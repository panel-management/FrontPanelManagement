<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-5">
    <div class="bg-white p-4 md:p-6 rounded-xl w-full flex flex-col lg:items-center gap-5">
      <div class="flex items-center justify-between w-full">
        <div class="flex gap-3">
          <div class="bg-black rounded-full size-16 flex justify-center items-center text-white">
            {{ coach?.data?.fullName.slice(0, 1) }}
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-medium text-xl">{{ coach?.data?.fullName }}</span>
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <UBadge
                v-if="coach?.data?.type === Role.Coach"
                color="secondary"
                variant="solid"
                label="مربی"
                class="font-medium"
              />
              <UBadge
                color="neutral"
                variant="soft"
                :label="coach?.data?.sport.name"
                class="font-semibold w-fit"
              />
              <UBadge
                :color="coach?.data?.isActive ? 'primary' : 'error'"
                variant="soft"
                :label="coach?.data?.isActive ? 'فعال' : 'غیر فعال'"
                class="font-semibold"
              />
            </div>
          </div>
        </div>
        <div class="flex gap-3 max-md:hidden">
          <UButton
            v-if="isShow"
            @click="toggleInout"
            color="tertiary"
            variant="outline"
            size="lg"
            label="ویرایش"
            trailing-icon="material-symbols:edit-square-outline-rounded"
          />
          <UButton
            v-if="!isShow"
            @click="toggleInout"
            color="neutral"
            variant="outline"
            size="lg"
            label="انصراف"
            trailing-icon="material-symbols:close-rounded"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        <div class="flex items-center gap-1">
          <UIcon name="ic:baseline-call" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">شماره تلفن:</span>
          <span class="font-medium text-base mt-1">{{ coach?.data?.phoneNumber }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="iconoir:barcode" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">کدملی:</span>
          <span class="font-medium text-base mt-1">{{ coach?.data?.nationalCode }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">عضویت:</span>
          <span class="font-medium text-base mt-1">
            {{ gregorianToJalali(coach?.data?.createdAt) }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="ion:university" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">سابقه:</span>
          <span class="font-medium text-base mt-1">
            {{ coach?.data?.history ? `${coach?.data?.history} سال ` : 'وجود ندارد' }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="solar:medal-ribbons-star-bold" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">تخصص:</span>
          <span class="font-medium text-base mt-1">{{ coach?.data?.sport.name }}</span>
        </div>
      </div>
      <div class="flex gap-3 min-md:hidden">
        <UButton
          v-if="isShow"
          @click="toggleInout"
          color="tertiary"
          variant="outline"
          size="lg"
          label="ویرایش"
          trailing-icon="material-symbols:edit-square-outline-rounded"
        />
        <UButton
          v-if="!isShow"
          @click="toggleInout"
          color="neutral"
          variant="outline"
          size="lg"
          label="انصراف"
          trailing-icon="material-symbols:close-rounded"
        />
      </div>
    </div>
    <div class="w-full h-full bg-white rounded-lg p-4">
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput
              :required="false"
              :disable="isShow"
              v-model="state.fullName"
              label="نام و نام خانوادگی"
              name="fullName"
              type="text"
              placeholder="نام کامل مربی"
              class="w-full"
            />
            <BaseFormInput
              :required="false"
              :disable="isShow"
              v-model="state.nationalCode"
              label="کد ملی"
              name="nationalCode"
              type="text"
              placeholder="کد ملی مربی"
              class="w-full"
            />
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput
              :required="false"
              :disable="isShow"
              v-model="state.age"
              label="سن"
              name="age"
              type="text"
              placeholder="سن"
              class="w-full"
            />
            <BaseDatePicker
              :required="false"
              :disable="isShow"
              v-model="state.birthDate"
              label="تاریخ تولد"
              name="birthDate"
              class="w-full"
            />
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput
              :required="false"
              :disable="isShow"
              v-model="state.phoneNumber"
              label="شماره تلفن"
              name="phoneNumber"
              type="text"
              placeholder="شماره تلفن مربی"
              class="w-full"
            />
            <BaseFormInput
              :required="false"
              :disable="isShow"
              v-model="state.history"
              label="سابقه تدریس"
              name="history"
              type="text"
              placeholder="سابقه تدریس مربی"
              class="w-full"
            />
          </div>
          <div class="w-full">
            <BaseFormInput
              :required="false"
              :disable="isShow"
              v-model="state.certificates"
              label="مدرک و گواهینامه ها"
              name="certificates"
              type="text"
              placeholder="مدرک و گواهینامه ها مربیگری"
              class="w-full"
            />
          </div>
          <div class="w-full flex flex-col justify-center items-center">
            <BaseFormUploadFile
              :required="false"
              :disable="isShow"
              v-model="state.imageFile"
              label="ارسال عکس گواهینامه"
              name="imageFile"
              description="اپلود عکس با فرمت (jepg, png, webp, jpg) و حداکثر تا MB 1"
              class="w-full"
            />
            <img
              v-if="state.imageUrl"
              class="object-cover md:w-2/3 pt-10"
              :src="state.imageUrl"
              :alt="state.fullName"
              draggable="false"
              loading="lazy"
            />
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <UButton
              v-if="!isShow"
              :loading="isLoading"
              label="اعمال تغییرات"
              color="primary"
              type="submit"
            />
          </div>
        </div>
      </UForm>
    </div>
  </section>
</template>
<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import type { UpdateCoach } from '~/models/users/coach/UpdateCoach'
  import { getCoachProfileService, updateCoachProfileService } from '~/services/coach.service'
  import { Role } from '~/models/Role'

  const isShow: Ref<boolean> = ref(true)
  const isLoading: Ref<boolean> = ref(false)
  const toastStore = useToastStore()
  const { gregorianToJalali, jalaliToGregorian } = useDateConverter()

  const schema = v.object({
    fullName: v.pipe(v.string(), v.trim(), v.nonEmpty('نام و نام خانوادگی الزامی است')),
    nationalCode: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('کد ملی الزامی است'),
      v.maxLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید'),
      v.regex(/^\d+$/, 'کد ملی فقط می‌تواند شامل اعداد باشد')
    ),
    phoneNumber: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن الزامی است'),
      v.minLength(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد'),
      v.maxLength(12, 'شماره تلفن نباید بیشتر از ۱۲ رقم باشد'),
      v.regex(/^09\d{9,10}$/, 'شماره تلفن باید با 09 شروع شود')
    ),
    history: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('سابقه تدریس الزامی است'),
      v.maxLength(2, 'سابقه تدریس باید حداکثر ۲ رقم باشد'),
      v.regex(/^\d+$/, 'سابقه تدریس باید عدد باشد')
    ),
    certificates: v.pipe(v.string(), v.trim(), v.nonEmpty('مدرک و گواهینامه الزامی است')),
    birthDate: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('تاریخ تولد الزامی است'),
      v.regex(/^\d{4}\/\d{2}\/\d{2}$/, 'فرمت تاریخ باید 1380/01/01 باشد')
    ),
    age: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('سن الزامی است'),
      v.minLength(1, 'سن نمی‌تواند خالی باشد'),
      v.maxLength(2, 'سن باید حداکثر ۲ رقم باشد'),
      v.regex(/^\d+$/, 'سن باید عدد باشد')
    ),
    imageFile: v.optional(
      v.pipe(
        v.file(),
        v.mimeType(
          ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
          'لطف عکس را با این فرمت ها اپلود کنید. (jpeg, png, jpg, webp)'
        ),
        v.maxSize(1024 * 1024 * 2, 'عکس باید زیر ۲ مگابایت باشد.')
      )
    ),
  })

  type Schema = v.InferOutput<typeof schema>

  const {
    data: coach,
    error,
    refresh,
  } = await useAsyncData('current-coach-profile', () => getCoachProfileService())
  console.log(coach.value?.data)
  if (error.value || !coach.value?.data) {
    throw createError({
      statusCode: coach.value?.statusCode || 404,
      fatal: true,
      message: coach.value?.message || 'پروفایل پیدا نشده لطف دوباره تلاش کنید',
    })
  }

  const state = reactive<UpdateCoach>({
    fullName: coach.value?.data.fullName ?? '',
    phoneNumber: coach.value?.data.phoneNumber ?? '',
    nationalCode: coach.value?.data.nationalCode ?? '',
    birthDate: gregorianToJalali(coach.value?.data.birthDate) ?? '',
    age: coach.value?.data.age.toString() ?? '',
    certificates: coach.value?.data.certificates ?? '',
    history: coach.value?.data.history ?? '',
    imageUrl: coach.value?.data.image ?? undefined,
    imageFile: undefined,
  })

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const payload: UpdateCoach = {
        ...event.data,
        birthDate: jalaliToGregorian(event.data.birthDate),
      }
      const result = await updateCoachProfileService(payload)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        refresh()
        reloadNuxtApp()
        isShow.value = true
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  function toggleInout() {
    isShow.value = !isShow.value
  }

  definePageMeta({
    middleware: ['role-guard', 'plan-guard'],
  })

  useHead({
    title: `پروفایل ${coach.value?.data?.fullName}`,
    meta: [{ name: 'description', content: 'مشاهده و ویرایش اطلاعات حساب کاربری و تنظیمات شخصی.' }],
  })
</script>
