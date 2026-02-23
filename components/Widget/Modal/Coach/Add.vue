<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import type { CreateCoach } from '~/models/users/coach/CreateCoach'
  import { createCoachService } from '~/services/coach.service'

  const emit = defineEmits(['update:open', 'success'])
  const toastStore = useToastStore()
  const isLoading: Ref<boolean> = ref(false)

  const props = defineProps({
    open: {
      type: Boolean,
      required: true,
    },
  })

  const localOpen = computed({
    get: () => props.open,
    set: (Val) => emit('update:open', Val),
  })

  const schema = v.object({
    fullName: v.pipe(v.string(), v.trim(), v.nonEmpty('نام و نام خانوادگی مربی الزامی است')),
    nationalCode: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('کد ملی الزامی است'),
      v.maxLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید'),
      v.minLength(10, 'کد ملی دارای 10 رقم میباشد لطف مجدد وارد کنید'),
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
    history: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('سابقه تدریس الزامی است'),
      v.maxLength(2, 'سابقه تدریس باید حداکثر ۲ رقم باشد'),
      v.regex(/^\d+$/, 'سابقه تدریس باید عدد باشد')
    ),
    certificates: v.pipe(v.string(), v.trim(), v.nonEmpty('مدرک و گواهینامه مربی الزامی است')),
    birthDate: v.pipe(v.string(), v.trim(), v.nonEmpty('تاریخ تولد الزامی است')),
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

  const state = reactive<CreateCoach>({
    fullName: '',
    phoneNumber: '',
    nationalCode: '',
    certificates: '',
    history: '',
    age: '',
    birthDate: '',
    imageFile: undefined as File | undefined,
  })

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const result = await createCoachService(event.data)
      if (result.statusCode === 201) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        localOpen.value = false
        resetForm()
        emit('success')
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  function resetForm() {
    state.fullName = ''
    state.phoneNumber = ''
    state.nationalCode = ''
    state.certificates = ''
    state.history = ''
    state.age = ''
    state.birthDate = ''
    state.imageFile = ''
  }
</script>

<template>
  <UModal
    v-model:open="localOpen"
    title="ثبت مربی جدید"
    description="اطلاعات مربی را تکمیل کنید"
    :ui="{ footer: 'justify-between' }"
  >
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput
              v-model="state.fullName"
              label="نام و نام خانوادگی"
              name="fullName"
              type="text"
              placeholder="نام کامل مربی"
              required
              class="w-full"
            />
            <BaseFormInput
              v-model="state.nationalCode"
              label="کد ملی"
              name="nationalCode"
              type="text"
              placeholder="کد ملی مربی"
              required
              class="w-full"
            />
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseVueDatePicker
              required
              v-model="state.birthDate"
              label="تاریخ تولد"
              name="birthDate"
              class="w-full"
            />
            <BaseFormInput
              required
              v-model="state.age"
              label="سن"
              name="age"
              type="text"
              placeholder="سن"
              class="w-full"
            />
          </div>
          <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
            <BaseFormInput
              v-model="state.phoneNumber"
              label="شماره تلفن"
              name="phoneNumber"
              type="text"
              placeholder="شماره تلفن مربی"
              required
              class="w-full"
            />
            <BaseFormInput
              v-model="state.history"
              label="سابقه تدریس"
              name="history"
              type="text"
              placeholder="سابقه تدریس مربی"
              required
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-5 w-full">
            <BaseFormInput
              v-model="state.certificates"
              label="مدرک و گواهینامه ها"
              name="certificates"
              type="text"
              placeholder="مدرک و گواهینامه ها مربیگری"
              required
              class="w-full"
            />
            <BaseFormUploadFile
              :required="false"
              v-model="state.imageFile"
              label="ارسال عکس گواهینامه"
              name="imageFile"
              description="اپلود عکس با فرمت (jepg, png, webp, jpg) و حداکثر تا 2MB"
              class="w-full"
            />
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false" />
            <UButton :loading="isLoading" label="افزودن مربی" color="primary" type="submit" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
