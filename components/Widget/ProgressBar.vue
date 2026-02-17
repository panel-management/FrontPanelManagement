<template>
  <div v-if="formData" class="w-full p-5 flex flex-col items-center gap-6">
    <div class="flex flex-col items-center gap-2">
      <span class="text-xl font-bold text-black">وضعیت پلن شما</span>
      <p class="text-sm">{{ formData.planName }}</p>
    </div>
    <div class="relative size-52">
      <svg class="w-full h-full" viewBox="0 0 120 120">
        <circle class="stroke-slate-200" cx="60" cy="60" r="54" fill="none" stroke-width="12" />
        <circle
          class="stroke-info transition-all duration-500 ease-out"
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke-width="12"
          pathLength="100"
          stroke-dasharray="100"
          :stroke-dashoffset="formData.progressPercentage"
          stroke-linecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col justify-center items-center">
        <span class="text-3xl font-extrabold text-black">{{ progress }}%</span>
        <span class="text-xs">استفاده شده</span>
      </div>
    </div>
    <div class="w-full flex flex-col gap-2 text-center">
      <p class="text-base font-medium text-black">{{ formData.daysLeft }} روز باقی‌مانده</p>
      <p class="text-xs">پلن شما در تاریخ {{ useJDate(formData.endsAt) }} به پایان می‌رسد.</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import type { StatusPlanMaster } from '~/models/plan/masterPlan/StatusPlanMaster'
  import { getStatusPlanService } from '~/services/users.service'

  const formData = shallowRef<StatusPlanMaster | null>(null)
  const emit = defineEmits(['delete'])

  const progress = computed(() => formData.value?.progressPercentage?.toFixed(0) ?? 0)

  async function getStatusPlanMaster() {
    try {
      const result = await getStatusPlanService()
      if (result.statusCode === 200) {
        formData.value = result.data as StatusPlanMaster
        if (result?.isAdmin) emit('delete')
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  onMounted(getStatusPlanMaster)
</script>
