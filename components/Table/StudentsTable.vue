<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex max-lg:flex-col items-center gap-3 overflow-x-auto py-2">
      <UInput :model-value="(table?.tableApi?.getColumn('fullName')?.getFilterValue() as string)"
        @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)" type="search"
        class="w-full xl:w-1/3" placeholder="جستجو بر اساس نام هنرجویان" size="xl" variant="outline"
        icon="i-lucide-search" color="primary" />
      <div class="w-full flex max-sm:flex-col gap-3">
        <BaseDropdownMenu :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
          label: columnLabels[column.id] || column.id, type: 'checkbox' as const, checked: column.getIsVisible(),
          onUpdateChecked(checked: boolean) {
            table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
          },
          onSelect(e?: Event) {
            e?.preventDefault()
          }
        }))" label="ستون ها" />
        <BaseDropdownMenu :content="{ align: 'end', class: 'max-h-64 md:max-h-70' }" :items="itemsSelect.map(belt => ({
          label: belt, type: 'checkbox' as const, checked: selectedBelts.includes(belt),
          onUpdateChecked(checked: boolean) {
            if (checked) {
              selectedBelts.push(belt)
            } else {
              selectedBelts = selectedBelts.filter(b => b !== belt)
            }
          },
          onSelect(e?: Event) { e?.preventDefault() }
        }))" label="کمربند ها" />
        <BaseDropdownMenu :items="statusPaymentOption.map(statusPayment => ({
          label: paymentStatusLabels[statusPayment], type: 'checkbox' as const, checked: selectedStatusPayment.includes(statusPayment),
          onUpdateChecked(checked: boolean) {
            if (checked) {
              selectedStatusPayment.push(statusPayment)
            } else {
              selectedStatusPayment = selectedStatusPayment.filter(b => b !== statusPayment)
            }
          },
          onSelect(e?: Event) { e?.preventDefault() }
        }))" label="وضعیت شهریه ها" />
      </div>
    </div>
    <UTable ref="table" :loading="props.loading" :data="filteredData" :columns="columns"
      empty="هیچ اطلاعاتی برای نمایش وجود ندارد" sticky class="h-96 lg:h-svh no-scrollbar">
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { PaymentStatus } from '~/models/PaymentStatus'
import type { Belt } from '~/models/sportAndBelt/belt'
import type { StudentData } from '~/models/users/student/StudentData'
import { getAllBeltService } from '~/services/sportBelt.service'
import { deleteStudentService } from '~/services/student.service'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const table = useTemplateRef('table')
const modalStore = useModalStore()
const toastStore = useToastStore()
const { showConfirmDialog } = useConfirmDialog()
const rowLoading = ref<number | null>(null)
const itemsSelect: Ref<any[]> = ref([])

const emit = defineEmits(['refresh'])
const props = defineProps<{
  items: StudentData[],
  loading: boolean
}>()

const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'در انتظار تایید',
  [PaymentStatus.CONFIRMED]: 'پرداخت شده',
  [PaymentStatus.REJECTED]: 'پرداخت نشده',
  [PaymentStatus.NO_PAYMENT]: 'بدون موجودی',
}

const selectedBelts = ref<string[]>([])
const selectedStatusPayment = ref<PaymentStatus[]>([])
const beltOptions: Ref<Belt[]> = ref([])
const statusPaymentOption: Ref<PaymentStatus[]> = ref(
  [PaymentStatus.PENDING, PaymentStatus.CONFIRMED, PaymentStatus.REJECTED, PaymentStatus.NO_PAYMENT]
)
// const beltOptions = ref(['سفید', 'نارنجی', 'ابی', 'زرد', 'سبز', 'قهوه ای', 'سیاه'])
// const statusPaymentOption = ref(['پرداخت شده', 'پرداخت نشده', 'در انتظار پرداخت'])

const filteredData = computed(() => {
  return props.items.filter(row => {
    const beltMatch = selectedBelts.value.length === 0 || selectedBelts.value.includes(row.currentBelt.color)
    const statusMatch = selectedStatusPayment.value.length === 0 || selectedStatusPayment.value.includes(row.paymentStatus)
    return beltMatch && statusMatch
  })
})

async function getAllBelt() {
  try {
    const result = await getAllBeltService()
    console.log(result.data);

    if (result.statusCode === 200) {
      beltOptions.value = Array.isArray(result.data) ? result.data : [];
      itemsSelect.value = beltOptions.value.map(item => item.color)
    }
  } catch (error: any) {
    console.log(error.message || error)
  }
}

async function deleteAccountStudent(id: number) {
  rowLoading.value = id
  try {
    const result = await deleteStudentService(id)
    console.log(result.data);
    if (result.statusCode === 200) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      emit('refresh')
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    rowLoading.value = null
  }
}

onMounted(() => {
  nextTick(() => getAllBelt())
})

// type Payment = {
//   id: string
//   fullName: string
//   belt: 'سفید' | 'نارنجی' | 'ابی' | 'زرد' | 'سبز' | 'قهوه ای' | 'سیاه',
//   status: 'پرداخت شده' | 'پرداخت نشده' | 'در انتظار پرداخت'
//   sport: string
//   attendance: number,
//   date: string | Date,
// }

// const data = ref<Payment[]>([{
//   id: '4600',
//   fullName: 'محمد غفاری',
//   belt: 'سفید',
//   status: 'پرداخت نشده',
//   sport: 'کاراته',
//   attendance: 30,
//   date: '2024-03-11T15:30:00',
// }])

const columnLabels: Record<string, string> = {
  fullName: 'نام کامل',
  phoneNumber: 'شماره تلفن',
  currentBelt: 'کمربند ها',
  paymentStatus: 'وضعیت شهریه',
  active: 'وضعیت حساب ها',
  sport: 'رشته',
  status: 'وضعیت شهریه',
  attendance: 'حضور',
  createdAt: 'تاریخ ایجاد',
  updatedAt: 'تاریخ بروزرسانی'
}

const columns: TableColumn<StudentData>[] = [
  {
    accessorKey: 'fullName',
    header: 'نام کامل',
    cell: ({ row }) => {
      return row.getValue('fullName')
    }
  },
  {
    accessorKey: 'phoneNumber',
    header: 'شماره تلفن',
    cell: ({ row }) => {
      return row.getValue('phoneNumber')
    }
  },
  {
    accessorKey: 'currentBelt',
    header: 'کمربند ها',
    cell: ({ row }) => {
      const belt = row.getValue('currentBelt')?.color

      const color = ({
        'سفید': 'belt-white border' as const,
        'خاکستری': 'belt-gray' as const,
        'زرد': 'belt-yellow' as const,
        'نارنجی': 'belt-orange' as const,
        'سبز': 'belt-green' as const,
        'آبی': 'belt-blue' as const,
        'بنفش': 'belt-purple' as const,
        'قهوه‌ای': 'belt-brown' as const,
        'قرمز': 'belt-red' as const,
        'قرمز/سیاه': 'belt-red-black' as const,
        'قرمز/سفید': 'belt-red-white' as const,
        'مشکی': 'belt-black' as const,
        'صورتی': 'belt-pink' as const,
        'طلایی': 'belt-gold' as const,
        'نقره‌ای': 'belt-silver' as const
      })[belt as string]

      return h("span", { class: `px-2  py-1 rounded-lg font-medium text-xs ${color}` }, belt)
    }
  },
  {
    accessorKey: 'paymentStatus',
    header: 'وضعیت شهریه',
    cell: ({ row }) => {
      const paymentStatus = row.getValue('paymentStatus')
      const color = ({
        'CONFIRMED': 'success' as const,
        'REJECTED': 'error' as const,
        'PENDING': 'warning' as const,
        'NO_PAYMENT': 'error' as const,
      })[paymentStatus as string]
      let text = paymentStatus
      switch (paymentStatus) {
        case 'NO_PAYMENT':
          text = 'پرداخت وجود ندارد'
          break;
        case 'CONFIRMED':
          text = 'پرداخت شده'
          break;
        case 'PENDING':
          text = 'در انتظار پرداخت'
          break;
        case 'REJECTED':
          text = 'پر داخت نشده'
          break;
      }
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => text)
    }
  },
  {
    accessorKey: 'active',
    header: 'وضعیت',
    cell: ({ row }) => {
      const activeValue = row.getValue('active')
      const color = ({
        'ENABLE': 'success' as const,
        'DISABLE': 'error' as const,
      })[activeValue as string]
      const statusText = activeValue === 'ENABLE' ? 'فعال' : 'غیر فعال'
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => statusText)
    }
  },
  {
    accessorKey: 'sport',
    header: ({ column }) => {
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
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('sport')?.name)
  },
  {
    accessorKey: 'createdAt',
    header: 'تاریخ ایجاد',
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
    accessorKey: 'updatedAt',
    header: 'تاریخ بروزرسانی',
    cell: ({ row }) => {
      return new Date(row.getValue('updatedAt')).toLocaleString('fa-IR', {
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
      const items = [{
        type: 'label',
        label: 'عملیات'
      }, {
        type: 'separator'
      }, {
        label: 'مشاهده پروفایل',
        icon: 'material-symbols:person',
        onSelect() {
          const userId = row.original.user_id
          modalStore.toggleModal('studentEdit', userId)
        }
      }, {
        label: 'حذف هنرجو',
        icon: 'ic:sharp-delete',
        color: 'error',
        loading: rowLoading.value === row.original.user_id,
        onSelect() {
          const userId = row.original.user_id
          showConfirmDialog(`آیا میخواهید هنرجو ${row.original.fullName} را حذف کنید؟`, () => {
            deleteAccountStudent(userId)
          })
        },
      }]
      return h('div', { class: 'text-right' }, h(UDropdownMenu, {
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