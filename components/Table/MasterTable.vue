<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex max-lg:flex-col items-center gap-3 overflow-x-auto py-2">
      <UInput
        :model-value="table?.tableApi?.getColumn('fullName')?.getFilterValue() as string"
        @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)"
        type="search"
        class="w-full xl:w-1/3"
        placeholder="جستجو بر اساس نام استاد"
        size="xl"
        variant="outline"
        icon="i-lucide-search"
        color="primary"
      />
      <div class="w-full flex max-sm:flex-col gap-3">
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
        />
        <BaseDropdownMenu
          :content="{ align: 'end', class: 'max-h-64 md:max-h-70' }"
          :items="
            itemsSelect.map((sport) => ({
              label: sport,
              type: 'checkbox' as const,
              checked: selectedStatusSport.includes(sport),
              onUpdateChecked(checked: boolean) {
                if (checked) {
                  selectedStatusSport.push(sport)
                } else {
                  selectedStatusSport = selectedStatusSport.filter((b) => b !== sport)
                }
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              },
            }))
          "
          label="رشته ها"
        />
        <BaseDropdownMenu
          :items="
            statusAccountOptions.map((account) => ({
              label: activeLabels[String(account)],
              type: 'checkbox' as const,
              checked: selectedStatusAccount.includes(account),
              onUpdateChecked(checked: boolean) {
                if (checked) {
                  selectedStatusAccount.push(account)
                } else {
                  selectedStatusAccount = selectedStatusAccount.filter((b) => b !== account)
                }
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              },
            }))
          "
          label="وضعیت حساب"
        />
        <BaseDropdownMenu
          :items="
            statusPaymentOption.map((statusPayment) => ({
              label: paymentStatusLabels[statusPayment],
              type: 'checkbox' as const,
              checked: selectedStatusPayment.includes(statusPayment),
              onUpdateChecked(checked: boolean) {
                if (checked) {
                  selectedStatusPayment.push(statusPayment)
                } else {
                  selectedStatusPayment = selectedStatusPayment.filter((b) => b !== statusPayment)
                }
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              },
            }))
          "
          label="وضعیت پلن ها"
        />
      </div>
    </div>
    <UTable
      sticky
      :loading="loadingModel"
      loading-color="neutral"
      ref="table"
      :data="filteredData"
      :columns="columns"
      empty="هیچ اطلاعاتی برای نمایش وجود ندارد"
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
  import { changeStatusMasterService, deleteMasterService } from '~/services/master.service'
  import type { MasterData } from '~/models/users/master/MasterData'
  import { PaymentStatus } from '~/models/PaymentStatus'

  const UButton = resolveComponent('UButton')
  const UBadge = resolveComponent('UBadge')
  const UDropdownMenu = resolveComponent('UDropdownMenu')
  const table = useTemplateRef('table')
  const { showConfirmDialog } = useConfirmDialog()
  const modalStore = useModalStore()
  const toastStore = useToastStore()
  const gettingVariousDataStore = useGettingVariousDataStore()
  const itemsSelect: Ref<any[]> = ref([])

  const emit = defineEmits(['deleted'])
  const loadingModel = defineModel<boolean>('loading', { required: true })
  const props = defineProps<{
    items: MasterData[]
  }>()

  const paymentStatusLabels: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'در انتظار تایید',
    [PaymentStatus.CONFIRMED]: 'پرداخت شده',
    [PaymentStatus.REJECTED]: 'پرداخت نشده',
    [PaymentStatus.NO_PAYMENT]: 'بدون موجودی',
  }

  const selectedStatusSport = ref<string[]>([])
  const selectedStatusAccount = ref<boolean[]>([])
  const selectedStatusPayment = ref<PaymentStatus[]>([])
  const statusAccountOptions: Ref<boolean[]> = ref([true, false])
  const statusPaymentOption: Ref<PaymentStatus[]> = ref([
    PaymentStatus.PENDING,
    PaymentStatus.CONFIRMED,
    PaymentStatus.REJECTED,
    PaymentStatus.NO_PAYMENT,
  ])

  const filteredData = computed(() => {
    return props.items.filter((row) => {
      const statusAccountMatch =
        selectedStatusAccount.value.length === 0 ||
        selectedStatusAccount.value.includes(row.isActive)
      const statusPaymentMatch =
        selectedStatusPayment.value.length === 0 ||
        selectedStatusPayment.value.includes(row.paymentStatus)
      const statusSportMatch =
        selectedStatusSport.value.length === 0 || selectedStatusSport.value.includes(row.sport.name)
      return statusAccountMatch && statusPaymentMatch && statusSportMatch
    })
  })

  async function changeStatusUser(id: number, status: boolean) {
    loadingModel.value = true
    try {
      const result = await changeStatusMasterService(id, status)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        const userIndex = props.items.findIndex((user) => user.user_id === id)
        if (userIndex !== -1) {
          props.items[userIndex].isActive = status
        }
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      loadingModel.value = false
    }
  }

  async function deleteAccountUser(id: number) {
    loadingModel.value = true
    try {
      const result = await deleteMasterService(id)
      if (result.statusCode === 200) {
        emit('deleted', id)
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      loadingModel.value = false
    }
  }

  watch(gettingVariousDataStore, (value) => {
    itemsSelect.value = value.sportData.map((item) => item.name)
  })

  onMounted(gettingVariousDataStore.fetchSports)

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
    studentCount: 'تعداد هنرجویان',
    createdAt: 'تاریخ',
    updatedAt: 'آخرین بروزرسانی',
  }

  const columns: TableColumn<MasterData>[] = [
    {
      accessorKey: 'fullName',
      header: 'نام کامل',
      cell: ({ row }) => {
        return row.getValue('fullName')
      },
    },
    {
      accessorKey: 'phoneNumber',
      header: 'شماره تلفن',
      cell: ({ row }) => {
        return row.getValue('phoneNumber')
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'وضعیت پلن',
      cell: ({ row }) => {
        const paymentStatus = row.getValue('paymentStatus')
        const color = {
          CONFIRMED: 'success' as const,
          REJECTED: 'error' as const,
          PENDING: 'warning' as const,
          NO_PAYMENT: 'error' as const,
        }[paymentStatus as string]
        let text = paymentStatus
        switch (paymentStatus) {
          case 'NO_PAYMENT':
            text = 'پرداخت وجود ندارد'
            break
          case 'CONFIRMED':
            text = 'پرداخت شده'
            break
          case 'PENDING':
            text = 'در انتظار پرداخت'
            break
          case 'REJECTED':
            text = 'پر داخت نشده'
            break
        }
        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => text)
      },
    },
    {
      accessorKey: 'isActive',
      header: 'وضعیت',
      cell: ({ row }) => {
        const activeValue = row.getValue('isActive') as boolean
        const color = activeValue ? 'success' : 'error'
        const statusText = activeValue ? 'فعال' : 'غیر فعال'
        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => statusText)
      },
    },
    {
      accessorKey: 'sport',
      header: ({ column }) => {
        const isSorted = column.getIsSorted()
        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'رشته',
          icon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        })
      },
      cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('sport')?.name),
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
      },
    },
    {
      accessorKey: 'studentCount',
      header: 'تعداد کاربر',
      cell: ({ row }) => {
        const student = row.getValue('studentCount')
        if (!student) {
          return h('span', { class: 'font-medium' }, 'کاربری وجود ندارد')
        } else {
          return h('span', { class: 'font-medium' }, `${student} نفر`)
        }
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
    {
      accessorKey: 'updatedAt',
      header: 'آخرین بروزرسانی',
      cell: ({ row }) => {
        return new Date(row.getValue('updatedAt')).toLocaleString('fa-IR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      },
    },
    {
      id: 'actions',
      header: 'عملیات',
      enableHiding: false,
      cell: ({ row }) => {
        const items = [
          {
            type: 'label',
            label: 'عملیات',
          },
          {
            type: 'separator',
          },
          {
            label: 'مشاهده پروفایل',
            icon: 'material-symbols:person',
            onSelect() {
              modalStore.toggleModal('masterEdit', row.original.user_id)
            },
          },
          {
            label: 'تغییر وضعیت',
            icon: 'hugeicons:exchange-01',
            onSelect() {
              showConfirmDialog(
                ` آیا میخواهید وضعیت حساب کاربر ${row.original.fullName} را تغییر دهید.`,
                () => {
                  changeStatusUser(row.original.user_id, !row.original.isActive)
                }
              )
            },
          },
          {
            label: 'حذف استاد',
            icon: 'ic:sharp-delete',
            color: 'error',
            onSelect() {
              showConfirmDialog(`آیا میخواهید استاد ${row.original.fullName} را حذف کنید؟`, () => {
                deleteAccountUser(row.original.user_id)
              })
            },
          },
        ]

        return h(
          'div',
          { class: 'text-right' },
          h(
            UDropdownMenu,
            {
              content: {
                align: 'end',
              },
              items,
              'aria-label': 'Actions dropdown',
            },
            () =>
              h(UButton, {
                icon: 'i-lucide-ellipsis-vertical',
                color: 'neutral',
                variant: 'ghost',
                class: 'ml-auto',
                'aria-label': 'Actions dropdown',
              })
          )
        )
      },
    },
  ]
</script>
