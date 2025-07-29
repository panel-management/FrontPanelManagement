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

const itemsSelect = ref(['امیر', 'حسین', 'حسن', 'رضا', 'قاسم', 'علی', 'شادمان'])

const schema = v.object({
  name: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('نام محصول الزامی است.')
  ),
  price: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('قیمت محصول الزامی است.')
  ),
  selectBelt: v.pipe(
      v.string(),
      v.trim(),
  ),
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  name: '',
  price: '',
  selectBelt: 'امیر',
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UModal v-model:open="localOpen" title="ثبت محصول جدید" description="اطلاعات محصول را تکمیل کنید"
          :ui="{ footer: 'justify-between' }">
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="w-full">
            <BaseFormSelect :required="false" v-model="state.selectBelt" :items="itemsSelect" name="selectBelt" label="انتخاب هنرجو"/>
          </div>
          <div class="w-full">
            <BaseFormInput v-model="state.name" label="نام محصول" name="name" type="text"
                           placeholder="خرید دستکش" required class="w-full"/>
          </div>
          <div class="w-full">
            <BaseFormInput v-model="state.price" label="قیمت محصول" name="price" type="text"
                           placeholder="120000" required class="w-full"/>
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false"/>
            <UButton label="ثبت محصول" color="primary" type="submit"/>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>