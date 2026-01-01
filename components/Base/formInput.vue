<template>
  <UFormField :label="label" :name="name" :required="required">
    <UInput
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disable"
      color="neutral"
      size="lg"
      class="w-full"
      :class="{ 'blur-[1px]': disable }"
    />
  </UFormField>
</template>
<script setup lang="ts">
  const model = defineModel<string>()

  const {
    label = '',
    name,
    type,
    placeholder = '',
    required,
    disable = false,
  } = defineProps<{
    label?: string
    name: string
    type: string
    placeholder?: string
    required: boolean
    disable?: boolean
  }>()
</script>
