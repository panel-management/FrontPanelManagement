<template>
  <UModal
    fullscreen
    v-model:open="localOpen"
    title="پروفایل استاد"
    description="اطلاعات کامل و تاریخچه استاد"
  >
    <template #body>
      <div v-if="formData" class="flex flex-col gap-5 h-full w-full">
        <WidgetProfilesDetail
          customStyle="bg-muted"
          v-model:toggle="isShow"
          :fullName="formData.fullName"
          :sportName="formData.sport.name"
          :isActiveColor="formData.isActive"
          :isActiveLabel="formData.isActive"
        >
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
            <span class="font-medium text-base mt-1">تعداد هنرجو و مربی:</span>
            <span class="font-medium text-base mt-1">{{ formData._count.students }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="ion:university" class="size-6 text-black" />
            <span class="font-medium text-base mt-1">سابقه:</span>
            <span class="font-medium text-base mt-1">
              {{ formData.history ? `${formData.history} سال ` : 'وجود ندارد' }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="solar:medal-ribbons-star-bold" class="size-6 text-black" />
            <span class="font-medium text-base mt-1">تخصص:</span>
            <span class="font-medium text-base mt-1">{{ formData.sport.name }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="bxs:certification" class="size-6 text-black" />
            <span class="font-medium text-base mt-1">مدرک و گواهینامه ها:</span>
            <span class="font-medium text-base mt-1">
              {{ formData.certificates || 'وجود ندارد' }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="solar:planet-2-bold" class="size-6 text-black" />
            <span class="font-medium text-base mt-1">پلن انتخاب شده:</span>
            <span class="font-medium text-base mt-1">
              {{ formData.masterPlan ? formData.masterPlan.name : 'پلن وجود ندارد' }}
            </span>
          </div>
        </WidgetProfilesDetail>
        <div
          class="bg-muted p-4 rounded-xl w-full grid grid-cols-1 sm:grid-cols-2 lg:items-center gap-5"
        >
          <WidgetCartsInformation
            bgColorIcon="bg-turquoise-100"
            nameIcon="material-symbols:calendar-today-outline-rounded"
            classIcon="size-5 sm:size-6 text-turquoise-500"
            title="سابقه تدریس"
          >
            {{ formData.history ? `${formData.history} سال` : 'سابقه وجود ندارد' }}
          </WidgetCartsInformation>
          <WidgetCartsInformation
            bgColorIcon="bg-info-100"
            nameIcon="ph:users-three-bold"
            classIcon="size-5 sm:size-6 text-info-500"
            title="هنرجو و مربی"
          >
            {{ formData._count.students }}
          </WidgetCartsInformation>
        </div>
        <div class="bg-muted p-4 rounded-xl w-full flex items-center gap-5">
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
                        :disable="isShow"
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
                        :disable="isShow"
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
                      <BaseVueDatePicker
                        :required="false"
                        :disable="isShow"
                        v-model="state.birthDate"
                        label="تاریخ تولد"
                        name="birthDate"
                        class="w-full"
                      />
                    </div>
                    <div class="flex flex-col gap-5 w-full">
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
                      <BaseFormSelect
                        :required="false"
                        :disable="isShow"
                        v-model="state.sportId"
                        :items="itemsSelect"
                        name="sportId"
                        label="انتخاب رشته ورزشی"
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
              <div class="flex flex-col gap-6 w-full h-full">
                <div class="bg-white flex flex-col gap-5 rounded-lg p-4 w-full">
                  <div class="flex items-center gap-2">
                    <UIcon name="solar:dollar-bold" class="size-6 text-black/70" />
                    <span class="text-xl font-medium break-words">وضعیت فعلی پرداخت</span>
                  </div>
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-4 lg:gap-8 w-full"
                  >
                    <WidgetCartsInformation
                      baseClass="border border-black/50"
                      :bgColorIcon="lastPayment?.status ? 'bg-primary-100' : 'bg-muted'"
                      :nameIcon="paymentIcon[lastPayment?.status] || 'bi:emoji-neutral-fill'"
                      :classIcon="
                        `${paymentIconColor[lastPayment?.status]} size-5 sm:size-6` ||
                        'text-gray-400'
                      "
                      title="وضعیت فعلی"
                    >
                      {{ lastPayment ? paymentStatusText[lastPayment?.status] : 'وجود ندارد' }}
                    </WidgetCartsInformation>
                    <WidgetCartsInformation
                      baseClass="border border-black/50"
                      bgColorIcon="bg-black/20"
                      nameIcon="fluent:payment-32-filled"
                      classIcon="size-5 sm:size-6 text-black"
                      title="پرداخت ماهانه (تومان)"
                    >
                      {{
                        lastPayment
                          ? useLocaleString(Number(formData.masterPlan.price))
                          : 'وجود ندارد'
                      }}
                    </WidgetCartsInformation>
                    <WidgetCartsInformation
                      baseClass="border border-black/50"
                      bgColorIcon="bg-yellow-100"
                      nameIcon="material-symbols:calendar-today-rounded"
                      classIcon="size-5 sm:size-6 text-yellow-400"
                      title="زمان پرداخت"
                    >
                      {{ lastPayment ? gregorianToJalali(lastPayment.createdAt) : 'وجود ندارد' }}
                    </WidgetCartsInformation>
                  </div>
                </div>
                <div
                  class="bg-white w-full max-md:h-72 lg:h-48 p-4 rounded-lg overflow-hidden"
                  :class="!formData.subscriptionPayments.length ? ' place-content-center' : ''"
                >
                  <div
                    v-if="formData.subscriptionPayments.length"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-auto h-full w-full"
                  >
                    <WidgetCartsPayments
                      v-for="payment in formData.subscriptionPayments"
                      :key="payment.id"
                      :nameIcon="paymentIcon[payment.status] || 'bi:emoji-neutral-fill'"
                      :classIcon="paymentIconColor[payment.status] || 'text-gray-400'"
                      :title="useLocaleString(Number(payment.amount))"
                      :dateTime="
                        payment.paymentDate ? gregorianToJalali(payment.paymentDate) : null
                      "
                      :badgeLabel="paymentStatusText[payment.status]"
                      :badgeColor="paymentIconBadge[payment.status]"
                    />
                  </div>
                  <WidgetEmptyState
                    v-else
                    icon="material-symbols:credit-card-off-outline"
                    title="تاریخچه مالی وجود ندارد"
                    description="پس از انجام اولین تراکنش، اطلاعات آن در این بخش نمایش داده می‌شود"
                  />
                </div>
              </div>
            </template>
          </BaseTabs>
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import type { TabsItem } from '@nuxt/ui'
  import {
    getMasterByIdForAdminService,
    updateProfileMasterJustAdminService,
  } from '~/services/master.service'
  import type { MasterListData } from '~/models/users/master/MasterListData'
  import type { UpdateMaster } from '~/models/users/master/UpdateMaster'

  const emit = defineEmits(['update:open', 'updated'])
  const modalStore = useModalStore()
  const toastStore = useToastStore()
  const gettingVariousDataStore = useGettingVariousDataStore()
  const { gregorianToDate, gregorianToJalali } = useDateConverter()
  const formData = ref<MasterListData | null>(null)
  const itemsSelect = ref<{ label: string; value: string }[]>([])
  const isShow: Ref<boolean> = ref(true)
  const isLoading: Ref<boolean> = ref(false)
  const userId = computed(() => modalStore.modals.masterEdit)

  const props = defineProps({
    open: {
      type: [Boolean, Object, Number, String, null],
      default: null,
    },
  })

  const localOpen = computed({
    get: () => !!props.open,
    set: (val: boolean) => {
      if (!val) emit('update:open', null)
    },
  })

  const items = [
    {
      label: 'ویرایش اطلاعات',
      slot: 'editData' as const,
    },
    {
      label: 'وضعیت مالی',
      slot: 'paymentStatus' as const,
    },
  ] satisfies TabsItem[]

  const schema = v.object({
    fullName: v.pipe(v.string(), v.trim(), v.nonEmpty('نام و نام خانوادگی الزامی است')),
    nationalCode: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('کد ملی الزامی است'),
      v.maxLength(11, 'کد ملی دارای 10 تا 11 رقم میباشد لطف مجدد وارد کنید'),
      v.minLength(10, 'کد ملی دارای 10 تا 11 رقم میباشد لطف مجدد وارد کنید'),
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
    birthDate: v.pipe(v.string(), v.trim()),
    age: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'سن نمی‌تواند خالی باشد'),
      v.maxLength(2, 'سن باید حداکثر ۲ رقم باشد'),
      v.regex(/^\d+$/, 'سن باید عدد باشد')
    ),
    history: v.pipe(v.string(), v.trim()),
    certificates: v.pipe(v.string(), v.trim()),
    sportId: v.pipe(v.string(), v.trim()),
  })

  type Schema = v.InferOutput<typeof schema>

  const state = reactive<UpdateMaster>({
    fullName: '',
    phoneNumber: '',
    nationalCode: '',
    age: '',
    birthDate: '',
    history: '',
    certificates: '',
    sportId: '',
  })

  watch(formData, (data) => {
    if (!data) {
      state.fullName = ''
      state.phoneNumber = ''
      state.nationalCode = ''
      state.age = ''
      state.birthDate = ''
      state.history = ''
      state.sportId = ''
      state.certificates = ''
      return
    }
    state.fullName = data.fullName ?? ''
    state.phoneNumber = data.phoneNumber ?? ''
    state.nationalCode = data.nationalCode ?? ''
    state.age = data.age?.toString() ?? ''
    state.birthDate = data.birthDate ? gregorianToDate(data.birthDate) : ''
    state.history = data.history ?? ''
    state.certificates = data.certificates ?? ''
    state.sportId = data.sport.id.toString() ?? ''
  })

  const lastPayment: Ref<MasterListData['subscriptionPayments'][0] | null> = computed(() => {
    const arr = formData.value?.subscriptionPayments
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : null
  })

  async function loadMaster() {
    try {
      const result = await getMasterByIdForAdminService(userId.value)
      if (result.statusCode === 200) {
        formData.value = result.data as MasterListData
      }
    } catch (error: any) {
      console.log(error.message || error)
      formData.value = null
    }
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const result = await updateProfileMasterJustAdminService(userId.value, event.data)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        isShow.value = true
        localOpen.value = false
        emit('updated', result.data)
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  watch(
    gettingVariousDataStore.sportData,
    (value) => {
      itemsSelect.value = value.map((item) => ({
        label: item.name,
        value: String(item.id),
      }))
    },
    { immediate: true }
  )

  watch(userId, (id) => {
    if (id) {
      loadMaster()
    } else {
      formData.value = null
    }
  })

  onMounted(() => {
    if (userId.value) {
      nextTick(loadMaster)
      gettingVariousDataStore.fetchSports
    }
  })
</script>
