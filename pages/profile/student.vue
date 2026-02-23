<template>
  <section class="h-full w-full rounded-sm p-2 sm:p-3 bg-muted flex flex-col gap-5 md:gap-10">
    <div class="bg-white p-4 rounded-xl w-full flex flex-col lg:items-center gap-5">
      <div class="flex items-center justify-between w-full">
        <div class="flex gap-3">
          <div class="bg-black rounded-full size-16 flex justify-center items-center text-white">
            {{ student?.data.fullName.slice(0, 1) }}
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-medium text-xl">{{ student?.data.fullName }}</span>
            <div class="flex gap-3">
              <UBadge
                color="tertiary"
                variant="subtle"
                :label="student?.data.sport.name"
                class="font-medium"
              />
              <UBadge
                v-if="hasSystemBelt"
                color="info"
                variant="solid"
                :label="student?.data.currentBelt.color"
                class="font-medium"
              />
              <UBadge
                :color="student?.data.isActive ? 'primary' : 'error'"
                variant="soft"
                :label="student?.data.isActive ? 'فعال' : 'غیر فعال'"
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
          <UIcon name="iconoir:barcode" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">کدملی:</span>
          <span class="font-medium text-base mt-1">{{ student?.data.nationalCode }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="ic:baseline-call" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">شماره تلفن:</span>
          <span class="font-medium text-base mt-1">{{ student?.data.phoneNumber }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="ic:baseline-call" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">شماره تلفن:</span>
          <span class="font-medium text-base mt-1">{{ student?.data.phoneNumberEmergency }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">عضویت:</span>
          <span class="font-medium text-base mt-1">
            {{ gregorianToJalali(student?.data.createdAt!) }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">تاریخ تولد:</span>
          <span class="font-medium text-base mt-1">{{ useJDate(student?.data.birthDate) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="ic:round-person" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">سن:</span>
          <span class="font-medium text-base mt-1">{{ student?.data.age }}</span>
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
    <BaseTabs :items="items" color="tertiary">
      <template #editData>
        <div class="w-full h-full bg-white rounded-lg p-4">
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
                  :required="false"
                  class="w-full"
                  :disable="isShow"
                />
                <BaseFormInput
                  v-model="state.nationalCode"
                  label="کد ملی"
                  name="nationalCode"
                  type="text"
                  placeholder="کد ملی هنرجو"
                  :required="false"
                  class="w-full"
                  :disable="true"
                />
              </div>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseDatePicker
                  :required="false"
                  :disable="isShow"
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
                  :required="false"
                  class="w-full"
                  :disable="isShow"
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
                  :required="false"
                  class="w-full"
                  :disable="true"
                />
                <BaseFormInput
                  v-model="state.phoneNumberEmergency"
                  label="شماره تلفن اضطراری"
                  name="phoneNumberEmergency"
                  type="text"
                  placeholder="شماره تلفن اضطراری هنرجو"
                  :required="false"
                  class="w-full"
                  :disable="isShow"
                />
              </div>
              <div class="w-full pt-1">
                <BaseFormTextArea
                  v-model="state.address"
                  label="آدرس محل سکونت"
                  name="address"
                  :required="false"
                  class="w-full"
                  :disable="isShow"
                />
              </div>
              <USeparator label="اطلاعات پزشکی" />
              <div class="flex flex-col gap-4 w-full">
                <BaseFormCheckBox
                  :required="false"
                  v-model="state.underSupervisionDoctor"
                  name="underSupervisionDoctor"
                  label="آیا تحت نظر پزشک هستید؟"
                  :disable="isShow"
                />
                <BaseFormCheckBox
                  :required="false"
                  v-model="state.diseaseRecords"
                  name="diseaseRecords"
                  label="سوابق بیماری یا آسیب‌دیدگی؟"
                  :disable="isShow"
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
      </template>
      <template #dateBelt>
        <div class="flex flex-col gap-6 p-4 bg-white rounded-lg w-full h-full">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <UIcon name="solar:medal-ribbon-bold" class="size-6 text-black/70" />
              <span class="font-medium text-2xl">تاریخچه ارتقاهای کمربند</span>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
            <div
              class="flex items-center gap-4 bg-muted p-5 rounded-xl"
              v-for="data in student?.data.achievedBelts"
              :key="data.id"
            >
              <span class="text-lg" :class="[getBeltClass(data.color)]">{{ data.color }}</span>
              <div class="flex flex-col gap-1">
                <span class="font-semibold text-lg">کمربند {{ data.color }}</span>
                <!-- <span class="font-medium text-sm flex items-center gap-1">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-4 text-black/70" />
                        {{ data?.createAt || new Date().getFullYear() }}
                      </span> -->
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #statusPlan>
        <div class="bg-white w-full h-full rounded-lg p-4">
          <WidgetProgressBar />
        </div>
      </template>
    </BaseTabs>
  </section>
</template>
<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import type { TabsItem } from '@nuxt/ui'
  import {
    getStudentJustStudentByIdService,
    updateStudentJustStudentByIdService,
  } from '~/services/student.service'
  import type { UpdateStudent } from '~/models/users/student/UpdateStudent'
  import { Role } from '~/models/Role'

  const toastStore = useToastStore()
  const gettingVariousDataStore = useGettingVariousDataStore()
  const { gregorianToJalali, jalaliToGregorian } = useDateConverter()
  const isShow: Ref<boolean> = ref(true)
  const isLoading: Ref<boolean> = ref(false)

  const hasSystemBelt = computed(() => gettingVariousDataStore.hasBeltSystem)

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
    age: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('سن الزامی است'),
      v.minLength(1, 'سن نمی‌تواند خالی باشد'),
      v.maxLength(2, 'سن باید حداکثر ۲ رقم باشد'),
      v.regex(/^\d+$/, 'سن باید عدد باشد')
    ),
    birthDate: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('تاریخ تولد الزامی است'),
      v.regex(/^\d{4}\/\d{2}\/\d{2}$/, 'فرمت تاریخ باید 1380/01/01 باشد')
    ),
    underSupervisionDoctor: v.boolean(),
    diseaseRecords: v.boolean(),
  })

  type Schema = v.InferOutput<typeof schema>

  const items = computed(() => {
    return [
      {
        label: 'ویرایش اطلاعات',
        slot: 'editData' as const,
      },
      ...(hasSystemBelt.value
        ? [
            {
              label: 'تاریخچه کمربند',
              slot: 'dateBelt' as const,
            },
          ]
        : []),
      {
        label: 'وضعیت پلن',
        slot: 'statusPlan' as const,
      },
    ] satisfies TabsItem[]
  })

  const {
    data: student,
    error,
    refresh,
  } = await useAsyncData('current-student-profile', () => getStudentJustStudentByIdService())
  if (error.value || !student.value?.data) {
    throw createError({
      statusCode: student.value?.statusCode || 404,
      fatal: true,
      message: student.value?.message || 'پروفایل پیدا نشده لطف دوباره تلاش کنید',
    })
  }

  onMounted(gettingVariousDataStore.fetchSports)

  const state = reactive<UpdateStudent>({
    fullName: student.value.data.fullName ?? '',
    nationalCode: student.value.data.nationalCode ?? '',
    phoneNumber: student.value.data.phoneNumber ?? '',
    phoneNumberEmergency: student.value.data.phoneNumberEmergency ?? '',
    address: student.value.data.address ?? '',
    age: student.value.data.age.toString() ?? '',
    birthDate: gregorianToJalali(student.value.data.birthDate) ?? '',
    underSupervisionDoctor: student.value.data.underSupervisionDoctor ?? '',
    diseaseRecords: student.value.data.diseaseRecords ?? '',
  })

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const payload: UpdateStudent = {
        ...event.data,
        birthDate: jalaliToGregorian(event.data.birthDate),
      }
      const result = await updateStudentJustStudentByIdService(payload)
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
    middleware: ['plan-guard'],
    roles: [Role.Student],
  })

  useHead({
    title: `پروفایل ${student.value?.data?.fullName}`,
    meta: [{ name: 'description', content: 'مشاهده و ویرایش اطلاعات حساب کاربری و تنظیمات شخصی.' }],
  })
</script>
