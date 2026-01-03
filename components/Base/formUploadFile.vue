<template>
  <UFormField :label="label" :name="name" :required="required">
    <UFileUpload
      v-model="model"
      highlight
      label="تصویر خود را در اینجا رها کنید."
      :description="description"
      :disabled="disable"
      color="neutral"
      class="w-full min-h-48"
      :class="{ 'blur-[1px]': disable }"
    />
  </UFormField>
</template>
<script setup lang="ts">
  const model = defineModel<File | undefined>()

  const {
    label,
    name,
    required,
    disable = false,
    description = '',
  } = defineProps<{
    label: string
    name: string
    required: boolean
    disable?: boolean
    description?: string
  }>()
</script>
