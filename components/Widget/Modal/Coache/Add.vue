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

const itemsSelect = ref(['کارته', 'بوکس', 'کیک بوکس', 'جودو', 'کشتی', 'کنگفو', 'تکواندو', 'موی تای', 'ام‌ام‌ای'])

const schema = v.object({
  fullName: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('نام و نام خانوادگی مربی الزامی است.')
  ),
  nationalCode: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('کد ملی الزامی است.'),
      v.maxLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید.')
  ),
  phoneNumber: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن الزامی است.'),
      v.minLength(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد.'),
      v.maxLength(12, 'شماره تلفن نباید بیشتر از ۱۲ رقم باشد.')
  ),
  history: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('سابقه تدریس الزامی است.'),
  ),
  certificates: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('مدرک و گواهینامه مربی الزامی است.'),
  ),
  address: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('ادرس محل باشگاه الزامی است.')
  ),
  selectSport: v.pipe(
      v.string(),
      v.trim(),
  ),
  image: v.pipe(
      v.file(),
      v.mimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'لطف عکس را با این فرمت ها اپلود کنید. (jpeg, png, jpg, webp)'),
      v.maxSize(1024 * 1024 * 2, 'عکس باید زیر ۲ مگابایت باشد.')
  )
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  fullName: '',
  address: '',
  phoneNumber: '',
  nationalCode: '',
  history: '',
  certificates: '',
  selectSport: 'کارته',
  image: undefined as File | undefined
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UModal v-model:open="localOpen" title="ثبت مربی جدید" description="اطلاعات مربی را تکمیل کنید"
          :ui="{ footer: 'justify-between' }">
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput v-model="state.fullName" label="نام و نام خانوادگی" name="fullName" type="text"
                           placeholder="نام کامل مربی" required class="w-full"/>
            <BaseFormInput v-model="state.nationalCode" label="کد ملی" name="nationalCode" type="text"
                           placeholder="کد ملی مربی" required class="w-full"/>
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput v-model="state.phoneNumber" label="شماره تلفن" name="phoneNumber" type="text"
                           placeholder="شماره تلفن مربی" required class="w-full"/>
            <BaseFormInput v-model="state.history" label="سابقه تدریس" name="history" type="text"
                           placeholder="سابقه تدریس مربی" required class="w-full"/>
          </div>
          <div class="w-full pt-1">
            <BaseFormInput v-model="state.certificates" label="مدرک و گواهینامه ها" name="certificates" type="text"
                           placeholder="مدرک و گواهینامه ها مربیگری" required class="w-full"/>
          </div>
          <div class="w-full pt-1">
            <BaseFormTextArea v-model="state.address" label="آدرس محل باشگاه" name="address" required class="w-full"/>
          </div>
          <div class="w-full pt-1">
            <BaseFormSelect required v-model="state.selectSport" :items="itemsSelect" name="selectSport"
                            label="انتخاب رشته ورزشی"/>
          </div>
          <div class="w-full pt-1">
            <BaseFormUploadFile :required="false" v-model="state.image" label="ارسال عکس گواهینامه" name="image" description="اپلود عکس با فرمت (jepg, png, webp, jpg) و حداکثر تا 2MB" class="w-full"/>
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false"/>
            <UButton label="افزودن مربی" color="primary" type="submit"/>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>