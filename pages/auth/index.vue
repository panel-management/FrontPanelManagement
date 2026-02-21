<template>
  <UApp :locale="ar" :toaster="{ position: 'top-right' }">
    <div class="w-full h-dvh px-7 flex justify-center items-center">
      <UForm
        v-if="step === 1"
        :schema="step1Schema"
        :state="stateStep1"
        @submit.prevent="onSubmitStep1"
        class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full flex flex-col items-center justify-center gap-5"
      >
        <div class="flex flex-col items-center-safe gap-1">
          <span class="font-medium text-xl md:text-3xl text-black leading-relaxed">
            ورود به سیستم
          </span>
          <span class="text-black/80 font-normal text-sm">لطفاً اطلاعات خود را وارد کنید</span>
        </div>
        <BaseFormInput
          v-model="stateStep1.phoneNumber"
          label="شماره تلفن"
          name="phoneNumber"
          type="text"
          :required="false"
          class="w-full"
        />
        <UButton
          :loading="isLoading"
          type="submit"
          color="neutral"
          class="btn btn-outline flex justify-center text-base"
          label="ورود"
        />
      </UForm>
      <UForm
        v-else-if="step === 2"
        :schema="step2Schema"
        :state="stateStep2"
        @submit.prevent="onSubmitStep2"
        class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full flex flex-col items-center justify-center gap-5"
      >
        <div class="flex flex-col items-center-safe gap-1">
          <span class="font-medium text-xl md:text-3xl text-black leading-relaxed">
            ورود به سیستم
          </span>
          <span class="text-black/80 font-normal text-sm">
            کد تایید ارسال شده به {{ stateStep1.phoneNumber }} را وارد کنید
          </span>
        </div>
        <BaseFormOtp
          v-model="stateStep2.otpArray"
          name="otpArray"
          :disable="false"
          :required="false"
          class="w-full flex justify-center items-center"
        />
        <UButton
          :loading="isLoading"
          type="submit"
          color="neutral"
          class="btn btn-outline flex justify-center text-base"
          label="ورود به حساب کاربری"
        />
      </UForm>
      <UForm
        v-else-if="step === 3"
        :schema="step3Schema"
        :state="stateStep3"
        @submit.prevent="onSubmitStep3"
        class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-full flex flex-col items-center justify-center gap-5"
      >
        <div class="flex flex-col items-center-safe gap-1">
          <span class="font-medium text-xl md:text-3xl text-black leading-relaxed">ثبت نام</span>
          <span class="text-black/80 font-normal text-sm">ایجاد حساب کاربری جدید</span>
        </div>
        <div class="w-full flex flex-col gap-5">
          <BaseFormInput
            v-model="stateStep3.fullName"
            label="نام و نام خانوادگی"
            name="fullName"
            type="text"
            required
            :disable="false"
            class="w-full"
          />
          <BaseFormInput
            v-model="stateStep3.nationalCode"
            label="کد ملی"
            name="nationalCode"
            type="text"
            required
            :disable="false"
            class="w-full"
          />
          <BaseFormInput
            v-model="stateStep1.phoneNumber"
            label="شماره تلفن"
            name="phoneNumber"
            type="text"
            required
            :disable="true"
            class="w-full"
          />
          <BaseFormInput
            v-model="otpValue"
            label="کد تایید"
            name="otpArray"
            type="text"
            required
            :disable="true"
            class="w-full"
          />
          <BaseFormSelect
            required
            :disable="false"
            v-model="stateStep3.selectSport"
            :items="itemsSelect"
            name="selectSport"
            placeholder="رشته مورد نظر را انتخاب کنید"
            label="انتخاب رشته ورزشی"
          />
        </div>
        <UButton
          :loading="isLoading"
          type="submit"
          color="neutral"
          class="btn btn-outline flex justify-center text-base"
          label="ثبت نام"
        />
      </UForm>
    </div>
  </UApp>
</template>
<script setup lang="ts">
  import { ar } from '#ui/locale'
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import { otpCodeService, registerUsersService, requestOtpService } from '~/services/auth.service'

  const router = useRouter()
  const route = useRoute()
  const toastStore = useToastStore()
  const accountStore = useAccountStore()
  const gettingVariousDataStore = useGettingVariousDataStore()
  const step: Ref<number> = ref(1)
  const isLoading: Ref<boolean> = ref(false)
  const itemsSelect: Ref<{ label: string; value: string }[]> = ref([])

  const step1Schema = v.object({
    phoneNumber: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن الزامی است'),
      v.minLength(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد'),
      v.maxLength(12, 'شماره تلفن نباید بیشتر از ۱۲ رقم باشد'),
      v.regex(/^09\d{9,10}$/, 'شماره تلفن باید با 09 شروع شود')
    ),
  })
  const step2Schema = v.object({
    otpArray: v.pipe(
      v.array(v.string()),
      v.nonEmpty('کد تایید الزامی است'),
      v.minLength(6, 'کد باید ۶ رقم باشد'),
      v.maxLength(6, 'کد نباید بیشتر از ۶ رقم باشد')
    ),
  })
  const step3Schema = v.object({
    fullName: v.pipe(v.string(), v.trim(), v.nonEmpty('نام و نام خانوادگی الزامی است')),
    nationalCode: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('کد ملی الزامی است'),
      v.maxLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید'),
      v.minLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید'),
      v.regex(/^\d+$/, 'کد ملی فقط می‌تواند شامل اعداد باشد')
    ),
    selectSport: v.pipe(v.string(), v.trim(), v.minLength(1, 'لطفا یک از موارد رشته انتخاب کنید')),
  })

  type step1Schema = v.InferOutput<typeof step1Schema>
  type step2Schema = v.InferOutput<typeof step2Schema>
  type step3Schema = v.InferOutput<typeof step3Schema>

  const stateStep1 = reactive({
    phoneNumber: '',
  })
  const stateStep2 = reactive({
    otpArray: [] as string[],
  })
  const stateStep3 = reactive({
    fullName: '',
    nationalCode: '',
    selectSport: '' as string,
  })
  const otpValue = computed({
    get() {
      return stateStep2.otpArray.join('')
    },
    set(value) {
      stateStep2.otpArray = value.split('')
    },
  })

  async function onSubmitStep1(event: FormSubmitEvent<step1Schema>) {
    isLoading.value = true
    try {
      const result = await requestOtpService(event.data.phoneNumber)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        step.value = 2
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  async function onSubmitStep2(event: FormSubmitEvent<step2Schema>) {
    isLoading.value = true
    try {
      const otpString = event.data.otpArray.join('')
      const result = await otpCodeService(stateStep1.phoneNumber, otpString)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        accountStore.setAuthToken(result.data)
        setTimeout(() => {
          navigateTo(route.query.redirectTo as string, { replace: true })
        }, 200)
      } else if (result.statusCode === 404) {
        step.value = 3
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  async function onSubmitStep3(event: FormSubmitEvent<step3Schema>) {
    isLoading.value = true
    try {
      const otpString = stateStep2.otpArray.join('')
      const sport = Number(event.data.selectSport)
      const result = await registerUsersService(
        event.data.fullName,
        event.data.nationalCode,
        stateStep1.phoneNumber,
        otpString,
        sport
      )
      if (result.statusCode === 201) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        accountStore.setAuthToken(result.data)
        setTimeout(() => {
          router.push('/membership')
        }, 200)
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    watch(step, (value) => {
      if (value === 3) {
        gettingVariousDataStore.fetchSports()
        watchEffect(() => {
          itemsSelect.value = gettingVariousDataStore.sportData.map((item) => ({
            label: item.name,
            value: String(item.id),
          }))
        })
      }
    })
  })

  definePageMeta({
    layout: false,
  })

  useHead({
    title: 'ورود / ثبت‌ نام',
    meta: [{ name: 'description', content: 'ورود به حساب کاربری یا ایجاد حساب جدید.' }],
  })
</script>
