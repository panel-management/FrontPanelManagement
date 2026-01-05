<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-5">
    <div class="bg-white p-4 md:p-6 rounded-xl w-full flex flex-col lg:items-center gap-5">
      <div class="flex items-center justify-between w-full">
        <div class="flex gap-3">
          <div class="bg-black rounded-full size-16 flex justify-center items-center text-white">
            {{ master?.data?.fullName.slice(0, 1) }}
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-medium text-xl">{{ master?.data?.fullName }}</span>
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <UBadge
                v-if="master?.data?.type === Role.Master"
                color="secondary"
                variant="solid"
                label="استاد"
                class="font-medium"
              />
              <UBadge
                :color="master?.data?.active === 'ENABLE' ? 'primary' : 'error'"
                variant="soft"
                :label="master?.data?.active === 'ENABLE' ? 'فعال' : 'غیر فعال'"
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
          <span class="font-medium text-base mt-1">{{ master?.data?.phoneNumber }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="iconoir:barcode" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">کدملی:</span>
          <span class="font-medium text-base mt-1">{{ master?.data?.nationalCode }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="material-symbols-light:calendar-today" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">عضویت:</span>
          <span class="font-medium text-base mt-1">{{ useJDate(master?.data?.createdAt) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="hugeicons:students" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">هنرجو:</span>
          <span class="font-medium text-base mt-1">
            {{ master?.data?.students.length ?? 'هنرجو وجود ندارد' }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="ion:university" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">سابقه:</span>
          <span class="font-medium text-base mt-1">
            {{ master?.data?.history ? `سال ${master?.data?.history}` : 'وجود ندارد' }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="solar:medal-ribbons-star-bold" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">تخصص:</span>
          <span class="font-medium text-base mt-1">{{ master?.data?.sport.name }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="bxs:certification" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">مدرک و گواهینامه ها:</span>
          <span class="font-medium text-base mt-1">
            {{ master?.data?.certificates ? master?.data?.certificates : 'وجود ندارد' }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="solar:planet-2-bold" class="size-6 text-black" />
          <span class="font-medium text-base mt-1">پلن انتخاب شده:</span>
          <span class="font-medium text-base mt-1">
            {{ master?.data?.masterPlan.name ?? 'پلن وجود ندارد' }}
          </span>
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
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput
                  :required="false"
                  :disable="isShow"
                  v-model="state.fullName"
                  label="نام و نام خانوادگی"
                  name="fullName"
                  type="text"
                  placeholder="نام کامل"
                  class="w-full"
                />
                <BaseFormInput
                  :required="false"
                  :disable="true"
                  v-model="state.nationalCode"
                  label="کد ملی"
                  name="nationalCode"
                  type="text"
                  placeholder="کد ملی"
                  class="w-full"
                />
              </div>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput
                  :required="false"
                  :disable="true"
                  v-model="state.phoneNumber"
                  label="شماره تلفن"
                  name="phoneNumber"
                  type="text"
                  placeholder="شماره تلفن"
                  class="w-full"
                />
                <BaseFormInput
                  :required="false"
                  :disable="isShow"
                  v-model="state.history"
                  label="سابقه تدریس"
                  name="history"
                  type="text"
                  placeholder="سابقه تدریس"
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
              <div class="w-full pt-1">
                <BaseFormInput
                  :required="false"
                  :disable="isShow"
                  v-model="state.certificates"
                  label="مدرک و گواهینامه ها"
                  name="certificates"
                  type="text"
                  placeholder="مدرک و گواهینامه ها مربیگری خلاصه"
                  class="w-full"
                />
              </div>
              <div class="w-full flex flex-col justify-center items-center pt-1">
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
      </template>
      <template #paymentStatus>
        <div
          v-if="master?.data?.subscriptionPayments.length"
          class="flex flex-col gap-6 w-full h-full"
        >
          <div class="bg-white flex flex-col gap-5 rounded-lg p-4 w-full">
            <div class="flex items-center gap-2">
              <UIcon name="solar:dollar-bold" class="size-6 text-black/70" />
              <span class="text-xl font-medium break-words">وضعیت فعلی شهریه</span>
            </div>
            <div class="flex max-lg:flex-col items-center justify-between gap-10 w-full">
              <div
                class="flex flex-col items-center justify-evenly gap-1 w-full h-[10rem] p-3 bg-white shadow-lg rounded-lg"
              >
                <div class="bg-muted rounded-full size-12 flex justify-center items-center">
                  <UIcon
                    :name="paymentIcon[lastPayment?.status] || 'bi:emoji-neutral-fill'"
                    class="size-7"
                    :class="paymentIconColor[lastPayment?.status] || 'text-gray-400'"
                  />
                </div>
                <span class="text-xl font-medium">
                  {{
                    lastPayment ? paymentStatusText[lastPayment?.status] : 'هیچ پرداختی موجود نیست'
                  }}
                </span>
                <span class="text-sm">وضعیت فعلی</span>
              </div>
              <div
                class="flex flex-col items-center justify-evenly gap-1 w-full h-[10rem] p-3 bg-white shadow-lg rounded-lg"
              >
                <div class="bg-muted rounded-full size-12 flex justify-center items-center">
                  <UIcon name="fluent:payment-32-filled" class="size-6 text-black" />
                </div>
                <span class="text-xl font-medium">
                  {{
                    lastPayment
                      ? Number(master.data.masterPlan.price).toLocaleString('fa-IR')
                      : 'هیچ پرداختی موجود نیست'
                  }}
                </span>
                <span class="text-sm">شهریه ماهانه (تومان)</span>
              </div>
              <div
                class="flex flex-col items-center justify-evenly gap-1 w-full h-[10rem] p-3 bg-white shadow-lg rounded-lg"
              >
                <div class="bg-muted rounded-full size-12 flex justify-center items-center">
                  <UIcon
                    name="material-symbols:calendar-today-rounded"
                    class="size-6 text-yellow-300"
                  />
                </div>
                <span class="text-xl font-medium">
                  {{
                    lastPayment
                      ? gregorianToJalali(lastPayment.createdAt)
                      : 'هیچ پرداختی موجود نیست'
                  }}
                </span>
                <span class="text-sm">زمان پرداخت</span>
              </div>
            </div>
          </div>
          <div
            class="overflow-hidden bg-white rounded-lg p-4"
            v-if="master.data.subscriptionPayments"
          >
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto h-72 w-full"
            >
              <div
                class="flex items-center gap-4 bg-muted p-3 rounded-xl h-fit"
                v-for="payment in master.data.subscriptionPayments"
                :key="payment.id"
              >
                <div class="flex justify-center items-center">
                  <UIcon
                    :name="paymentIcon[lastPayment?.status] || 'bi:emoji-neutral-fill'"
                    class="size-6"
                    :class="paymentIconColor[lastPayment?.status] || 'text-gray-400'"
                  />
                </div>
                <div class="w-full flex justify-between items-center">
                  <div class="flex flex-col gap-1">
                    <span class="font-semibold text-lg">
                      {{ Number(payment.amount).toLocaleString('fa-IR') }} تومان
                    </span>
                    <span class="font-medium text-sm flex items-center gap-1">
                      {{ gregorianToJalali(payment.paymentDate) }}
                    </span>
                  </div>
                  <UBadge
                    :label="paymentStatusText[payment.status]"
                    :color="paymentIconBadge[payment.status]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <WidgetEmptyState
          v-else
          class="bg-white rounded-lg"
          icon="material-symbols:credit-card-off-outline"
          title="تاریخچه مالی وجود ندارد"
          description="پس از انجام اولین تراکنش، اطلاعات آن در این بخش نمایش داده می‌شود"
        />
      </template>
    </BaseTabs>
  </section>
</template>
<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent, TabsItem } from '@nuxt/ui'
  import { getMasterByIdService, updateProfileMasterService } from '~/services/master.service'
  import type { UpdateMaster } from '~/models/users/master/UpdateMaster'
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
      v.maxLength(2, 'سابقه تدریس باید حداکثر ۲ رقم باشد'),
      v.regex(/^\d+$/, 'سابقه تدریس باید عدد باشد')
    ),
    age: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'سن نمی‌تواند خالی باشد'),
      v.maxLength(2, 'سن باید حداکثر ۲ رقم باشد'),
      v.regex(/^\d+$/, 'سن باید عدد باشد')
    ),
    birthDate: v.pipe(
      v.string(),
      v.trim(),
      v.regex(/^\d{4}\/\d{2}\/\d{2}$/, 'فرمت تاریخ باید 1380/01/01 باشد')
    ),
    certificates: v.pipe(v.string(), v.trim()),
    imageFile: v.optional(
      v.pipe(
        v.file(),
        v.mimeType(
          ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
          'لطف عکس را با این فرمت ها اپلود کنید. (jpeg, png, jpg, webp)'
        ),
        v.maxSize(1024 * 1024 * 1, 'عکس باید زیر 1 مگابایت باشد.')
      )
    ),
  })

  const items = [
    {
      label: 'ویرایش اطلاعات',
      slot: 'editData' as const,
    },
    {
      label: 'تاریخچه مالی',
      slot: 'paymentStatus' as const,
    },
  ] satisfies TabsItem[]

  type Schema = v.InferOutput<typeof schema>

  const {
    data: master,
    error,
    refresh,
  } = await useAsyncData('current-master-profile', () => getMasterByIdService())
  console.log(master.value?.data)
  if (error.value || !master.value?.data) {
    throw createError({
      statusCode: 404,
      message: master.value?.message || 'پروفایل پیدا نشده لطف دوباره تلاش کنید',
    })
  }

  const state = reactive<UpdateMaster>({
    fullName: master.value?.data.fullName ?? '',
    phoneNumber: master.value?.data.phoneNumber ?? '',
    nationalCode: master.value?.data.nationalCode ?? '',
    age: master.value?.data.age?.toString() ?? '',
    birthDate: master.value?.data.birthDate ? gregorianToJalali(master.value?.data.birthDate) : '',
    history: master.value?.data.history ?? '',
    certificates: master.value?.data.certificates ?? '',
    imageUrl: master.value?.data.image ?? undefined,
    imageFile: undefined,
  })

  const lastPayment = computed(() => {
    const arr = master.value?.data?.subscriptionPayments
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : null
  })

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const payload: UpdateMaster = {
        ...event.data,
        birthDate: jalaliToGregorian(event.data.birthDate),
      }
      const result = await updateProfileMasterService(payload)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        refresh()
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
    title: `پروفایل ${master.value?.data?.fullName}`,
    meta: [{ name: 'description', content: 'مشاهده و ویرایش اطلاعات حساب کاربری و تنظیمات شخصی.' }],
  })
</script>
