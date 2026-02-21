<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex max-lg:flex-col items-center gap-3 overflow-x-auto py-2">
      <UInput
        :model-value="table?.tableApi?.getColumn('fullName')?.getFilterValue() as string"
        @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)"
        type="search"
        class="w-full xl:w-1/3"
        placeholder="جستجو بر اساس نام هنرجویان"
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
          v-if="hasSystemBelt"
          :content="{ align: 'end', class: 'max-h-64 md:max-h-70' }"
          :items="
            itemsSelect.map((belt) => ({
              label: belt,
              type: 'checkbox' as const,
              checked: selectedBelts.includes(belt),
              onUpdateChecked(checked: boolean) {
                if (checked) {
                  selectedBelts.push(belt)
                } else {
                  selectedBelts = selectedBelts.filter((b) => b !== belt)
                }
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              },
            }))
          "
          label="کمربند ها"
        />
        <BaseDropdownMenu
          :items="
            statusTransactionOption.map((statusTransaction) => ({
              label: transactionStatusLabel[statusTransaction],
              type: 'checkbox' as const,
              checked: selectedTransactionStatus.includes(statusTransaction),
              onUpdateChecked(checked: boolean) {
                if (checked) {
                  selectedTransactionStatus.push(statusTransaction)
                } else {
                  selectedTransactionStatus = selectedTransactionStatus.filter(
                    (b) => b !== statusTransaction
                  )
                }
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              },
            }))
          "
          label="وضعیت شهریه ها"
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
      </div>
    </div>
    <UTable
      ref="table"
      :loading="loadingModel"
      loading-color="neutral"
      :data="filteredData"
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
  import { TransactionStatus } from '~/models/transactions/TransactionStatus'
  import type { StudentData } from '~/models/users/student/StudentData'
  import { changeStatusStudentService, deleteStudentService } from '~/services/student.service'

  const UButton = resolveComponent('UButton')
  const UBadge = resolveComponent('UBadge')
  const UDropdownMenu = resolveComponent('UDropdownMenu')
  const table = useTemplateRef('table')
  const modalStore = useModalStore()
  const toastStore = useToastStore()
  const { showConfirmDialog } = useConfirmDialog()
  const gettingVariousDataStore = useGettingVariousDataStore()
  const hasSystemBelt = computed(() => gettingVariousDataStore.hasBeltSystem)
  const itemsSelect: Ref<any[]> = ref([])

  const emit = defineEmits(['deleted'])
  const loadingModel = defineModel<boolean>('loading', { required: true })
  const props = defineProps<{
    items: StudentData[]
  }>()
  defineExpose({
    $el: table,
  })

  const selectedBelts = ref<string[]>([])
  const selectedStatusAccount = ref<boolean[]>([])
  const selectedTransactionStatus = ref<TransactionStatus[]>([])
  const statusAccountOptions: Ref<boolean[]> = ref([true, false])
  const statusTransactionOption: Ref<TransactionStatus[]> = ref([
    TransactionStatus.PAID,
    TransactionStatus.PENDING,
    TransactionStatus.UNPAID,
    TransactionStatus.UPCOMING,
  ])

  const filteredData = computed(() => {
    return props.items.filter((row) => {
      const beltMatch =
        selectedBelts.value.length === 0 || selectedBelts.value.includes(row.currentBelt.color)
      const statusAccountMatch =
        selectedStatusAccount.value.length === 0 ||
        selectedStatusAccount.value.includes(row.isActive)
      const statusMatch =
        selectedTransactionStatus.value.length === 0 ||
        selectedTransactionStatus.value.includes(row.studentTransactions)
      return beltMatch && statusMatch && statusAccountMatch
    })
  })

  async function changeStatusUser(id: number, status: boolean) {
    loadingModel.value = true
    try {
      const result = await changeStatusStudentService(id, status)
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

  async function deleteAccountStudent(id: number) {
    loadingModel.value = true
    try {
      const result = await deleteStudentService(id)
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

  onMounted(gettingVariousDataStore.fetchSports)

  watch(
    () => hasSystemBelt.value,
    (value) => {
      if (value) {
        gettingVariousDataStore.fetchBelts()
      }
    },
    { immediate: true }
  )

  watch(
    () => gettingVariousDataStore.beltData,
    (value) => {
      if (!value) return
      itemsSelect.value = value.map((item) => item.color)
    },
    { immediate: true }
  )

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
    studentTransactions: 'وضعیت شهریه',
    active: 'وضعیت حساب ها',
    sport: 'رشته',
    createdAt: 'تاریخ ایجاد',
    updatedAt: 'تاریخ بروزرسانی',
  }

  // const columns: TableColumn<StudentData>[] = [
  //   {
  //     accessorKey: 'fullName',
  //     header: 'نام کامل',
  //     cell: ({ row }) => {
  //       return row.getValue('fullName')
  //     }
  //   },
  //   {
  //     accessorKey: 'phoneNumber',
  //     header: 'شماره تلفن',
  //     cell: ({ row }) => {
  //       return row.getValue('phoneNumber')
  //     }
  //   },
  //   {
  //     accessorKey: 'currentBelt',
  //     header: 'کمربند ها',
  //     cell: ({ row }) => {
  //       const belt = row.getValue('currentBelt')?.color as string

  //       const color = ({
  //         'سفید': 'belt-white border' as const,
  //         'خاکستری': 'belt-gray' as const,
  //         'زرد': 'belt-yellow' as const,
  //         'نارنجی': 'belt-orange' as const,
  //         'سبز': 'belt-green' as const,
  //         'آبی': 'belt-blue' as const,
  //         'بنفش': 'belt-purple' as const,
  //         'قهوه‌ای': 'belt-brown' as const,
  //         'قرمز': 'belt-red' as const,
  //         'قرمز/سیاه': 'belt-red-black' as const,
  //         'قرمز/سفید': 'belt-red-white' as const,
  //         'مشکی': 'belt-black' as const,
  //         'صورتی': 'belt-pink' as const,
  //         'طلایی': 'belt-gold' as const,
  //         'نقره‌ای': 'belt-silver' as const
  //       })[belt]

  //       return h("span", { class: `px-2  py-1 rounded-lg font-medium text-xs ${color}` }, belt)
  //     }
  //   },
  //   {
  //     accessorKey: 'studentTransactions',
  //     header: 'وضعیت شهریه',
  //     cell: ({ row }) => {
  //       const transactions = row.getValue('studentTransactions') as string
  //       const color = ({
  //         'PAID': 'success' as const,
  //         'UNPAID': 'error' as const,
  //         'PENDING': 'warning' as const,
  //         'UPCOMING': 'error' as const,
  //       })[transactions]
  //       let text = transactions
  //       switch (transactions) {
  //         case 'UPCOMING':
  //           text = 'پرداخت در اینده'
  //           break;
  //         case 'PAID':
  //           text = 'پرداخت شده'
  //           break;
  //         case 'PENDING':
  //           text = 'در انتظار پرداخت'
  //           break;
  //         case 'UNPAID':
  //           text = 'پرداخت نشده'
  //           break;
  //       }
  //       return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => text)
  //     }
  //   },
  //   {
  //     accessorKey: 'active',
  //     header: 'وضعیت',
  //     cell: ({ row }) => {
  //       const activeValue = row.getValue('active') as string
  //       const color = ({
  //         'ENABLE': 'success' as const,
  //         'DISABLE': 'error' as const,
  //       })[activeValue]
  //       const statusText = activeValue === 'ENABLE' ? 'فعال' : 'غیر فعال'
  //       return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => statusText)
  //     }
  //   },
  //   {
  //     accessorKey: 'sport',
  //     header: ({ column }) => {
  //       const isSorted = column.getIsSorted()
  //       return h(UButton, {
  //         color: 'neutral',
  //         variant: 'ghost',
  //         label: 'رشته',
  //         icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
  //         class: '-mx-2.5',
  //         onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
  //       })
  //     },
  //     cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('sport')?.name)
  //   },
  //   {
  //     accessorKey: 'createdAt',
  //     header: 'تاریخ ایجاد',
  //     cell: ({ row }) => {
  //       return new Date(row.getValue('createdAt')).toLocaleString('fa-IR', {
  //         day: 'numeric',
  //         month: 'short',
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         hour12: false
  //       })
  //     }
  //   },
  //   {
  //     accessorKey: 'updatedAt',
  //     header: 'تاریخ بروزرسانی',
  //     cell: ({ row }) => {
  //       return new Date(row.getValue('updatedAt')).toLocaleString('fa-IR', {
  //         day: 'numeric',
  //         month: 'short',
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         hour12: false
  //       })
  //     }
  //   },
  //   {
  //     id: 'actions',
  //     header: 'عملیات',
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       const items = [{
  //         type: 'label',
  //         label: 'عملیات'
  //       }, {
  //         type: 'separator'
  //       }, {
  //         label: 'مشاهده پروفایل',
  //         icon: 'material-symbols:person',
  //         onSelect() {
  //           modalStore.toggleModal('studentEdit', row.original.user_id)
  //         }
  //       }, {
  //         label: 'حذف هنرجو',
  //         icon: 'ic:sharp-delete',
  //         color: 'error',
  //         onSelect() {
  //           showConfirmDialog(`آیا میخواهید هنرجو ${row.original.fullName} را حذف کنید؟`, () => {
  //             deleteAccountStudent(row.original.user_id)
  //           })
  //         },
  //       }]
  //       return h('div', { class: 'text-right' }, h(UDropdownMenu, {
  //         'content': {
  //           align: 'end'
  //         },
  //         items,
  //         'aria-label': 'Actions dropdown'
  //       }, () => h(UButton, {
  //         'icon': 'i-lucide-ellipsis-vertical',
  //         'color': 'neutral',
  //         'variant': 'ghost',
  //         'class': 'ml-auto',
  //         'aria-label': 'Actions dropdown'
  //       })))
  //     }
  //   }
  // ];

  const columns = computed<TableColumn<StudentData>[]>(() => {
    const cols: TableColumn<StudentData>[] = [
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
      ...(hasSystemBelt.value
        ? [
            {
              accessorKey: 'currentBelt',
              header: 'کمربند ها',
              cell: ({ row }) => {
                const belt = row.getValue('currentBelt')?.color as string

                const color = {
                  سفید: 'belt-white border' as const,
                  خاکستری: 'belt-gray' as const,
                  زرد: 'belt-yellow' as const,
                  نارنجی: 'belt-orange' as const,
                  سبز: 'belt-green' as const,
                  آبی: 'belt-blue' as const,
                  بنفش: 'belt-purple' as const,
                  قهوه‌ای: 'belt-brown' as const,
                  قرمز: 'belt-red' as const,
                  'قرمز/سیاه': 'belt-red-black' as const,
                  'قرمز/سفید': 'belt-red-white' as const,
                  مشکی: 'belt-black' as const,
                  صورتی: 'belt-pink' as const,
                  طلایی: 'belt-gold' as const,
                  نقره‌ای: 'belt-silver' as const,
                }[belt]

                return h(
                  'span',
                  { class: `px-2  py-1 rounded-lg font-medium text-xs ${color}` },
                  belt
                )
              },
            },
          ]
        : []),
      {
        accessorKey: 'studentTransactions',
        header: ({ column }) => {
          const isSorted = column.getIsSorted()
          return h(UButton, {
            color: 'neutral',
            variant: 'ghost',
            label: 'وضعیت شهریه',
            icon: isSorted
              ? isSorted === 'desc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
              : 'i-lucide-arrow-up-down',
            class: '-mx-1',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
          })
        },
        cell: ({ row }) => {
          const transactions = row.getValue('studentTransactions') as string
          const color = {
            PAID: 'success' as const,
            UNPAID: 'error' as const,
            PENDING: 'warning' as const,
            UPCOMING: 'error' as const,
          }[transactions]
          let text = transactions
          switch (transactions) {
            case 'UPCOMING':
              text = 'پرداخت در اینده'
              break
            case 'PAID':
              text = 'پرداخت شده'
              break
            case 'PENDING':
              text = 'در انتظار پرداخت'
              break
            case 'UNPAID':
              text = 'پرداخت نشده'
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
        header: 'رشته',
        cell: ({ row }) => row.getValue('sport')?.name,
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
            hour12: false,
          })
        },
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
                modalStore.toggleModal('studentEdit', row.original.user_id)
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
              label: 'حذف هنرجو',
              icon: 'ic:sharp-delete',
              color: 'error',
              onSelect() {
                showConfirmDialog(
                  `آیا میخواهید هنرجو ${row.original.fullName} را حذف کنید؟`,
                  () => {
                    deleteAccountStudent(row.original.user_id)
                  }
                )
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
    return cols
  })
</script>
