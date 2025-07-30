<template>
  <USelect v-model="model" :items="items" :placeholder="placeholder" :disabled="disable" class="w-full"
           :class="{ 'blur-[1px]': disable }"/>
</template>
<script setup lang="ts">
const model = defineModel<string>()

const {items, disable = false, placeholder = ''} = defineProps<{
  items: any,
  placeholder?: string,
  disable?: boolean
}>()
</script>