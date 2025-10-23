<template>
  <div class="w-full p-5 rounded-xl bg-white flex flex-col gap-3">
    <div class="w-full flex max-md:flex-col gap-3">
      <UInput :model-value="(table?.tableApi?.getColumn('fullName')?.getFilterValue() as string)"
        @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)" type="search"
        class="w-full" placeholder="جستجو بر اساس نام استاد" size="xl" variant="outline" icon="i-lucide-search"
        color="primary" />
    </div>
    <div class="flex max-md:flex-col gap-3 w-full h-full">
      <div class="flex max-sm:flex-col gap-3">
        <UButton icon="mdi-light:download" label="خروجی اکسل" size="xl" color="neutral" variant="solid"
          class="flex- justify-center w-full md:w-fit" />
      </div>
      <BaseDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
        label: columnLabels[column.id] || column.id, type: 'checkbox' as const, checked: column.getIsVisible(),
        onUpdateChecked(checked: boolean) {
          table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
        },
        onSelect(e?: Event) {
          e?.preventDefault()
        }
      }))" label="ستون ها" class="w-full" />
      <BaseDropdownMenu :items="statusOptions.map(statusPayment => (
        {
          label: statusPayment, type: 'checkbox' as const, checked: selectedStatus.includes(statusPayment),
          onUpdateChecked(checked: boolean) {
            if (checked) {
              selectedStatus.push(statusPayment)
            } else {
              selectedStatus = selectedStatus.filter(b => b !== statusPayment)
            }
          },
          onSelect(e?: Event) { e?.preventDefault() }
        }))" label="وضعیت پرداخت" class="w-full" />
    </div>
  </div>
  <!-- <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full h-full">
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-turquoise-100">
        <UIcon name="streamline:interface-validation-check-check-form-validation-checkmark-success-add-addition"
          class="size-6 bg-turquoise-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">125,000,000</span>
        <span class="font-medium text-sm">کل شهریه‌های پرداخت شده</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-error-100">
        <UIcon name="mi:circle-error" class="size-6 bg-error-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">18,500,000</span>
        <span class="font-medium text-sm">کل شهریه‌های پرداخت نشده</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-yellow-100">
        <UIcon name="material-symbols:shopping-cart" class="size-6 bg-yellow-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">33,500,000</span>
        <span class="font-medium text-sm">کل درآمد تجهیزات</span>
      </div>
    </div>
  </div> -->
  <div class="w-full h-full p-5 rounded-xl bg-white flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <span class="text-lg md:text-2xl font-bold">همه تراکنش های مالی ({{ formData.length }} مورد)</span>
      <p class="break-words font-medium text-sm">تمام تراکنش‌ های</p>
    </div>
    <UTable ref="table" :loading="isLoading" :data="filteredData" :columns="columns"
      empty="هیچ اطلاعاتی برای نمایش وجود ندارد" sticky class="h-96 lg:h-svh no-scrollbar">
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { statusConfirmSubscriptionsMaster } from "~/models/Payments/Subscriptions/confirmSubscriptionsMaster";
import type { SubscriptionListData } from "~/models/Payments/Subscriptions/SubscriptionListData";
import { confirmSubscriptionsMasterService, getSubscriptionsPendingMasterService } from "~/services/payment.service";

const isLoading: Ref<boolean> = ref(false)
const formData: Ref<SubscriptionListData[]> = ref([])
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const table = useTemplateRef('table')
const toastStore = useToastStore()
const { showImagePreview } = useShowImagePreview()

const selectedStatus = ref<string[]>([])
const statusOptions = ref(['پرداخت شده', 'پرداخت نشده', 'در انتظار پرداخت'])

const filteredData = computed(() => {
  return formData.value.filter(row => {
    const statusMatch = selectedStatus.value.length === 0 || selectedStatus.value.includes(row.status)
    return statusMatch
  })
})

async function getSubscriptionListMaster() {
  isLoading.value = true
  try {
    const result = await getSubscriptionsPendingMasterService()
    console.log(result.data);

    if (result.statusCode === 200) {
      formData.value = Array.isArray(result.data) ? result.data : []
    }
  } catch (error: any) {
    console.log(error.massage || error);
  } finally {
    isLoading.value = false
  }
}

async function confirmSubscription(id: number, data: any) {
  isLoading.value = true
  try {
    const result = await confirmSubscriptionsMasterService(id, data)
    console.log(result);
    toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
    await getSubscriptionListMaster()
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  nextTick(() => getSubscriptionListMaster())
})

// type Payment = {
//   id: string
//   fullName: string
//   typeTransaction: 'شهریه' | 'تجهیزات'
//   price: number
//   date: Date | string
//   paymentMethod: 'آنلاین' | 'نقدی',
//   status: 'پرداخت شده' | 'پرداخت نشده' | 'در انتظار پرداخت'
// }

// const data = ref<Payment[]>([{
//   id: '4600',
//   fullName: 'احمد رضا سلطانی',
//   typeTransaction: 'شهریه',
//   price: 12000000,
//   date: '2024-03-11T15:30:00',
//   paymentMethod: 'آنلاین',
//   status: 'پرداخت شده'
// }])

const columnLabels: Record<string, string> = {
  fullName: 'نام مدیر باشگاه',
  amount: 'مبلغ',
  paymentDate: 'تاریخ پرداخت',
  trackingNumber: 'شماره پیگیری',
  payerFullName: 'نام پرداخت کننده',
  bankName: 'نام بانک',
  receiptImageUrl: 'فیش واریزی',
  status: 'وضعیت',
  confirmerId: 'ایدی تایید کننده',
  createdAt: 'تاریخ ثبت',
}

const columns: TableColumn<SubscriptionListData>[] = [
  {
    accessorKey: 'payerFullName',
    header: 'نام پرداخت کننده',
    cell: ({ row }) => {
      return row.getValue('payerFullName')
    }
  },
  {
    id: 'fullName',
    header: 'نام مدیر باشگاه',
    accessorFn: row => row.master?.fullName,
    cell: ({ getValue }) => getValue()
  },
  {
    accessorKey: 'bankName',
    header: 'نام بانک',
    cell: ({ row }) => {
      return row.getValue('bankName')
    }
  },
  {
    accessorKey: 'trackingNumber',
    header: 'شماره پیگیری',
    cell: ({ row }) => {
      return row.getValue('trackingNumber')
    }
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => {
      const paymentStatus = row.getValue('status')
      const color = ({
        'CONFIRMED': 'success' as const,
        'REJECTED': 'error' as const,
        'PENDING': 'warning' as const,
      })[paymentStatus as string]
      let text = paymentStatus
      switch (paymentStatus) {
        case 'CONFIRMED':
          text = 'تایید شد'
          break;
        case 'PENDING':
          text = 'در انتظار تایید'
          break;
        case 'REJECTED':
          text = 'پر داخت ناموفق'
          break;
      }
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => text)
    }
  },
  {
    accessorKey: 'amount',
    header: 'مبلغ',
    cell: ({ row }) => h("span", { class: 'font-medium' }, `${Number(row.getValue('amount')).toLocaleString()} تومان`)
  },
  {
    accessorKey: 'paymentDate',
    header: 'تاریخ پرداخت',
    cell: ({ row }) => {
      return new Date(row.getValue('paymentDate')).toLocaleString('fa-IR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'تاریخ ثبت',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleString('fa-IR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'receiptImageUrl',
    header: 'فیش واریزی',
    cell: ({ row }) => {
      const src = row.getValue('receiptImageUrl')
      return h('img', {
        src,
        class: 'size-10 rounded-full object-cover cursor-pointer',
        onClick: () => {
          showImagePreview(`فیش واریزی ${row.original.payerFullName}`, src)
        }
      })
    }
  },
  {
    id: 'actions',
    header: 'عملیات',
    enableHiding: false,
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(UButton, {
          label: 'تایید',
          icon: 'i-heroicons-check-circle',
          color: 'success',
          size: 'sm',
          onClick: () => {
            console.log("confirm");
            console.log(row.original.id);
            confirmSubscription(row.original.id, { status: statusConfirmSubscriptionsMaster.CONFIRMED })
          }
        }),
        h(UButton, {
          label: 'رد کردن',
          icon: 'i-heroicons-x-circle',
          color: 'error',
          variant: 'soft',
          size: 'sm',
          onClick: () => {
            console.log("reject");
          }
        })
      ])
    }
  }
];
</script>