<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex max-lg:flex-col items-center gap-3 overflow-x-auto py-2">
      <UInput :model-value="(table?.tableApi?.getColumn('fullName')?.getFilterValue() as string)"
        @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)" type="search"
        class="w-full xl:w-1/3" placeholder="جستجو بر اساس نام استاد" size="xl" variant="outline" icon="i-lucide-search"
        color="primary" />
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
        <BaseDropdownMenu :content="{ align: 'end', class: 'max-h-64 md:max-h-70' }" :items="itemsSelect.map(sport => ({
          label: sport, type: 'checkbox' as const, checked: selectedStatusSport.includes(sport),
          onUpdateChecked(checked: boolean) {
            if (checked) {
              selectedStatusSport.push(sport)
            } else {
              selectedStatusSport = selectedStatusSport.filter(b => b !== sport)
            }
          },
          onSelect(e?: Event) { e?.preventDefault() }
        }))" label="رشته ها" />
        <BaseDropdownMenu :items="statusAccountOptions.map(account => ({
          label: activeLabels[account], type: 'checkbox' as const, checked: selectedStatusAccount.includes(account),
          onUpdateChecked(checked: boolean) {
            if (checked) {
              selectedStatusAccount.push(account)
            } else {
              selectedStatusAccount = selectedStatusAccount.filter(b => b !== account)
            }
          },
          onSelect(e?: Event) { e?.preventDefault() }
        }))" label="وضعیت حساب" />
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
        }))" label="وضعیت پلن ها" />
      </div>
    </div>
    <UTable sticky :loading="isLoading" loading-color="neutral" ref="table" :data="filteredData" :columns="columns"
      empty="هیچ اطلاعاتی برای نمایش وجود ندارد" class="h-96 lg:h-svh no-scrollbar">
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
  <LazyWidgetModalMasterEdit v-model:open="modalStore.modals.masterEdit" />
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { changeStatusMasterService, deleteMasterService, getAllMasterService } from "~/services/master.service";
import type { MasterData } from "~/models/users/master/MasterData";
import { Active } from "~/models/Active";
import { PaymentStatus } from "~/models/PaymentStatus";
import type { Sport } from "~/models/sportAndBelt/sport";
import { getAllSportService } from "~/services/sportBelt.service";

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const table = useTemplateRef('table')
const { showConfirmDialog } = useConfirmDialog()
const modalStore = useModalStore()
const toastStore = useToastStore()
const isLoading: Ref<boolean> = ref(false)
const formData: Ref<MasterData[]> = ref([])
const itemsSelect: Ref<any[]> = ref([])

const activeLabels: Record<Active, string> = {
  [Active.ENABLE]: 'فعال',
  [Active.DISABLE]: 'غیر فعال',
}

const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'در انتظار تایید',
  [PaymentStatus.CONFIRMED]: 'پرداخت شده',
  [PaymentStatus.REJECTED]: 'پرداخت نشده',
  [PaymentStatus.NO_PAYMENT]: 'بدون موجودی',
}

const selectedStatusSport = ref<string[]>([])
const selectedStatusAccount = ref<Active[]>([])
const selectedStatusPayment = ref<PaymentStatus[]>([])
const statusSportOptions: Ref<Sport[]> = ref([])
const statusAccountOptions: Ref<Active[]> = ref([Active.ENABLE, Active.DISABLE])
const statusPaymentOption: Ref<PaymentStatus[]> = ref(
  [PaymentStatus.PENDING, PaymentStatus.CONFIRMED, PaymentStatus.REJECTED, PaymentStatus.NO_PAYMENT]
)
// const statusAccountOptions = ref(['فعال', 'غیر فعال'])
// const statusSportOptions = ref(['کارته', 'بوکس', 'کیک بوکس', 'جودو', 'کشتی', 'کنگفو', 'تکواندو', 'موی تای', 'ام‌ام‌ای'])
// const statusPaymentOption = ref(['پرداخت شده', 'پرداخت نشده', 'در انتظار پرداخت'])

const filteredData = computed(() => {
  return formData.value.filter(row => {
    const statusAccountMatch =
      selectedStatusAccount.value.length === 0 || selectedStatusAccount.value.includes(row.active)
    const statusPaymentMatch =
      selectedStatusPayment.value.length === 0 || selectedStatusPayment.value.includes(row.paymentStatus)
    const statusSportMatch =
      selectedStatusSport.value.length === 0 || selectedStatusSport.value.includes(row.sport.name)
    return statusAccountMatch && statusPaymentMatch && statusSportMatch
  })
})

async function getAllMasterData() {
  isLoading.value = true
  try {
    const result = await getAllMasterService()
    if (result.statusCode === 200) {
      formData.value = Array.isArray(result.data) ? result.data : [];
      console.log(result.data)
    }
  } catch (error: any) {
    console.log(error.message || error)
  } finally {
    isLoading.value = false
  }
}

async function getSportAll() {
  try {
    const result = await getAllSportService()
    if (result.statusCode === 200) {
      statusSportOptions.value = Array.isArray(result.data) ? result.data : [];
      itemsSelect.value = statusSportOptions.value.map(item => item.name)
    }
  } catch (error: any) {
    console.log(error.message || error)
  }
}

async function changeStatusUser(id: number, status: Active) {
  isLoading.value = true
  try {
    const result = await changeStatusMasterService(id, status)
    if (result.statusCode === 200) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      const userIndex = formData.value.findIndex(user => user.user_id === id)
      if (userIndex !== -1) {
        formData.value[userIndex].active = status
      }
    }
  } catch (error: any) {
    console.log(error.message || error)
  } finally {
    isLoading.value = false
  }
}

async function deleteAccountUser(id: number) {
  isLoading.value = true
  try {
    const result = await deleteMasterService(id)
    if (result.statusCode === 200) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      refreshNuxtData()
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    getAllMasterData()
    getSportAll()
  })
})

// type Payment = {
//   id: string
//   fullName: string
//   phoneNumber: string
//   payment: 'پرداخت شده' | 'پرداخت نشده' | 'در انتظار پرداخت'
//   status: 'فعال' | 'غیر فعال'
//   sport: 'کارته' | 'بوکس' | 'کیک بوکس' | 'جودو' | 'کشتی' | 'کنگفو' | 'تکواندو' | 'موی تای' | 'ام‌ام‌ای'
//   history: string
//   countStudent: number,
//   date: string | Date,
// }

// const data = ref<Payment[]>([{
//   id: '22',
//   fullName: 'محمد غفاری',
//   phoneNumber: '09212345678',
//   payment: 'پرداخت نشده',
//   status: 'فعال',
//   sport: 'کارته',
//   history: '5 سال',
//   countStudent: 30,
//   date: '2024-03-11T15:30:00',
// }])

const columnLabels: Record<string, string> = {
  fullName: 'نام کامل',
  phoneNumber: 'شماره تلفن',
  paymentStatus: 'وضعیت پلن',
  active: 'وضعیت',
  sport: 'رشته',
  history: 'سابقه تدریس',
  students: 'تعداد هنرجویان',
  createdAt: 'تاریخ',
}
const columns: TableColumn<MasterData>[] = [
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
    accessorKey: 'paymentStatus',
    header: 'وضعیت پلن',
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
    accessorKey: 'history',
    header: 'سابقه تدریس',
    cell: ({ row }) => {
      const history = row.getValue('history')
      if (history === null) {
        return h('span', { class: 'font-medium' }, 'سابقه استاد وجود ندارد')
      } else {
        return `${history} سال`
      }
    }
  },
  {
    accessorKey: 'students',
    header: 'هنرجویان',
    cell: ({ row }) => {
      const students = row.getValue('students')
      if (students.length <= 0) {
        return h("span", { class: 'font-medium' }, 'هنرجو وجود ندارد')
      } else {
        return h("span", { class: 'font-medium' }, `${students.length} نفر`)
      }
    }
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
          modalStore.toggleModal('masterEdit', userId)
        }
      }, {
        label: 'تغییر وضعیت',
        icon: 'hugeicons:exchange-01',
        onSelect() {
          const userId = row.original.user_id
          const statusAccount = row.original.active
          const newStatus = statusAccount === 'ENABLE' ? 'DISABLE' : 'ENABLE'
          showConfirmDialog(` آیا میخواهید وضعیت حساب کاربر ${row.original.fullName} را تغییر دهید.`, () => {
            changeStatusUser(userId, newStatus as Active)
          })
        }
      }, {
        label: 'حذف استاد',
        icon: 'ic:sharp-delete',
        color: 'error',
        onSelect() {
          const userId = row.original.user_id
          showConfirmDialog(`آیا میخواهید استاد ${row.original.fullName} را حذف کنید؟`, () => {
            deleteAccountUser(userId)
          })
        }
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