<template>
  <UFormField :name="name">
    <UCheckbox v-model="model" :label="label" :required="required" size="lg"/>
  </UFormField>
</template>
<script setup lang="ts">
const model = defineModel<boolean>()

const {label, name, required = false} = defineProps<{
  label: string,
  name: string,
  required: boolean
}>()
</script>