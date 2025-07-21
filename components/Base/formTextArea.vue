<template>
  <UFormField :label="label" :name="name" :required="required">
    <UTextarea v-model="model" :placeholder="placeholder" :disabled="disable" size="lg" autoresize :rows="5" class="w-full" :class="{ 'blur-[1px]': disable }"/>
  </UFormField>
</template>
<script setup lang="ts">
const model = defineModel<string>()

const {label, name, required, placeholder = "", disable = false} = defineProps<{
  label: string,
  name: string,
  placeholder?: string,
  required: boolean,
  disable?: boolean
}>()
</script>