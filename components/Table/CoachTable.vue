<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex max-lg:flex-col items-center gap-3 overflow-x-auto py-2">
      <UInput
        :model-value="table?.tableApi?.getColumn('fullName')?.getFilterValue() as string"
        @update:model-value="table?.tableApi?.getColumn('fullName')?.setFilterValue($event)"
        type="search"
        class="w-full xl:w-1/3"
        placeholder="جستجو بر اساس نام مربی"
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
          :items="
            statusAccountOptions.map((account) => ({
              label: activeLabels[account],
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
          label="وضعیت"
        />
      </div>
    </div>
    <UTable
      ref="table"
      :data="filteredData"
      :loading="loadingModel"
      loading-color="neutral"
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
  import type { CoachData } from '~/models/users/coach/CoachData'
  import { Active } from '~/models/Active'
  import { changeStatusCoachService, deleteCoachService } from '~/services/coach.service'

  const UButton = resolveComponent('UButton')
  const UBadge = resolveComponent('UBadge')
  const UDropdownMenu = resolveComponent('UDropdownMenu')
  const table = useTemplateRef('table')
  const modalStore = useModalStore()
  const toastStore = useToastStore()
  const { showConfirmDialog } = useConfirmDialog()

  const emit = defineEmits(['delete'])
  const loadingModel = defineModel<boolean>('loading', { required: true })
  const props = defineProps<{
    items: CoachData[]
  }>()

  const selectedStatusAccount = ref<Active[]>([])
  const statusAccountOptions: Ref<Active[]> = ref([Active.ENABLE, Active.DISABLE])

  const filteredData = computed(() => {
    return props.items.filter(
      (row) =>
        selectedStatusAccount.value.length === 0 || selectedStatusAccount.value.includes(row.active)
    )
  })

  async function changeStatusCoach(id: number, status: Active) {
    loadingModel.value = true
    try {
      const result = await changeStatusCoachService(id, status)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        const userIndex = props.items.findIndex((user) => user.user_id === id)
        if (userIndex !== -1) {
          props.items[userIndex].active = status
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
      const result = await deleteCoachService(id)
      if (result.statusCode === 200) {
        emit('delete', id)
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      loadingModel.value = false
    }
  }

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
    active: 'وضعیت',
    sport: 'رشته',
    history: 'سابقه تدریس',
    certificates: 'مدرک یا گواهینامه',
    createdAt: 'تاریخ ایجاد',
  }

  const columns: TableColumn<CoachData>[] = [
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
      accessorKey: 'active',
      header: 'وضعیت',
      cell: ({ row }) => {
        const active = row.getValue('active') as string
        const color = {
          ENABLE: 'success' as const,
          DISABLE: 'error' as const,
        }[active]
        const statusText = active === 'ENABLE' ? 'فعال' : 'غیر فعال'
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
      accessorKey: 'certificates',
      header: 'مدرک یا گواهینامه',
      cell: ({ row }) => row.getValue('certificates'),
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
              modalStore.toggleModal('coachesEdit', row.original.user_id)
            },
          },
          {
            label: 'تغییر وضعیت',
            icon: 'hugeicons:exchange-01',
            onSelect() {
              const newStatus = row.original.active === 'ENABLE' ? 'DISABLE' : 'ENABLE'
              showConfirmDialog(
                ` آیا میخواهید وضعیت حساب کاربر ${row.original.fullName} را تغییر دهید.`,
                () => {
                  changeStatusCoach(row.original.user_id, newStatus as Active)
                }
              )
            },
          },
          {
            label: 'حذف مربی',
            icon: 'ic:sharp-delete',
            color: 'error',
            onSelect() {
              showConfirmDialog(`آیا میخواهید مربی ${row.original.fullName} را حذف کنید؟`, () => {
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
