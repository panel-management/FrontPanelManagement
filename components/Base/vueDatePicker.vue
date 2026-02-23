<template>
  <UFormField :label="label" :name="name" :required="required">
    <DatePicker
      v-model="model"
      mode="single"
      :column="1"
      :disabled="disable"
      class="pr-1 border-2 focus:outline-none w-full"
      :class="{ 'blur-[1px]': disable }"
    />
  </UFormField>
</template>
<script setup lang="ts">
  import DatePicker from '@alireza-ab/vue3-persian-datepicker'

  const model = defineModel<string>()

  const {
    label = '',
    name,
    required,
    disable = false,
  } = defineProps<{
    label?: string
    name: string
    required?: boolean
    disable?: boolean
  }>()
</script>
