<template>
  <UApp :locale="ar" :toaster="{position: 'top-right'}">
    <div class="w-full h-full pt-5 pb-3 px-7 flex justify-center items-center">
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit"
             class="w-full lg:w-4/5 h-full flex flex-col items-center justify-center gap-5">
        <div class="flex flex-col gap-5 w-full">
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput required v-model="state.clubName" label="نام باشگاه" name="clubName" type="text"
                           class="w-full"/>
            <BaseFormInput required v-model="state.activityType" label="حوزه فعالیت" name="activityType" type="text"
                           class="w-full"/>
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput required v-model="state.clubPhoneNumber" label="شماره تلفن باشگاه" name="clubPhoneNumber"
                           type="text" class="w-full"/>
            <BaseFormInput required v-model="state.foundationDate" label="تاریخ تاسسیس باشگاه"
                           placeholder="مثال تاریخ 1380/01/30" name="foundationDate" type="text" class="w-full"/>
          </div>
          <BaseFormInput required v-model="state.goal" label="هدف ایجاد باشگاه" name="goal" type="text" class="w-full"/>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput :required="false" v-model="state.socialNetworks.instagram"
                           label="ایدی اینستاگرام باشگاه (اختیاری)" name="instagram" type="text" class="w-full"/>
            <BaseFormInput :required="false" v-model="state.socialNetworks.telegram"
                           label="لینک گروه تلگرام باشگاه (اختیاری)" name="telegram" type="text" class="w-full"/>
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput :required="false" v-model="state.socialNetworks.eitaa"
                           label="لینک گروه ایتا باشگاه (اختیاری)" name="eitaa" type="text" class="w-full"/>
            <BaseFormInput :required="false" v-model="state.socialNetworks.website" label="لینک وب سایت (اختیاری)"
                           name="website" type="text" class="w-full"/>
          </div>
          <div class="w-full">
            <BaseFormTextArea required v-model="state.clubAddress" label="آدرس باشگاه" name="clubAddress"
                              class="w-full"/>
          </div>
          <div class="w-full">
            <BaseFormTextArea required v-model="state.aboutClub" label="درباره باشگاه" name="aboutClub" class="w-full"/>
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <UButton :loading="isLoading" type="submit" color="neutral"
                     class="btn btn-outline flex justify-center text-base" label="ثبت اطلاعات"/>
          </div>
        </div>
      </UForm>
    </div>
  </UApp>
</template>
<script setup lang="ts">
import {ar} from "#ui/locale";
import * as v from "valibot";
import type {FormSubmitEvent} from "@nuxt/ui";
import {clubProfileService} from "~/services/clubProfile.service";

const isLoading: Ref<boolean> = ref(false);
const toastStore = useToastStore()
const router = useRouter()
const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/

const schema = v.object({
  clubName: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('نام باشگاه الزامی است')
  ),
  activityType: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('حوزه فعالیت الزامی است')
  ),
  clubPhoneNumber: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('شماره تلفن باشگاه الزامی است'),
      v.minLength(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد'),
      v.maxLength(12, 'شماره تلفن نباید بیشتر از ۱۲ رقم باشد'),
      v.custom((value) => /^\d+$/.test(value), 'شماره تلفن فقط می‌تواند شامل اعداد باشد')
  ),
  foundationDate: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('تاریخ تاسسیس باشگاه الزامی است'),
      v.custom((value) => dateRegex.test(value), 'فرمت تاریخ باید 1380/01/30 باشد')
  ),
  goal: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('هدف ایجاد باشگاه الزامی است')
  ),
  clubAddress: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('آدرس باشگاه الزامی است')
  ),
  aboutClub: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('درباره باشگاه الزامی است')
  )
})

type Schema = v.InferOutput<typeof schema>;

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
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  try {
    const result = await clubProfileService(event.data)
    console.log(result)
    if (result.statusCode === 201) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      setTimeout(() => {
        router.push('/dashboard')
      }, 200)
    }
  } catch (e: any) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}

definePageMeta({
  layout: false
})
</script>