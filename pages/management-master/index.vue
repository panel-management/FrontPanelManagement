<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-2 sm:p-2">
        <h2 class="text-lg sm:text-3xl font-bold">مدیریت استاد ها</h2>
        <span class="text-xs sm:text-sm font-medium">مشاهده و مدیریت اطلاعات استاد های باشگاه</span>
      </div>
    </div>
    <div class="bg-white flex flex-col gap-3 p-3 rounded-lg">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-bold">لیست استاد ها ({{ formData.length }} نفر)</span>
        <p class="wrap-break-word font-medium text-sm">مشاهده کامل اطلاعات استاد ها و مدیریت آنها</p>
      </div>
      <TableMasterTable :items="formData" v-model:loading="isLoading" @deleted="handleDelete" />
    </div>
    <LazyWidgetModalMasterEdit v-model:open="modalStore.modals.masterEdit" @updated="handleUpdate" />
  </section>
</template>
<script setup lang="ts">
import type { MasterData } from '~/models/users/master/MasterData';
import { getAllMasterService } from '~/services/master.service';

const formData: Ref<MasterData[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const modalStore = useModalStore()

async function getMasterData() {
  isLoading.value = true
  try {
    const result = await getAllMasterService()
    if (result.statusCode === 200) {
      console.log(result.data);
      formData.value = Array.isArray(result.data) ? result.data : [];
    }
  } catch (error: any) {
    console.log(error.message || error)
  } finally {
    isLoading.value = false
  }
}

function handleUpdate(updatedItem: MasterData | undefined) {
  if (!updatedItem) return
  const index = formData.value.findIndex(u => u.user_id === updatedItem.user_id)
  if (index !== -1) {
    formData.value[index] = { ...formData.value[index], ...updatedItem }
  }
}

function handleDelete(id: number) {
  formData.value = formData.value.filter(user => user.user_id !== id)
}

onMounted(getMasterData)
</script>