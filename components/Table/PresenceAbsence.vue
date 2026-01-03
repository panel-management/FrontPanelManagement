<template>
  <div class="w-full p-5 rounded-xl bg-white flex flex-col gap-3">
    <div class="w-full flex max-md:flex-col gap-3">
      <UButton
        icon="mdi-light:download"
        label="خروجی اکسل"
        size="xl"
        color="neutral"
        variant="solid"
        class="flex justify-center w-full md:w-fit"
      />
      <UInput
        :model-value="table?.tableApi?.getColumn('fullName')?.getFilterValue() as string"
        @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)"
        type="search"
        class="w-full"
        placeholder="جستجو بر اساس نام هنرجویان"
        size="xl"
        variant="outline"
        icon="i-lucide-search"
        color="primary"
      />
    </div>
    <div class="flex max-md:flex-col gap-3 w-full h-full">
      <BaseDropdownMenu
        :items="
          table?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: columnLabels[column.id] || column.id,
              type: 'checkbox' as const,
              checked: column.getIsVisible(),
              onUpdateChecked(checked: boolean) {
                table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              },
            }))
        "
        label="ستون ها"
        class="w-full"
      />
      <BaseDropdownMenu
        :items="
          PeriodOptions.map((date) => ({
            label: attendancePeriodLabels[date],
            type: 'checkbox' as const,
            checked: selectedPeriod === date,
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedPeriod = date
              } else {
                selectedPeriod = null
              }
            },
            onSelect(e?: Event) {
              e?.preventDefault()
            },
          }))
        "
        label="تاریخ ها"
        class="w-full"
      />
      <BaseDropdownMenu
        :items="
          AttendanceOptions.map((statusAttendance) => ({
            label: attendanceStatusLabels[statusAttendance],
            type: 'checkbox' as const,
            checked: selectedAttendance.includes(statusAttendance),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedAttendance.push(statusAttendance)
              } else {
                selectedAttendance = selectedAttendance.filter((b) => b !== statusAttendance)
              }
            },
            onSelect(e?: Event) {
              e?.preventDefault()
            },
          }))
        "
        label="وضعیت حضور غیاب"
        class="w-full"
      />
    </div>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full h-full">
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-turquoise-100">
        <UIcon name="material-symbols:person-check" class="size-6 bg-turquoise-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">
          {{ summaryData?.PRESENT ? summaryData?.PRESENT : 'وجود ندارد' }}
        </span>
        <span class="font-medium text-sm">حضور</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-error-100">
        <UIcon name="material-symbols:person-cancel" class="size-6 bg-error-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">
          {{ summaryData?.ABSENT ? summaryData?.ABSENT : 'وجود ندارد' }}
        </span>
        <span class="font-medium text-sm">غیبت‌ ها</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-yellow-100">
        <UIcon name="material-symbols:alarm" class="size-6 bg-yellow-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">
          {{ summaryData?.LATE ? summaryData?.LATE : 'وجود ندارد' }}
        </span>
        <span class="font-medium text-sm">تأخیرات</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-secondary-100">
        <UIcon name="mdi:file-document-multiple" class="size-6 bg-secondary-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">
          {{ summaryData?.EXCUSED ? summaryData?.EXCUSED : 'وجود ندارد' }}
        </span>
        <span class="font-medium text-sm">موجه</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-info-100">
        <UIcon name="mdi-light:chart-bar" class="size-6 bg-info-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">
          {{ sessionsData?.totalSessions ? sessionsData?.totalSessions : 'وجود ندارد' }}
        </span>
        <span class="font-medium text-sm">کل جلسات</span>
      </div>
    </div>
  </div>
  <div class="w-full h-full p-5 rounded-xl bg-white flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <span class="text-2xl font-bold">گزارش حضور و غیاب</span>
      <p class="break-words font-medium text-sm">تاریخچه حضور و غیاب کلاس‌ ها</p>
    </div>
    <UTable
      ref="table"
      :data="filteredData"
      :loading="isLoading"
      loading-color="neutral"
      :columns="columns"
      empty="هیچ اطلاعاتی برای نمایش وجود ندارد"
      sticky
      class="h-96 lg:h-svh no-scrollbar"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
</template>
<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui'
  import dayjs from 'dayjs'
  import { AttendanceStatus } from '~/models/attendance/AttendanceData'
  import {
    AttendancePeriod,
    type AttendanceReport,
    type AttendanceSessions,
    type AttendanceSummary,
  } from '~/models/attendance/AttendanceListData'
  import { getAttendanceReportService } from '~/services/attendance.service'

  const UBadge = resolveComponent('UBadge')
  const table = useTemplateRef<ComponentPublicInstance>('table')
  const reportData: Ref<AttendanceReport[]> = ref([])
  const summaryData = shallowRef<AttendanceSummary | null>(null)
  const sessionsData = shallowRef<AttendanceSessions | null>(null)
  const isLoading: Ref<boolean> = ref(false)
  const hasMore: Ref<boolean> = ref(true)
  const page = ref(1)
  const limit = ref(15)
  const totalPages = ref(0)

  const attendanceStatusLabels: Record<AttendanceStatus, string> = {
    [AttendanceStatus.PRESENT]: 'حاضر',
    [AttendanceStatus.ABSENT]: 'غایب',
    [AttendanceStatus.LATE]: 'تاخیر',
    [AttendanceStatus.EXCUSED]: 'موجه',
  }

  const attendancePeriodLabels: Record<AttendancePeriod, string> = {
    [AttendancePeriod.today]: 'امروز',
    [AttendancePeriod.week]: 'این هفته',
    [AttendancePeriod.month]: 'این ماه',
  }

  const selectedPeriod = ref<AttendancePeriod | null>(null)
  const selectedAttendance = ref<AttendanceStatus[]>([])
  const PeriodOptions = ref([AttendancePeriod.today, AttendancePeriod.week, AttendancePeriod.month])
  const AttendanceOptions = ref([
    AttendanceStatus.PRESENT,
    AttendanceStatus.ABSENT,
    AttendanceStatus.LATE,
    AttendanceStatus.EXCUSED,
  ])

  const filteredData = computed(() => {
    const now = dayjs()

    const periodMapping: Record<AttendancePeriod, dayjs.OpUnitType> = {
      [AttendancePeriod.today]: 'day',
      [AttendancePeriod.week]: 'week',
      [AttendancePeriod.month]: 'month',
    }

    return reportData.value.filter((row) => {
      const rowDate = dayjs(row.date)
      const statusMatch =
        selectedAttendance.value.length === 0 || selectedAttendance.value.includes(row.status)
      const dateMatch =
        selectedPeriod.value === null || rowDate.isSame(now, periodMapping[selectedPeriod.value])
      return statusMatch && dateMatch
    })
  })

  async function getAttendanceReport() {
    isLoading.value = true
    try {
      const periodParam = selectedPeriod.value || undefined
      const result = await getAttendanceReportService(page.value, limit.value, periodParam)
      console.log(result)
      if (result.statusCode === 200) {
        const newItems = Array.isArray(result.data?.report) ? result.data?.report : []
        summaryData.value = result.data?.summary as AttendanceSummary
        sessionsData.value = result.data?.sessions as AttendanceSessions
        if (page.value === 1) {
          reportData.value = newItems
        } else {
          reportData.value.push(...newItems)
        }
        if (result.pagination) {
          totalPages.value = result.pagination.totalPages
          if (page.value >= totalPages.value) {
            hasMore.value = false
          } else {
            page.value++
          }
        } else {
          if (newItems.length < limit.value) {
            hasMore.value = false
          } else {
            page.value++
          }
        }
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  watch(selectedPeriod, () => {
    page.value = 1
    hasMore.value = true
    reportData.value = []
    getAttendanceReport()
  })

  onMounted(async () => {
    await getAttendanceReport()

    await nextTick()

    if (table.value) {
      useInfiniteScroll(
        table.value.$el,
        () => {
          if (!isLoading.value && hasMore.value) {
            getAttendanceReport()
          }
        },
        {
          distance: 100,
          interval: 500,
          canLoadMore: () => !isLoading.value && hasMore.value,
        }
      )
    }
  })

  // type Payment = {
  //   id: string
  //   fullName: string
  //   status: 'حاضر' | 'غیبت' | 'تاخیر' | 'موجه',
  //   absence: number
  //   delay: number
  //   present: number
  //   date: 'این ماه' | 'این هفته' | 'امروز'
  //   dateTime: Date | string
  // }

  // const data = ref<Payment[]>([{
  //   id: '4600',
  //   fullName: 'احمد رضا سلطانی',
  //   status: 'حاضر',
  //   absence: 10,
  //   delay: 5,
  //   present: 15,
  //   date: 'امروز',
  //   dateTime: '2024-03-11T15:30:00',
  // }])

  const columnLabels: Record<string, string> = {
    fullName: 'نام کامل',
    status: 'وضعیت',
    date: 'زمان',
    createdAt: 'تاریخ',
  }

  const columns: TableColumn<AttendanceReport>[] = [
    {
      accessorKey: 'fullName',
      header: 'نام کامل',
      accessorFn: (row) => row.student.fullName,
    },
    {
      accessorKey: 'status',
      header: 'وضعیت',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const color = {
          PRESENT: 'success' as const,
          ABSENT: 'error' as const,
          LATE: 'warning' as const,
          EXCUSED: 'secondary' as const,
        }[status]
        let text = status
        switch (status) {
          case 'PRESENT':
            text = 'حاضر'
            break
          case 'ABSENT':
            text = 'غایب'
            break
          case 'LATE':
            text = 'تاخیر'
            break
          case 'EXCUSED':
            text = 'موجه'
            break
        }
        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => text)
      },
    },
    {
      accessorKey: 'date',
      header: 'زمان',
      cell: ({ row }) => {
        return useFormatPeriod(row.getValue('date'))
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ',
      cell: ({ row }) => {
        return new Date(row.getValue('createdAt')).toLocaleString('fa-IR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      },
    },
  ]
</script>
