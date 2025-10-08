<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from "@nuxt/ui"
import type { UpdateMasterPlanData } from '~/models/plan/masterPlan/UpdateMasterPlanData';
import { updateMasterPlanService } from '~/services/masterPlan.service';

const isLoading: Ref<boolean> = ref(false)
const modalStore = useModalStore()
const toastStore = useToastStore()
const { showConfirmDialog } = useConfirmDialog()

const emit = defineEmits(['update:open', 'success']);

const props = defineProps({
  open: {
    type: [Boolean, Object, null] as any,
    default: false
  }
});

const planData = computed(() => {
  return props.open && typeof props.open === 'object' ? props.open : null;
});

const planId = computed(() => {
  return planData.value?.id || null;
});

const localOpen = computed({
  get: () => {
    if (props.open === null) return false;
    if (typeof props.open === 'object') return true;
    return !!props.open;
  },
  set: (val) => {
    if (!val) {
      modalStore.toggleModal('paymentAdminEdit', null);
    }
  }
});

const schema = v.object({
  description: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('توضیحات الزامی است.')
  ),
  isActive: v.pipe(
    v.boolean(),
  )
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive<UpdateMasterPlanData>({
  description: '',
  isActive: true
});

watch(() => planData.value, (newData) => {
  if (newData) {
    state.description = newData.description || '';
    state.isActive = newData.isActive ?? true;
  }
}, { immediate: true, deep: true });

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!planId.value) {
    toastStore.setAlert('پلنی با ایدی یافت نشد', '', 'error', 'bx:bxs-error')
    return;
  }

  isLoading.value = true;

  try {
    await showConfirmDialog('آیا مطمئن هستید که وضعیت این پلن تغییر دهید؟', async () => {
      const result = await updateMasterPlanService(planId.value, event.data);
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        localOpen.value = false;
        emit('success')
      }
    })
  } catch (error: any) {
    console.error(error?.message || error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UModal v-model:open="localOpen" title="ویرایش پلن" description="ویرایش اطلاعات پلن"
    :ui="{ footer: 'justify-between' }">
    <template #body>
      <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-5 w-full">
          <div class="w-full">
            <BaseFormInput v-model="state.description" label="توضیحات" name="description" type="text"
              placeholder="توضیح درباره پلن که ویرایش میخواهید انجام دهید؟" required class="w-full" />
          </div>
          <div class="w-full">
            <BaseFormCheckBox v-model="state.isActive" label="وضعیت پلن" name="isActive" :required="false" />
          </div>
          <div class="flex justify-between gap-2 pt-4">
            <UButton label="انصراف" color="neutral" variant="outline" @click="localOpen = false" />
            <UButton :loading="isLoading" label="ویرایش پلن" color="primary" type="submit" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>