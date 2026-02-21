<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import { createStudentService } from '~/services/student.service'
  import type { StudentPlanData } from '~/models/plan/studentPlan/StudentPlanData'
  import { getPlanMasterByStudentService } from '~/services/masterPlan.service'
  import type { CreateStudent } from '~/models/users/student/CreateStudent'

  const emit = defineEmits(['update:open', 'success'])
  const toastStore = useToastStore()
  const gettingVariousDataStore = useGettingVariousDataStore()
  const planData: Ref<StudentPlanData[]> = ref([])
  const beltSelect = ref<{ label: string; value: string }[]>([])
  const planSelect = ref<{ label: string; value: string }[]>([])
  const isLoading: Ref<boolean> = ref(false)
  const hasSystemBelt = computed(() => gettingVariousDataStore.hasBeltSystem)

  const props = defineProps({
    open: {
      type: Boolean,
      required: true,
    },
  })

  const localOpen = computed({
    get: () => props.open,
    set: (Val) => emit('update:open', Val),
  })

  const schema = v.object({
    fullName: v.pipe(v.string(), v.trim(), v.nonEmpty('نام و نام خانوادگی هنرجو الزامی است')),
    nationalCode: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('کد ملی الزامی است'),
      v.maxLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید'),
      v.minLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید'),
      v.regex(/^\d+$/, 'کد ملی فقط می‌تواند شامل اعداد باشد')
    ),
    age: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('سن هنرجو الزامی است'),
      v.minLength(1, 'سن نمی‌تواند خالی باشد'),
      v.maxLength(2, 'سن باید حداکثر ۲ رقم باشد'),
      v.regex(/^\d+$/, 'سن باید عدد باشد')
    ),
    birthDate: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('تاریخ تولد هنرجو الزامی است'),
      v.regex(
        /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        'فرمت تاریخ میلادی صحیح نیست. مثال: 2000-04-20'
      )
    ),
    phoneNumber: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن الزامی است'),
      v.minLength(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد'),
      v.maxLength(11, 'شماره تلفن نباید بیشتر از ۱۱ رقم باشد'),
      v.regex(/^09\d{9,10}$/, 'شماره تلفن باید با 09 شروع شود')
    ),
    phoneNumberEmergency: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن اضطراری الزامی است'),
      v.minLength(11, 'شماره تلفن اضطراری باید حداقل ۱۱ رقم باشد'),
      v.maxLength(11, 'شماره تلفن اضطراری نباید بیشتر از ۱۱ رقم باشد'),
      v.regex(/^09\d{9,10}$/, 'شماره تلفن اضطراری باید با 09 شروع شود')
    ),
    address: v.pipe(v.string(), v.trim(), v.nonEmpty('ادرس محل زندگی الزامی است')),
    beltIds: v.pipe(v.string(), v.trim()),
    planId: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('انتخاب طرح الزامی است'),
      v.minLength(1, 'لطفا یک از طرح ها را انتخاب کنید')
    ),
    underSupervisionDoctor: v.boolean(),
    diseaseRecords: v.boolean(),
  })

  type Schema = v.InferOutput<typeof schema>

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
    diseaseRecords: false,
  })

  async function fetchPlanStudent() {
    try {
      const result = await getPlanMasterByStudentService()
      if (result.statusCode === 200) {
        planData.value = Array.isArray(result.data) ? result.data : []
        planSelect.value = planData.value.map((item) => ({
          label: item.name,
          value: String(item.id),
        }))
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const payload: CreateStudent = {
        ...event.data,
        age: Number(event.data.age),
        planId: Number(event.data.planId),
        beltIds: Number(event.data.beltIds),
      }
      const result = await createStudentService(payload)
      if (result.statusCode === 201) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        localOpen.value = false
        emit('success')
        resetForm()
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  function resetForm() {
    state.fullName = ''
    state.nationalCode = ''
    state.age = ''
    state.birthDate = ''
    state.phoneNumber = ''
    state.phoneNumberEmergency = ''
    state.address = ''
    state.beltIds = ''
    state.planId = ''
    state.underSupervisionDoctor = false
    state.diseaseRecords = false
  }

  watch(
    () => gettingVariousDataStore.beltData,
    (value) => {
      if (!hasSystemBelt.value) return
      beltSelect.value = value.map((item) => ({
        label: item.color,
        value: String(item.id),
      }))
    },
    { immediate: true }
  )

  onMounted(fetchPlanStudent)
</script>

<template>
  <UModal
    v-model:open="localOpen"
    title="ثبت هنرجوی جدید"
    description="اطلاعات هنرجو را تکمیل کنید"
    :ui="{ footer: 'justify-between' }"
  >
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <USeparator label="اطلاعات شخصی" />
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput
              v-model="state.fullName"
              label="نام و نام خانوادگی"
              name="fullName"
              type="text"
              placeholder="نام کامل هنرجو"
              required
              class="w-full"
            />
            <BaseFormInput
              v-model="state.nationalCode"
              label="کد ملی"
              name="nationalCode"
              type="text"
              placeholder="کد ملی هنرجو"
              required
              class="w-full"
            />
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseVueDatePicker
              required
              v-model="state.birthDate"
              label="تاریخ تولد"
              name="birthDate"
              class="w-full"
            />
            <BaseFormInput
              v-model="state.age"
              label="سن"
              name="age"
              type="text"
              placeholder="سن هنرجو"
              required
              class="w-full"
            />
          </div>
          <USeparator label="اطلاعات تماس" />
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput
              v-model="state.phoneNumber"
              label="شماره تلفن"
              name="phoneNumber"
              type="text"
              placeholder="شماره تلفن هنرجو"
              required
              class="w-full"
            />
            <BaseFormInput
              v-model="state.phoneNumberEmergency"
              label="شماره تلفن اضطراری"
              name="phoneNumberEmergency"
              type="text"
              placeholder="شماره تلفن اضطراری هنرجو"
              required
              class="w-full"
            />
          </div>
          <div class="w-full">
            <BaseFormTextArea
              v-model="state.address"
              label="آدرس محل سکونت"
              name="address"
              required
              class="w-full"
            />
          </div>
          <USeparator label="اطلاعات پزشکی" />
          <div class="flex flex-col gap-4 w-full">
            <BaseFormCheckBox
              :required="false"
              v-model="state.underSupervisionDoctor"
              name="underSupervisionDoctor"
              label="آیا تحت نظر پزشک هستید؟"
            />
            <BaseFormCheckBox
              :required="false"
              v-model="state.diseaseRecords"
              name="diseaseRecords"
              label="سوابق بیماری یا آسیب‌دیدگی؟"
            />
          </div>
          <USeparator label="انتخاب کمربند و پلن" />
          <div class="flex flex-col gap-4 w-full">
            <BaseFormSelect
              v-if="hasSystemBelt"
              :required="hasSystemBelt"
              v-model="state.beltIds"
              :items="beltSelect"
              name="beltIds"
              placeholder="انتخاب کمربند"
              label="انتخاب کمربند"
            />
            <BaseFormSelect
              :required="true"
              v-model="state.planId"
              :items="planSelect"
              name="planId"
              placeholder="انتخاب طرح"
              label="انتخاب طرح"
            />
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false" />
            <UButton :loading="isLoading" label="افزودن هنرجو" color="primary" type="submit" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
