<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from "@nuxt/ui"
import type { TabsItem } from '@nuxt/ui'
import { getStudentByIdService, updateStudentService } from '~/services/student.service';
import type { StudentListData } from '~/models/users/student/StudentListData';
import type { UpdateStudent } from '~/models/users/student/UpdateStudent';
import type { Belt } from '~/models/sportAndBelt/belt';
import { getAllBeltService } from '~/services/sportBelt.service';

const emit = defineEmits(['update:open', 'success']);
const isShow: Ref<boolean> = ref(true)
const isLoading: Ref<boolean> = ref(false)
const modalStore = useModalStore()
const toastStore = useToastStore()
const { gregorianToJalali, gregorianToDate } = useDateConverter()
const formData = ref<StudentListData | null>(null)
const beltItems = ref<Belt[]>([])
const itemsSelect = ref<{ label: string; value: string }[]>([])
// const itemsSelect = ref(['سفید', 'نارنجی', 'ابی', 'زرد', 'سبز', 'قهوه ای', 'مشکی'])

const userId = computed(() => modalStore.modals.studentEdit)

const props = defineProps({
  open: {
    type: [Boolean, Object, Number, String, null],
    default: null
  }
})

const localOpen = computed({
  get: () => !!props.open,
  set: (val: boolean) => {
    if (!val) emit('update:open', null)
  }
})

const items = [
  {
    label: 'ویرایش اطلاعات',
    slot: 'editData' as const
  },
  {
    label: 'تاریخچه کمربند',
    slot: 'dateBelt' as const
  },
  {
    label: 'وضعیت مالی',
    slot: 'paymentStatus' as const
  }
] satisfies TabsItem[]

async function loadStudent() {
  if (!userId.value) {
    formData.value = null
    return
  }
  try {
    const result = await getStudentByIdService(userId.value)
    console.log(result.data);

    if (result.statusCode === 200) {
      formData.value = result.data as StudentListData
    }
  } catch (error: any) {
    console.log(error.message || error)
    formData.value = null
  }
}

async function loadBelt() {
  try {
    const result = await getAllBeltService()
    if (result.statusCode === 200) {
      beltItems.value = Array.isArray(result.data) ? result.data : []
      itemsSelect.value = beltItems.value.map(item => ({
        label: item.color,
        value: String(item.id)
      }))
    }
  } catch (error: any) {
    console.error('Error loadSports:', error.message || error)
  }
}

onMounted(() => {
  loadBelt()
  if (userId.value) {
    nextTick(loadStudent)
  }
})

// open modal just yourself master id
watch(userId, (id) => {
  if (id) {
    loadStudent()
  } else {
    formData.value = null
  }
})

const schema = v.object({
  fullName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('نام و نام خانوادگی هنرجو الزامی است')
  ),
  nationalCode: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('کد ملی الزامی است'),
    v.maxLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید')
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
    v.nonEmpty('ادرس محل زندگی هنرجو الزامی است')
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
    v.regex(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'فرمت تاریخ میلادی صحیح نیست. مثال: 2000-04-20')
  ),
  beltIds: v.pipe(v.string(), v.trim()),
  underSupervisionDoctor: v.boolean(),
  diseaseRecords: v.boolean()
})

type Schema = v.InferOutput<typeof schema>;

// state form data
const state = reactive<UpdateStudent>({
  fullName: '',
  nationalCode: '',
  phoneNumber: '',
  phoneNumberEmergency: '',
  address: '',
  diseaseRecords: '',
  underSupervisionDoctor: '',
  birthDate: '',
  age: '',
  beltIds: '',
})

// view data and updated data
watch(formData, (data) => {
  if (!data) {
    state.fullName = ''
    state.nationalCode = ''
    state.phoneNumber = ''
    state.phoneNumberEmergency = ''
    state.address = ''
    state.diseaseRecords = ''
    state.underSupervisionDoctor = ''
    state.birthDate = ''
    state.age = ''
    state.beltIds = ''
    return
  }
  state.fullName = data.fullName ?? ''
  state.nationalCode = data.nationalCode ?? ''
  state.phoneNumber = data.phoneNumber ?? ''
  state.phoneNumberEmergency = data.phoneNumberEmergency ?? ''
  state.address = data.address ?? ''
  state.diseaseRecords = data.diseaseRecords ?? ''
  state.underSupervisionDoctor = data.underSupervisionDoctor ?? ''
  state.birthDate = gregorianToDate(data.birthDate) ?? ''
  state.age = data.age.toString() ?? ''
  state.beltIds = data.currentBelt?.id?.toString() ?? ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    const payload = {
      ...event.data,
      age: Number(event.data.age),
      beltIds: [Number(event.data.beltIds)]
    }
    const result = await updateStudentService(userId.value, payload)
    if (result.statusCode === 200) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      emit('success')
      isShow.value = true
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false
  }
}

function getBeltClass(color: string) {
  const colorMap: Record<string, string> = {
    'سفید': 'belt-white',
    'خاکستری': 'belt-gray',
    'زرد': 'belt-yellow',
    'نارنجی': 'belt-orange',
    'سبز': 'belt-green',
    'آبی': 'belt-blue',
    'بنفش': 'belt-purple',
    'قهوه‌ای': 'belt-brown',
    'قرمز': 'belt-red',
    'قرمز/سیاه': 'belt-red-black',
    'قرمز/سفید': 'belt-red-white',
    'مشکی': 'belt-black',
    'صورتی': 'belt-pink',
    'طلایی': 'belt-gold',
    'نقره‌ای': 'belt-silver'
  }
  return colorMap[color]
}

function enableInputs(): void {
  isShow.value = false
}

function disableInputs(): void {
  isShow.value = true
}
</script>

<template>
  <UModal fullscreen v-model:open="localOpen" title="پروفایل هنرجو" description="اطلاعات کامل و تاریخچه هنرجو">
    <template #body>
      <div v-if="formData" class="flex flex-col gap-5 md:gap-10 h-full w-full">
        <div class="bg-muted p-4 rounded-xl w-full flex flex-col lg:items-center gap-5">
          <div class="flex items-center justify-between w-full">
            <div class="flex gap-3">
              <div class="bg-black rounded-full size-16 flex justify-center items-center text-white">
                {{ formData.fullName.slice(0, 1) }}
              </div>
              <div class="flex flex-col gap-2">
                <span class="font-medium text-xl">{{ formData.fullName }}</span>
                <div class="flex gap-3">
                  <UBadge color="info" variant="solid" :label="formData.currentBelt.color" class="font-medium" />
                  <UBadge color="neutral" variant="soft" :label="formData.sport.name" class="font-semibold w-fit" />
                  <UBadge
                    :color="formData.paymentStatus === 'CONFIRMED' ? 'success' : formData.paymentStatus === 'PENDING' ? 'warning' : 'error'"
                    :label="formData.paymentStatus === 'CONFIRMED' ? 'پرداخت شده' : formData.paymentStatus === 'PENDING' ? 'در انتظار' : 'پرداخت نشده'"
                    variant="soft" class="font-semibold w-fit" />
                </div>
              </div>
            </div>
            <div class="flex gap-3 max-md:hidden">
              <UButton v-if="isShow" @click="enableInputs" color="tertiary" variant="outline" size="lg" label="ویرایش"
                trailing-icon="material-symbols:edit-square-outline-rounded" />
              <UButton v-if="!isShow" @click="disableInputs" color="neutral" variant="outline" size="lg" label="انصراف"
                trailing-icon="material-symbols:close-rounded" />
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
            <div class="flex items-center gap-1">
              <UIcon name="iconoir:barcode" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">کدملی:</span>
              <span class="font-medium text-base mt-1">{{ formData.nationalCode }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ic:baseline-call" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">شماره تلفن:</span>
              <span class="font-medium text-base mt-1">{{ formData.phoneNumber }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ic:baseline-call" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">شماره تلفن اضطرای:</span>
              <span class="font-medium text-base mt-1">{{ formData.phoneNumberEmergency }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">عضویت:</span>
              <span class="font-medium text-base mt-1">{{ useJDate(formData.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">تاریخ تولد:</span>
              <span class="font-medium text-base mt-1">{{ gregorianToJalali(formData.birthDate) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ic:round-person" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">سن:</span>
              <span class="font-medium text-base mt-1">{{ formData.age }}</span>
            </div>
          </div>
          <div class="flex gap-3 min-md:hidden">
            <UButton v-if="isShow" @click="enableInputs" color="tertiary" variant="outline" size="lg" label="ویرایش"
              trailing-icon="material-symbols:edit-square-outline-rounded" />
            <UButton v-if="!isShow" @click="disableInputs" color="neutral" variant="outline" size="lg" label="انصراف"
              trailing-icon="material-symbols:close-rounded" />
          </div>
        </div>
        <div class="bg-muted p-4 rounded-xl w-full flex items-center gap-5">
          <LazyBaseTabs :items="items" color="tertiary">
            <template #editData>
              <div class="w-full h-full bg-white rounded-lg p-4">
                <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
                  <div class="flex flex-col gap-5 w-full">
                    <USeparator label="اطلاعات شخصی" />
                    <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                      <BaseFormInput v-model="state.fullName" label="نام و نام خانوادگی" name="fullName" type="text"
                        placeholder="نام کامل هنرجو" :required="false" class="w-full" :disable="isShow" />
                      <BaseFormInput v-model="state.nationalCode" label="کد ملی" name="nationalCode" type="text"
                        placeholder="کد ملی هنرجو" :required="false" class="w-full" :disable="isShow" />
                    </div>
                    <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                      <BaseVueDatePicker :required="false" v-model="state.birthDate" label="تاریخ تولد" name="birthDate"
                        :disable="isShow" class="w-full" />
                      <BaseFormInput v-model="state.age" label="سن" name="age" type="text" placeholder="سن هنرجو"
                        :required="false" class="w-full" :disable="isShow" />
                    </div>
                    <USeparator label="اطلاعات تماس" />
                    <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                      <BaseFormInput v-model="state.phoneNumber" label="شماره تلفن" name="phoneNumber" type="text"
                        placeholder="شماره تلفن هنرجو" :required="false" class="w-full" :disable="isShow" />
                      <BaseFormInput v-model="state.phoneNumberEmergency" label="شماره تلفن اضطراری"
                        name="phoneNumberEmergency" type="text" placeholder="شماره تلفن اضطراری هنرجو" :required="false"
                        class="w-full" :disable="isShow" />
                    </div>
                    <div class="w-full">
                      <BaseFormTextArea v-model="state.address" label="آدرس محل سکونت" name="address" :required="false"
                        class="w-full" :disable="isShow" />
                    </div>
                    <USeparator label="اطلاعات پزشکی" />
                    <div class="flex flex-col gap-4 w-full">
                      <BaseFormCheckBox :required="false" v-model="state.underSupervisionDoctor"
                        name="underSupervisionDoctor" label="آیا تحت نظر پزشک هستید؟" :disable="isShow" />
                      <BaseFormCheckBox :required="false" v-model="state.diseaseRecords" name="diseaseRecords"
                        label="سوابق بیماری یا آسیب‌دیدگی؟" :disable="isShow" />
                    </div>
                    <USeparator />
                    <div class="w-full">
                      <BaseFormSelect :required="false" v-model="state.beltIds" :items="itemsSelect"
                        name="beltIds" label="انتخاب کمربند" :disable="isShow" />
                    </div>
                    <div class="flex justify-end gap-2 pt-4">
                      <UButton v-if="!isShow" :loading="isLoading" label="اعمال تغییرات" color="primary" type="submit"
                        class="disabled:blur-[1px]" />
                    </div>
                  </div>
                </UForm>
              </div>
            </template>
            <template #dateBelt>
              <div class="flex flex-col gap-6 p-4 bg-white rounded-lg w-full h-full">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <UIcon name="solar:medal-ribbon-bold" class="size-6 text-black/70" />
                    <span class="font-medium text-2xl">تاریخچه ارتقاهای کمربند</span>
                  </div>
                  <p class="break-words font-medium text-base">روند پیشرفت و ارتقاهای هنرجو</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                  <!-- <div class="flex items-center gap-4 bg-muted p-5 rounded-xl">
                    <span class="belt-white text-lg">سفید</span>
                    <div class="flex flex-col gap-1">
                      <span class="font-semibold text-lg">کمربند سفید</span>
                      <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70"/>
                        1404/02/20
                      </span>
                    </div>
                  </div> -->
                  <div class="flex items-center gap-4 bg-muted p-5 rounded-xl" v-for="data in formData.achievedBelts"
                    :key="data?.id">
                    <span class="text-lg" :class="[getBeltClass(data?.color)]">{{ data?.color }}</span>
                    <div class="flex flex-col gap-1">
                      <span class="font-semibold text-lg">کمربند {{ data?.color }}</span>
                      <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70" />
                        <!-- {{ data?.createAt || new Date().getFullYear() }} -->
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template #paymentStatus>
              <div class="flex flex-col gap-6 w-full h-full">
                <div class="bg-white flex flex-col gap-5 rounded-lg p-4 w-full">
                  <div class="flex items-center gap-2">
                    <UIcon name="solar:dollar-bold" class="size-6 text-black/70" />
                    <span class="text-xl font-medium break-words">وضعیت فعلی شهریه</span>
                  </div>
                  <div class="flex max-lg:flex-col items-center justify-between gap-10 w-full">
                    <div
                      class="flex flex-col items-center justify-evenly gap-1 w-full h-[10rem] p-3 bg-white shadow-lg rounded-lg">
                      <div class="bg-muted rounded-full size-12 flex justify-center items-center">
                        <UIcon name="clarity:success-standard-line" class="size-6 text-success" />
                      </div>
                      <span class="text-xl font-medium">پرداخت شده</span>
                      <span class="text-sm">وضعیت فعلی</span>
                    </div>
                    <div
                      class="flex flex-col items-center justify-evenly gap-1 w-full h-[10rem] p-3 bg-white shadow-lg rounded-lg">
                      <div class="bg-muted rounded-full size-12 flex justify-center items-center">
                        <UIcon name="fluent:payment-32-filled" class="size-6 text-black" />
                      </div>
                      <span class="text-xl font-medium">۲,۵۰۰,۰۰۰</span>
                      <span class="text-sm">شهریه ماهانه (تومان)</span>
                    </div>
                    <div
                      class="flex flex-col items-center justify-evenly gap-1 w-full h-[10rem] p-3 bg-white shadow-lg rounded-lg">
                      <div class="bg-muted rounded-full size-12 flex justify-center items-center">
                        <UIcon name="material-symbols:calendar-today-rounded" class="size-6 text-teal-300" />
                      </div>
                      <span class="text-xl font-medium">۱۴۰۳/۰۷/۰۱</span>
                      <span class="text-sm">سررسید بعدی</span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full bg-white rounded-lg p-4">
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success" />
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - کارت
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary" />
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success" />
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - نقد
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary" />
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success" />
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - کارت
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary" />
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success" />
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - نقد
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary" />
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success" />
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - کارت
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary" />
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success" />
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - نقد
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </LazyBaseTabs>
        </div>
      </div>
    </template>
  </UModal>
</template>