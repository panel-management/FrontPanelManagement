<template>
  <UFormField :label="label" :name="name" :required="required">
    <UInput v-model="model" :type="type" :placeholder="placeholder" class="w-full" size="lg"/>
  </UFormField>
</template>
<script setup lang="ts">
const model = defineModel<string>()

const {label, name, type, placeholder = '', required} = defineProps<{
  label: string,
  name: string,
  type: string,
  placeholder: string,
  required: boolean
}>()
</script>