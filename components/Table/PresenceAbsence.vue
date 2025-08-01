<template>
  <div class="w-full p-5 rounded-xl bg-white flex flex-col gap-3">
    <div class="w-full flex max-md:flex-col gap-3">
      <UButton icon="mdi-light:download" label="خروجی اکسل" size="xl" color="neutral" variant="solid" class="flex justify-center w-full md:w-fit"/>
      <UInput :model-value="(table?.tableApi?.getColumn('fullName')?.getFilterValue() as string)" @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)" type="search" class="w-full" placeholder="جستجو بر اساس نام هنرجویان" size="xl" variant="outline" icon="i-lucide-search" color="primary"/>
    </div>
    <div class="flex max-md:flex-col gap-3 w-full h-full">
      <BaseDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({ label: columnLabels[column.id] || column.id, type: 'checkbox' as const, checked: column.getIsVisible(),
            onUpdateChecked(checked: boolean) {
              table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
              },
            onSelect(e?: Event) {
              e?.preventDefault()
            }}))" label="ستون ها" class="w-full"/>
      <BaseDropdownMenu :items="dateOptions.map(date => (
        { label: date, type: 'checkbox' as const, checked: selectedDate.includes(date),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedDate.push(date)
              } else {
                selectedDate = selectedDate.filter(b => b !== date)
              }},
              onSelect(e?: Event) {e?.preventDefault()}
        }))" label="تاریخ ها" class="w-full"/>
      <BaseDropdownMenu :items="statusOptions.map(statusPayment => (
        { label: statusPayment, type: 'checkbox' as const, checked: selectedStatus.includes(statusPayment),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedStatus.push(statusPayment)
              } else {
                selectedStatus = selectedStatus.filter(b => b !== statusPayment)
              }},
              onSelect(e?: Event) {e?.preventDefault()}
        }))" label="وضعیت حضور غیاب" class="w-full"/>
    </div>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full h-full">
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-turquoise-100">
        <UIcon name="material-symbols:person-check" class="size-6 bg-turquoise-500"/>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">۸۵</span>
        <span class="font-medium text-sm">حضور</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-yellow-100">
        <UIcon name="material-symbols:alarm" class="size-6 bg-yellow-500"/>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">۸</span>
        <span class="font-medium text-sm">تأخیرات</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-error-100">
        <UIcon name="material-symbols:person-cancel" class="size-6 bg-error-500"/>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">۷</span>
        <span class="font-medium text-sm">غیبت‌ ها</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-secondary-100">
        <UIcon name="mdi:file-document-multiple" class="size-6 bg-secondary-500"/>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">1</span>
        <span class="font-medium text-sm">موجه</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-info-100">
        <UIcon name="mdi-light:chart-bar" class="size-6 bg-info-500"/>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">۱۲۴</span>
        <span class="font-medium text-sm">کل جلسات</span>
      </div>
    </div>
  </div>
  <div class="w-full h-full p-5 rounded-xl bg-white flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <span class="text-2xl font-bold">گزارش حضور و غیاب</span>
      <p class="break-words font-medium text-sm">تاریخچه حضور و غیاب کلاس‌ ها</p>
    </div>
    <UTable ref="table" :data="filteredData" :columns="columns" empty="هیچ اطلاعاتی برای نمایش وجود ندارد"
            sticky class="h-96 lg:h-svh no-scrollbar">
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
</template>
<script setup lang="ts">
import type {TableColumn} from "@nuxt/ui";

const UBadge = resolveComponent('UBadge')
const table = useTemplateRef('table')

const selectedDate = ref<string[]>([])
const selectedStatus = ref<string[]>([])
const dateOptions = ref(['امروز', 'این هفته', 'این ماه'])
const statusOptions = ref(['حاضر', 'غیبت', 'تاخیر', 'موجه'])

const filteredData = computed(() => {
  return data.value.filter(row => {
    const dateMatch = selectedDate.value.length === 0 || selectedDate.value.includes(row.date)
    const statusMatch = selectedStatus.value.length === 0 || selectedStatus.value.includes(row.status)
    return dateMatch && statusMatch
  })
})

const columnLabels: Record<string, string> = {
  fullName: 'نام کامل',
  status: 'وضعیت',
  absence: 'غیبت',
  delay: 'تاخیر',
  present: 'حاضر',
  date: 'زمان',
  dateTime: 'تاریخ',
}

type Payment = {
  id: string
  fullName: string
  status: 'حاضر' | 'غیبت' | 'تاخیر' | 'موجه',
  absence: number
  delay: number
  present: number
  date: 'این ماه' | 'این هفته' | 'امروز'
  dateTime: Date | string
}

const data = ref<Payment[]>([{
  id: '4600',
  fullName: 'احمد رضا سلطانی',
  status: 'حاضر',
  absence: 10,
  delay: 5,
  present: 15,
  date: 'امروز',
  dateTime: '2024-03-11T15:30:00',
}, {
  id: '4600',
  fullName: 'امیر فلاحی',
  status: 'غیبت',
  absence: 10,
  delay: 5,
  present: 15,
  date: 'این هفته',
  dateTime: '2024-03-11T15:30:00',
}, {
  id: '4600',
  fullName: 'رضا عطار',
  status: 'تاخیر',
  absence: 10,
  delay: 5,
  present: 15,
  date: 'امروز',
  dateTime: '2024-03-11T15:30:00',
}, {
  id: '4600',
  fullName: 'محسن بیکار',
  status: 'موجه',
  absence: 10,
  delay: 5,
  present: 15,
  date: 'امروز',
  dateTime: '2024-03-11T15:30:00',
}])

const columns: TableColumn<Payment>[] = [
  {
    accessorKey: 'fullName',
    header: 'نام کامل',
    cell: ({row}) => {
      return row.getValue('fullName')
    }
  }, {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({row}) => {
      const color = ({
        'حاضر': 'success' as const,
        'غیبت': 'error' as const,
        'تاخیر': 'warning' as const,
        'موجه': 'secondary' as const
      })[row.getValue('status') as string]

      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () => row.getValue('status'))
    }
  }, {
    accessorKey: 'absence',
    header: 'غیبت',
    cell: ({row}) => {
      return h(UBadge, {
        variant: 'soft',
        color: 'error',
        icon: 'material-symbols:person-cancel'
      }, () => row.getValue('absence'))
    }
  }, {
    accessorKey: 'delay',
    header: 'تاخیر',
    cell: ({row}) => {
      return h(UBadge, {variant: 'soft', color: 'warning', icon: 'mdi:clock'}, () => row.getValue('delay'))
    }
  }, {
    accessorKey: 'present',
    header: 'حاضر',
    cell: ({row}) => {
      return h(UBadge, {
        variant: 'soft',
        color: 'success',
        icon: 'material-symbols:person-check'
      }, () => row.getValue('present'))
    }
  }, {
    accessorKey: 'date',
    header: 'زمان',
    cell: ({row}) => {
      return row.getValue('date')
    }
  }, {
    accessorKey: 'dateTime',
    header: 'تاریخ',
    cell: ({row}) => {
      return new Date(row.getValue('dateTime')).toLocaleString('fa-IR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }
];
</script>