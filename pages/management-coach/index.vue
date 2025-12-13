<template>
  <section class="xl:container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-2 sm:p-2">
        <h2 class="text-lg sm:text-3xl font-bold">مدیریت مربیان</h2>
        <span class="text-xs sm:text-sm font-medium">مشاهده و مدیریت اطلاعات مربیان باشگاه</span>
      </div>
      <div class="sm:p-2">
        <UButton @click="modalStore.toggleModal('coachesAdd')" trailing-icon="material-symbols:person-add" size="lg"
          color="primary" variant="subtle">
          افزودن مربی جدید
        </UButton>
      </div>
    </div>
    <div class="bg-white flex flex-col gap-3 p-3 rounded-lg">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-bold">لیست مربیان ({{ formData.length }} نفر)</span>
        <p class="break-words font-medium text-sm">مشاهده کامل اطلاعات مربیان و مدیریت آنها</p>
      </div>
      <TableCoachTable :items="formData" v-model:loading="isLoading" @delete="handleDelete" />
    </div>
    <LazyWidgetModalCoachAdd v-model:open="modalStore.modals.coachesAdd" @success="getAllCoach" />
    <LazyWidgetModalCoachEdit v-model:open="modalStore.modals.coachesEdit" @updated="handleUpdate" />
  </section>
</template>
<script setup lang="ts">
import type { CoachData } from '~/models/users/coach/CoachData';
import { getAllCoachService } from '~/services/coach.service';

const formData: Ref<CoachData[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const modalStore = useModalStore()

async function getAllCoach() {
  isLoading.value = true
  try {
    const result = await getAllCoachService()
    if (result.statusCode === 200) {
      console.log(result.data);
      formData.value = Array.isArray(result.data) ? result.data : []
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false
  }
}

function handleUpdate(updatedItem: CoachData | undefined) {
  if (!updatedItem) return
  const index = formData.value.findIndex(u => u.user_id === updatedItem.user_id)
  if (index !== -1) {
    formData.value[index] = { ...formData.value[index], ...updatedItem }
  }
}

function handleDelete(id: number) {
  formData.value = formData.value.filter(user => user.user_id !== id)
}

onMounted(getAllCoach)
</script>