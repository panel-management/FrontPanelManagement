<script setup lang="ts">
import * as v from 'valibot'
import type {FormSubmitEvent} from "@nuxt/ui"

const emit = defineEmits(['update:open']);

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
});

const localOpen = computed({
  get: () => props.open,
  set: (Val) => emit('update:open', Val)
});

const schema = v.object({
  name: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('نام طرح الزامی است.')
  ),
  price: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('قیمت طرح الزامی است.'),
  ),
  dateTime: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('مدت زمان طرح الزامی است.'),
  )
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  name: '',
  price: '',
  dateTime: '',
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UModal v-model:open="localOpen" title="ثبت طرح جدید" description="اطلاعات طرح را تکمیل کنید"
          :ui="{ footer: 'justify-between' }">
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="w-full">
            <BaseFormInput v-model="state.name" label="نام طرح" name="name" type="text"
                           placeholder="مثال: شهریه ویژه یا خرید تجهیزات ورزشی" required class="w-full"/>
          </div>
          <div class="w-full">
            <BaseFormInput v-model="state.price" label="قیمت (تومان)" name="price" type="text"
                           placeholder="2,500,000" required class="w-full"/>
          </div>
          <div class="w-full">
            <BaseFormInput v-model="state.dateTime" label="مدت زمان" name="dateTime" type="text"
                           placeholder="1 ماه" required class="w-full"/>
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false"/>
            <UButton label="افزودن طرح جدید" color="primary" type="submit"/>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>