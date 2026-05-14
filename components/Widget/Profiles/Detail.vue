<template>
  <div class="p-4 rounded-xl w-full flex flex-col lg:items-center gap-5" :class="props.customStyle">
    <div class="flex items-center justify-between w-full">
      <div class="flex gap-3">
        <div
          class="bg-black rounded-full size-16 flex justify-center items-center text-white font-semibold text-xl"
        >
          {{ props.fullName.slice(0, 1) }}
        </div>
        <div class="flex flex-col gap-2">
          <span class="font-medium text-xl">{{ props.fullName }}</span>
          <div class="flex gap-2 sm:gap-3">
            <UBadge
              v-if="hasSystemBelt"
              color="info"
              variant="solid"
              :label="props.currentBeltLabel"
              class="font-medium"
            />
            <UBadge
              color="neutral"
              variant="soft"
              :label="props.sportName"
              class="font-semibold w-fit"
            />
            <UBadge
              :color="props.isActiveColor ? 'primary' : 'error'"
              variant="soft"
              :label="props.isActiveLabel ? 'فعال' : 'غیر فعال'"
              class="font-semibold"
            />
          </div>
        </div>
      </div>
      <div class="flex max-md:hidden">
        <UButton
          v-if="isShow"
          @click="toggleInput"
          color="tertiary"
          variant="outline"
          size="lg"
          label="ویرایش"
          trailing-icon="material-symbols:edit-square-outline-rounded"
        />
        <UButton
          v-if="!isShow"
          @click="toggleInput"
          color="neutral"
          variant="outline"
          size="lg"
          label="انصراف"
          trailing-icon="material-symbols:close-rounded"
        />
      </div>
    </div>
    <div
      class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-5 w-full"
    >
      <slot />
    </div>
    <div class="flex min-md:hidden">
      <UButton
        v-if="isShow"
        @click="toggleInput"
        color="tertiary"
        variant="outline"
        size="lg"
        label="ویرایش"
        trailing-icon="material-symbols:edit-square-outline-rounded"
      />
      <UButton
        v-if="!isShow"
        @click="toggleInput"
        color="neutral"
        variant="outline"
        size="lg"
        label="انصراف"
        trailing-icon="material-symbols:close-rounded"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  const isShow: Ref<boolean> = ref(true)

  const emit = defineEmits(['update:toggle'])

  const props = defineProps<{
    fullName: string
    sportName: string
    isActiveColor: boolean | undefined
    isActiveLabel: boolean | undefined
    hasSystemBelt?: boolean
    currentBeltLabel?: string
    customStyle: string
  }>()

  function toggleInput() {
    isShow.value = !isShow.value
    emit('update:toggle', isShow.value)
  }
</script>
