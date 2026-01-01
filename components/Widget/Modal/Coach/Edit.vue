<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import type { CoachListData } from '~/models/users/coach/CoachListData'
  import { getCoachByIdService, updateCoachService } from '~/services/coach.service'
  import type { UpdateCoach } from '~/models/users/coach/UpdateCoach'
  import { Role } from '~/models/Role'

  const emit = defineEmits(['update:open', 'updated'])
  const modalStore = useModalStore()
  const toastStore = useToastStore()
  const { gregorianToDate, gregorianToJalali } = useDateConverter()
  const formData = ref<CoachListData | null>(null)
  const isShow: Ref<boolean> = ref(true)
  const isLoading: Ref<boolean> = ref(false)

  const userId = computed(() => modalStore.modals.coachesEdit)

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

  const schema = v.object({
    fullName: v.pipe(v.string(), v.trim(), v.nonEmpty('نام و نام خانوادگی مربی الزامی است')),
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
    certificates: v.pipe(v.string(), v.trim(), v.nonEmpty('مدرک و گواهینامه مربی الزامی است')),
    birthDate: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('تاریخ تولد الزامی است'),
      v.regex(
        /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        'فرمت تاریخ میلادی صحیح نیست. مثال: 2000-04-20'
      )
    ),
    age: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('سن مربی الزامی است'),
      v.minLength(1, 'سن مربی نمی‌تواند خالی باشد'),
      v.maxLength(2, 'سن مربی باید حداکثر ۲ رقم باشد'),
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

  const state = reactive<UpdateCoach>({
    fullName: '',
    phoneNumber: '',
    nationalCode: '',
    birthDate: '',
    age: '',
    certificates: '',
    history: '',
    imageFile: undefined,
    imageUrl: undefined,
  })

  watch(formData, (data) => {
    if (!data) {
      state.fullName = ''
      state.phoneNumber = ''
      state.nationalCode = ''
      state.age = ''
      state.birthDate = ''
      state.history = ''
      state.certificates = ''
      state.imageFile = undefined
      state.imageUrl = undefined
      return
    }
    state.fullName = data.fullName ?? ''
    state.phoneNumber = data.phoneNumber ?? ''
    state.nationalCode = data.nationalCode ?? ''
    state.age = data.age?.toString() ?? ''
    state.birthDate = data.birthDate ? gregorianToDate(data.birthDate) : ''
    state.history = data.history ?? ''
    state.certificates = data.certificates ?? ''
    state.imageUrl = data.image ?? ''
  })

  async function loadCoach() {
    try {
      const result = await getCoachByIdService(userId.value)
      if (result.statusCode === 200) {
        console.log(result.data)
        formData.value = result.data as CoachListData
      }
    } catch (error: any) {
      console.log(error.message || error)
      formData.value = null
    }
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const result = await updateCoachService(userId.value, event.data)
      console.log(result)
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

  function toggleInput() {
    isShow.value = !isShow.value
  }

  watch(userId, (id) => {
    if (id) {
      loadCoach()
    } else {
      formData.value = null
    }
  })

  onMounted(() => {
    if (userId.value) {
      nextTick(loadCoach)
    }
  })
</script>

<template>
  <UModal
    fullscreen
    v-model:open="localOpen"
    title="پروفایل مربی"
    description="اطلاعات کامل و تاریخچه مربی"
  >
    <template #body>
      <div v-if="formData" class="flex flex-col gap-5 md:gap-10 h-full w-full">
        <div class="bg-muted p-4 rounded-xl w-full flex flex-col lg:items-center gap-5">
          <div class="flex items-center justify-between w-full">
            <div class="flex gap-3">
              <div
                class="bg-black rounded-full size-16 flex justify-center items-center text-white"
              >
                {{ formData.fullName.slice(0, 1) }}
              </div>
              <div class="flex flex-col gap-2">
                <span class="font-medium text-xl">{{ formData.fullName }}</span>
                <div class="flex gap-2 sm:gap-3">
                  <div class="flex max-sm:flex-col gap-2 sm:gap-3">
                    <UBadge
                      v-if="formData.type === Role.Coach"
                      color="secondary"
                      variant="solid"
                      label="مربی"
                      class="font-medium"
                    />
                    <UBadge
                      color="neutral"
                      variant="soft"
                      :label="formData.sport.name"
                      class="font-semibold w-fit"
                    />
                  </div>
                  <div class="flex max-sm:flex-col gap-2 sm:gap-3">
                    <UBadge
                      :color="formData.active === 'ENABLE' ? 'primary' : 'error'"
                      variant="soft"
                      :label="formData.active === 'ENABLE' ? 'فعال' : 'غیر فعال'"
                      class="font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-3 max-md:hidden">
              <UButton
                v-if="isShow"
                @click="toggleInput"
                color="tertiary"
                variant="outline"
                size="lg"
                label="ویرایش"
                trailing-icon="material-symbols:edit-square-outline-rounded"
              />
              <UButton
                v-if="!isShow"
                @click="toggleInput"
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
              <span class="font-medium text-base mt-1">{{
                gregorianToJalali(formData.createdAt)
              }}</span>
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
              <span class="font-medium text-base mt-1">{{ formData.certificates }}</span>
            </div>
          </div>
          <div class="flex gap-3 min-md:hidden">
            <UButton
              v-if="isShow"
              @click="toggleInput"
              color="tertiary"
              variant="outline"
              size="lg"
              label="ویرایش"
              trailing-icon="material-symbols:edit-square-outline-rounded"
            />
            <UButton
              v-if="!isShow"
              @click="toggleInput"
              color="neutral"
              variant="outline"
              size="lg"
              label="انصراف"
              trailing-icon="material-symbols:close-rounded"
            />
          </div>
        </div>
        <!-- <div
          class="bg-muted p-4 rounded-xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:items-center gap-5">
          <div
            class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-turquoise-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-6 text-turquoise-500" />
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">۸ سال</span>
              <span class="font-medium">سابقه تدریس</span>
            </div>
          </div>
          <div
            class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-orange-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="mdi:medal-outline" class="size-6 text-orange-400" />
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">۱۲</span>
              <span class="font-medium">ارتقای کمربند</span>
            </div>
          </div>
          <div
            class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-turquoise-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="mdi:chart-timeline-variant" class="size-6 text-turquoise-500" />
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">۸۷%</span>
              <span class="font-medium">میانگین حضور کلاس</span>
            </div>
          </div>
          <div
            class="rounded-xl bg-white p-5 w-full flex flex-row-reverse md:flex-col items-center justify-between sm:justify-center gap-4">
            <div class="bg-info-100 size-12 flex items-center justify-center rounded-full">
              <UIcon name="ph:users-three-bold" class="size-6 text-info-500" />
            </div>
            <div class="flex flex-col md:items-center gap-1">
              <span class="font-semibold text-xl">25</span>
              <span class="font-medium">هنرجو</span>
            </div>
          </div>
        </div> -->
        <div class="bg-muted p-4 rounded-xl w-full flex items-center gap-5">
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
                  <BaseVueDatePicker
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
                  <ClientOnly>
                    <BaseFormUploadFile
                      :required="false"
                      :disable="isShow"
                      v-model="state.imageFile"
                      label="ارسال عکس گواهینامه"
                      name="imageFile"
                      description="اپلود عکس با فرمت (jepg, png, webp, jpg) و حداکثر تا MB 1"
                      class="w-full"
                    />
                  </ClientOnly>
                  <img
                    v-if="state.imageUrl"
                    class="object-cover md:w-2/3 pt-10"
                    :src="state.imageUrl"
                    :alt="formData.fullName"
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
        </div>
      </div>
    </template>
  </UModal>
</template>
