<template>
  <UFormField :name="name">
    <UCheckbox
      v-model="model"
      :label="label"
      :required="required"
      :disabled="disable"
      size="lg"
      color="tertiary"
      :class="{ 'blur-[1px]': disable }"
    />
  </UFormField>
</template>
<script setup lang="ts">
  const model = defineModel<boolean>()

  const {
    label,
    name,
    required = false,
    disable = false,
  } = defineProps<{
    label: string
    name: string
    required: boolean
    disable?: boolean
  }>()
</script>
