<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full h-full flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">پشتیبانی کاربران</h2>
      <span class="text-xs sm:text-sm font-medium">مدیریت تیکت‌ها و پشتیبانی کاربران</span>
    </div>
    <div class="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        class="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-center items-center gap-4"
      >
        <div class="size-14 rounded-full bg-turquoise-100 flex justify-center items-center">
          <UIcon
            name="streamline:interface-validation-check-circle-checkmark-addition-circle-success-check-validation-add-form"
            class="size-6 text-turquoise-500"
          />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-semibold">{{ statsData?.open ?? 'وجود ندارد' }}</span>
          <span class="text-sm font-light">تیکت‌های باز</span>
        </div>
      </div>
      <div
        class="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-center items-center gap-4"
      >
        <div class="size-14 rounded-full bg-yellow-100 flex justify-center items-center">
          <UIcon name="ic:twotone-access-time-filled" class="size-6 text-yellow-400" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-semibold">{{ statsData?.pending ?? 'وجود ندارد' }}</span>
          <span class="text-sm font-light">در انتظار</span>
        </div>
      </div>
      <div
        class="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-center items-center gap-4"
      >
        <div class="size-14 rounded-full bg-error-100 flex justify-center items-center">
          <UIcon name="proicons:question-circle" class="size-6 text-error-400" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-semibold">{{ statsData?.highPriority ?? 'وجود ندارد' }}</span>
          <span class="text-sm font-light">اولویت بالا</span>
        </div>
      </div>
      <div
        class="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-center items-center gap-4"
      >
        <div class="size-14 rounded-full bg-info-100 flex justify-center items-center">
          <UIcon name="material-symbols:android-chat" class="size-6 text-info-400" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-semibold">{{ statsData?.total ?? 'وجود ندارد' }}</span>
          <span class="text-sm font-light">کل تیکت‌ها</span>
        </div>
      </div>
    </div>
    <div class="flex max-sm:flex-col gap-2 w-full h-full p-3 bg-white rounded-lg">
      <BaseSelectBoxDropdown
        v-model="state.priority"
        :items="prioritySelect"
        placeholder="همه اولویت ها"
      />
      <BaseSelectBoxDropdown
        v-model="state.category"
        :items="categorySelect"
        placeholder="همه دسته بندی ها"
      />
      <BaseSelectBoxDropdown
        v-model="state.status"
        :items="statusSelect"
        placeholder="همه وضعیت ها"
      />
    </div>
    <div class="flex flex-col gap-3 p-4 bg-white rounded-lg">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-bold">مدیریت تیکت‌ها ({{ formData.length }} مورد)</span>
        <p class="break-words font-medium text-sm">مشاهده و پاسخگویی به تیکت‌های کاربران</p>
      </div>
      <div class="w-full h-full flex flex-col gap-3">
        <NuxtLink
          v-for="data in filterData"
          :key="data.id"
          :to="`/supports/chat-${data.id}`"
          class="w-full p-4 rounded-xl bg-white border border-black/30 flex max-sm:flex-col gap-3 justify-between"
        >
          <div class="flex max-sm:flex-col sm:items-center gap-2">
            <div class="size-12 rounded-full bg-muted hidden sm:flex justify-center items-center">
              <span class="font-light">{{ data.id }}#</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-lg">
                <span class="font-light sm:hidden">{{ data.id }}#</span>
                {{ data.title }}
              </span>
              <p class="text-sm font-light text-muted">
                توسط {{ data.user?.fullName }} • {{ useJDateTime(data.createdAt) }}
              </p>
            </div>
          </div>
          <div class="flex sm:flex-col items-end gap-2">
            <TicketBadge type="status" :value="data.status" />
            <TicketBadge type="priority" :value="data.priority" />
            <TicketBadge type="category" :value="data.category" />
          </div>
        </NuxtLink>
        <WidgetEmptyState
          v-if="!filterData.length"
          icon="material-symbols:chat-error-outline"
          title="تیکتی وجود ندارد"
          description="فیلترها را تغییر دهید یا همه را پاک کنید"
        />
      </div>
    </div>
    <div
      class="w-full flex bg-white p-4 rounded-lg justify-center items-center"
      v-if="totalPage > 1"
    >
      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="limit"
        show-edges
        :sibling-count="1"
        size="xl"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
  import { type TicketData, type TicketStats } from '~/models/ticket/TicketData'
  import { getTicketAdminService } from '~/services/ticket.service'

  const formData: Ref<TicketData[]> = ref([])
  const statsData = ref<TicketStats | null>(null)
  const isLoading: Ref<boolean> = ref(false)
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const totalPage = ref(0)

  async function getTicketAdmin() {
    isLoading.value = true
    try {
      const result = await getTicketAdminService(page.value, limit.value)
      console.log(result)
      if (result.statusCode === 200) {
        formData.value = Array.isArray(result.data) ? result.data : []
        // @ts-ignore
        if (result.stats) {
          // @ts-ignore
          statsData.value = result.stats as TicketStats
        }
        if (result.pagination) {
          total.value = result.pagination.total
          totalPage.value = result.pagination.totalPages
        }
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  const state = reactive({
    status: '',
    category: '',
    priority: '',
  })

  const filterData = computed(() => {
    return formData.value.filter((item) => {
      const matchCategory = !state.category || item.category === state.category
      const matchPriority = !state.priority || item.priority === state.priority
      const matchStatus = !state.status || item.status === state.status
      return matchCategory && matchPriority && matchStatus
    })
  })

  watch(page, getTicketAdmin)
  onMounted(getTicketAdmin)

  definePageMeta({
    middleware: ['role-guard', 'plan-guard'],
  })

  useHead({
    title: 'پشتیبانی سیستم',
    meta: [
      { name: 'description', content: 'بررسی، اولویت‌ بندی و پیگیری تیکت‌ ها پشتیبانی در سیستم.' },
    ],
  })
</script>
