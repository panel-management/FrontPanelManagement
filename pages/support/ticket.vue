<template>
  <section class="h-full w-full rounded-sm p-2 sm:p-3 bg-muted flex flex-col gap-4">
    <div class="w-full h-full flex flex-col gap-2 sm:p-2">
      <h2 class="text-xl sm:text-3xl font-bold">مدیریت پشتیبانی</h2>
      <span class="text-sm font-medium">مدیریت تیکت ‌ها</span>
    </div>
    <div
      class="w-full h-full p-4 flex max-sm:flex-col sm:items-center sm:justify-between gap-3 sm:gap-0 rounded-xl bg-white"
    >
      <div class="flex flex-col gap-2">
        <span class="font-medium text-2xl">تیکت‌های من</span>
        <p class="font-light text-sm">مشاهده و پیگیری تیکت‌های شما</p>
      </div>
      <UButton
        @click="modalStore.toggleModal('supportAdd')"
        class="max-sm:flex max-sm:justify-center"
        color="primary"
        variant="solid"
        size="xl"
        label="ثبت تیکت جدید"
        icon="material-symbols-light:add-comment-outline"
      />
    </div>
    <div class="w-full h-full flex flex-col gap-3">
      <NuxtLink
        v-for="data in formData"
        :key="data.id"
        :to="`/support/chat-${data.id}`"
        class="w-full p-4 rounded-xl bg-white flex justify-between"
      >
        <div class="flex flex-col gap-2">
          <span class="font-medium text-lg sm:text-xl">
            <span>{{ data.id.slice(0, 2) }}#</span>
            {{ data.title }}
          </span>
          <div class="flex max-md:flex-col gap-2">
            <div class="flex items-center gap-1">
              <UIcon
                name="material-symbols:calendar-today-outline-rounded"
                class="size-5 bg-black"
              />
              <span class="font-medium">{{ useJDateTime(data.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ic:twotone-access-time-filled" class="size-5 bg-black" />
              <span class="font-medium">آخرین بروزرسانی:</span>
              <span class="font-medium">{{ useJDateTime(data.updatedAt) }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <TicketBadge type="status" :value="data.status" />
          <TicketBadge type="priority" :value="data.priority" />
          <TicketBadge type="category" :value="data.category" />
        </div>
      </NuxtLink>
      <WidgetEmptyState
        v-if="!formData.length"
        icon="material-symbols:chat-error-outline"
        title="تیکتی وجود ندارد"
        description="می‌توانید یک تیکت جدید ایجاد کنید"
      />
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
    <LazyWidgetModalSupportAdd
      v-model:open="modalStore.modals.supportAdd"
      @refresh="getTicketMaster"
    />
  </section>
</template>
<script setup lang="ts">
  import { Role } from '~/models/Role'
  import type { TicketData } from '~/models/ticket/TicketData'
  import { getTicketMasterService } from '~/services/ticket.service'

  const isLoading: Ref<boolean> = ref(false)
  const modalStore = useModalStore()
  const formData = shallowRef<TicketData[]>([])
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const totalPage = ref(0)

  async function getTicketMaster() {
    isLoading.value = true
    try {
      const result = await getTicketMasterService(page.value, limit.value)
      if (result.statusCode === 200) {
        formData.value = Array.isArray(result.data) ? result.data : []
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

  watch(page, getTicketMaster)
  onMounted(getTicketMaster)

  definePageMeta({
    middleware: ['plan-guard'],
    roles: [Role.Master],
  })

  useHead({
    title: 'پشتیبانی',
    meta: [{ name: 'description', content: 'مشاهده و مدیریت تیکت‌ ها و پیام‌های پشتیبانی.' }],
  })
</script>
