<template>
  <UFormField :label="label" :name="name" :required="required">
    <UInput
      v-model="model"
      type="text"
      placeholder="تاریخ را انتخاب کنید"
      :disabled="disable"
      color="neutral"
      size="lg"
      class="w-full"
      :class="{ 'blur-[1px]': disable }"
      data-jdp
    />
  </UFormField>
</template>
<script setup lang="ts">
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

  onMounted(async () => {
    if (process.client) {
      await import('@majidh1/jalalidatepicker/dist/jalalidatepicker.min.css')
      await import('@majidh1/jalalidatepicker/dist/jalalidatepicker')

      // @ts-ignore
      jalaliDatepicker.startWatch({
        format: 'YYYY/MM/DD',
        autoShow: true,
        showTodayBtn: true,
        useDropDownYears: true,
        onChange: (selectedDate: string) => {
          model.value = selectedDate
        },
      })
    }
  })

  onBeforeUnmount(() => {
    if (process.client) {
      // @ts-ignore
      jalaliDatepicker.hide()
    }
  })
</script>
