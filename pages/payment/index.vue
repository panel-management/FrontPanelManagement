<template>
  <section class="flex max-lg:flex-col justify-between w-full h-full lg:pt-3">
    <div class="w-full h-full p-4 rounded-lg shadow bg-black">
      <h2 class="font-bold text-white text-sm md:text-lg">حساب به نام {{ paymentName }} می باشد.</h2>
      <div class="flex flex-col gap-3 pt-5">
        <span class="text-white flex max-md:flex-col max-md:gap-2 justify-between">
          شماره کارت بانک سامان:
          <span class="text-end">{{ paymentCard }}</span>
        </span>
        <span class="text-white flex max-md:flex-col max-md:gap-2 justify-between">
          شماره شبا بانک سامان:
          <span class="text-end text-sm sm:text-base">{{ paymentShaba }}</span>
        </span>
      </div>
    </div>
    <div class="w-full h-full pb-3 max-lg:pt-8 xl:px-7 flex justify-center items-center">
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit"
        class="w-full lg:w-4/5 h-full flex flex-col items-center justify-center gap-5">
        <div class="flex flex-col gap-5 w-full">
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput required v-model="state.bankName" label="نام بانک" name="bankName" type="text"
              class="w-full" />
            <BaseFormInput required v-model="displayPrice" label="مبلغ واریز" name="amount" type="text"
              class="w-full" />
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseDatePicker required v-model="state.paymentDate" label="تاریخ پرداخت" name="paymentDate"
              class="w-full" />
            <BaseFormInput required v-model="state.payerFullName" label="نام نام خانوادگی پرداخت کننده"
              name="payerFullName" type="text" class="w-full" />
          </div>
          <div class="w-full flex flex-col gap-5">
            <BaseFormInput required v-model="state.trackingNumber" label="شماره پیگیری" name="trackingNumber"
              type="text" class="w-full" />
            <BaseFormUploadFile required v-model="state.imageFile" label="ارسال  فیش واریزی" name="imageFile"
              description="اپلود عکس با فرمت (jepg, png, jpg) و حداکثر تا MB 1" class="w-full" />
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <UButton :loading="isLoading" type="submit" color="neutral"
              class="btn btn-outline flex justify-center text-base" label="ثبت فیش" />
          </div>
        </div>
      </UForm>
    </div>
  </section>
</template>
<script lang="ts" setup>
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";
import { createSubscriptionsMasterService } from "~/services/payment.service";
import type { createSubscriptionsMaster } from "~/models/Payments/CreateSubscriptionsMaster";

const isLoading: Ref<boolean> = ref(false);
const { jalaliToGregorian } = useDateConverter()
const toastStore = useToastStore()
const router = useRouter()
const config = useRuntimeConfig()
const userStore = useUsersStore()
const paymentName = config.public.PAYMENT_NAME
const paymentCard = config.public.PAYMENT_CARD
const paymentShaba = config.public.PAYMENT_SHABA

const schema = v.object({
  bankName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('نام بانک الزامی است')
  ),
  trackingNumber: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('شماره پیگیری الزامی است'),
    v.regex(/^\d+$/, 'شماره پیگیری فقد می تواند شامل عدد باشد')
  ),
  paymentDate: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('تاریخ پرداخت الزامی است'),
    v.regex(/^\d{4}\/\d{2}\/\d{2}$/, 'فرمت تاریخ باید 1404/05/20 باشد'),
  ),
  payerFullName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('نام و نام خانوادگی پرداخت کننده الزامی است')
  ),
  amount: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('مبلغ واریز الزامی است'),
    v.regex(/^\d+$/, 'مبلغ واریز فقد می تواند شامل عدد باشد')
  ),
  imageFile: v.pipe(
    v.file('فیش واریز الزامی است'),
    v.mimeType(['image/jpeg', 'image/png', 'image/jpg'], 'لطف عکس را با این فرمت ها اپلود کنید. (jpeg, png, jpg)'),
    v.maxSize(1024 * 1024 * 1, 'عکس باید زیر 1 مگابایت باشد.')
  )
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive<createSubscriptionsMaster>({
  payerFullName: '',
  bankName: '',
  paymentDate: '',
  trackingNumber: '',
  amount: '',
  imageFile: '',
});

const { displayPrice } = useFormattedPrice(toRef(state, 'amount'))

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    const payload: createSubscriptionsMaster = {
      ...event.data,
      paymentDate: jalaliToGregorian(event.data.paymentDate)
    }
    const result = await createSubscriptionsMasterService(payload)
    if (result.statusCode === 201) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      setInterval(async () => {
        router.push('/dashboard')
        await userStore.getStatusPlanUsers()
      }, 200);
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false
  }
}
</script>