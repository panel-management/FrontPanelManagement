<template>
  <div
    class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center-safe gap-2 lg:pt-6 max-lg:px-2 lg:px-2"
  >
    <div
      v-for="data in activePlanDataMaster"
      :key="data.id"
      class="relative w-full md:max-w-sm bg-white rounded-2xl p-8 text-center border-2 border-sky-200 flex flex-col gap-10 transition-all duration-300 md:hover:-translate-y-2 hover:shadow-xl"
    >
      <div class="flex flex-col gap-3">
        <h2 class="text-2xl font-bold text-black">{{ data.name }}</h2>
        <p class="text-base text-gray-500">{{ data.description }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-5xl font-extrabold text-black" v-if="Number(data.price) === 0"
          >رایگان</span
        >
        <span class="text-5xl font-extrabold text-black" v-else>{{
          Number(data.price).toLocaleString('fa-IR')
        }}</span>
        <span class="block text-sm text-gray-500">به مدت {{ data.durationInDays }} روز</span>
      </div>
      <ul class="list-none flex flex-col flex-grow gap-3">
        <li class="flex items-center gap-2" v-for="feature in data.features">
          <UIcon name="clarity:success-line" class="size-5 text-teal-500" />
          <span class="text-base text-black">{{ feature }}</span>
        </li>
        <!-- <li class="flex items-center mb-4">
          <svg class="w-5 h-5 text-[#2a9d8f] ml-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span class="text-base text-black">استفاده از کمدهای عمومی</span>
        </li> -->
      </ul>
      <UButton
        :loading="isLoading[data.id]"
        @click="selectPlanMaster(data.id)"
        class="py-3 font-medium text-lg flex place-content-center"
        color="tertiary"
        variant="solid"
        :label="data.type === TypePlan.TRIAL ? 'شروع دوره آزمایشی' : 'انتخاب'"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { TypePlan, type MasterPlanData } from '~/models/plan/masterPlan/MasterPlanData'
  import { selectPlanYourSelfMasterService } from '~/services/master.service'
  import { getPlanMasterOrAdminService } from '~/services/masterPlan.service'

  const formData: Ref<MasterPlanData[]> = ref([])
  const isLoading = reactive<Record<number, boolean>>({})
  const toastStore = useToastStore()
  const userStore = useUsersStore()

  async function selectPlanMaster(id: number) {
    isLoading[id] = true
    try {
      const result = await selectPlanYourSelfMasterService(id)
      console.log(result)

      if (result.statusCode === 200) {
        toastStore.setAlert(result.data?.message, '', 'success', 'ep:success-filled')
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        await userStore.getStatusPlanUsers()
        const plan = userStore.planStatus
        if (plan?.needsPayment) {
          await navigateTo('/payment')
          return
        }
        if (plan?.isActive) {
          await navigateTo('/dashboard')
          return
        }
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading[id] = false
    }
  }

  async function getPlanMaster() {
    try {
      const result = await getPlanMasterOrAdminService()
      console.log(result)
      if (result.statusCode === 200) {
        formData.value = Array.isArray(result.data) ? result.data : []
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  const activePlanDataMaster = computed(() => formData.value.filter((item) => item.isActive))

  onMounted(getPlanMaster)
</script>
