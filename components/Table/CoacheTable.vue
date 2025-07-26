<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex max-lg:flex-col items-center gap-3 overflow-x-auto py-2">
      <UInput :model-value="(table?.tableApi?.getColumn('fullName')?.getFilterValue() as string)"
              @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)" type="search"
              class="w-full xl:w-1/3" placeholder="جستجو بر اساس نام مربی" size="xl" variant="outline"
              icon="i-lucide-search" color="primary"/>
      <div class="w-full flex max-sm:flex-col gap-3">
        <BaseDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({ label: columnLabels[column.id] || column.id, type: 'checkbox' as const, checked: column.getIsVisible(),
            onUpdateChecked(checked: boolean) {
              table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
              },
            onSelect(e?: Event) {
              e?.preventDefault()
            }}))" label="ستون ها"/>
        <BaseDropdownMenu :items="statusSportOptions.map(sport => ({ label: sport, type: 'checkbox' as const, checked: selectedStatusSport.includes(sport),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedStatusSport.push(sport)
              } else {
                selectedStatusSport = selectedStatusSport.filter(b => b !== sport)
              }},
              onSelect(e?: Event) {e?.preventDefault()}}))" label="رشته ها"/>
        <BaseDropdownMenu :items="statusAccountOptions.map(account => ({ label: account, type: 'checkbox' as const, checked: selectedStatusAccount.includes(account),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedStatusAccount.push(account)
              } else {
                selectedStatusAccount = selectedStatusAccount.filter(b => b !== account)
              }},
              onSelect(e?: Event) {e?.preventDefault()}}))" label="وضعیت"/>
        <BaseDropdownMenu :items="statusPaymentOption.map(statusPayment => ({ label: statusPayment, type: 'checkbox' as const, checked: selectedStatusPayment.includes(statusPayment),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedStatusPayment.push(statusPayment)
              } else {
                selectedStatusPayment = selectedStatusPayment.filter(b => b !== statusPayment)
              }},
              onSelect(e?: Event) {e?.preventDefault()}}))" label="وضعیت شهریه ها"/>
      </div>
    </div>
    <UTable ref="table" :data="filteredData" :columns="columns" empty="هیچ اطلاعاتی برای نمایش وجود ندارد" sticky class="h-96 lg:h-svh no-scrollbar">
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
  <LazyWidgetModalCoacheEdit v-model:open="isOpen"/>
</template>
<script setup lang="ts">
import type {TableColumn} from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const table = useTemplateRef('table')
const isOpen: Ref<boolean> = ref(false)

type Payment = {
  id: string
  fullName: string
  phoneNumber: string
  payment: 'پرداخت شده' | 'پرداخت نشده' | 'در انتظار پرداخت'
  status: 'فعال' | 'غیر فعال'
  sport: 'کارته' | 'بوکس' | 'کیک بوکس' | 'جودو' | 'کشتی' | 'کنگفو' | 'تکواندو' | 'موی تای' | 'ام‌ام‌ای'
  history: string
  countStudent: number,
  date: string | Date,
}

const columnLabels: Record<string, string> = {
  fullName: 'نام کامل',
  phoneNumber: 'شماره تلفن',
  payment: 'وضعیت شهریه',
  status: 'وضعیت',
  sport: 'رشته',
  history: 'سابقه تدریس',
  countStudent: 'تعداد هنرجویان',
  date: 'تاریخ',
}

const selectedStatusAccount = ref<string[]>([])
const selectedStatusPayment = ref<string[]>([])
const selectedStatusSport = ref<string[]>([])
const statusAccountOptions = ref(['فعال', 'غیر فعال'])
const statusSportOptions = ref(['کارته', 'بوکس', 'کیک بوکس', 'جودو', 'کشتی', 'کنگفو', 'تکواندو', 'موی تای', 'ام‌ام‌ای'])
const statusPaymentOption = ref(['پرداخت شده', 'پرداخت نشده', 'در انتظار پرداخت'])

const filteredData = computed(() => {
  return data.value.filter(row => {
    const statusAccountMatch = selectedStatusAccount.value.length === 0 || selectedStatusAccount.value.includes(row.status)
    const statusPaymentMatch = selectedStatusPayment.value.length === 0 || selectedStatusPayment.value.includes(row.payment)
    const statusSportMatch = selectedStatusSport.value.length === 0 || selectedStatusSport.value.includes(row.sport)
    return statusAccountMatch && statusPaymentMatch && statusSportMatch
  })
})

const data = ref<Payment[]>([{
  id: '22',
  fullName: 'محمد غفاری',
  phoneNumber: '09212345678',
  payment: 'پرداخت نشده',
  status: 'فعال',
  sport: 'کارته',
  history: '5 سال',
  countStudent: 30,
  date: '2024-03-11T15:30:00',
}, {
  id: '10',
  fullName: 'امیر حسین محمد',
  phoneNumber: '09212345678',
  payment: 'پرداخت شده',
  status: 'غیر فعال',
  sport: 'تکواندو',
  history: '10 سال',
  countStudent: 25,
  date: '2024-03-11T15:30:00',
}, {
  id: '30',
  fullName: 'حسین کیای',
  phoneNumber: '09212345678',
  payment: 'در انتظار پرداخت',
  status: 'غیر فعال',
  sport: 'کنگفو',
  history: '5 سال',
  countStudent: 30,
  date: '2024-03-11T15:30:00',
}, {
  id: '22',
  fullName: 'جواد جلالی',
  phoneNumber: '09212345678',
  payment: 'پرداخت شده',
  status: 'فعال',
  sport: 'موی تای',
  history: '5 سال',
  countStudent: 30,
  date: '2024-03-11T15:30:00',
}])

const columns: TableColumn<Payment>[] = [
  {
    accessorKey: 'fullName',
    header: 'نام کامل',
    cell: ({row}) => {
      return row.getValue('fullName')
    }
  }, {
    accessorKey: 'phoneNumber',
    header: 'شماره تلفن',
    cell: ({row}) => {
      return row.getValue('phoneNumber')
    }
  }, {
    accessorKey: 'payment',
    header: 'وضعیت شهریه',
    cell: ({row}) => {
      const color = ({
        'پرداخت شده': 'success' as const,
        'پرداخت نشده': 'error' as const,
        'در انتظار پرداخت': 'warning' as const
      })[row.getValue('payment') as string]

      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () => row.getValue('payment'))
    }
  }, {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({row}) => {
      const color = ({
        'فعال': 'success' as const,
        'غیر فعال': 'neutral' as const,
      })[row.getValue('status') as string]

      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () => row.getValue('status'))
    }
  }, {
    accessorKey: 'sport',
    header: ({column}) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'رشته',
        icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({row}) => h('div', {class: 'lowercase'}, row.getValue('sport'))
  }, {
    accessorKey: 'history',
    header: 'سابقه تدریس',
    cell: ({row}) => row.getValue('history')
  }, {
    accessorKey: 'countStudent',
    header: 'هنرجویان',
    cell: ({row}) => h("span", {class: 'font-medium'}, `${row.getValue('countStudent')} نفر`)
  }, {
    accessorKey: 'date',
    header: 'تاریخ',
    cell: ({row}) => {
      return new Date(row.getValue('date')).toLocaleString('fa-IR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }, {
    id: 'actions',
    header: 'عملیات',
    enableHiding: false,
    cell: ({row}) => {
      const items = [{
        type: 'label',
        label: 'عملیات'
      }, {
        type: 'separator'
      }, {
        label: 'مشاهده پروفایل',
        icon: 'material-symbols:person',
        onSelect() {
          isOpen.value = !isOpen.value
        }
      }, {
        label: 'تغییر وضعیت',
        icon: 'hugeicons:exchange-01',
      }, {
        label: 'حذف هنرجو',
        icon: 'ic:sharp-delete',
        color: 'error'
      }]

      return h('div', {class: 'text-right'}, h(UDropdownMenu, {
        'content': {
          align: 'end'
        },
        items,
        'aria-label': 'Actions dropdown'
      }, () => h(UButton, {
        'icon': 'i-lucide-ellipsis-vertical',
        'color': 'neutral',
        'variant': 'ghost',
        'class': 'ml-auto',
        'aria-label': 'Actions dropdown'
      })))
    }
  }
];
</script>