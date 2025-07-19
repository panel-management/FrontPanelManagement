<template>
  <UFormField :label="label" :name="name" :required="required">
    <UTextarea v-model="model" :placeholder="placeholder" class="w-full" size="lg" autoresize :rows="5"/>
  </UFormField>
</template>
<script setup lang="ts">
const model = defineModel<string>()

const {label, name, required, placeholder = ""} = defineProps<{
  label: string,
  name: string,
  placeholder?: string,
  required: boolean
}>()
</script>