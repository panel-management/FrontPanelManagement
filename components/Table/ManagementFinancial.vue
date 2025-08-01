<template>
  <div class="w-full p-5 rounded-xl bg-white flex flex-col gap-3">
    <div class="w-full flex max-md:flex-col gap-3">
      <div class="flex max-sm:flex-col gap-3">
        <UButton icon="mdi-light:download" label="خروجی اکسل" size="xl" color="neutral" variant="solid"
                 class="max-md:w-fit"/>
        <UButton icon="material-symbols:shopping-bag" @click="modalStore.toggleModal('equipmentAdd')" label="افزودن خرید تجهیزات" size="xl" color="neutral"
                 variant="solid" class="max-md:w-fit"/>
      </div>
      <UInput :model-value="(table?.tableApi?.getColumn('fullName')?.getFilterValue() as string)"
              @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)" type="search"
              class="w-full" placeholder="جستجو بر اساس نام هنرجویان" size="xl" variant="outline" icon="i-lucide-search"
              color="primary"/>
    </div>
    <div class="flex max-md:flex-col gap-3 w-full h-full">
      <BaseDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({ label: columnLabels[column.id] || column.id, type: 'checkbox' as const, checked: column.getIsVisible(),
            onUpdateChecked(checked: boolean) {
              table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
              },
            onSelect(e?: Event) {
              e?.preventDefault()
            }}))" label="ستون ها" class="w-full"/>
      <BaseDropdownMenu :items="paymentMethodOptions.map(paymentMethod => (
        { label: paymentMethod, type: 'checkbox' as const, checked: selectedPaymentMethod.includes(paymentMethod),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedPaymentMethod.push(paymentMethod)
              } else {
                selectedPaymentMethod = selectedPaymentMethod.filter(b => b !== paymentMethod)
              }},
              onSelect(e?: Event) {e?.preventDefault()}
        }))" label="روش پرداخت" class="w-full"/>
      <BaseDropdownMenu :items="typeTransactionOptions.map(typeTransaction => (
        { label: typeTransaction, type: 'checkbox' as const, checked: selectedTypeTransaction.includes(typeTransaction),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedTypeTransaction.push(typeTransaction)
              } else {
                selectedTypeTransaction = selectedTypeTransaction.filter(b => b !== typeTransaction)
              }},
              onSelect(e?: Event) {e?.preventDefault()}
        }))" label="نوع تراکنش" class="w-full"/>
      <BaseDropdownMenu :items="statusOptions.map(statusPayment => (
        { label: statusPayment, type: 'checkbox' as const, checked: selectedStatus.includes(statusPayment),
            onUpdateChecked(checked: boolean) {
              if (checked) {
                selectedStatus.push(statusPayment)
              } else {
                selectedStatus = selectedStatus.filter(b => b !== statusPayment)
              }},
              onSelect(e?: Event) {e?.preventDefault()}
        }))" label="وضعیت پرداخت" class="w-full"/>
    </div>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full h-full">
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-turquoise-100">
        <UIcon name="streamline:interface-validation-check-check-form-validation-checkmark-success-add-addition"
               class="size-6 bg-turquoise-500"/>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">125,000,000</span>
        <span class="font-medium text-sm">کل شهریه‌های پرداخت شده</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-error-100">
        <UIcon name="mi:circle-error" class="size-6 bg-error-500"/>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">18,500,000</span>
        <span class="font-medium text-sm">کل شهریه‌های پرداخت نشده</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-yellow-100">
        <UIcon name="material-symbols:shopping-cart" class="size-6 bg-yellow-500"/>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">33,500,000</span>
        <span class="font-medium text-sm">کل درآمد تجهیزات</span>
      </div>
    </div>
  </div>
  <div class="w-full h-full p-5 rounded-xl bg-white flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <span class="text-2xl font-bold">همه تراکنش های مالی (5 مورد)</span>
      <p class="break-words font-medium text-sm">تمام تراکنش‌های مالی باشگاه</p>
    </div>
    <UTable ref="table" :data="filteredData" :columns="columns" empty="هیچ اطلاعاتی برای نمایش وجود ندارد"
            sticky class="h-96 lg:h-svh no-scrollbar">
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
  <LazyWidgetModalEquipmentAdd v-model:open="modalStore.modals.equipmentAdd"/>
</template>
<script setup lang="ts">
import type {TableColumn} from "@nuxt/ui";

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const table = useTemplateRef('table')
const modalStore = useModalStore()

const selectedPaymentMethod = ref<string[]>([])
const selectedTypeTransaction = ref<string[]>([])
const selectedStatus = ref<string[]>([])
const paymentMethodOptions = ref(['آنلاین', 'نقدی'])
const typeTransactionOptions = ref(['شهریه', 'تجهیزات'])
const statusOptions = ref(['پرداخت شده', 'پرداخت نشده', 'در انتظار پرداخت'])

const filteredData = computed(() => {
  return data.value.filter(row => {
    const paymentMethodMatch = selectedPaymentMethod.value.length === 0 || selectedPaymentMethod.value.includes(row.paymentMethod)
    const statusMatch = selectedStatus.value.length === 0 || selectedStatus.value.includes(row.status)
    const typeTransactionMatch = selectedTypeTransaction.value.length === 0 || selectedTypeTransaction.value.includes(row.typeTransaction)
    return paymentMethodMatch && statusMatch
  })
})

const columnLabels: Record<string, string> = {
  fullName: 'نام کامل',
  typeTransaction: 'نوع تراکنش',
  price: 'مبلغ',
  date: 'تاریخ',
  paymentMethod: 'روش پرداخت',
  status: 'وضعیت',
}

type Payment = {
  id: string
  fullName: string
  typeTransaction: 'شهریه' | 'تجهیزات'
  price: number
  date: Date | string
  paymentMethod: 'آنلاین' | 'نقدی',
  status: 'پرداخت شده' | 'پرداخت نشده' | 'در انتظار پرداخت'
}

const data = ref<Payment[]>([{
  id: '4600',
  fullName: 'احمد رضا سلطانی',
  typeTransaction: 'شهریه',
  price: 12000000,
  date: '2024-03-11T15:30:00',
  paymentMethod: 'آنلاین',
  status: 'پرداخت شده'
},{
  id: '4600',
  fullName: 'امیر فتاهی',
  typeTransaction: 'تجهیزات',
  price: 12000000,
  date: '2024-03-11T15:30:00',
  paymentMethod: 'نقدی',
  status: 'در انتظار پرداخت'
},{
  id: '4600',
  fullName: 'غلام رضا حدادی',
  typeTransaction: 'شهریه',
  price: 12000000,
  date: '2024-03-11T15:30:00',
  paymentMethod: 'آنلاین',
  status: 'پرداخت نشده'
},{
  id: '4600',
  fullName: 'حسین بختیاری',
  typeTransaction: 'شهریه',
  price: 12000000,
  date: '2024-03-11T15:30:00',
  paymentMethod: 'آنلاین',
  status: 'پرداخت شده'
},{
  id: '4600',
  fullName: 'احمد رضا سلطانی',
  typeTransaction: 'شهریه',
  price: 12000000,
  date: '2024-03-11T15:30:00',
  paymentMethod: 'آنلاین',
  status: 'پرداخت شده'
},{
  id: '4600',
  fullName: 'احمد رضا سلطانی',
  typeTransaction: 'شهریه',
  price: 12000000,
  date: '2024-03-11T15:30:00',
  paymentMethod: 'آنلاین',
  status: 'پرداخت شده'
},{
  id: '4600',
  fullName: 'احمد رضا سلطانی',
  typeTransaction: 'شهریه',
  price: 12000000,
  date: '2024-03-11T15:30:00',
  paymentMethod: 'آنلاین',
  status: 'پرداخت شده'
},{
  id: '4600',
  fullName: 'احمد رضا سلطانی',
  typeTransaction: 'شهریه',
  price: 12000000,
  date: '2024-03-11T15:30:00',
  paymentMethod: 'آنلاین',
  status: 'پرداخت شده'
}])

const columns: TableColumn<Payment>[] = [
  {
    accessorKey: 'fullName',
    header: 'نام کامل',
    cell: ({row}) => {
      return row.getValue('fullName')
    }
  }, {
    accessorKey: 'typeTransaction',
    header: 'نوع تراکنش',
    cell: ({row}) => {
      const color = ({
        'شهریه': 'info' as const,
        'تجهیزات': 'neutral' as const,
      })[row.getValue('typeTransaction') as string]
      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () => row.getValue('typeTransaction'))
    }
  }, {
    accessorKey: 'paymentMethod',
    header: 'روش پرداخت',
    cell: ({row}) => {
      const color = ({
        'آنلاین': 'secondary' as const,
        'نقدی': 'neutral' as const,
      })[row.getValue('paymentMethod') as string]
      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () => row.getValue('paymentMethod'))
    }
  }, {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({row}) => {
      const color = ({
        'پرداخت شده': 'success' as const,
        'پرداخت نشده': 'error' as const,
        'در انتظار پرداخت': 'warning' as const,
      })[row.getValue('status') as string]
      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () => row.getValue('status'))
    }
  }, {
    accessorKey: 'price',
    header: 'مبلغ',
    cell: ({row}) => h("span", {class: 'font-medium'}, `${Number(row.getValue('price')).toLocaleString()} تومان`)
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
      return h('div', {class: 'flex gap-2'}, [
        h(UButton, {
          label: 'تایید',
          icon: 'i-heroicons-check-circle',
          color: 'success',
          size: 'sm',
        }),
        h(UButton, {
          label: 'رد کردن',
          icon: 'i-heroicons-x-circle',
          color: 'error',
          variant: 'soft',
          size: 'sm',
        })
      ])
    }
  }
];
</script>