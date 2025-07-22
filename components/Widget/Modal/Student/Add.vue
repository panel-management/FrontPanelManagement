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

const itemsSelect = ref(['سفید', 'نارنجی', 'ابی', 'زرد', 'سبز', 'قهوه ای', 'مشکی'])

const schema = v.object({
  fullName: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('نام و نام خانوادگی هنرجو الزامی است.')
  ),
  address: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('ادرس محل زندگی الزامی است.')
  ),
  phoneNumber: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن الزامی است.'),
      v.minLength(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد.'),
      v.maxLength(12, 'شماره تلفن نباید بیشتر از ۱۲ رقم باشد.')
  ),
  phoneNumberEmergency: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن اضطراری الزامی است.'),
      v.minLength(11, 'شماره تلفن اضطراری باید حداقل ۱۱ رقم باشد.'),
      v.maxLength(12, 'شماره تلفن اضطراری نباید بیشتر از ۱۲ رقم باشد.')
  ),
  nationalCode: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('کد ملی الزامی است.'),
      v.maxLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید.')
  ),
  age: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('سن هنرجو الزامی است.'),
      v.minLength(1, 'سن نمی‌تواند خالی باشد'),
      v.maxLength(2, 'سن باید حداکثر ۲ رقم باشد')
  ),
  selectBelt: v.pipe(
      v.string(),
      v.trim(),
  ),
  date: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('تاریخ تولد هنرجو الزامی است.'),
      v.regex(/^\d{4}\/\d{2}\/\d{2}$/, 'فرمت تاریخ شمسی صحیح نیست. مثال: 1380/07/30'),
      v.custom((val: any) => !isNaN(new Date(val).getTime()), 'تاریخ وارد شده معتبر نیست.')
  ),
  underSupervisionDoctor: v.boolean(),
  diseaseRecords: v.boolean()
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  fullName: '',
  address: '',
  phoneNumber: '',
  phoneNumberEmergency: '',
  nationalCode: '',
  age: '',
  date: '',
  selectBelt: 'سفید',
  underSupervisionDoctor: false,
  diseaseRecords: false
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UModal v-model:open="localOpen" title="ثبت هنرجوی جدید" description="اطلاعات هنرجو را تکمیل کنید"
          :ui="{ footer: 'justify-between' }">
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <USeparator label="اطلاعات شخصی"/>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput v-model="state.fullName" label="نام و نام خانوادگی" name="fullName" type="text"
                           placeholder="نام کامل هنرجو" required class="w-full"/>
            <BaseFormInput v-model="state.nationalCode" label="کد ملی" name="nationalCode" type="text"
                           placeholder="کد ملی هنرجو" required class="w-full"/>
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput v-model="state.date" label="تاریخ تولد" name="date" type="text"
                           placeholder="1380/10/20" required class="w-full"/>
            <BaseFormInput v-model="state.age" label="سن" name="age" type="text"
                           placeholder="سن هنرجو" required class="w-full"/>
          </div>
          <USeparator label="اطلاعات تماس"/>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput v-model="state.phoneNumber" label="شماره تلفن" name="phoneNumber" type="text"
                           placeholder="شماره تلفن هنرجو" required class="w-full"/>
            <BaseFormInput v-model="state.phoneNumberEmergency" label="شماره تلفن اضطراری" name="phoneNumberEmergency"
                           type="text" placeholder="شماره تلفن اضطراری هنرجو" required class="w-full"/>
          </div>
          <div class="w-full pt-1">
            <BaseFormTextArea v-model="state.address" label="آدرس محل سکونت" name="address" required class="w-full"/>
          </div>
          <USeparator label="اطلاعات پزشکی"/>
          <div class="flex flex-col gap-4 w-full">
            <BaseFormCheckBox :required="false" v-model="state.underSupervisionDoctor" name="underSupervisionDoctor"
                              label="آیا تحت نظر پزشک هستید؟"/>
            <BaseFormCheckBox :required="false" v-model="state.diseaseRecords" name="diseaseRecords"
                              label="سوابق بیماری یا آسیب‌دیدگی؟"/>
          </div>
          <USeparator/>
          <div class="w-full">
            <BaseFormSelect :required="false" v-model="state.selectBelt" :items="itemsSelect" name="selectBelt" label="انتخاب کمربند"/>
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false"/>
            <UButton label="ذخیره اطلاعات" color="primary" type="submit"/>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>