<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import { getStudentForEquipmentService } from '~/services/student.service'
  import type { StudentData } from '~/models/users/student/StudentData'
  import type { CreateTransactionEquipment } from '~/models/transactions/CreateTransactionEquipment'
  import { createTransactionEquipmentService } from '~/services/transactions.service'

  const emit = defineEmits(['update:open', 'success'])
  const toastStore = useToastStore()
  const studentData: Ref<StudentData[]> = ref([])
  const itemsSelect: Ref<any> = ref([])
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
    studentId: v.pipe(v.string(), v.trim(), v.nonEmpty('نام هنرجو الزامی است')),
    amount: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('مبلغ محصول الزامی است'),
      v.regex(/^\d+$/, 'مبلغ باید فقط شامل عدد باشد')
    ),
    description: v.pipe(v.string(), v.trim(), v.nonEmpty('توضیح درباره محصول الزامی است')),
  })

  type Schema = v.InferOutput<typeof schema>

  async function getListStudent() {
    try {
      const result = await getStudentForEquipmentService()
      console.log(result.data)
      if (result.statusCode === 200) {
        studentData.value = Array.isArray(result.data) ? result.data : []
        itemsSelect.value = studentData.value.map((item) => ({
          label: item.fullName,
          value: String(item.user_id),
        }))
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  const state = reactive<CreateTransactionEquipment>({
    studentId: '',
    amount: '',
    description: '',
  })

  const { displayPrice } = useFormattedPrice(toRef(state, 'amount'))

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const result = await createTransactionEquipmentService(event.data)
      if (result.statusCode === 201) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        localOpen.value = false
        emit('success')
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(getListStudent)
</script>

<template>
  <UModal
    v-model:open="localOpen"
    title="ثبت محصول جدید"
    description="اطلاعات محصول را تکمیل کنید"
    :ui="{ footer: 'justify-between' }"
  >
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <BaseFormSelect
            :required="true"
            v-model="state.studentId"
            :items="itemsSelect"
            name="studentId"
            placeholder="انتخاب نام هنرجو"
            label="انتخاب هنرجو"
          />
          <BaseFormInput
            v-model="displayPrice"
            label="مبلغ محصول(تومان)"
            name="amount"
            type="text"
            placeholder="1,000,000"
            required
            class="w-full"
          />
          <BaseFormInput
            v-model="state.description"
            label="توضیح درباره محصول"
            name="description"
            type="text"
            placeholder="مثال: خرید دستکش بوکس"
            required
            class="w-full"
          />
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false" />
            <UButton :loading="isLoading" label="ثبت محصول" color="primary" type="submit" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
