<template>
  <section v-if="data?.data" class="container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-5">
    <div class="bg-white p-4 md:p-6 rounded-xl w-full flex flex-col lg:items-center gap-5">
      <div class="flex items-center justify-between w-full">
        <div class="flex gap-3">
          <div class="bg-black rounded-full size-16 flex justify-center items-center text-white">
            {{ data.data.fullName.slice(0, 1) }}
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-medium text-xl">{{ data.data.fullName }}</span>
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <UBadge v-if="data.data.type === 1" color="secondary" variant="solid" label="استاد" class="font-medium" />
              <UBadge :color="data.data.active === 'ENABLE' ? 'primary' : 'error'" variant="soft"
                :label="data.data.active === 'ENABLE' ? 'فعال' : 'غیر فعال'" class="font-semibold" />
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
          <span class="font-medium text-base mt-1">{{ data.data.phoneNumber }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="iconoir:barcode" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">کدملی:</span>
          <span class="font-medium text-base mt-1">{{ data.data.nationalCode }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">عضویت:</span>
          <span class="font-medium text-base mt-1">{{ useJDate(data.data.createdAt) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="hugeicons:students" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">هنرجو:</span>
          <span class="font-medium text-base mt-1">{{ data.data.students.length }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="ion:university" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">سابقه:</span>
          <span class="font-medium text-base mt-1">
            {{ data.data.history ? `سال ${data.data.history}` : 'وجود ندارد' }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="solar:medal-ribbons-star-bold" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">تخصص:</span>
          <span class="font-medium text-base mt-1">{{ data.data.sport.name }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="bxs:certification" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">مدرک و گواهینامه ها:</span>
          <span class="font-medium text-base mt-1">{{ data.data.certificates ?? 'وجود ندارد' }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="solar:planet-2-bold" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">پلن انتخاب شده:</span>
          <span class="font-medium text-base mt-1">{{ data.data.masterPlan.name ?? 'پلن وجود ندارد' }}</span>
        </div>
      </div>
      <div class="flex gap-3 min-md:hidden">
        <UButton v-if="isShow" @click="enableInputs" color="tertiary" variant="outline" size="lg" label="ویرایش"
          trailing-icon="material-symbols:edit-square-outline-rounded" />
        <UButton v-if="!isShow" @click="disableInputs" color="neutral" variant="outline" size="lg" label="انصراف"
          trailing-icon="material-symbols:close-rounded" />
      </div>
    </div>
    <LazyBaseTabs :items="items" color="tertiary">
      <template #editData>
        <div class="w-full h-full bg-white rounded-lg p-4">
          <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
            <div class="flex flex-col gap-5 w-full">
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput :required="false" :disable="isShow" v-model="state.fullName" label="نام و نام خانوادگی"
                  name="fullName" type="text" placeholder="نام کامل" class="w-full" />
                <BaseFormInput :required="false" :disable="true" v-model="state.nationalCode" label="کد ملی"
                  name="nationalCode" type="text" placeholder="کد ملی" class="w-full" />
              </div>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput :required="false" :disable="true" v-model="state.phoneNumber" label="شماره تلفن"
                  name="phoneNumber" type="text" placeholder="شماره تلفن" class="w-full" />
                <BaseFormInput :required="false" :disable="isShow" v-model="state.history" label="سابقه تدریس"
                  name="history" type="text" placeholder="سابقه تدریس" class="w-full" />
              </div>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput :required="false" :disable="isShow" v-model="state.age" label="سن" name="age" type="text"
                  placeholder="سن" class="w-full" />
                <BaseFormInput :required="false" :disable="isShow" v-model="state.birthDate" label="تاریخ تولد"
                  name="birthDate" type="text" placeholder="مثال تاریخ 1350/01/01" class="w-full" />
              </div>
              <div class="w-full pt-1">
                <BaseFormInput :required="false" :disable="isShow" v-model="state.certificates"
                  label="مدرک و گواهینامه ها" name="certificates" type="text"
                  placeholder="مدرک و گواهینامه ها مربیگری خلاصه" class="w-full" />
              </div>
              <div class="w-full flex flex-col justify-center items-center pt-1">
                <ClientOnly>
                  <BaseFormUploadFile :required="false" :disable="isShow" v-model="state.imageFile"
                    label="ارسال عکس گواهینامه" name="image"
                    description="اپلود عکس با فرمت (jepg, png, webp, jpg) و حداکثر تا MB 1" class="w-full" />
                </ClientOnly>
                <img v-if="state.imageUrl" class="object-cover md:w-2/3 pt-10" :src="state.imageUrl"
                  :alt="state.fullName" draggable="false" loading="lazy">
              </div>
              <div class="flex justify-end gap-2 pt-4">
                <UButton v-if="!isShow" :loading="isLoading" label="اعمال تغییرات" color="primary" type="submit"
                  class="disabled:blur-[1px]" />
              </div>
            </div>
          </UForm>
        </div>
      </template>
      <template #paymentStatus>
        <div v-if="formData.length" class="flex flex-col gap-6 w-full h-full">
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
        <div v-else class="bg-white rounded-lg p-4 w-full h-72 flex justify-center items-center">
          <span class="text-black text-xl md:text-2xl font-bold">تاریخچه مالی وجود ندارد</span>
        </div>
      </template>
    </LazyBaseTabs>
  </section>
</template>
<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent, TabsItem } from "@nuxt/ui"
import { getHistorySubscriptionsMasterService, getMasterByIdService, updateProfileMasterService } from '~/services/master.service'
import type { UpdateMasterData } from '~/models/users/master/UpdateMasterData'

const isShow: Ref<boolean> = ref(true)
const isLoading: Ref<boolean> = ref(false)
const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/
const router = useRouter();
const toastStore = useToastStore()
const formData: Ref<any[]> = ref([])

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
  history: v.pipe(
    v.string(),
    v.trim(),
  ),
  age: v.pipe(
    v.string(),
    v.trim(),
  ),
  birthDate: v.pipe(
    v.string(),
    v.trim(),
    v.custom((value) => dateRegex.test(value), 'فرمت تاریخ باید 1380/01/30 باشد')
  ),
  certificates: v.pipe(
    v.string(),
    v.trim(),
  ),
  imageFile: v.optional(
    v.pipe(
      v.file(),
      v.mimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'لطف عکس را با این فرمت ها اپلود کنید. (jpeg, png, jpg, webp)'),
      v.maxSize(1024 * 1024 * 1, 'عکس باید زیر 1 مگابایت باشد.')
    )
  )
})

const items = [
  {
    label: 'ویرایش اطلاعات',
    slot: 'editData' as const
  },
  {
    label: 'تاریخچه مالی',
    slot: 'paymentStatus' as const
  }
] satisfies TabsItem[]

type Schema = v.InferOutput<typeof schema>;

const { data } = await useAsyncData('current-master-profile', () => getMasterByIdService());
console.log(data.value?.data);
if (!data.value || !data.value.data) {
  if (import.meta.client) {
    toastStore.setAlert(data.value?.message, '', 'error', 'bx:bxs-error')
    router.push('/dashboard')
  } else {
    throw createError({
      statusCode: 404,
      statusMessage: 'پروفایل پیدا نشده لطف دوباره تلاش کنید'
    })
  }
}

const state = reactive<UpdateMasterData>({
  fullName: data.value?.data.fullName ?? '',
  phoneNumber: data.value?.data.phoneNumber ?? '',
  nationalCode: data.value?.data.nationalCode ?? '',
  age: String(data.value?.data.age ?? ''),
  birthDate: data.value?.data.birthDate ?? '',
  history: data.value?.data.history ?? '',
  certificates: data.value?.data.certificates ?? '',
  imageUrl: data.value?.data.image ?? undefined,
  imageFile: undefined
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    const result = await updateProfileMasterService(event.data)
    if (result.statusCode === 200) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      refreshNuxtData()
      isShow.value = true
    }
  } catch (error: any) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

async function getHistoryPaymentMaster() {
  try {
    const result = await getHistorySubscriptionsMasterService()
    if (result.statusCode === 200) {
      console.log(result.data);
      formData.value = Array.isArray(result.data) ? result.data : []
    }
  } catch (error: any) {
    console.log(error.massage || error);
  }
}

function enableInputs(): void {
  isShow.value = false
}

function disableInputs(): void {
  isShow.value = true
}

onMounted(()=>{
  nextTick(()=> getHistoryPaymentMaster())
})
</script>