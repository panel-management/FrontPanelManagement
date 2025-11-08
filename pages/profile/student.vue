<template>
  <section class="xl:container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-5 md:gap-10">
    <div class="bg-white p-4 rounded-xl w-full flex flex-col lg:items-center gap-5">
      <div class="flex items-center justify-between w-full">
        <div class="flex gap-3">
          <div class="bg-black rounded-full size-16 flex justify-center items-center text-white">
            {{ name[0].slice(0, 2) }}
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-medium text-xl">علی احمدی</span>
            <div class="flex gap-3">
              <UBadge color="info" variant="solid" label="کمربند ابی" class="font-medium"/>
              <UBadge color="neutral" variant="soft" label="کاراته" class="font-semibold"/>
            </div>
          </div>
        </div>
        <div class="flex gap-3 max-md:hidden">
          <UButton v-if="isShow" @click="enableInputs" color="tertiary" variant="outline" size="lg" label="ویرایش"
                   trailing-icon="material-symbols:edit-square-outline-rounded"/>
          <UButton v-if="!isShow" @click="disableInputs" color="neutral" variant="outline" size="lg" label="انصراف"
                   trailing-icon="material-symbols:close-rounded"/>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        <div class="flex items-center gap-1">
          <UIcon name="iconoir:barcode" class="size-6 text-black"/>
          <span class="font-medium text-base mt-1">کدملی:</span>
          <span class="font-medium text-base mt-1">0921912348</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="ic:baseline-call" class="size-6 text-black"/>
          <span class="font-medium text-base mt-1">شماره تلفن:</span>
          <span class="font-medium text-base mt-1">09012345678</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black"/>
          <span class="font-medium text-base mt-1">عضویت:</span>
          <span class="font-medium text-base mt-1">1403/02/15</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black"/>
          <span class="font-medium text-base mt-1">تاریخ تولد:</span>
          <span class="font-medium text-base mt-1">1386/10/05</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="ic:round-person" class="size-6 text-black"/>
          <span class="font-medium text-base mt-1">سن:</span>
          <span class="font-medium text-base mt-1">22</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="hugeicons:chart-line-data-01" class="size-6 text-black"/>
          <span class="font-medium text-base mt-1">حضور:</span>
          <span class="font-medium text-base mt-1">48%</span>
        </div>
      </div>
      <div class="flex gap-3 min-md:hidden">
        <UButton v-if="isShow" @click="enableInputs" color="tertiary" variant="outline" size="lg" label="ویرایش"
                 trailing-icon="material-symbols:edit-square-outline-rounded"/>
        <UButton v-if="!isShow" @click="disableInputs" color="neutral" variant="outline" size="lg" label="انصراف"
                 trailing-icon="material-symbols:close-rounded"/>
      </div>
    </div>
    <LazyBaseTabs :items="items" color="tertiary">
      <template #editData>
        <div class="w-full h-full bg-white rounded-lg p-4">
          <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
            <div class="flex flex-col gap-5 w-full">
              <USeparator label="اطلاعات شخصی"/>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput v-model="state.fullName" label="نام و نام خانوادگی" name="fullName" type="text"
                               placeholder="نام کامل هنرجو" :required="false" class="w-full" :disable="isShow"/>
                <BaseFormInput v-model="state.nationalCode" label="کد ملی" name="nationalCode" type="text"
                               placeholder="کد ملی هنرجو" :required="false" class="w-full" :disable="isShow"/>
              </div>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput v-model="state.date" label="تاریخ تولد" name="date" type="text"
                               placeholder="1380/10/20" :required="false" class="w-full" :disable="isShow"/>
                <BaseFormInput v-model="state.age" label="سن" name="age" type="text"
                               placeholder="سن هنرجو" :required="false" class="w-full" :disable="isShow"/>
              </div>
              <USeparator label="اطلاعات تماس"/>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput v-model="state.phoneNumber" label="شماره تلفن" name="phoneNumber" type="text"
                               placeholder="شماره تلفن هنرجو" :required="false" class="w-full" :disable="isShow"/>
                <BaseFormInput v-model="state.phoneNumberEmergency" label="شماره تلفن اضطراری"
                               name="phoneNumberEmergency" type="text" placeholder="شماره تلفن اضطراری هنرجو"
                               :required="false" class="w-full" :disable="isShow"/>
              </div>
              <div class="w-full pt-1">
                <BaseFormTextArea v-model="state.address" label="آدرس محل سکونت" name="address" :required="false"
                                  class="w-full" :disable="isShow"/>
              </div>
              <USeparator label="اطلاعات پزشکی"/>
              <div class="flex flex-col gap-4 w-full">
                <BaseFormCheckBox :required="false" v-model="state.underSupervisionDoctor"
                                  name="underSupervisionDoctor"
                                  label="آیا تحت نظر پزشک هستید؟" :disable="isShow"/>
                <BaseFormCheckBox :required="false" v-model="state.diseaseRecords" name="diseaseRecords"
                                  label="سوابق بیماری یا آسیب‌دیدگی؟" :disable="isShow"/>
              </div>
              <div class="flex justify-end gap-2 pt-4">
                <UButton :disabled="isShow" label="اعمال تغییرات" color="primary" type="submit"
                         class="disabled:blur-[1px]"/>
              </div>
            </div>
          </UForm>
        </div>
      </template>
      <template #dateBelt>
        <div class="flex flex-col gap-6 p-4 bg-white rounded-lg w-full h-full">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <UIcon name="solar:medal-ribbon-bold" class="size-6 text-black/70"/>
              <span class="font-medium text-2xl">تاریخچه ارتقاهای کمربند</span>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
            <div class="flex items-center gap-4 bg-muted p-5 rounded-xl">
              <span class="belt-white text-lg">سفید</span>
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-lg">کمربند سفید</span>
                <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70"/>
                        1404/02/20
                      </span>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-muted p-5 rounded-xl">
              <span class="belt-orange text-lg">نارنجی</span>
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-lg">کمربند نارنجی</span>
                <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70"/>
                        1404/04/20
                      </span>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-muted p-5 rounded-xl">
              <span class="belt-blue text-lg">ابی</span>
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-lg">کمربند ابی</span>
                <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70"/>
                        1404/06/20
                      </span>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-muted p-5 rounded-xl">
              <span class="belt-yellow text-lg">زرد</span>
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-lg">کمربند زرد</span>
                <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70"/>
                        1404/08/20
                      </span>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-muted p-5 rounded-xl">
              <span class="belt-green text-lg">سبز</span>
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-lg">کمربند سبز</span>
                <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70"/>
                        1404/10/20
                      </span>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-muted p-5 rounded-xl">
              <span class="belt-brown text-lg">قهوه ای</span>
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-lg">کمربند قهوه ای</span>
                <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70"/>
                        1404/12/20
                      </span>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-muted p-5 rounded-xl">
              <span class="belt-black text-lg">مشکی</span>
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-lg">کمربند مشکی</span>
                <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70"/>
                        1405/4/20
                      </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </LazyBaseTabs>
  </section>
</template>
<script setup lang="ts">
import * as v from 'valibot'
import type {FormSubmitEvent} from "@nuxt/ui"
import type {TabsItem} from '@nuxt/ui'

const isShow: Ref<boolean> = ref(true)
const name = ref(['علی'])

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

const items = [
  {
    label: 'ویرایش اطلاعات',
    slot: 'editData' as const
  },
  {
    label: 'تاریخچه کمربند',
    slot: 'dateBelt' as const
  }
] satisfies TabsItem[]

const state = reactive({
  fullName: 'علی احمدی',
  address: 'گلبهار میدان پرند خیابان قدیر قدیر 10',
  phoneNumber: '09123456789',
  phoneNumberEmergency: '09123456789',
  nationalCode: '0946108224',
  age: '24',
  date: '1383/04/30',
  underSupervisionDoctor: false,
  diseaseRecords: false
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>