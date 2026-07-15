<template>
  <UPagination
    v-model="model"
    :total="total"
    :items-per-page="limit"
    :sibling-count="1"
    size="xl"
    show-edges
  />
</template>
<script lang="ts" setup>
  const model = defineModel<number>()
  defineProps<{ total: number; limit: number }>()
</script>
