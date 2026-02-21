<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-2 sm:p-2">
        <h2 class="text-lg sm:text-3xl font-bold">مدیریت هنرجویان</h2>
        <span class="text-xs sm:text-sm font-medium">مشاهده و مدیریت اطلاعات هنرجویان باشگاه</span>
      </div>
      <div class="sm:p-2">
        <UButton
          @click="modalStore.toggleModal('studentAdd')"
          trailing-icon="material-symbols:person-add"
          size="lg"
          color="primary"
          variant="subtle"
        >
          افزودن هنرجو جدید
        </UButton>
      </div>
    </div>
    <div class="bg-white flex flex-col gap-3 p-3 rounded-lg">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-bold">لیست هنرجویان ({{ formData.length }} نفر)</span>
        <p class="wrap-break-word font-medium text-sm">
          مشاهده کامل اطلاعات هنرجویان و مدیریت آنها
        </p>
      </div>
      <TableStudentsTable
        ref="tableRef"
        :items="formData"
        v-model:loading="isLoading"
        @deleted="handleDelete"
      />
    </div>
    <LazyWidgetModalStudentAdd v-model:open="modalStore.modals.studentAdd" @success="refreshPage" />
    <LazyWidgetModalStudentEdit
      v-model:open="modalStore.modals.studentEdit"
      @updated="handleUpdate"
    />
  </section>
</template>
<script setup lang="ts">
  import { Role } from '~/models/Role'
  import type { StudentData } from '~/models/users/student/StudentData'
  import { getAllStudentService } from '~/services/student.service'

  const modalStore = useModalStore()
  const tableRef = useTemplateRef('tableRef')
  const formData: Ref<StudentData[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)
  const hasMore: Ref<boolean> = ref(true)
  const page = ref(1)
  const limit = ref(15)
  const totalPages = ref(0)

  async function getStudentData() {
    isLoading.value = true
    try {
      const result = await getAllStudentService(page.value, limit.value)
      if (result.statusCode === 200) {
        const newItems = Array.isArray(result.data?.user) ? result.data?.user : []
        if (page.value === 1) {
          formData.value = newItems
        } else {
          formData.value = [...formData.value, ...newItems]
        }
        if (result.pagination) {
          totalPages.value = result.pagination.totalPages
          if (page.value >= totalPages.value) {
            hasMore.value = false
          } else {
            page.value++
          }
        } else {
          if (newItems.length < limit.value) {
            hasMore.value = false
          } else {
            page.value++
          }
        }
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  function handleUpdate(updatedItem: StudentData | undefined) {
    if (!updatedItem) return
    const index = formData.value.findIndex((u) => u.user_id === updatedItem.user_id)
    if (index !== -1) {
      formData.value[index] = { ...formData.value[index], ...updatedItem }
    }
  }

  function handleDelete(id: number) {
    formData.value = formData.value.filter((user) => user.user_id !== id)
  }

  async function refreshPage() {
    page.value = 1
    hasMore.value = true
    await getStudentData()
  }

  onMounted(async () => {
    await getStudentData()

    await nextTick()

    if (tableRef.value?.$el) {
      useInfiniteScroll(
        tableRef.value.$el,
        () => {
          if (!isLoading.value && hasMore.value) {
            getStudentData()
          }
        },
        {
          distance: 100,
          interval: 500,
          canLoadMore: () => !isLoading.value && hasMore.value,
        }
      )
    }
  })

  definePageMeta({
    middleware: ['plan-guard'],
    roles: [Role.Master],
  })

  useHead({
    title: 'مدیریت هنرجویان',
    meta: [
      {
        name: 'description',
        content: 'مدیریت اطلاعات هنرجویان شامل اضافه کردن و ویرایش داده‌ ها.',
      },
    ],
  })
</script>
