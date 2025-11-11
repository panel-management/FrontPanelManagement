<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from "@nuxt/ui"
import { getAllBeltService } from '~/services/sportBelt.service';
import type { Belt } from '~/models/sportAndBelt/belt';
import { getPlanMasterByStudentService } from '~/services/masterPlan.service';
import type { StudentPlanData } from '~/models/plan/studentPlan/StudentPlanData';

const emit = defineEmits(['update:open']);
const beltSelect: Ref<any[]> = ref([])
const planSelect: Ref<any[]> = ref([])
const beltData: Ref<Belt[]> = ref([])
const planData: Ref<StudentPlanData[]> = ref([])
// const itemsSelect = ref(['سفید', 'نارنجی', 'ابی', 'زرد', 'سبز', 'قهوه ای', 'مشکی'])

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
  fullName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('نام و نام خانوادگی هنرجو الزامی است')
  ),
  nationalCode: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('کد ملی الزامی است.'),
    v.maxLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید')
  ),
  age: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('سن هنرجو الزامی است'),
    v.minLength(1, 'سن نمی‌تواند خالی باشد'),
    v.maxLength(2, 'سن باید حداکثر ۲ رقم باشد')
  ),
  birthDate: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('تاریخ تولد هنرجو الزامی است'),
    v.regex(/^\d{4}\/\d{2}\/\d{2}$/, 'فرمت تاریخ شمسی صحیح نیست. مثال: 1380/07/30')
  ),
  phoneNumber: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('شماره تلفن الزامی است'),
    v.minLength(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد'),
    v.maxLength(12, 'شماره تلفن نباید بیشتر از ۱۲ رقم باشد')
  ),
  phoneNumberEmergency: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('شماره تلفن اضطراری الزامی است'),
    v.minLength(11, 'شماره تلفن اضطراری باید حداقل ۱۱ رقم باشد'),
    v.maxLength(12, 'شماره تلفن اضطراری نباید بیشتر از ۱۲ رقم باشد')
  ),
  address: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('ادرس محل زندگی الزامی است')
  ),
  beltIds: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('انتخاب کمربند الزامی است'),
    v.minLength(1, 'لطفا یک از موارد کمربند انتخاب کنید'),
  ),
  planId: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('انتخاب طرح الزامی است'),
    v.minLength(1, 'لطفا یک از موارد طرح انتخاب کنید'),
  ),
  underSupervisionDoctor: v.boolean(),
  diseaseRecords: v.boolean()
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  fullName: '',
  nationalCode: '',
  age: '',
  birthDate: '',
  phoneNumber: '',
  phoneNumberEmergency: '',
  address: '',
  beltIds: '',
  planId: '',
  underSupervisionDoctor: false,
  diseaseRecords: false
});

async function getAllBelt() {
  try {
    const result = await getAllBeltService()
    if (result.statusCode === 200) {
      console.log(result.data);
      beltData.value = Array.isArray(result.data) ? result.data : []
      beltSelect.value = beltData.value.map(item => ({
        label: item.color,
        value: String(item.id)
      }))
    }
  } catch (error: any) {
    console.log(error.message || error);
  }
}

async function getAllPlanStudent() {
  try {
    const result = await getPlanMasterByStudentService()
    if (result.statusCode === 200) {
      console.log(result.data);
      planData.value = Array.isArray(result.data) ? result.data : []
      planSelect.value = planData.value.map(items => ({
        label: items.name,
        value: String(items.id),
      }))
    }
  } catch (error: any) {
    console.log(error.message || error);
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}

onMounted(() => {
  getAllBelt()
  getAllPlanStudent()
})
</script>

<template>
  <UModal v-model:open="localOpen" title="ثبت هنرجوی جدید" description="اطلاعات هنرجو را تکمیل کنید"
    :ui="{ footer: 'justify-between' }">
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <USeparator label="اطلاعات شخصی" />
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput v-model="state.fullName" label="نام و نام خانوادگی" name="fullName" type="text"
              placeholder="نام کامل هنرجو" required class="w-full" />
            <BaseFormInput v-model="state.nationalCode" label="کد ملی" name="nationalCode" type="text"
              placeholder="کد ملی هنرجو" required class="w-full" />
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseVueDatePicker required v-model="state.birthDate" label="تاریخ تولد" name="birthDate" class="w-full" />
            <BaseFormInput v-model="state.age" label="سن" name="age" type="text" placeholder="سن هنرجو" required
              class="w-full" />
          </div>
          <USeparator label="اطلاعات تماس" />
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput v-model="state.phoneNumber" label="شماره تلفن" name="phoneNumber" type="text"
              placeholder="شماره تلفن هنرجو" required class="w-full" />
            <BaseFormInput v-model="state.phoneNumberEmergency" label="شماره تلفن اضطراری" name="phoneNumberEmergency"
              type="text" placeholder="شماره تلفن اضطراری هنرجو" required class="w-full" />
          </div>
          <div class="w-full">
            <BaseFormTextArea v-model="state.address" label="آدرس محل سکونت" name="address" required class="w-full" />
          </div>
          <USeparator label="اطلاعات پزشکی" />
          <div class="flex flex-col gap-4 w-full">
            <BaseFormCheckBox :required="false" v-model="state.underSupervisionDoctor" name="underSupervisionDoctor"
              label="آیا تحت نظر پزشک هستید؟" />
            <BaseFormCheckBox :required="false" v-model="state.diseaseRecords" name="diseaseRecords"
              label="سوابق بیماری یا آسیب‌دیدگی؟" />
          </div>
          <USeparator />
          <div class="w-full">
            <BaseFormSelect :required="true" v-model="state.beltIds" :items="beltSelect" name="beltIds"
              placeholder="انتخاب کمربند" label="انتخاب کمربند" />
          </div>
          <div class="w-full">
            <BaseFormSelect :required="true" v-model="state.planId" :items="planSelect" name="planId"
              placeholder="انتخاب طرح" label="انتخاب طرح" />
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false" />
            <UButton label="افزودن هنرجو" color="primary" type="submit" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>