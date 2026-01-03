<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full h-full flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">تنظیمات باشگاه</h2>
      <span class="text-xs sm:text-sm font-medium">مدیریت و پیکربندی تنظیمات کلی سیستم باشگاه</span>
    </div>
    <BaseTabs v-model="active" :items="items" color="tertiary">
      <template #public>
        <div class="flex flex-col gap-6 p-4 bg-white rounded-lg w-full h-full">
          <div class="flex flex-col gap-2">
            <span class="text-2xl font-bold">اطلاعات عمومی باشگاه</span>
            <p class="break-words font-medium text-sm">
              اطلاعات تماس و معرفی باشگاه را تنظیم کنید.
            </p>
          </div>
          <UForm
            :schema="schema"
            :state="state"
            @submit.prevent="onSubmit"
            class="w-full flex flex-col items-center justify-center gap-5"
          >
            <div class="flex flex-col gap-5 w-full">
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput
                  required
                  v-model="state.clubName"
                  label="نام باشگاه"
                  name="clubName"
                  type="text"
                  class="w-full"
                />
                <BaseFormInput
                  required
                  v-model="state.activityType"
                  label="حوزه فعالیت"
                  name="activityType"
                  type="text"
                  class="w-full"
                />
              </div>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput
                  required
                  v-model="state.clubPhoneNumber"
                  label="شماره تلفن باشگاه"
                  name="clubPhoneNumber"
                  type="text"
                  class="w-full"
                />
                <BaseDatePicker
                  required
                  v-model="state.foundationDate"
                  label="تاریخ تاسسیس باشگاه"
                  name="foundationDate"
                  class="w-full"
                />
              </div>
              <BaseFormInput
                required
                v-model="state.goal"
                label="هدف ایجاد باشگاه"
                name="goal"
                type="text"
                class="w-full"
              />
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput
                  :required="false"
                  v-model="state.socialNetworks.instagram"
                  label="ایدی اینستاگرام باشگاه (اختیاری)"
                  name="instagram"
                  type="text"
                  class="w-full"
                />
                <BaseFormInput
                  :required="false"
                  v-model="state.socialNetworks.telegram"
                  label="لینک گروه تلگرام باشگاه (اختیاری)"
                  name="telegram"
                  type="text"
                  class="w-full"
                />
              </div>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput
                  :required="false"
                  v-model="state.socialNetworks.eitaa"
                  label="لینک گروه ایتا باشگاه (اختیاری)"
                  name="eitaa"
                  type="text"
                  class="w-full"
                />
                <BaseFormInput
                  :required="false"
                  v-model="state.socialNetworks.website"
                  label="لینک وب سایت (اختیاری)"
                  name="website"
                  type="text"
                  class="w-full"
                />
              </div>
              <div class="w-full">
                <BaseFormTextArea
                  required
                  v-model="state.clubAddress"
                  label="آدرس باشگاه"
                  name="clubAddress"
                  class="w-full"
                />
              </div>
              <div class="w-full">
                <BaseFormTextArea
                  required
                  v-model="state.aboutClub"
                  label="درباره باشگاه"
                  name="aboutClub"
                  class="w-full"
                />
              </div>
              <div class="flex justify-end gap-2 pt-4">
                <UButton
                  :loading="isLoading"
                  type="submit"
                  color="primary"
                  class="flex justify-center text-base"
                  label="ثبت اطلاعات"
                />
              </div>
            </div>
          </UForm>
        </div>
      </template>
      <template #mali>
        <div class="flex flex-col gap-6 rounded-lg w-full h-full">
          <div
            class="bg-white p-4 rounded-xl w-full flex max-sm:flex-col sm:items-center justify-between gap-3 sm:gap-0"
          >
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-2xl">انواع طرح ها</span>
              <p class="font-light text-sm">مدیریت طرح‌های مختلف عضویت و قیمت‌ ها</p>
            </div>
            <UButton
              @click="modalStore.toggleModal('paymentAdd')"
              label="طرح جدید"
              size="lg"
              icon="material-symbols:add-rounded"
              variant="solid"
              color="neutral"
              class="flex justify-center w-full sm:w-fit"
            />
          </div>
          <div class="bg-white p-4 rounded-xl w-full flex flex-col gap-5">
            <div class="flex items-center gap-2">
              <UIcon name="heroicons:fire-16-solid" class="size-7 text-yellow-200" />
              <span class="text-2xl font-bold">طرح‌ ها</span>
            </div>
            <div
              v-if="!formData.length"
              class="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div
                v-for="n in 12"
                :key="n"
                class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4 animate-pulse"
              >
                <div class="w-full flex flex-col gap-2">
                  <div class="h-6 bg-turquoise-200 rounded w-1/3"></div>
                  <!-- name placeholder -->
                  <div class="h-4 bg-turquoise-200 rounded w-2/3"></div>
                  <!-- description placeholder -->
                </div>
                <div class="w-full flex flex-col gap-4">
                  <div class="h-4 bg-turquoise-200 rounded w-full"></div>
                  <div class="flex w-full justify-between items-center gap-2">
                    <div class="h-4 bg-turquoise-200 rounded w-1/4"></div>
                    <div class="h-4 bg-turquoise-200 rounded w-1/2"></div>
                  </div>
                  <div class="h-4 bg-turquoise-200 rounded w-full"></div>
                  <div class="flex w-full justify-between items-center gap-2">
                    <div class="h-4 bg-turquoise-200 rounded w-1/4"></div>
                    <div class="h-4 bg-turquoise-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div class="w-full flex gap-2">
                  <div class="h-10 bg-turquoise-200 rounded w-1/2"></div>
                  <div class="h-10 bg-turquoise-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div v-else class="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- <div class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4">
                <div class="w-full flex flex-col gap-1">
                  <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه شهریور</span>
                  <p class="text-sm font-medium">مدت: ۱ ماه</p>
                </div>
                <USeparator/>
                <div class="flex w-full justify-between">
                  <span class="font-medium">مبلغ:</span>
                  <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
                </div>
                <USeparator/>
                <div class="w-full flex gap-2">
                  <UButton @click="modalStore.toggleModal('paymentEdit')" color="primary" variant="solid"
                           icon="material-symbols-light:edit-document-rounded"
                           class="w-full flex content-center items-center justify-center" label="ویرایش"/>
                  <UButton color="error" variant="solid" icon="material-symbols:delete-forever-rounded"
                           class="w-full flex content-center items-center justify-center" label="حذف"/>
                </div>
              </div> -->
              <div
                class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4"
                v-for="data in formData"
                :key="data.id"
              >
                <div class="w-full flex flex-col gap-1">
                  <span class="font-semibold text-lg xl:text-xl">{{ data.name }}</span>
                  <p class="text-sm font-medium">{{ data.description }}</p>
                </div>
                <USeparator />
                <div class="flex w-full justify-between">
                  <span class="font-medium">مدت:</span>
                  <span class="font-medium">
                    <span>{{ data.durationInDays }}</span>
                    روز
                  </span>
                </div>
                <USeparator />
                <div class="flex w-full justify-between">
                  <span class="font-medium">مبلغ:</span>
                  <span class="font-medium">
                    <span>{{ Number(data.price).toLocaleString('fa-IR') }}</span>
                    تومان
                  </span>
                </div>
                <USeparator />
                <div class="flex w-full justify-between items-center">
                  <span class="font-medium">تاریخ ایجاد:</span>
                  <span class="font-medium">{{ useJDate(data.createdAt) }}</span>
                </div>
                <USeparator />
                <div class="w-full flex gap-2">
                  <UButton
                    @click="modalStore.toggleModal('paymentEdit', data)"
                    color="primary"
                    variant="solid"
                    icon="material-symbols-light:edit-document-rounded"
                    class="w-full flex content-center items-center justify-center"
                    label="ویرایش"
                  />
                  <UButton
                    :loading="isLoading"
                    @click="deletePlanMasterByStudent(data.id)"
                    color="error"
                    variant="solid"
                    icon="material-symbols:delete-forever-rounded"
                    class="w-full flex content-center items-center justify-center"
                    label="حذف"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="bg-white p-4 rounded-xl w-full flex justify-center items-center">
            <UPagination v-model:page="page" show-edges :sibling-count="1" :total="50" />
          </div> -->
        </div>
        <LazyWidgetModalPaymentAdd
          v-model:open="modalStore.modals.paymentAdd"
          @success="getPlanStudent"
        />
        <LazyWidgetModalPaymentEdit
          v-model:open="modalStore.modals.paymentEdit"
          @updated="handleUpdate"
        />
      </template>
      <template #ranks>
        <div class="flex flex-col gap-6 p-4 bg-white rounded-lg w-full h-full">
          <div class="w-full flex max-sm:flex-col items-center justify-between gap-4 sm:gap-2">
            <div class="flex flex-col gap-2">
              <span class="text-2xl font-bold">کمربندها یا درجه ها</span>
              <p class="break-words font-medium text-sm">
                ترتیب و رنگ کمربندها یا رتبه ها را مدیریت کنید.
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-5 w-full p-2">
            <div
              class="flex items-center justify-between gap-2 w-full"
              v-for="item in gettingVariousDataStore.beltData"
              :key="item.id"
            >
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center bg-muted rounded-full size-10">
                  {{ item.id }}
                </div>
                <div
                  class="flex justify-center items-center rounded-full size-14"
                  :class="[getBeltClass(item.color)]"
                ></div>
                <div class="flex flex-col gap-1 mr-2">
                  <span class="font-semibold text-xl">کمربند {{ item.color }}</span>
                  <p class="font-medium text-muted text-sm">رنگ: {{ item.color }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseTabs>
  </section>
</template>
<script setup lang="ts">
  import type { FormSubmitEvent, TabsItem } from '@nuxt/ui'
  import * as v from 'valibot'
  import type { ClubProfileData } from '~/models/clubProfile/ClubProfileData'
  import type { StudentPlanData } from '~/models/plan/studentPlan/StudentPlanData'
  import { getClubProfileService, updateClubProfileService } from '~/services/clubProfile.service'
  import {
    deletePlanMasterByStudentService,
    getPlanMasterByStudentService,
  } from '~/services/masterPlan.service'

  const route = useRoute()
  const router = useRouter()
  const modalStore = useModalStore()
  const toastStore = useToastStore()
  const gettingVariousDataStore = useGettingVariousDataStore()
  const { showConfirmDialog } = useConfirmDialog()
  const { jalaliToGregorian, gregorianToJalali } = useDateConverter()
  const validTabs = ['public', 'mali', 'ranks']
  const formData = shallowRef<StudentPlanData[]>([])
  const clubProfile = ref<ClubProfileData | null>(null)
  const isLoading: Ref<boolean> = ref(false)

  const hasSystemBelt = computed(() => gettingVariousDataStore.hasBeltSystem)

  const active = computed({
    get() {
      const currentTab = (route.query.tab as string) || 'public'
      if (!validTabs.includes(currentTab)) {
        navigateTo({ path: '/setting/master', query: { tab: 'public' } }, { replace: true })
      }
      return currentTab
    },
    set(tab) {
      if (validTabs.includes(tab)) {
        router.push({
          path: '/setting/master',
          query: { tab },
        })
      }
    },
  })

  const items = computed(() => {
    return [
      {
        label: 'عمومی',
        icon: 'hugeicons:setting-07',
        value: 'public',
        slot: 'public' as const,
      },
      {
        label: 'مالی',
        icon: 'solar:dollar-minimalistic-line-duotone',
        value: 'mali',
        slot: 'mali' as const,
      },
      ...(hasSystemBelt.value
        ? [
            {
              label: 'رتبه ها',
              icon: 'solar:pallete-2-linear',
              value: 'ranks',
              slot: 'ranks' as const,
            },
          ]
        : []),
    ] satisfies TabsItem[]
  })

  const schema = v.object({
    clubName: v.pipe(v.string(), v.trim(), v.nonEmpty('نام باشگاه الزامی است')),
    activityType: v.pipe(v.string(), v.trim(), v.nonEmpty('حوزه فعالیت الزامی است')),
    clubPhoneNumber: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن باشگاه الزامی است'),
      v.regex(/^\d+$/, 'شماره تلفن فقط می‌تواند شامل اعداد باشد')
    ),
    foundationDate: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('تاریخ تاسسیس باشگاه الزامی است'),
      v.regex(/^\d{4}\/\d{2}\/\d{2}$/, 'فرمت تاریخ باید 1380/01/30 باشد')
    ),
    goal: v.pipe(v.string(), v.trim(), v.nonEmpty('هدف ایجاد باشگاه الزامی است')),
    clubAddress: v.pipe(v.string(), v.trim(), v.nonEmpty('آدرس باشگاه الزامی است')),
    aboutClub: v.pipe(v.string(), v.trim(), v.nonEmpty('درباره باشگاه الزامی است')),
  })

  type Schema = v.InferOutput<typeof schema>

  const state = reactive({
    clubName: '',
    activityType: '',
    clubPhoneNumber: '',
    foundationDate: '',
    goal: '',
    clubAddress: '',
    aboutClub: '',
    socialNetworks: {
      instagram: '',
      telegram: '',
      eitaa: '',
      website: '',
    },
  })

  watch(clubProfile, (value) => {
    if (!value) return
    state.clubName = value.clubName
    state.activityType = value.activityType
    state.clubPhoneNumber = value.clubPhoneNumber
    state.foundationDate = gregorianToJalali(value.foundationDate)
    state.goal = value.goal
    state.clubAddress = value.clubAddress
    state.aboutClub = value.aboutClub
    state.socialNetworks = { ...value.socialNetworks }
  })

  async function getPlanStudent() {
    try {
      const result = await getPlanMasterByStudentService()
      if (result.statusCode === 200) {
        console.log(result.data)
        formData.value = Array.isArray(result.data) ? result.data : []
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  async function getClubProfile() {
    try {
      const result = await getClubProfileService()
      if (result.statusCode === 200) {
        clubProfile.value = result.data
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const payload: ClubProfileData = {
        ...event.data,
        foundationDate: jalaliToGregorian(event.data.foundationDate),
      }
      const result = await updateClubProfileService(payload)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  function handleUpdate(updatedItem: StudentPlanData | undefined) {
    if (!updatedItem) return
    const index = formData.value.findIndex((u) => u.id === updatedItem.id)
    if (index !== -1) {
      formData.value[index] = { ...formData.value[index], ...updatedItem }
    }
  }

  async function deletePlanMasterByStudent(id: number) {
    showConfirmDialog(
      'آیا از حذف این پلن اطمینان دارید؟ این عملیات قابل بازگشت نیست.',
      async () => {
        isLoading.value = true
        try {
          const result = await deletePlanMasterByStudentService(id)
          if (result.statusCode === 200) {
            formData.value = formData.value.filter((user) => user.id !== id)
            toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
          }
        } catch (error: any) {
          console.error(error.message || error)
        } finally {
          isLoading.value = false
        }
      }
    )
  }

  onMounted(() => {
    getClubProfile()
    getPlanStudent()
    gettingVariousDataStore.fetchSports()
  })

  watch(
    () => hasSystemBelt.value,
    (value) => {
      if (value) {
        gettingVariousDataStore.fetchBelts()
      }
    },
    { immediate: true }
  )

  definePageMeta({
    middleware: ['role-guard', 'plan-guard'],
  })

  useHead({
    title: 'مدیریت تنظیمات باشگاه',
    meta: [
      {
        name: 'description',
        content: 'مدیریت تنظیمات شخصی، برنامه‌ها و پیکربندی‌های کلیدی باشگاه.',
      },
    ],
  })
</script>
