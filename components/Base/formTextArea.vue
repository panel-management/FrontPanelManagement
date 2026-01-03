<template>
  <UFormField :label="label" :name="name" :required="required">
    <UTextarea
      v-model="model"
      :placeholder="placeholder"
      :disabled="disable"
      autoresize
      :rows="5"
      size="lg"
      color="neutral"
      class="w-full"
      :class="{ 'blur-[1px]': disable }"
    />
  </UFormField>
</template>
<script setup lang="ts">
  const model = defineModel<string>()

  const {
    label,
    name,
    required,
    placeholder = '',
    disable = false,
  } = defineProps<{
    label: string
    name: string
    placeholder?: string
    required: boolean
    disable?: boolean
  }>()
</script>
