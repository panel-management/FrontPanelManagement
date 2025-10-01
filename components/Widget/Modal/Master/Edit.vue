<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from "@nuxt/ui"
import type { TabsItem } from '@nuxt/ui'
import { getMasterByIdForAdminService, updateProfileMasterJustAdminService } from '~/services/master.service';
import type { MasterData } from '~/models/users/master/MasterData';
import type { UpdateMasterData } from '~/models/users/master/UpdateMasterData';
import { getAllSportService } from '~/services/sportBelt.service';
import type { Sport } from '~/models/sportAndBelt/sport';

const emit = defineEmits(['update:open']);
const isShow: Ref<boolean> = ref(true)
const isLoading: Ref<boolean> = ref(false)
const modalSore = useModalStore()
const toastStore = useToastStore()
const formData = ref<MasterData | null>(null)
const sportItems = ref<Sport[]>([])
const itemsSelect = ref<{ label: string; value: string }[]>([])
const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/

const userId = computed(() => modalSore.modals.masterEdit)

const props = defineProps({
  open: {
    type: [Number, String, null],
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
    label: 'هنرجویان',
    slot: 'student' as const
  },
  {
    label: 'وضعیت مالی',
    slot: 'paymentStatus' as const
  }
] satisfies TabsItem[]

async function loadMaster() {
  if (!userId.value) {
    formData.value = null
    return
  }
  try {
    const res = await getMasterByIdForAdminService(userId.value)
    formData.value = res.data as MasterData
  } catch (err: any) {
    console.error('Error loadMaster:', err)
    formData.value = null
  }
}

async function loadSports() {
  try {
    const res = await getAllSportService()
    if (res.statusCode === 200) {
      sportItems.value = Array.isArray(res.data) ? res.data : []
      itemsSelect.value = mapToSelectOptions(sportItems.value)
    }
  } catch (err: any) {
    console.error('Error loadSports:', err)
  }
}

function mapToSelectOptions(sports: Sport[]) {
  return sports.map(s => ({
    label: s.name,
    value: String(s.id),
  }))
}

onMounted(() => {
  loadSports()
  if (userId.value) {
    nextTick(loadMaster)
  }
})

// open modal just yourself master id
watch(userId, (id) => {
  if (id) {
    loadMaster()
  } else {
    formData.value = null
  }
})

// schema valibot
const schema = v.object({
  fullName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('نام و نام خانوادگی الزامی است.')
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
  history: v.pipe(v.string(), v.trim()),
  age: v.pipe(v.string(), v.trim()),
  birthDate: v.pipe(
    v.string(),
    v.trim(),
    v.custom((value) => dateRegex.test(value), 'فرمت تاریخ باید 1380/01/30 باشد')
  ),
  certificates: v.pipe(v.string(), v.trim()),
  sport: v.pipe(v.string(), v.trim()),
  imageFile: v.optional(
    v.pipe(
      v.file(),
      v.mimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
        'لطف عکس را با این فرمت‌ها اپلود کنید.'),
      v.maxSize(1024 * 1024, 'عکس باید زیر 1 مگابایت باشد.')
    )
  ),
})

type Schema = v.InferOutput<typeof schema>

// state form data
const state = reactive<UpdateMasterData>({
  fullName: '',
  phoneNumber: '',
  nationalCode: '',
  age: '',
  birthDate: '',
  history: '',
  certificates: '',
  sport: '',
  sportId: undefined,
  imageUrl: undefined,
  imageFile: undefined,
})

// view data and updated data
watch(formData, (data) => {
  if (!data) {
    state.fullName = ''
    state.phoneNumber = ''
    state.nationalCode = ''
    state.age = ''
    state.birthDate = ''
    state.history = ''
    state.certificates = ''
    state.sport = ''
    state.imageUrl = undefined
    state.imageFile = undefined
    state.sportId = undefined
    return
  }
  state.fullName = data.fullName ?? ''
  state.phoneNumber = data.phoneNumber ?? ''
  state.nationalCode = data.nationalCode ?? ''
  state.age = data.age?.toString() ?? ''
  state.birthDate = data.birthDate ?? ''
  state.history = data.history ?? ''
  state.certificates = data.certificates ?? ''
  state.sport = data.sport?.id?.toString() ?? ''
  state.imageUrl = data.image ?? ''
})

// covert sport to sportId from submit data
function prepareUpdateData(formValues: any) {
  const upd: any = { ...formValues }
  if (upd.sport && !isNaN(Number(upd.sport))) {
    upd.sportId = Number(upd.sport)
  } else {
    delete upd.sportId
  }
  return upd
}

// updated data master
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    const updateData = prepareUpdateData(event.data)
    const res = await updateProfileMasterJustAdminService(userId.value, updateData)
    if (res.statusCode === 200) {
      toastStore.setAlert(res.message, '', 'success', 'ep:success-filled')
      await loadMaster()
      refreshNuxtData()
      isShow.value = true
    }
  } catch (err: any) {
    console.error('onSubmit error:', err)
  } finally {
    isLoading.value = false
  }
}

function enableInputs() {
  isShow.value = false
}

function disableInputs() {
  isShow.value = true
}
</script>

<template>
  <UModal fullscreen v-model:open="localOpen" title="پروفایل استاد" description="اطلاعات کامل و تاریخچه استاد">
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
                <div class="flex gap-2 sm:gap-3">
                  <div class="flex max-sm:flex-col gap-2 sm:gap-3">
                    <UBadge v-if="formData.type === 1" color="secondary" variant="solid" label="استاد"
                      class="font-medium" />
                    <UBadge color="neutral" variant="soft" :label="formData.sport.name" class="font-semibold w-fit" />
                  </div>
                  <div class="flex max-sm:flex-col gap-2 sm:gap-3">
                    <UBadge :color="formData.active === 'ENABLE' ? 'primary' : 'error'" variant="soft"
                      :label="formData.active === 'ENABLE' ? 'فعال' : 'غیر فعال'" class="font-semibold" />
                    <UBadge
                      :color="formData.paymentStatus === 'CONFIRMED' ? 'success' : formData.paymentStatus === 'PENDING' ? 'warning' : 'error'"
                      :label="formData.paymentStatus === 'CONFIRMED' ? 'پرداخت شده' : formData.paymentStatus === 'PENDING' ? 'در انتظار' : 'پرداخت نشده'"
                      variant="soft" class="font-semibold w-fit" />
                  </div>
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
              <UIcon name="ic:baseline-call" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">شماره تلفن:</span>
              <span class="font-medium text-base mt-1">{{ formData.phoneNumber }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="iconoir:barcode" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">کدملی:</span>
              <span class="font-medium text-base mt-1">{{ formData.nationalCode }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">عضویت:</span>
              <span class="font-medium text-base mt-1">{{ useJDate(formData.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="hugeicons:students" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">هنرجو:</span>
              <span class="font-medium text-base mt-1">{{ formData.students.length }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ion:university" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">سابقه:</span>
              <span class="font-medium text-base mt-1">{{ formData.history ? `${formData.history} سال ` : 'وجود ندارد'}}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="solar:medal-ribbons-star-bold" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">تخصص:</span>
              <span class="font-medium text-base mt-1">{{ formData.sport.name }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="bxs:certification" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">مدرک و گواهینامه ها:</span>
              <span class="font-medium text-base mt-1">{{ formData.certificates ?? 'وجود ندارد' }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="solar:planet-2-bold" class="size-6 text-black" />
              <span class="font-medium text-base mt-1">پلن انتخاب شده:</span>
              <span class="font-medium text-base mt-1">{{ formData.masterPlanId ?? 'پلن وجود ندارد' }}</span>
            </div>
          </div>
          <div class="flex gap-3 min-md:hidden">
            <UButton v-if="isShow" @click="enableInputs" color="tertiary" variant="outline" size="lg" label="ویرایش"
              trailing-icon="material-symbols:edit-square-outline-rounded" />
            <UButton v-if="!isShow" @click="disableInputs" color="neutral" variant="outline" size="lg" label="انصراف"
              trailing-icon="material-symbols:close-rounded" />
          </div>
        </div>
        <div class="bg-muted p-4 rounded-xl w-full grid grid-cols-1 md:grid-cols-2 lg:items-center gap-5">
          <div
            class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-turquoise-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-6 text-turquoise-500" />
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">{{ formData.history }} سال</span>
              <span class="font-medium">سابقه تدریس</span>
            </div>
          </div>
          <div
            class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-info-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="ph:users-three-bold" class="size-6 text-info-500" />
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">{{ formData.students.length }}</span>
              <span class="font-medium">هنرجو</span>
            </div>
          </div>
        </div>
        <div class="bg-muted p-4 rounded-xl w-full flex items-center gap-5">
          <LazyBaseTabs :items="items" color="tertiary">
            <template #editData>
              <div class="w-full h-full bg-white rounded-lg p-4">
                <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
                  <div class="flex flex-col gap-5 w-full">
                    <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.fullName"
                        label="نام و نام خانوادگی" name="fullName" type="text" placeholder="نام کامل" class="w-full" />
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.nationalCode" label="کد ملی"
                        name="nationalCode" type="text" placeholder="کد ملی" class="w-full" />
                    </div>
                    <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.phoneNumber" label="شماره تلفن"
                        name="phoneNumber" type="text" placeholder="شماره تلفن" class="w-full" />
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.history" label="سابقه تدریس"
                        name="history" type="text" placeholder="سابقه تدریس" class="w-full" />
                    </div>
                    <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.age" label="سن" name="age"
                        type="text" placeholder="سن" class="w-full" />
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.birthDate" label="تاریخ تولد"
                        name="birthDate" type="text" placeholder="مثال تاریخ 1350/01/01" class="w-full" />
                    </div>
                    <div class="w-full">
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.certificates"
                        label="مدرک و گواهینامه ها" name="certificates" type="text"
                        placeholder="مدرک و گواهینامه ها مربیگری خلاصه" class="w-full" />
                    </div>
                    <div class="w-full">
                      <BaseFormSelect :required="false" :disable="isShow" v-model="state.sport" :items="itemsSelect"
                        name="sport" label="انتخاب رشته ورزشی" />
                    </div>
                    <div class="w-full flex flex-col justify-center items-center">
                      <ClientOnly>
                        <BaseFormUploadFile :required="false" :disable="isShow" v-model="state.imageFile"
                          label="ارسال عکس گواهینامه" name="image"
                          description="اپلود عکس با فرمت (jepg, png, webp, jpg) و حداکثر تا MB 1" class="w-full" />
                      </ClientOnly>
                      <img v-if="state.imageUrl" class="object-cover md:w-2/3 pt-10" :src="state.imageUrl" :alt="state.fullName"
                        draggable="false" loading="lazy">
                    </div>
                    <div class="flex justify-end gap-2 pt-4">
                      <UButton v-if="!isShow" :loading="isLoading" label="اعمال تغییرات" color="primary" type="submit"
                        class="disabled:blur-[1px]" />
                    </div>
                  </div>
                </UForm>
              </div>
            </template>
            <template #student>
              <div class="flex flex-col gap-6 p-4 bg-white rounded-lg w-full h-full">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <UIcon name="ph:users-three-bold" class="size-6 text-black/70" />
                    <span class="font-medium text-lg md:text-2xl">هنرجویان تحت نظر ({{ formData.students.length }} نفر)</span>
                  </div>
                  <p class="break-words font-medium text-sm md:text-base">لیست هنرجویانی که تحت نظر این مربی هستند</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
                  <div class="w-full rounded-lg bg-muted p-4">
                    <div class="flex flex-col items-center gap-3 w-full">
                      <div class="rounded-full bg-white size-14 flex items-center justify-center text-lg font-bold">
                        <!-- {{ name[0].slice(0, 1) }} -->
                      </div>
                      <div class="flex justify-between gap-4 w-full">
                        <span class="font-medium text-lg">علی احمدی</span>
                        <span class="belt-blue text-sm">کمربند ابی</span>
                      </div>
                      <div class="flex justify-between gap-4 w-full">
                        <span class="font-medium">حضور 85%</span>
                        <span class="font-medium">عضویت 1403/10/20</span>
                      </div>
                      <div class="flex justify-between items-center gap-4">
                        <UBadge color="success" label="پرداخت شده" />
                      </div>
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