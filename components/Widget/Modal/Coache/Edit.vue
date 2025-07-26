<script setup lang="ts">
import * as v from 'valibot'
import type {FormSubmitEvent} from "@nuxt/ui"
import type {TabsItem} from '@nuxt/ui'

const emit = defineEmits(['update:open']);
const isShow: Ref<boolean> = ref(true)
const name = ref(['علی'])
const itemsSelect = ref(['کارته', 'بوکس', 'کیک بوکس', 'جودو', 'کشتی', 'کنگفو', 'تکواندو', 'موی تای', 'ام‌ام‌ای'])

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

function enableInputs(): void {
  isShow.value = false
}

function disableInputs(): void {
  isShow.value = true
}

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

const state = reactive({
  fullName: 'محسن حیایی',
  address: 'گلبهار میدان پرند خیابان قدیر قدیر 10',
  phoneNumber: '09123456789',
  nationalCode: '09123456789',
  history: '8 سال',
  certificates: 'مدرک دان 4 فدراسیون کاراته',
  selectSport: 'کارته',
  image: undefined as File | undefined
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UModal fullscreen v-model:open="localOpen" title="پروفایل مربی" description="اطلاعات کامل و تاریخچه مربی">
    <template #body>
      <div class="flex flex-col gap-5 md:gap-10 h-full w-full">
        <div class="bg-muted p-4 md:p-6 rounded-xl w-full flex flex-col lg:items-center gap-5">
          <div class="flex items-center justify-between w-full">
            <div class="flex gap-3">
              <div class="bg-black rounded-full size-16 flex justify-center items-center text-white">
                {{ name[0].slice(0, 2) }}
              </div>
              <div class="flex flex-col gap-2">
                <span class="font-medium text-xl">علی احمدی</span>
                <div class="flex flex-wrap gap-2 sm:gap-3">
                  <UBadge color="secondary" variant="solid" label="مربی" class="font-medium"/>
                  <UBadge color="neutral" variant="soft" label="کیک بوکسینگ" class="font-semibold"/>
                  <UBadge color="primary" variant="soft" label="فعال" class="font-semibold"/>
                  <UBadge color="success" variant="soft" label="پرداخت شده" class="font-semibold"/>
                </div>
              </div>
            </div>
            <div class="flex gap-3 max-md:hidden">
              <UButton v-if="!isShow" color="success" variant="subtle" size="lg" label="ذخیره"
                       trailing-icon="ic:baseline-save"/>
              <UButton v-if="isShow" @click="enableInputs" color="tertiary" variant="outline" size="lg" label="ویرایش"
                       trailing-icon="material-symbols:edit-square-outline-rounded"/>
              <UButton v-if="!isShow" @click="disableInputs" color="neutral" variant="outline" size="lg" label="انصراف"
                       trailing-icon="material-symbols:close-rounded"/>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
            <div class="flex items-center gap-1">
              <UIcon name="ic:baseline-call" class="size-6 text-black"/>
              <span class="font-medium text-base mt-1">شماره تلفن:</span>
              <span class="font-medium text-base mt-1">09012345678</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="iconoir:barcode" class="size-6 text-black"/>
              <span class="font-medium text-base mt-1">کدملی:</span>
              <span class="font-medium text-base mt-1">0921912348</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black"/>
              <span class="font-medium text-base mt-1">عضویت:</span>
              <span class="font-medium text-base mt-1">1403/02/15</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="hugeicons:students" class="size-6 text-black"/>
              <span class="font-medium text-base mt-1">هنرجو:</span>
              <span class="font-medium text-base mt-1">52</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ion:university" class="size-6 text-black"/>
              <span class="font-medium text-base mt-1">سابقه:</span>
              <span class="font-medium text-base mt-1">8 سال</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="solar:medal-ribbons-star-bold" class="size-6 text-black"/>
              <span class="font-medium text-base mt-1">تخصص:</span>
              <span class="font-medium text-base mt-1">کاراته</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="bxs:certification" class="size-6 text-black"/>
              <span class="font-medium text-base mt-1">مدرک و گواهینامه ها:</span>
              <span class="font-medium text-base mt-1">مدرک کارته دان 4</span>
            </div>
          </div>
          <div class="flex gap-3 min-md:hidden">
            <UButton v-if="!isShow" color="success" variant="subtle" size="lg" label="ذخیره"
                     trailing-icon="ic:baseline-save"/>
            <UButton v-if="isShow" @click="enableInputs" color="tertiary" variant="outline" size="lg" label="ویرایش"
                     trailing-icon="material-symbols:edit-square-outline-rounded"/>
            <UButton v-if="!isShow" @click="disableInputs" color="neutral" variant="outline" size="lg" label="انصراف"
                     trailing-icon="material-symbols:close-rounded"/>
          </div>
        </div>
        <div class="bg-muted p-4 md:p-6 rounded-xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:items-center gap-5">
          <div class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-turquoise-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-6 text-turquoise-500"/>
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">۸ سال</span>
              <span class="font-medium">سابقه تدریس</span>
            </div>
          </div>
          <div class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-orange-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="mdi:medal-outline" class="size-6 text-orange-400"/>
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">۱۲</span>
              <span class="font-medium">ارتقای کمربند</span>
            </div>
          </div>
          <div class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-turquoise-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="mdi:chart-timeline-variant" class="size-6 text-turquoise-500"/>
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">۸۷%</span>
              <span class="font-medium">میانگین حضور کلاس</span>
            </div>
          </div>
          <div class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-info-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="ph:users-three-bold" class="size-6 text-info-500"/>
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">25</span>
              <span class="font-medium">هنرجو</span>
            </div>
          </div>
        </div>
        <div class="bg-muted p-4 md:p-6 rounded-xl w-full flex items-center gap-5">
          <LazyBaseTabs :items="items" color="tertiary">
            <template #editData>
              <div class="w-full h-full bg-white rounded-lg p-4">
                <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
                  <div class="flex flex-col gap-5 w-full">
                    <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.fullName" label="نام و نام خانوادگی" name="fullName" type="text" placeholder="نام کامل مربی" class="w-full"/>
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.nationalCode" label="کد ملی" name="nationalCode" type="text" placeholder="کد ملی مربی" class="w-full"/>
                    </div>
                    <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.phoneNumber" label="شماره تلفن" name="phoneNumber" type="text" placeholder="شماره تلفن مربی" class="w-full"/>
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.history" label="سابقه تدریس" name="history" type="text" placeholder="سابقه تدریس مربی" class="w-full"/>
                    </div>
                    <div class="w-full pt-1">
                      <BaseFormInput :required="false" :disable="isShow" v-model="state.certificates" label="مدرک و گواهینامه ها" name="certificates" type="text" placeholder="مدرک و گواهینامه ها مربیگری" class="w-full"/>
                    </div>
                    <div class="w-full pt-1">
                      <BaseFormTextArea :required="false" :disable="isShow" v-model="state.address" label="آدرس محل باشگاه" name="address" class="w-full"/>
                    </div>
                    <div class="w-full pt-1">
                      <BaseFormSelect :required="false" :disable="isShow" v-model="state.selectSport" :items="itemsSelect" name="selectSport" label="انتخاب رشته ورزشی"/>
                    </div>
                    <div class="w-full pt-1">
                      <BaseFormUploadFile :required="false" :disable="isShow" v-model="state.image" label="ارسال عکس گواهینامه" name="image" description="اپلود عکس با فرمت (jepg, png, webp, jpg) و حداکثر تا 2MB" class="w-full"/>
                    </div>
                    <div class="flex justify-end gap-2 pt-4">
                      <UButton :disabled="isShow" label="اعمال تغییرات" color="primary" type="submit" class="disabled:blur-[1px]"/>
                    </div>
                  </div>
                </UForm>
              </div>
            </template>
            <template #student>
              <div class="flex flex-col gap-6 p-4 bg-white rounded-lg w-full h-full">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <UIcon name="ph:users-three-bold" class="size-6 text-black/70"/>
                    <span class="font-medium text-lg md:text-2xl">هنرجویان تحت نظر (4 نفر)</span>
                  </div>
                  <p class="break-words font-medium text-sm md:text-base">لیست هنرجویانی که تحت نظر این مربی هستند</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
                  <div class="w-full rounded-lg bg-muted p-4">
                    <div class="flex flex-col items-center gap-3 w-full">
                      <div class="rounded-full bg-white size-14 flex items-center justify-center text-lg font-bold">
                        {{ name[0].slice(0, 1) }}
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
                        <UBadge color="success" label="پرداخت شده"/>
                      </div>
                    </div>
                  </div>
                  <div class="w-full rounded-lg bg-muted p-4">
                    <div class="flex flex-col items-center gap-3 w-full">
                      <div class="rounded-full bg-white size-14 flex items-center justify-center text-lg font-bold">
                        {{ name[0].slice(0, 1) }}
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
                        <UBadge color="success" label="پرداخت شده"/>
                      </div>
                    </div>
                  </div>
                  <div class="w-full rounded-lg bg-muted p-4">
                    <div class="flex flex-col items-center gap-3 w-full">
                      <div class="rounded-full bg-white size-14 flex items-center justify-center text-lg font-bold">
                        {{ name[0].slice(0, 1) }}
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
                        <UBadge color="success" label="پرداخت شده"/>
                      </div>
                    </div>
                  </div>
                  <div class="w-full rounded-lg bg-muted p-4">
                    <div class="flex flex-col items-center gap-3 w-full">
                      <div class="rounded-full bg-white size-14 flex items-center justify-center text-lg font-bold">
                        {{ name[0].slice(0, 1) }}
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
                        <UBadge color="success" label="پرداخت شده"/>
                      </div>
                    </div>
                  </div>
                  <div class="w-full rounded-lg bg-muted p-4">
                    <div class="flex flex-col items-center gap-3 w-full">
                      <div class="rounded-full bg-white size-14 flex items-center justify-center text-lg font-bold">
                        {{ name[0].slice(0, 1) }}
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
                        <UBadge color="success" label="پرداخت شده"/>
                      </div>
                    </div>
                  </div>
                  <div class="w-full rounded-lg bg-muted p-4">
                    <div class="flex flex-col items-center gap-3 w-full">
                      <div class="rounded-full bg-white size-14 flex items-center justify-center text-lg font-bold">
                        {{ name[0].slice(0, 1) }}
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
                        <UBadge color="success" label="پرداخت شده"/>
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
                    <UIcon name="solar:dollar-bold" class="size-6 text-black/70"/>
                    <span class="text-xl font-medium break-words">وضعیت فعلی شهریه</span>
                  </div>
                  <div class="bg-muted flex max-lg:flex-col items-center justify-between gap-10 rounded-md w-full p-4">
                    <div
                        class="flex flex-col items-center justify-evenly gap-1 w-full h-[10rem] p-3 bg-white rounded-lg">
                      <div class="bg-muted rounded-full size-12 flex justify-center items-center">
                        <UIcon name="clarity:success-standard-line" class="size-6 text-success"/>
                      </div>
                      <span class="text-xl font-medium">پرداخت شده</span>
                      <span class="text-sm">وضعیت فعلی</span>
                    </div>
                    <div
                        class="flex flex-col items-center justify-evenly gap-1 w-full h-[10rem] p-3 bg-white rounded-lg">
                      <div class="bg-muted rounded-full size-12 flex justify-center items-center">
                        <UIcon name="fluent:payment-32-filled" class="size-6 text-black"/>
                      </div>
                      <span class="text-xl font-medium">۲,۵۰۰,۰۰۰</span>
                      <span class="text-sm">شهریه ماهانه (تومان)</span>
                    </div>
                    <div
                        class="flex flex-col items-center justify-evenly gap-1 w-full h-[10rem] p-3 bg-white rounded-lg">
                      <div class="bg-muted rounded-full size-12 flex justify-center items-center">
                        <UIcon name="material-symbols:calendar-today-rounded" class="size-6 text-teal-300"/>
                      </div>
                      <span class="text-xl font-medium">۱۴۰۳/۰۷/۰۱</span>
                      <span class="text-sm">سررسید بعدی</span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full bg-white rounded-lg p-4">
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success"/>
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - کارت
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary"/>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success"/>
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - نقد
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary"/>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success"/>
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - کارت
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary"/>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success"/>
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - نقد
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary"/>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success"/>
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - کارت
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary"/>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-muted p-3 rounded-xl">
                    <div class="flex justify-center items-center">
                      <UIcon name="clarity:success-standard-line" class="size-6 text-success"/>
                    </div>
                    <div class="w-full flex justify-between items-center">
                      <div class="flex flex-col gap-1">
                        <span class="font-semibold text-lg">۲,۵۰۰,۰۰۰ تومان</span>
                        <span class="font-medium text-sm flex items-center gap-1">
                          ۱۴۰۳/۰۶/۰۱ - نقد
                        </span>
                      </div>
                      <UBadge label="پراخت شده" color="primary"/>
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