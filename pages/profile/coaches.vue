<template>
  <section class="xl:container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-5">
    <div class="bg-white p-4 md:p-6 rounded-xl w-full flex flex-col lg:items-center gap-5">
      <div class="flex items-center justify-between w-full">
        <div class="flex gap-3">
          <div class="bg-black rounded-full size-16 flex justify-center items-center text-white">
            {{ name[0].slice(0, 2) }}
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-medium text-xl">علی احمدی</span>
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <UBadge color="secondary" variant="solid" label="مربی" class="font-medium"/>
              <UBadge color="primary" variant="soft" label="فعال" class="font-semibold"/>
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
        <UButton v-if="isShow" @click="enableInputs" color="tertiary" variant="outline" size="lg" label="ویرایش"
                 trailing-icon="material-symbols:edit-square-outline-rounded"/>
        <UButton v-if="!isShow" @click="disableInputs" color="neutral" variant="outline" size="lg" label="انصراف"
                 trailing-icon="material-symbols:close-rounded"/>
      </div>
    </div>
    <div class="w-full h-full bg-white rounded-lg p-4">
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput :required="false" :disable="isShow" v-model="state.fullName" label="نام و نام خانوادگی"
                           name="fullName" type="text" placeholder="نام کامل" class="w-full"/>
            <BaseFormInput :required="false" :disable="isShow" v-model="state.nationalCode" label="کد ملی"
                           name="nationalCode" type="text" placeholder="کد ملی" class="w-full"/>
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput :required="false" :disable="isShow" v-model="state.phoneNumber" label="شماره تلفن"
                           name="phoneNumber" type="text" placeholder="شماره تلفن" class="w-full"/>
            <BaseFormInput :required="false" :disable="isShow" v-model="state.history" label="سابقه تدریس"
                           name="history" type="text" placeholder="سابقه تدریس" class="w-full"/>
          </div>
          <div class="w-full pt-1">
            <BaseFormInput :required="false" :disable="isShow" v-model="state.certificates"
                           label="مدرک و گواهینامه ها" name="certificates" type="text"
                           placeholder="مدرک و گواهینامه ها مربیگری" class="w-full"/>
          </div>
          <div class="w-full pt-1">
            <BaseFormUploadFile :required="false" :disable="isShow" v-model="state.image"
                                label="ارسال عکس گواهینامه" name="image"
                                description="اپلود عکس با فرمت (jepg, png, webp, jpg) و حداکثر تا 2MB"
                                class="w-full"/>
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <UButton :disabled="isShow" label="اعمال تغییرات" color="primary" type="submit"
                     class="disabled:blur-[1px]"/>
          </div>
        </div>
      </UForm>
    </div>
  </section>
</template>
<script setup lang="ts">
import * as v from 'valibot'
import type {FormSubmitEvent} from "@nuxt/ui"

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
      v.nonEmpty('سابقه تدریس الزامی است.'),
  ),
  certificates: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('مدرک و گواهینامه الزامی است.'),
  ),
  image: v.optional(
      v.pipe(
          v.file(),
          v.mimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'لطف عکس را با این فرمت ها اپلود کنید. (jpeg, png, jpg, webp)'),
          v.maxSize(1024 * 1024 * 2, 'عکس باید زیر ۲ مگابایت باشد.')
      )
  )
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  fullName: 'محسن حیایی',
  phoneNumber: '09123456789',
  nationalCode: '0914875324',
  history: '8 سال',
  certificates: 'مدرک دان 4 فدراسیون کاراته',
  image: undefined as File | undefined
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>