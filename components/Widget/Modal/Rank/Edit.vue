<script setup lang="ts">
import * as v from 'valibot'
import type {FormSubmitEvent} from "@nuxt/ui"

const emit = defineEmits(['update:open']);

const categorySelect = ref(['سفید', 'نارنجی', 'آبی', 'زرد', 'سبز', 'قهوه ای', 'مشکی'])

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
      v.nonEmpty('نام رتبه الزامی است.')
  ),
  category: v.pipe(
      v.string(),
      v.trim(),
  )
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  name: 'قهوه ای',
  category: 'سبز',
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UModal v-model:open="localOpen" title="ویرایش رتبه" description="ویرایش اطلاعات رتبه"
          :ui="{ footer: 'justify-between' }">
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="w-full">
            <BaseFormInput v-model="state.name" label="نام رتبه" name="name" type="text"
                           placeholder="مثال: قرمز یا سطح" required class="w-full"/>
          </div>
          <div class="w-full">
            <BaseFormSelect :required="true" v-model="state.category" :items="categorySelect" name="category"
                            placeholder="دسته بندی را انتخاب کنید" label="دسته بندی" class="w-full"/>
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false"/>
            <UButton label="ویرایش رتبه" color="primary" type="submit"/>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>