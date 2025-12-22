<template>
  <div class="w-full p-5 rounded-xl bg-white flex flex-col gap-3">
    <div class="w-full flex max-md:flex-col gap-3">
      <div class="flex max-sm:flex-col gap-3">
        <UButton icon="mdi-light:download" label="خروجی اکسل" size="xl" color="neutral" variant="solid"
          class="flex- justify-center w-full md:w-fit" />
        <UButton icon="material-symbols:shopping-bag" @click="modalStore.toggleModal('equipmentAdd')"
          label="افزودن خرید تجهیزات" size="xl" color="neutral" variant="solid"
          class="flex- justify-center w-full md:w-fit" />
      </div>
      <UInput :model-value="(table?.tableApi?.getColumn('fullName')?.getFilterValue() as string)"
        @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)" type="search"
        class="w-full" placeholder="جستجو بر اساس نام هنرجویان" size="xl" variant="outline" icon="i-lucide-search"
        color="primary" />
    </div>
    <div class="flex max-md:flex-col gap-3 w-full h-full">
      <BaseDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
        label: columnLabels[column.id] || column.id, type: 'checkbox' as const, checked: column.getIsVisible(),
        onUpdateChecked(checked: boolean) {
          table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
        },
        onSelect(e?: Event) {
          e?.preventDefault()
        }
      }))" label="ستون ها" class="w-full" />
      <BaseDropdownMenu :items="paymentMethodOptions.map(paymentMethod => (
        {
          label: paymentMethodLabels[paymentMethod], type: 'checkbox' as const, checked: selectedPaymentMethod.includes(paymentMethod),
          onUpdateChecked(checked: boolean) {
            if (checked) {
              selectedPaymentMethod.push(paymentMethod)
            } else {
              selectedPaymentMethod = selectedPaymentMethod.filter(b => b !== paymentMethod)
            }
          },
          onSelect(e?: Event) { e?.preventDefault() }
        }))" label="روش پرداخت" class="w-full" />
      <BaseDropdownMenu :items="typeTransactionOptions.map(typeTransaction => (
        {
          label: transactionTypeLabels[typeTransaction], type: 'checkbox' as const, checked: selectedTypeTransaction.includes(typeTransaction),
          onUpdateChecked(checked: boolean) {
            if (checked) {
              selectedTypeTransaction.push(typeTransaction)
            } else {
              selectedTypeTransaction = selectedTypeTransaction.filter(b => b !== typeTransaction)
            }
          },
          onSelect(e?: Event) { e?.preventDefault() }
        }))" label="نوع تراکنش" class="w-full" />
      <BaseDropdownMenu :items="statusOptions.map(statusPayment => (
        {
          label: paymentStatusLabels[statusPayment], type: 'checkbox' as const, checked: selectedStatus.includes(statusPayment),
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
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-gray-200">
        <UIcon name="streamline:money-cash-dollar-coin-accounting-billing-payment-cash-coin-currency-money-finance"
          class="size-6 bg-gray-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">
          {{ generalSum?.totalAmount ? generalSum?.totalAmount.toLocaleString('fa-IR') : 'وجود ندارد' }}
        </span>
        <span class="font-medium text-sm">جمع کل درآمد</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-turquoise-100">
        <UIcon name="streamline:interface-validation-check-check-form-validation-checkmark-success-add-addition"
          class="size-6 bg-turquoise-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">
          {{ generalSum?.paidFees ? generalSum?.paidFees.toLocaleString('fa-IR') : 'وجود ندارد' }}
        </span>
        <span class="font-medium text-sm">کل شهریه‌های پرداخت شده</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-error-100">
        <UIcon name="mi:circle-error" class="size-6 bg-error-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">
          {{ generalSum?.unpaidFees ? generalSum?.unpaidFees.toLocaleString('fa-IR') : 'وجود ندارد' }}
        </span>
        <span class="font-medium text-sm">کل شهریه‌های پرداخت نشده</span>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg flex flex-col gap-3 justify-center items-center">
      <div class="flex items-center justify-center size-14 rounded-full bg-yellow-100">
        <UIcon name="material-symbols:shopping-cart" class="size-6 bg-yellow-500" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-semibold text-2xl">
          {{ generalSum?.equipmentIncome ? generalSum?.equipmentIncome.toLocaleString('fa-IR') : 'وجود ندارد' }}
        </span>
        <span class="font-medium text-sm">کل درآمد تجهیزات</span>
      </div>
    </div>
  </div>
  <div class="w-full h-full p-5 rounded-xl bg-white flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <span class="text-lg md:text-2xl font-bold">همه تراکنش های مالی ({{ formData.length }} مورد)</span>
      <p class="break-words font-medium text-sm">تمام تراکنش‌های مالی باشگاه</p>
    </div>
    <UTable ref="table" :loading="isLoading" loading-color="neutral" :data="filteredData" :columns="columns"
      empty="هیچ اطلاعاتی برای نمایش وجود ندارد" sticky class="h-96 lg:h-svh no-scrollbar">
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
  <LazyWidgetModalEquipmentAdd v-model:open="modalStore.modals.equipmentAdd" @success="refreshPage" />
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { ComponentPublicInstance } from "vue";
import { PaymentMethodStatus } from "~/models/transactions/PaymentMethodStatus";
import type { RejectTransaction } from "~/models/transactions/RejectTransaction";
import type { GeneralSum, TransactionData } from "~/models/transactions/TransactionData";
import { TransactionStatus } from "~/models/transactions/TransactionStatus";
import { TransactionType } from "~/models/transactions/TransactionType";
import { confirmTransactionService, getHistoryTransactionMasterService, rejectTransactionService } from "~/services/transactions.service";

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const table = useTemplateRef<ComponentPublicInstance>('table')
const modalStore = useModalStore()
const toastStore = useToastStore()
const { showConfirmDialog } = useConfirmDialog()
const { showSendMessage } = useSendMessage()
const formData: Ref<TransactionData[]> = ref([])
const generalSum = shallowRef<GeneralSum | null>(null)
const isLoading: Ref<boolean> = ref(false)
const hasMore: Ref<boolean> = ref(true)
const page = ref(1)
const limit = ref(15)
const totalPages = ref(0)

const paymentMethodLabels: Record<PaymentMethodStatus, string> = {
  [PaymentMethodStatus.CASH]: 'نقدی',
  [PaymentMethodStatus.CARD]: 'کارت',
  [PaymentMethodStatus.ONLINE]: 'آنلاین',
}

const transactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.FEE]: 'شهریه',
  [TransactionType.EQUIPMENT]: 'تجهیزات',
  [TransactionType.OTHER]: 'سایر',
}

const paymentStatusLabels: Record<TransactionStatus, string> = {
  [TransactionStatus.PAID]: 'پرداخت شده',
  [TransactionStatus.PENDING]: 'در انتظار تایید',
  [TransactionStatus.UNPAID]: 'پرداخت نشده',
  [TransactionStatus.UPCOMING]: 'پرداخت های آینده',
}

const selectedPaymentMethod = ref<PaymentMethodStatus[]>([])
const selectedTypeTransaction = ref<TransactionType[]>([])
const selectedStatus = ref<TransactionStatus[]>([])
const paymentMethodOptions = ref([PaymentMethodStatus.CASH, PaymentMethodStatus.CARD, PaymentMethodStatus.ONLINE])
const typeTransactionOptions: Ref<TransactionType[]> = ref(
  [TransactionType.FEE, TransactionType.EQUIPMENT, TransactionType.OTHER]
)
const statusOptions: Ref<TransactionStatus[]> = ref(
  [TransactionStatus.PAID, TransactionStatus.PENDING, TransactionStatus.UNPAID, TransactionStatus.UPCOMING]
)

const filteredData = computed(() => {
  return formData.value.filter(row => {
    const paymentMethodMatch = selectedPaymentMethod.value.length === 0 || selectedPaymentMethod.value.includes(row.paymentMethod)
    const statusMatch = selectedStatus.value.length === 0 || selectedStatus.value.includes(row.status)
    const typeTransactionMatch = selectedTypeTransaction.value.length === 0 || selectedTypeTransaction.value.includes(row.type)
    return paymentMethodMatch && statusMatch && typeTransactionMatch
  })
})

async function getTransactionStudent() {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    const result = await getHistoryTransactionMasterService(page.value, limit.value);
    console.log(result);
    if (result.statusCode === 200) {
      const newItems = Array.isArray(result.data?.transactions) ? result.data?.transactions : [];
      generalSum.value = result.data?.generalSum as GeneralSum
      if (page.value === 1) {
        formData.value = newItems;
      } else {
        formData.value.push(...newItems);
      }
      if (result.pagination) {
        totalPages.value = result.pagination.totalPages;
        if (page.value >= totalPages.value) {
          hasMore.value = false;
        } else {
          page.value++;
        }
      } else {
        if (newItems.length < limit.value) {
          hasMore.value = false;
        } else {
          page.value++;
        }
      }
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false;
  }
}

async function confirmTransaction(id: number) {
  isLoading.value = true
  try {
    const result = await confirmTransactionService(id);
    if (result.statusCode === 200) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      console.log(result.data);
      const transactionIndex = formData.value.findIndex(transaction => transaction.id === id)
      if (transactionIndex !== -1) {
        formData.value[transactionIndex].status = TransactionStatus.PAID
        formData.value[transactionIndex].paymentMethod = PaymentMethodStatus.CASH
      }
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false
  }
}

async function rejectTransaction(id: number, description: RejectTransaction) {
  isLoading.value = true
  try {
    const result = await rejectTransactionService(id, description)
    if (result.statusCode === 200) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      console.log(result.data);
      const transactionIndex = formData.value.findIndex(transaction => transaction.id === id)
      if (transactionIndex !== -1) {
        formData.value[transactionIndex].status = TransactionStatus.UNPAID
      }
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false
  }
}

async function refreshPage() {
  page.value = 1;
  hasMore.value = true;
  await getTransactionStudent();
}

onMounted(async () => {
  await getTransactionStudent();

  await nextTick();

  if (table.value) {
    useInfiniteScroll(
      table.value.$el,
      () => {
        if (!isLoading.value && hasMore.value) {
          getTransactionStudent();
        }
      },
      {
        distance: 100,
        interval: 500,
        canLoadMore: () => !isLoading.value && hasMore.value
      }
    )
  }
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
  fullName: 'هنرجو',
  type: 'نوع تراکنش',
  paymentMethod: 'روش پرداخت',
  status: 'وضعیت',
  amount: 'مبلغ',
  createdAt: 'تاریخ',
  paymentDate: 'زمان پرداخت',
  dueDate: 'تاریخ سررسید'
}

const columns: TableColumn<TransactionData>[] = [
  {
    accessorKey: 'fullName',
    header: 'نام کامل',
    accessorFn: row => row.student?.fullName,
    cell: ({ getValue }) => getValue()
  },
  {
    accessorKey: 'type',
    header: 'نوع تراکنش',
    cell: ({ row }) => {
      const transactionType = row.getValue('type') as string
      const color = ({
        'FEE': 'info' as const,
        'EQUIPMENT': 'tertiary' as const,
        'OTHER': 'neutral' as const,
      })[transactionType]
      let text = transactionType
      switch (transactionType) {
        case 'FEE':
          text = 'شهریه'
          break;
        case 'EQUIPMENT':
          text = 'تجهیزات'
          break;
        case 'OTHER':
          text = 'سایر'
          break;
      }
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => text)
    }
  },
  {
    accessorKey: 'paymentMethod',
    header: 'روش پرداخت',
    cell: ({ row }) => {
      const paymentMethod = row.getValue('paymentMethod') as string
      const color = ({
        'CARD': 'info' as const,
        'CASH': 'tertiary' as const,
        'ONLINE': 'neutral' as const,
        null: 'warning' as const,
      })[paymentMethod]
      let text = paymentMethod
      switch (paymentMethod) {
        case 'CASH':
          text = 'نقدی'
          break;
        case 'CARD':
          text = 'کارت'
          break;
        case 'ONLINE':
          text = 'آنلاین'
          break;
        default:
          text = 'تعیین نشده'
          break;
      }
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => text)
    }
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const color = ({
        'PAID': 'success' as const,
        'UNPAID': 'error' as const,
        'PENDING': 'warning' as const,
        'UPCOMING': 'error' as const,
      })[status]
      let text = status
      switch (status) {
        case 'UPCOMING':
          text = 'پرداخت در اینده'
          break;
        case 'PAID':
          text = 'پرداخت شده'
          break;
        case 'PENDING':
          text = 'در انتظار پرداخت'
          break;
        case 'UNPAID':
          text = 'پرداخت نشده'
          break;
      }
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => text)
    }
  },
  {
    accessorKey: 'amount',
    header: 'مبلغ',
    cell: ({ row }) => h("span", { class: 'font-medium' }, `${Number(row.getValue('amount')).toLocaleString('fa-IR')} تومان`)
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
        hour12: false
      })
    }
  },
  {
    accessorKey: 'paymentDate',
    header: 'زمان پرداخت',
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
    accessorKey: 'dueDate',
    header: 'تاریخ سررسید',
    cell: ({ row }) => {
      return new Date(row.getValue('dueDate')).toLocaleString('fa-IR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
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
          onClick() {
            showConfirmDialog(`آیا اطمینان دارید که هنرجو ${row.original.student.fullName} پرداخت انجام داده؟`, () => {
              confirmTransaction(row.original.id)
            })
          }
        }),
        h(UButton, {
          label: 'رد کردن',
          icon: 'i-heroicons-x-circle',
          color: 'error',
          variant: 'soft',
          size: 'sm',
          onClick() {
            showSendMessage(`آیا تأیید می‌کنید که هنرجو ${row.original.student.fullName} هنوز پرداختی انجام نداده است؟`,
              (desc) => {
                rejectTransaction(row.original.id, { reason: desc });
              }
            );
          }
        })
      ])
    }
  }
];
</script>