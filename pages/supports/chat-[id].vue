<template>
  <div class="h-dvh w-full rounded-sm p-4 bg-muted flex flex-col gap-4">
    <div class="flex justify-between">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-medium">
          {{ ticketData?.title }}
        </span>
        <span class="text-sm font-medium flex items-center gap-1">
          تیکت #{{ ticketData?.id }} • ایجاد شده توسط {{ ticketData?.user?.fullName }}
        </span>
        <div v-if="ticketData?.status !== TicketStatus.CLOSED">
          <UButton @click="closeTicket" :loading="isLoading" color="neutral" variant="solid" label="بستن تیکت" />
        </div>
      </div>
      <div v-if="ticketData" class="flex flex-col items-end gap-2">
        <TicketBadge type="status" :value="ticketData?.status" />
        <TicketBadge type="priority" :value="ticketData?.priority" />
        <TicketBadge type="category" :value="ticketData?.category" />
      </div>
    </div>
    <div class="bg-white h-full w-full rounded-xl p-4 flex flex-col gap-3 overflow-hidden">
      <div ref="messageContainer" class="overflow-y-auto w-full h-full p-1 space-y-3 scroll-smooth">
        <div v-for="message in messages" :key="message.id"
          :class="message.sender?.type === 1 ? 'flex justify-end' : 'flex justify-start'">
          <UCard class="w-[14rem] md:w-1/2 lg:w-1/3 xl:w-1/4">
            <template #header>
              <span class="font-medium text-sm" :class="message.sender?.type === 1 ? 'text-primary' : 'text-tertiary'">
                {{ message.sender?.type === 1 ? message.sender?.fullName : 'پشتیبانی' }}
              </span>
            </template>
            <div class="flex flex-col gap-3">
              <p class="text-sm text-black whitespace-pre-wrap leading-6">{{ message.text }}</p>
              <span class="text-xs text-muted text-end">
                {{ useJDateTime(message.createdAt) }}
              </span>
            </div>
          </UCard>
        </div>
      </div>
      <div class="flex justify-center items-end pt-2" v-show="ticketData?.status !== TicketStatus.CLOSED">
        <div class="bg-white p-2 rounded shadow-xs shadow-black/30 w-full md:w-2/3 xl:w-1/2">
          <form @submit.prevent="sendMessage" class="flex items-center gap-2 w-full">
            <BaseFormInput required v-model="newMessage" name="newMessage" type="text"
              placeholder="پیام خود را اینجا بنویسید..." class="w-full" />
            <UButton :loading="isLoading" type="submit" :disabled="!newMessage.trim()" color="primary" variant="solid"
              icon="i-heroicons-paper-airplane" label="ارسال" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SendMassage } from '~/models/ticket/SendMassage'
import { TicketStatus } from '~/models/ticket/TicketData'
import type { TicketListData } from '~/models/ticket/TicketListData'
import { changeStatusTicketService, getTicketByIdService, sendMessageService } from '~/services/ticket.service'

const route = useRoute()
const toastStore = useToastStore()
const id = Number(route.params.id)
const invalidId = ref(!id || isNaN(id))
let interval: any = null

if (invalidId.value) {
  showError({ statusCode: 404, message: 'شناسه تیکت نامعتبر است' })
}

const messageContainer = ref<HTMLElement | null>(null)
const isLoading: Ref<boolean> = ref(false)
const newMessage = ref('')

const { data: ticket, refresh } = await useAsyncData(
  `ticket-${id}`,
  () => getTicketByIdService(id),
  {
    transform: (res) => {
      if (!res) {
        showError({ statusCode: 500, message: 'پاسخی از سرور دریافت نشد' })
      }

      if (!res.data) {
        showError({ statusCode: 404, message: 'شناسه تیکت نامعتبر است' })
      }

      if (res.statusCode !== 200) {
        showError({ statusCode: 404, message: 'شناسه تیکت نامعتبر است' })
      }

      return res.data
    }
  }
)

onMounted(() => {
  scrollToBottom()
  interval = setInterval(() => {
    refresh()
  }, 10000);
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

const ticketData = computed(() => ticket.value as TicketListData | null)
const messages = computed(() => ticketData.value?.messages || [])

async function sendMessage() {
  if (!newMessage.value.trim()) return

  isLoading.value = true
  try {
    const payload: SendMassage = {
      text: newMessage.value
    }
    const result = await sendMessageService(id, payload)
    if (result.statusCode === 201) {
      console.log(result.data);
      if (ticketData.value) {
        ticketData.value.messages.push(result.data)
      }
      newMessage.value = ''
      await scrollToBottom()
    }
  } catch (error: any) {
    console.error(error.message || error);
  } finally {
    isLoading.value = false
  }
}

async function closeTicket() {
  isLoading.value = true
  try {
    const result = await changeStatusTicketService(id)
    console.log(result);
    if (result.statusCode === 200) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>