<template>
  <UFormField :label="label" :name="name" :required="required">
    <UPinInput class="direction" v-model="model" size="xl" color="neutral" otp type="number" :length="6"
               :disabled="disable" :class="{ 'blur-[1px]': disable }"/>
  </UFormField>
</template>
<script setup lang="ts">
const model = defineModel<number[]>()

const {name, required, label = '', disable = false} = defineProps<{
  label?: string,
  name: string,
  required: boolean
  disable?: boolean
}>()
</script>
<style scoped>
.direction {
  direction: ltr !important;
}
</style>