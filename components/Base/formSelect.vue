<template>
  <UFormField :label="label" :name="name" :required="required">
    <USelect v-model="model" :items="items" :placeholder="placeholder" :disabled="disable" class="w-full"
             :class="{ 'blur-[1px]': disable }"/>
  </UFormField>
</template>
<script setup lang="ts">
const model = defineModel<string>()

const {items, label, name, required = false, disable = false, placeholder=''} = defineProps<{
  items: any,
  name: string,
  label: string,
  placeholder?: string,
  required: boolean,
  disable?: boolean
}>()
</script>