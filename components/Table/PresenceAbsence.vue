<template>
  <div class="w-full p-3 sm:p-5 rounded-xl bg-white flex flex-col gap-3">
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
        placeholder="جستجو بر اساس نام کاربران"
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
    <WidgetCartsInformation
      bgColorIcon="bg-turquoise-100"
      nameIcon="material-symbols:person-check"
      classIcon="size-5 sm:size-6 text-turquoise-500"
      title="حضور"
    >
      {{ summaryData?.PRESENT ? summaryData?.PRESENT : 'وجود ندارد' }}
    </WidgetCartsInformation>
    <WidgetCartsInformation
      bgColorIcon="bg-error-100"
      nameIcon="material-symbols:person-cancel"
      classIcon="size-5 sm:size-6 text-error-500"
      title="غیبت ها"
    >
      {{ summaryData?.ABSENT ? summaryData?.ABSENT : 'وجود ندارد' }}
    </WidgetCartsInformation>
    <WidgetCartsInformation
      bgColorIcon="bg-yellow-100"
      nameIcon="material-symbols:alarm"
      classIcon="size-5 sm:size-6 text-yellow-500"
      title="تاخیرات"
    >
      {{ summaryData?.LATE ? summaryData?.LATE : 'وجود ندارد' }}
    </WidgetCartsInformation>
    <WidgetCartsInformation
      bgColorIcon="bg-secondary-100"
      nameIcon="material-symbols:alarm"
      classIcon="size-5 sm:size-6 text-secondary-500"
      title="موجه"
    >
      {{ summaryData?.EXCUSED ? summaryData?.EXCUSED : 'وجود ندارد' }}
    </WidgetCartsInformation>
    <WidgetCartsInformation
      bgColorIcon="bg-info-100"
      nameIcon="mdi-light:chart-bar"
      classIcon="size-5 sm:size-6 bg-info-500"
      title="کل جلسات"
    >
      {{ sessionsData?.totalSessions ? sessionsData?.totalSessions : 'وجود ندارد' }}
    </WidgetCartsInformation>
  </div>
  <div class="w-full h-full p-3 sm:p-5 rounded-xl bg-white flex flex-col gap-5">
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
  import { Role } from '~/models/Role'
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
      if (result.statusCode === 200) {
        const newItems = Array.isArray(result.data?.report) ? result.data?.report : []
        summaryData.value = result.data?.summary
        sessionsData.value = result.data?.sessions
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
    type: 'نقش',
    status: 'وضعیت',
    date: 'زمان',
    createdAt: 'تاریخ',
  }

  const columns: TableColumn<AttendanceReport>[] = [
    {
      accessorKey: 'type',
      header: 'نقش',
      accessorFn: (row) => (row.student.type === Role.Student ? 'هنرجو' : 'مربی'),
    },
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
