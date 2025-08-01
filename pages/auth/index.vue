<template>
  <div class="w-full h-dvh px-7 flex justify-center items-center">
    <UForm v-if="step === 1" :schema="step1Schema" :state="stateStep1" @submit.prevent="onSubmitStep1"
           class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full flex flex-col items-center justify-center gap-5">
      <div class="flex flex-col items-center-safe gap-1">
        <span class="font-medium text-xl md:text-3xl text-black leading-relaxed">ورود به سیستم</span>
        <span class="text-black/80 font-normal text-sm">لطفاً اطلاعات خود را وارد کنید</span>
      </div>
      <div class="w-full flex flex-col gap-5">
        <BaseFormInput v-model="stateStep1.phoneNumber" label="شماره تلفن" name="phoneNumber" type="text"
                       :required="false" class="w-full"/>
      </div>
      <UButton @click="step = 2" type="submit" class="btn btn-outline flex justify-center text-base" label="ورود"/>
    </UForm>
    <UForm v-else-if="step === 2" :schema="step2Schema" :state="stateStep2" @submit.prevent="onSubmitStep2"
           class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full flex flex-col items-center justify-center gap-5">
      <div class="flex flex-col items-center-safe gap-1">
        <span class="font-medium text-xl md:text-3xl text-black leading-relaxed">ورود به سیستم</span>
        <span class="text-black/80 font-normal text-sm">کد تایید ارسال شده به 09123456789 را وارد کنید</span>
      </div>
      <div class="w-full">
        <BaseFormOtp v-model="stateStep2.otpArray" name="otpArray" :disable="false" :required="false"
                     class="w-full flex justify-center items-center"/>
      </div>
      <UButton @click="step = 3" type="submit" class="btn btn-outline flex justify-center text-base"
               label="ورود به حساب کاربری"/>
    </UForm>
    <UForm v-else-if="step === 3" :schema="step3Schema" :state="stateStep3" @submit.prevent="onSubmitStep3"
           class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full flex flex-col items-center justify-center gap-5">
      <div class="flex flex-col items-center-safe gap-1">
        <span class="font-medium text-xl md:text-3xl text-black leading-relaxed">ثبت نام</span>
        <span class="text-black/80 font-normal text-sm">ایجاد حساب کاربری جدید</span>
      </div>
      <div class="w-full flex flex-col gap-5">
        <BaseFormInput v-model="stateStep3.fullName" label="نام و نام خانوادگی" name="fullName" type="text" required :disable="false" class="w-full"/>
        <BaseFormInput v-model="stateStep3.nationalCode" label="کد ملی" name="nationalCode" type="text" required :disable="false" class="w-full"/>
        <BaseFormInput v-model="stateStep3.phoneNumber" label="شماره تلفن" name="phoneNumber" type="text" required :disable="true" class="w-full"/>
        <BaseFormInput v-model="stateStep3.otp" label="کد تایید" name="otp" type="text" required :disable="true" class="w-full"/>
        <BaseFormSelect required :disable="false" v-model="stateStep3.selectSport" :items="itemsSelect" name="selectSport" placeholder="رشته مورد نظر را انتخاب کنید" label="انتخاب رشته ورزشی"/>
      </div>
      <UButton to="/dashboard" class="btn btn-outline flex justify-center text-base" label="ثبت نام"/>
    </UForm>
  </div>
</template>
<script setup lang="ts">
import * as v from "valibot";
import type {FormSubmitEvent} from "@nuxt/ui";

const step: Ref<number> = ref(1)
const itemsSelect = ref(['کاراته', 'بوکس', 'کیک بوکس', 'جودو', 'کشتی', 'کنگفو', 'تکواندو', 'موی تای', 'ام‌ام‌ای'])

const step1Schema = v.object({
  phoneNumber: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن الزامی است'),
      v.minLength(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد'),
      v.maxLength(12, 'شماره تلفن نباید بیشتر از ۱۲ رقم باشد')
  ),
})
const step2Schema = v.object({
  otpArray: v.pipe(
      v.array(v.number()),
      v.nonEmpty('کد تایید الزامی است'),
      v.minLength(6, 'کد باید ۶ رقم باشد'),
      v.maxLength(6, 'کد نباید بیشتر از ۶ رقم باشد'),
  ),
})
const step3Schema = v.object({
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
  otp: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('کد تایید الزامی است'),
      v.minLength(6, 'کد باید ۶ رقم باشد'),
      v.maxLength(6, 'کد نباید بیشتر از ۶ رقم باشد'),
  ),
  selectSport: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'لطفا یک از موارد رشته انتخاب کنید.'),
      v.custom((val: any) => itemsSelect.value.includes(val), 'رشته انتخاب ‌شده معتبر نیست.')
  )
})

type step1Schema = v.InferOutput<typeof step1Schema>;
type step2Schema = v.InferOutput<typeof step2Schema>;
type step3Schema = v.InferOutput<typeof step3Schema>;

const stateStep1 = reactive({
  phoneNumber: '09123456789'
});
const stateStep2 = reactive({
  otpArray: [] as number[],
});
const stateStep3 = reactive({
  fullName: 'احسان فولادی',
  nationalCode: '0914059112',
  phoneNumber: '09123456789',
  otp: '123456',
  selectSport: 'کاراته',
});

async function onSubmitStep1(event: FormSubmitEvent<step1Schema>) {
  console.log(event.data)
}
async function onSubmitStep2(event: FormSubmitEvent<step2Schema>) {
  const otpString = event.data.otpArray.join('')
  console.log(otpString)
}
async function onSubmitStep3(event: FormSubmitEvent<step3Schema>) {
  console.log(event.data)
}

definePageMeta({
  layout: false
})
</script>