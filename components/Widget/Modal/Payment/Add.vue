<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from "@nuxt/ui"
import type { CreatePlanStudent } from '~/models/plan/studentPlan/CreatePlanStudent';
import { createPlanMasterByStudentService } from '~/services/masterPlan.service';

const emit = defineEmits(['update:open', 'success']);
const toastStore = useToastStore()
const isLoading: Ref<boolean> = ref(false)
const displayPrice: Ref<string> = ref('')

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
    v.nonEmpty('نام پلن الزامی است')
  ),
  description: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('توضیحات پلن الزامی است')
  ),
  price: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('مبلغ طرح الزامی است'),
    v.regex(/^\d+$/, 'مبلغ باید فقط شامل عدد باشد')
  ),
  durationInDays: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('مدت زمان طرح الزامی است'),
    v.regex(/^\d+$/, 'مدت زمان باید فقط شامل عدد باشد')
  ),
  isDefault: v.optional(
    v.boolean()
  )
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive<CreatePlanStudent>({
  name: '',
  description: '',
  price: '',
  durationInDays: '',
  isDefault: false
});

const displayPriceComputed = computed({
  get() {
    return displayPrice.value
  },
  set(val: string) {
    const numeric = val.replace(/[^\d]/g, '')
    displayPrice.value = numeric ? Number(numeric).toLocaleString('en-US') : ''
    state.price = numeric
  }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    const payload = {
      ...event.data,
      price: Number(event.data.price),
      durationInDays: Number(event.data.durationInDays)
    }
    const result = await createPlanMasterByStudentService(payload)
    if (result.statusCode === 201) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      localOpen.value = false
      emit('success')
      resetForm();
    }
  } catch (error: any) {
    console.log(error?.message || error);
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  state.name = '';
  state.description = '';
  displayPrice.value = '';
  state.durationInDays = '';
  state.isDefault = '';
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
              placeholder="مثال: شهریه ویژه یا خرید تجهیزات ورزشی" required class="w-full" />
          </div>
          <div class="w-full">
            <BaseFormInput v-model="state.description" label="توضیحات" name="description" type="text"
              placeholder="توضیح کوتاه درباره طرح" required class="w-full" />
          </div>
          <div class="w-full">
            <BaseFormInput v-model="displayPriceComputed" label="قیمت (تومان)" name="price" type="text"
              placeholder="2,500,000" required class="w-full" />
          </div>
          <div class="w-full">
            <BaseFormInput v-model="state.durationInDays" label="مدت زمان" name="durationInDays" type="text"
              placeholder="مدت زمان باید به روز باشد" required class="w-full" />
          </div>
          <div class="w-full">
            <BaseFormCheckBox v-model="state.isDefault" label="لطف طرح اول خود را فعال کنید" name="isDefault" :required="false" />
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false" />
            <UButton label="افزودن طرح جدید" color="primary" type="submit" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>