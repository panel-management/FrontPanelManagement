<template>
  <UModal :title="props.title" :ui="{ footer: 'justify-between' }">
    <template #description></template>
    <template #body>
      <div class="w-full">
        <BaseFormTextArea
          required
          v-model="localDescription"
          label="توضیحات"
          placeholder="توضیح درباره اینکه چرا کاربر پرداخت ناموفق داشته"
          name="description"
          class="w-full"
        />
      </div>
    </template>
    <template #footer>
      <UButton label="انصراف" color="neutral" variant="outline" @click="close" />
      <UButton
        v-if="localDescription.trim()"
        label="ارسال پیام"
        color="primary"
        variant="soft"
        @click="confirm"
      />
    </template>
  </UModal>
</template>
<script setup lang="ts">
  const props = defineProps<{ title: string }>()

  const emit = defineEmits<{
    confirm: [desc: string]
    close: []
  }>()

  const localDescription = ref('')

  const close = () => emit('close')

  const confirm = () => {
    emit('confirm', localDescription.value)
    close()
  }
</script>
