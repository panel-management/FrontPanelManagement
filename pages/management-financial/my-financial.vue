<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full h-full flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">صورتحساب‌ های شما</h2>
      <span class="text-xs sm:text-sm font-medium">مشاهده و پرداخت صورتحساب‌ های معوق و آینده</span>
    </div>
    <div
      v-if="formData.length"
      class="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="item in formData"
        :key="item.id"
        class="rounded-lg p-4 w-full flex flex-col gap-4"
        :class="transactionStatusColor[item.status]"
      >
        <div class="w-full flex max-sm:flex-col-reverse gap-2 justify-between">
          <div>
            <span class="font-semibold text-lg xl:text-xl">{{ item.description }}</span>
            <p class="text-sm font-medium" v-if="item.plan">پلن: {{ item.plan.name }}</p>
          </div>
          <div>
            <UBadge
              :color="transactionStatus[item.status] as any"
              :icon="transactionStatusIcon[item.status]"
              variant="soft"
              size="lg"
              :label="transactionStatusLabel[item.status]"
            />
          </div>
        </div>
        <USeparator />
        <div class="flex w-full justify-between">
          <span class="font-medium" v-if="item.status === TransactionStatus.PAID">
            مبلغ پرداخت شده:
          </span>
          <span class="font-medium" v-else>مبلغ قابل پرداخت:</span>
          <span class="font-medium">
            <span>{{ Number(item.amount).toLocaleString('fa-IR') }}</span>
            تومان
          </span>
        </div>
        <USeparator />
        <div class="w-full flex flex-col gap-3">
          <div class="flex items-center gap-1">
            <UIcon
              name="material-symbols:calendar-today-outline-rounded"
              class="size-5 text-black"
            />
            <span class="font-medium">زمان پرداخت:</span>
            <span class="font-medium">{{ useJDate(item.paymentDate) }}</span>
          </div>
          <USeparator v-if="item.status === TransactionStatus.UPCOMING" />
          <div
            class="flex items-center gap-1"
            v-if="item.type === TransactionType.FEE && item.status === TransactionStatus.UPCOMING"
          >
            <UIcon
              name="material-symbols:calendar-today-outline-rounded"
              class="size-5 text-black"
            />
            <span class="font-medium">سررسید:</span>
            <span class="font-medium">{{ useJDate(item.dueDate) }}</span>
          </div>
          <USeparator />
          <div class="flex items-center gap-1">
            <UIcon
              name="material-symbols:calendar-today-outline-rounded"
              class="size-5 text-black"
            />
            <span class="font-medium">زمان ایجاد:</span>
            <span class="font-medium">{{ useJDate(item.createdAt) }}</span>
          </div>
          <!-- <UButton color="primary" variant="solid" class="flex content-center items-center justify-center"
            label="پرداخت انلاین" /> -->
        </div>
      </div>
    </div>
    <WidgetEmptyState
      v-else
      class="bg-white rounded-lg"
      icon="material-symbols:credit-card-off-outline"
      title="تاریخچه مالی وجود ندارد"
      description="پس از انجام اولین تراکنش، اطلاعات آن در این بخش نمایش داده می‌شود"
    />
    <div class="w-full h-full flex justify-center items-center" v-if="formData.length > 1">
      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="limit"
        show-edges
        :sibling-count="1"
        size="xl"
      />
    </div>
    <div class="w-full h-full flex max-sm:flex-col gap-5 p-4 rounded-lg bg-white">
      <div class="flex max-sm:items-center gap-2">
        <div class="rounded-full size-12 flex items-center justify-center bg-info-100">
          <UIcon name="bi:info-circle" class="size-5 bg-info-500" />
        </div>
        <span class="text-xl font-medium min-sm:hidden">نکات مهم پرداخت</span>
      </div>
      <div class="flex flex-col gap-2 w-full">
        <span class="text-xl font-medium max-sm:hidden">نکات مهم پرداخت</span>
        <ul
          class="space-y-2 font-light text-sm md:list-disc md:list-inside leading-normal text-justify"
        >
          <li>پرداخت آنلاین فوری انجام می‌شود و رسید بلافاصله ارسال می‌گردد.</li>
          <li>پرداخت نقدی را حتماً به مربی یا مسئول باشگاه اطلاع دهید.</li>
          <li>در صورت بروز هرگونه مشکل به مربی خود گزارش دهید.</li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  import type { TransactionData } from '~/models/transactions/TransactionData'
  import { TransactionStatus } from '~/models/transactions/TransactionStatus'
  import { TransactionType } from '~/models/transactions/TransactionType'
  import { getHistoryTransactionStudentService } from '~/services/transactions.service'

  const transactionStatusColor: Record<TransactionStatus, string> = {
    [TransactionStatus.PAID]: 'bg-teal-50',
    [TransactionStatus.PENDING]: 'bg-yellow-50',
    [TransactionStatus.UNPAID]: 'bg-error-50',
    [TransactionStatus.UPCOMING]: 'bg-neutral-50',
  }

  const transactionStatusIcon: Record<TransactionStatus, string> = {
    [TransactionStatus.PAID]: 'clarity:success-line',
    [TransactionStatus.PENDING]: 'ic:baseline-watch-later',
    [TransactionStatus.UNPAID]: 'material-symbols:close-rounded',
    [TransactionStatus.UPCOMING]:
      'streamline:computer-webcam-webcam-camera-future-tech-chat-skype-technology-video',
  }

  const transactionStatus: Record<TransactionStatus, string> = {
    [TransactionStatus.PAID]: 'success',
    [TransactionStatus.PENDING]: 'warning',
    [TransactionStatus.UNPAID]: 'error',
    [TransactionStatus.UPCOMING]: 'tertiary',
  }

  const formData = shallowRef<TransactionData[]>([])
  const page = ref(1)
  const limit = ref(9)
  const total = ref(0)

  async function getTransactionStudent() {
    try {
      const result = await getHistoryTransactionStudentService(page.value, limit.value)
      if (result.statusCode === 200) {
        formData.value = Array.isArray(result.data) ? result.data : []
        if (result.pagination) {
          total.value = result.pagination.total
        }
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  watch(page, getTransactionStudent)
  onMounted(getTransactionStudent)

  definePageMeta({
    middleware: ['role-guard', 'plan-guard'],
  })

  useHead({
    title: 'امور مالی',
    meta: [
      {
        name: 'description',
        content: 'مشاهده وضعیت مالی، پرداخت‌ها و بدهی‌های مربوط به حساب کاربری شما.',
      },
    ],
  })
</script>
