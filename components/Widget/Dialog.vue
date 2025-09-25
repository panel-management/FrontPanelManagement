<template>
  <UModal :title="props.title" :ui="{ footer: 'justify-between' }">
    <template #footer>
      <UButton label="انصراف" color="neutral" variant="outline" @click="close"/>
      <UButton label="بله مطمئن هستم" color="error" variant="soft" @click="confirm"/>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()

const emit = defineEmits<{
  confirm: []
  close: []
}>()

const close = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm')
  close()
}
</script>