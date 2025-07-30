<template>
  <div class="container h-full w-full rounded-sm p-4 bg-muted flex flex-col gap-4">
    <div class="flex justify-between">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-medium">مشکل در ثبت حضور و غیاب</span>
        <span class="text-sm font-medium">تیکت #1 • ایجاد شده توسط احمد رضایی</span>
      </div>
      <div class="flex flex-col gap-2">
        <UBadge label="باز" variant="solid" color="primary"/>
        <UBadge label="بالا" variant="solid" color="warning"/>
      </div>
    </div>
    <div class="bg-white rounded-xl p-4 flex flex-col flex-1 gap-3 overflow-y-auto">
      <div v-for="message in messages" :key="message.id" :class="message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'">
        <UCard :ui="{body}" class="w-[14rem] md:w-1/2 lg:w-1/3 xl:w-1/5">
          <template #header>
            <span class="font-medium text-sm">
              {{ message.sender === 'user' ? 'شما' : 'پشتیبانی' }}
            </span>
          </template>
          <div class="flex flex-col gap-3">
            <p class="text-sm text-black text-pretty">{{ message.text }}</p>
            <div class="text-xs text-muted text-end">{{ formatDate(message.createdAt) }}</div>
          </div>
        </UCard>
      </div>
      <div class="flex justify-center items-center">
        <div class="bg-white p-2 rounded shadow-xs shadow-black/30 w-full md:w-2/3 xl:w-1/2">
          <form @submit.prevent="sendMessage" class="flex items-center gap-2 w-full">
            <BaseFormInput v-model="newMessage" name="newMessage" type="text" placeholder="پیام خود را اینجا بنویسید" required class="w-full" />
            <UButton type="submit" :disabled="!newMessage.trim()" color="primary" variant="solid">ارسال</UButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const messages = ref([
  { id: 1, text: 'سلام، مشکلتون چیه؟', sender: 'admin', createdAt: new Date() },
  { id: 2, text: 'مشکل درگاه پرداخت', sender: 'user', createdAt: new Date() }
])

const newMessage = ref('')

function sendMessage() {
  if (!newMessage.value.trim()) return

  messages.value.push({
    id: Date.now(),
    text: newMessage.value,
    sender: 'user',
    createdAt: new Date()
  })

  newMessage.value = ''
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
</script>