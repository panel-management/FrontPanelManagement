<template>
  <div class="container w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-2 lg:pt-6 max-lg:px-2 lg:px-2">
    <div v-for="data in activePlanDataMaster" :key="data.id"
      class="relative w-full md:max-w-sm bg-white rounded-2xl p-8 text-center border-2 border-sky-200 flex flex-col gap-10 transition-all duration-300 md:hover:-translate-y-2 hover:shadow-xl">
      <div class="flex flex-col gap-3">
        <h2 class="text-2xl font-bold text-black">{{ data.name }}</h2>
        <p class="text-base text-gray-500">{{ data.description }}</p>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-5xl font-extrabold text-black" v-if="Number(data.price) === 0">رایگان</span>
        <span class="text-5xl font-extrabold text-black" v-else>{{ Number(data.price).toLocaleString('fa-IR') }}</span>
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

      <!-- <button class="w-full py-4 px-5 bg-[#457b9d] text-white rounded-xl text-lg font-bold cursor-pointer transition-all duration-300 hover:bg-[#1d3557] hover:-translate-y-1"></button> -->
      <UButton :loading="isLoading[data.id]" @click="selectPlanMaster(data.id)"
        class="py-3 font-medium text-lg flex place-content-center" color="tertiary" variant="solid"
        :label="data.type === 'TRIAL' ? 'شروع دوره آزمایشی' : 'خرید پلن'" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { MasterPlanData } from '~/models/plan/masterPlan/MasterPlanData';
import { selectPlanYourSelfMaster } from '~/services/master.service';
import { getPlanMasterOrAdminService } from '~/services/masterPlan.service';

const isLoading = reactive<Record<number, boolean>>({})
const formData: Ref<MasterPlanData[]> = ref([])
const toastStore = useToastStore();
const router = useRouter()

async function selectPlanMaster(id: number) {
  isLoading[id] = true
  try {
    const result = await selectPlanYourSelfMaster(id);
    if (result.statusCode === 200) {
      toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      setInterval(() => {
        router.push('/dashboard')
      }, 200);
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
    console.log(result);
    if (result.statusCode === 200) {
      formData.value = Array.isArray(result.data) ? result.data : []
    }
  } catch (error: any) {
    console.log(error.message || error);
  }
}

const activePlanDataMaster = computed(() => formData.value.filter(item => item.isActive))

onMounted(() => {
  nextTick(() => getPlanMaster())
})
</script>