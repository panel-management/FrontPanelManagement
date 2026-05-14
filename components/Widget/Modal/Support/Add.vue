<template>
  <UModal
    v-model:open="localOpen"
    title="ثبت تیکت جدید"
    description="مشکل یا درخواست خود را ثبت کنید"
    :ui="{ footer: 'justify-between' }"
  >
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <BaseFormInput
            v-model="state.title"
            label="عنوان تیکت"
            name="title"
            type="text"
            placeholder="عنوان مشکل یا درخواست خود را بنویسید."
            required
            class="w-full"
          />
          <div class="flex max-sm:flex-col gap-5 sm:gap-3 w-full">
            <BaseFormSelect
              :required="true"
              v-model="state.category"
              :items="categorySelect"
              name="category"
              placeholder="دسته بندی را انتخاب کنید"
              label="دسته بندی"
              class="w-full"
            />
            <BaseFormSelect
              :required="true"
              v-model="state.priority"
              :items="prioritySelect"
              name="priority"
              placeholder="اولویت را انتخاب کنید"
              label="اولویت"
              class="w-full"
            />
          </div>
          <BaseFormTextArea
            v-model="state.text"
            label="توضیحات"
            name="text"
            placeholder="مشکل یا درخواست خود را شرح دهید."
            required
            class="w-full"
          />
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false" />
            <UButton label="ارسال تیکت" color="primary" type="submit" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import * as v from 'valibot'
  import type { FormSubmitEvent } from '@nuxt/ui'
  import type { CreateTicket } from '~/models/ticket/CreateTicket'
  import { createTicketService } from '~/services/ticket.service'

  const emit = defineEmits(['update:open', 'refresh'])
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
    title: v.pipe(v.string(), v.trim(), v.nonEmpty('عنوان تیکت الزامی است')),
    text: v.pipe(v.string(), v.trim(), v.nonEmpty('توضیحات الزامی است')),
    category: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('دسته بندی الزامی است'),
      v.minLength(1, 'لطفا یک از موارد دسته ‌بندی انتخاب کنید')
    ),
    priority: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty('موارد الویت الزامی است'),
      v.minLength(1, 'لطفا یک از موارد اولویت انتخاب کنید')
    ),
  })

  type Schema = v.InferOutput<typeof schema>

  const state = reactive<CreateTicket>({
    title: '',
    text: '',
    category: '',
    priority: '',
  })

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true
    try {
      const result = await createTicketService(event.data as CreateTicket)
      if (result.statusCode === 201) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        localOpen.value = false
        resetForm()
        emit('refresh')
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  async function resetForm() {
    state.title = ''
    state.text = ''
    state.category = ''
    state.priority = ''
  }
</script>
