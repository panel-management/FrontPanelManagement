<template>
  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl h-fit">
    <div class="flex justify-center items-center">
      <UIcon :name="props.nameIcon" :class="props.classIcon" class="size-6" />
    </div>
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <span class="font-semibold text-lg"> {{ props.title }} تومان </span>
        <span class="font-medium text-sm flex items-center gap-1">
          {{ props.dateTime }}
        </span>
      </div>
      <UBadge :label="props.badgeLabel" :color="props.badgeColor" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps<{
    nameIcon: string
    classIcon: string
    title: string
    dateTime: string | null
    badgeLabel: string
    badgeColor: string
  }>()
</script>
