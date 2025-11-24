<template>
  <section class="xl:container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-2 sm:p-2">
        <h2 class="text-lg sm:text-3xl font-bold">لیست هنرجویان</h2>
        <span class="text-xs sm:text-sm font-medium">مشاهده و مدیریت اطلاعات هنرجویان باشگاه</span>
      </div>
      <div class="sm:p-2">
        <UButton @click="modalStore.toggleModal('studentAdd')" trailing-icon="material-symbols:person-add" size="lg"
          color="primary" variant="subtle">
          افزودن هنرجو جدید
        </UButton>
      </div>
    </div>
    <div class="bg-white flex flex-col gap-3 p-3 rounded-lg">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-bold">لیست هنرجویان ({{ formData.length }} نفر)</span>
        <p class="wrap-break-word font-medium text-sm">مشاهده کامل اطلاعات هنرجویان و مدیریت آنها</p>
      </div>
      <TableStudentsTable :items="formData" v-model:loading="isLoading" @refresh="getAllStudents" />
    </div>
    <LazyWidgetModalStudentAdd v-model:open="modalStore.modals.studentAdd" @success="getAllStudents" />
    <LazyWidgetModalStudentEdit v-model:open="modalStore.modals.studentEdit" @success="getAllStudents" />
  </section>
</template>
<script setup lang="ts">
import type { StudentData } from '~/models/users/student/StudentData';
import { getAllStudentService } from '~/services/student.service';

const modalStore = useModalStore()
const formData = shallowRef<StudentData[]>([])
const isLoading: Ref<boolean> = ref(true)

async function getAllStudents() {
  isLoading.value = true
  try {
    const result = await getAllStudentService()
    console.log(result.data);
    if (result.statusCode === 200) {
      formData.value = Array.isArray(result.data) ? result.data : []
    }
  } catch (error: any) {
    console.log(error.message || error);
  } finally {
    isLoading.value = false
  }
}

onMounted(getAllStudents)
</script>