<template>
  <UModal
    v-model:open="localOpen"
    title="ویرایش طرح"
    description="ویرایش اطلاعات طرح"
    :ui="{ footer: 'justify-between' }"
  >
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <BaseFormInput
            v-model="state.name"
            label="نام طرح"
            name="name"
            type="text"
            placeholder="مثال: شهریه ویژه یا خرید تجهیزات ورزشی"
            required
            class="w-full"
          />
          <BaseFormInput
            v-model="state.description"
            label="توضیحات"
            name="description"
            type="text"
            placeholder="توضیح کوتاه درباره طرح"
            required
            class="w-full"
          />
          <BaseFormInput
            v-model="displayPrice"
            label="قیمت(تومان)"
            name="price"
            type="text"
            placeholder="2,500,000"
            required
            class="w-full"
          />
          <BaseFormInput
            v-model="state.durationInDays"
            label="مدت زمان"
            name="durationInDays"
            type="text"
            placeholder="مدت زمان باید به روز باشد"
            required
            class="w-full"
          />
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false" />
            <UButton label="ویرایش طرح" color="primary" type="submit" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import type { UpdatePlanStudent } from '~/models/plan/studentPlan/UpdatePlanStudent'
  import { updatePlanMasterByStudentService } from '~/services/masterPlan.service'

  const emit = defineEmits(['update:open', 'updated'])
  const toastStore = useToastStore()
  const modalStore = useModalStore()
  const isLoading: Ref<boolean> = ref(false)

  const props = defineProps({
    open: {
      type: [Boolean, Object, null] as any,
      default: false,
    },
  })

  const planData = computed(() => {
    return props.open && typeof props.open === 'object' ? props.open : null
  })

  const planId = computed(() => {
    return planData.value?.id || null
  })

  const localOpen = computed({
    get: () => {
      if (props.open === null) return false
      if (typeof props.open === 'object') return true
      return !!props.open
    },
    set: (val) => {
      if (!val) {
        modalStore.toggleModal('paymentEdit', null)
      }
    },
  })

  const schema = v.object({
    name: v.pipe(v.string(), v.trim(), v.nonEmpty('نام پلن الزامی است')),
    description: v.pipe(v.string(), v.trim(), v.nonEmpty('توضیحات پلن الزامی است')),
    price: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('مبلغ طرح الزامی است'),
      v.regex(/^\d+$/, 'مبلغ باید فقط شامل عدد باشد')
    ),
    durationInDays: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('مدت زمان طرح الزامی است'),
      v.regex(/^\d+$/, 'مدت زمان باید فقط شامل عدد باشد')
    ),
  })

  type Schema = v.InferOutput<typeof schema>

  const state = reactive<UpdatePlanStudent>({
    name: '',
    description: '',
    price: '',
    durationInDays: '',
  })

  const { displayPrice } = useFormattedPrice(toRef(state, 'price'))

  watch(
    () => planData.value,
    (newData) => {
      if (newData) {
        state.name = newData.name || ''
        state.description = newData.description || ''
        displayPrice.value = String(newData.price) || ''
        state.durationInDays = String(newData.durationInDays) || ''
      }
    },
    { immediate: true, deep: true }
  )

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const payload: UpdatePlanStudent = {
        ...event.data,
        price: Number(event.data.price),
        durationInDays: Number(event.data.durationInDays),
      }
      const result = await updatePlanMasterByStudentService(planId.value, payload)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        localOpen.value = false
        emit('updated', result.data)
        resetForm()
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  function resetForm() {
    state.name = ''
    state.description = ''
    displayPrice.value = ''
    state.durationInDays = ''
  }
</script>
