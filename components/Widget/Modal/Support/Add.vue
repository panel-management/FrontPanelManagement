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

const categorySelect = ref(['مشکل فنی', 'امور مالی', 'در خواست ویژگی', 'عمومی'])
const prioritySelect = ref(['کم', 'متوسط', 'زیاد'])

const schema = v.object({
  ticket: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('عنوان تیکت الزامی است.')
  ),
  description: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('توضیحات الزامی است.')
  ),
  category: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'لطفا یک از موارد دسته ‌بندی انتخاب کنید.'),
      v.custom((val: any) => categorySelect.value.includes(val), 'دسته‌بندی انتخاب ‌شده معتبر نیست.')
  ),
  priority: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'لطفا یک از موارد اولویت انتخاب کنید.'),
      v.custom((val: any) => prioritySelect.value.includes(val), 'اولویت انتخاب ‌شده معتبر نیست.')
  )
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  ticket: '',
  description: '',
  category: '',
  priority: '',
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UModal v-model:open="localOpen" title=" ثبت تیکت جدید" description="مشکل یا درخواست خود را ثبت کنید"
          :ui="{ footer: 'justify-between' }">
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="w-full">
            <BaseFormInput v-model="state.ticket" label="عنوان تیکت" name="ticket" type="text"
                           placeholder="عنوان مشکل یا درخواست خود را بنویسید." required class="w-full"/>
          </div>
          <div class="flex max-sm:flex-col gap-5 sm:gap-3 w-full">
            <BaseFormSelect :required="true" v-model="state.category" :items="categorySelect" name="category"
                            placeholder="دسته بندی را انتخاب کنید" label="دسته بندی" class="w-full"/>
            <BaseFormSelect :required="true" v-model="state.priority" :items="prioritySelect" name="priority"
                            placeholder="اولویت را انتخاب کنید" label="اولویت" class="w-full"/>
          </div>
          <div class="w-full">
            <BaseFormTextArea v-model="state.description" label="توضیحات" name="description"
                              placeholder="مشکل یا درخواست خود را شرح دهید." required class="w-full"/>
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false"/>
            <UButton label="ارسال تیکت" color="primary" type="submit"/>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>