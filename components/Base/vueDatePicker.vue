<template>
  <UFormField :label="label" :name="name" :required="required">
    <div class="relative" ref="wrapper">
      <UInput
        v-model="formattedDate"
        type="text"
        placeholder="تاریخ را انتخاب کنید"
        :disabled="disable"
        color="neutral"
        size="lg"
        class="w-full"
        :class="{ 'blur-[1px]': disable }"
        @focus="open = true"
        readonly
      />

      <Transition name="fade">
        <div v-if="open" class="absolute pt-2 z-50">
          <DatePicker
            v-model="date"
            :column="1"
            mode="single"
            class="bg-white pr-1 border-2 focus:outline-none"
            @close="open = false"
            @change="handleChange"
          />
        </div>
      </Transition>
    </div>
  </UFormField>
</template>
<script setup lang="ts">
  import DatePicker from '@alireza-ab/vue3-persian-datepicker'
  import { onClickOutside } from '@vueuse/core'

  const model = defineModel<string>()

  const {
    label = '',
    name,
    required,
    disable = false,
  } = defineProps<{
    label?: string
    name: string
    required: boolean
    disable?: boolean
  }>()

  const open: Ref<boolean> = ref(false)
  const date: Ref<string> = ref('')
  const formattedDate: Ref<string> = ref('')
  const wrapper: Ref<HTMLElement | null> = ref<HTMLElement | null>(null)

  watch(date, (val) => {
    formattedDate.value = val
    model.value = val
  })

  watch(
    model,
    (val) => {
      formattedDate.value = val || ''
      date.value = val || ''
    },
    { immediate: true }
  )

  onClickOutside(wrapper, () => {
    open.value = false
  })

  function handleChange(val: string) {
    model.value = val
    formattedDate.value = val
    open.value = false
  }
</script>
<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
