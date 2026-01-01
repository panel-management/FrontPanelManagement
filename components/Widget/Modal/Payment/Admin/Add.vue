<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import { TypePlan, type MasterPlanData } from '~/models/plan/masterPlan/MasterPlanData'
  import { createMasterPlanService } from '~/services/masterPlan.service'

  const emit = defineEmits(['update:open', 'success'])
  const toastStore = useToastStore()
  const isLoading: Ref<boolean> = ref(false)
  const itemsSelect = [
    { label: 'آزمایشی', value: TypePlan.TRIAL },
    { label: 'پولی', value: TypePlan.PAID },
  ]

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
    name: v.pipe(v.string(), v.trim(), v.nonEmpty('نام پلن الزامی است')),
    description: v.pipe(v.string(), v.trim()),
    price: v.union([
      v.literal(''),
      v.pipe(v.string(), v.trim(), v.regex(/^\d+$/, 'قیمت باید فقط شامل عدد باشد')),
    ]),
    features: v.pipe(
      v.array(v.pipe(v.string(), v.trim(), v.nonEmpty('متن ویژگی نمی‌ تواند خالی باشد'))),
      v.minLength(1, 'حداقل یک ویژگی باید وارد شود')
    ),
    type: v.pipe(v.string(), v.trim(), v.nonEmpty('نوع پلن الزامی است')),
    durationInDays: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('مدت زمان پلن الزامی است'),
      v.regex(/^\d+$/, 'مدت زمان باید فقط شامل عدد باشد')
    ),
  })

  type Schema = v.InferOutput<typeof schema>

  const state = reactive<MasterPlanData>({
    name: '',
    description: '',
    price: '',
    features: [''],
    type: '',
    durationInDays: '',
  })

  const { displayPrice } = useFormattedPrice(toRef(state, 'price'))

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const payload: MasterPlanData = {
        ...event.data,
        price: Number(event.data.price),
        durationInDays: Number(event.data.durationInDays),
        features: event.data.features.filter((f) => f.trim() !== ''),
      }
      const result = await createMasterPlanService(payload)
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

  function addItem() {
    state.features.push('')
  }

  function removeItem(index: number) {
    if (state.features.length > 1) {
      state.features.splice(index, 1)
    }
  }

  function resetForm() {
    state.name = ''
    state.description = ''
    state.price = ''
    state.features = ['']
    state.type = ''
    state.durationInDays = ''
  }
</script>

<template>
  <UModal
    v-model:open="localOpen"
    title="ثبت پلن جدید"
    description="اطلاعات پلن را تکمیل کنید"
    :ui="{ footer: 'justify-between' }"
  >
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="w-full">
            <BaseFormInput
              v-model="state.name"
              label="نام پلن"
              name="name"
              type="text"
              placeholder="مثال: پلن رایگان , پلن پولی"
              required
              class="w-full"
            />
          </div>
          <div class="w-full">
            <BaseFormInput
              v-model="state.description"
              label="توضیحات"
              name="description"
              type="text"
              placeholder="توضیحات درباره این پلن"
              :required="false"
              class="w-full"
            />
          </div>
          <div class="w-full">
            <BaseFormInput
              v-model="displayPrice"
              label="قیمت(تومان)"
              name="price"
              type="text"
              placeholder="1,500,000"
              :required="false"
              class="w-full"
            />
          </div>
          <div class="w-full flex flex-col">
            <div class="flex justify-between items-center">
              <label
                class="text-base font-medium after:text-red-500 after:content-['*'] after:text-sm after:pr-1"
                >ویژگی‌ها</label
              >
              <UButton
                type="button"
                color="neutral"
                variant="solid"
                size="sm"
                label="افزودن ویژگی"
                @click="addItem()"
              />
            </div>
            <div
              v-for="(item, index) in state.features"
              :key="index"
              class="flex items-center gap-2 pt-2"
            >
              <UFormField :name="`features.${index}`" class="w-full" :required="true">
                <UInput
                  v-model="state.features[index]"
                  type="text"
                  class="w-full"
                  color="neutral"
                  size="lg"
                />
              </UFormField>
              <UButton
                v-if="state.features.length > 1"
                color="error"
                variant="soft"
                icon="material-symbols:delete-forever"
                @click="removeItem(index)"
              />
            </div>
          </div>
          <div class="w-full">
            <BaseFormSelect
              required
              :disable="false"
              v-model="state.type"
              :items="itemsSelect"
              name="type"
              placeholder="پلن مورد نظر را انتخاب کنید"
              label="انتخاب پلن"
            />
          </div>
          <div class="w-full">
            <BaseFormInput
              v-model="state.durationInDays"
              label="مدت زمان"
              name="durationInDays"
              type="text"
              placeholder="مدت زمان باید به روز باشد"
              required
              class="w-full"
            />
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false" />
            <UButton :loading="isLoading" label="افزودن پلن جدید" color="primary" type="submit" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
