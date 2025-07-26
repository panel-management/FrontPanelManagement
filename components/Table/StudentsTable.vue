<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex max-lg:flex-col items-center gap-3 overflow-x-auto py-2">
      <UInput :model-value="(table?.tableApi?.getColumn('fullName')?.getFilterValue() as string)" @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)" type="search" class="w-full xl:w-1/3" placeholder="جستجو بر اساس نام هنرجویان" size="xl" variant="outline" icon="i-lucide-search" color="primary"/>
      <div class="w-full flex max-sm:flex-col gap-3">
        <BaseDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({ label: columnLabels[column.id] || column.id, type: 'checkbox' as const, checked: column.getIsVisible(),
            onUpdateChecked(checked: boolean) {
              table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
              },
            onSelect(e?: Event) {
              e?.preventDefault()
            }}))" label="ستون ها"/>
        <BaseDropdownMenu :items="beltOptions.map(belt => ({ label: belt, type: 'checkbox' as const, checked: selectedBelts.includes(belt),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedBelts.push(belt)
              } else {
                selectedBelts = selectedBelts.filter(b => b !== belt)
              }},
              onSelect(e?: Event) {e?.preventDefault()}}))" label="کمربندها"/>
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
  <LazyWidgetModalStudentEdit v-model:open="isOpen"/>
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
  belt: 'سفید' | 'نارنجی' | 'ابی' | 'زرد' | 'سبز' | 'قهوه ای' | 'سیاه',
  status: 'پرداخت شده' | 'پرداخت نشده' | 'در انتظار پرداخت'
  sport: string
  attendance: number,
  date: string | Date,
}

const columnLabels: Record<string, string> = {
  fullName: 'نام کامل',
  belt: 'کمربند',
  sport: 'رشته',
  status: 'وضعیت شهریه',
  attendance: 'حضور',
  date: 'تاریخ',
}
const selectedBelts = ref<string[]>([])
const selectedStatusPayment = ref<string[]>([])
const beltOptions = ref(['سفید', 'نارنجی', 'ابی', 'زرد', 'سبز', 'قهوه ای', 'سیاه'])
const statusPaymentOption = ref(['پرداخت شده', 'پرداخت نشده', 'در انتظار پرداخت'])

const filteredData = computed(() => {
  return data.value.filter(row => {
    const beltMatch = selectedBelts.value.length === 0 || selectedBelts.value.includes(row.belt)
    const statusMatch = selectedStatusPayment.value.length === 0 || selectedStatusPayment.value.includes(row.status)
    return beltMatch && statusMatch
  })
})

const data = ref<Payment[]>([{
  id: '4600',
  fullName: 'محمد غفاری',
  belt: 'سفید',
  status: 'پرداخت نشده',
  sport: 'کاراته',
  attendance: 30,
  date: '2024-03-11T15:30:00',
}, {
  id: '4599',
  fullName: 'امیر امیری زاده',
  belt: 'سیاه',
  status: 'در انتظار پرداخت',
  sport: 'کیوکشین',
  attendance: 50,
  date: '2024-03-11T15:30:00',
}, {
  id: '4598',
  fullName: 'حسین حسینی نژاد',
  belt: 'قهوه ای',
  status: 'پرداخت شده',
  sport: 'موتای',
  attendance: 60,
  date: '2024-03-11T15:30:00',
}, {
  id: '4598',
  fullName: 'حسین حسینی نژاد',
  belt: 'نارنجی',
  status: 'پرداخت شده',
  sport: 'موتای',
  attendance: 60,
  date: '2024-03-11T15:30:00',
}, {
  id: '4598',
  fullName: 'حسین حسینی نژاد',
  belt: 'سبز',
  status: 'پرداخت شده',
  sport: 'موتای',
  attendance: 60,
  date: '2024-03-11T15:30:00',
}, {
  id: '4598',
  fullName: 'حسین حسینی نژاد',
  belt: 'ابی',
  status: 'پرداخت شده',
  sport: 'موتای',
  attendance: 60,
  date: '2024-03-11T15:30:00',
}, {
  id: '4598',
  fullName: 'حسین حسینی نژاد',
  belt: 'سیاه',
  status: 'پرداخت شده',
  sport: 'موتای',
  attendance: 60,
  date: '2024-03-11T15:30:00',
}, {
  id: '4598',
  fullName: 'حسین حسینی نژاد',
  belt: 'سیاه',
  status: 'پرداخت شده',
  sport: 'موتای',
  attendance: 60,
  date: '2024-03-11T15:30:00',
}, {
  id: '4598',
  fullName: 'حسین حسینی نژاد',
  belt: 'قهوه ای',
  status: 'پرداخت شده',
  sport: 'موتای',
  attendance: 60,
  date: '2024-03-11T15:30:00',
}, {
  id: '4598',
  fullName: 'حسین حسینی نژاد',
  belt: 'زرد',
  status: 'پرداخت شده',
  sport: 'موتای',
  attendance: 60,
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
    accessorKey: 'belt',
    header: 'کمربند ها',
    cell: ({row}) => {
      const color = ({
        'سفید': 'belt-white border' as const,
        'نارنجی': 'belt-orange' as const,
        'ابی': 'belt-blue' as const,
        'زرد': 'belt-yellow' as const,
        'سبز': 'belt-green' as const,
        'قهوه ای': 'belt-brown' as const,
        'سیاه': 'belt-black' as const,
      })[row.getValue('belt') as string]

      return h("span", {class: `px-2  py-1 rounded-lg font-medium text-xs ${color}`}, row.getValue('belt'))
    }
  }, {
    accessorKey: 'status',
    header: 'وضعیت شهریه',
    cell: ({row}) => {
      const color = ({
        'پرداخت شده': 'success' as const,
        'پرداخت نشده': 'error' as const,
        'در انتظار پرداخت': 'neutral' as const
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
    accessorKey: 'attendance',
    header: 'حضور',
    cell: ({row}) => h("span", {class: 'font-medium'}, `${row.getValue('attendance')}%`)
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