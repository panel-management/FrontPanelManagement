<template>
  <UTabs :items="items" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
    <template v-for="item in items" v-slot:[item.slot]="{item}">
      <slot :name="item.slot" :item="item"/>
    </template>
  </UTabs>
</template>
<script setup lang="ts">
defineProps<{
  items: { label: string; slot: string; description?: string }[]
}>()
</script>