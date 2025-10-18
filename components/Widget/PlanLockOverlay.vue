<template>
  <div v-if="showOverlay"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/40 overflow-hidden">
    <div class="bg-white p-6 rounded-lg shadow-lg min-w-lg h-54 flex flex-col justify-center items-center gap-5">
      <p class="font-medium w-96 text-center">{{ planStatus.message || 'پلن شما فعال نیست' }}</p>
      <UButton :to="linkPage" color="primary" class="p-3" label="پرداخت و فعال‌سازی پلن" />
    </div>
  </div>
</template>
<script setup lang="ts">
const isLoading: Ref<boolean> = ref(true)
const route = useRoute()
const userStore = useUsersStore()
const planStatus = storeToRefs(userStore).planStatus
const listLinkPage = ['/memberShip/plans', '/payment']

onMounted(async () => {
  await userStore.getStatusPlanUsers()
  isLoading.value = false
})

const showOverlay = computed(() => {
  if (isLoading.value) return false
  return !planStatus.value.isActive && !listLinkPage.includes(route.path)
})


const linkPage = computed(() => {
  if (planStatus.value.statusCode === 200) return '/memberShip/plans'
  if (planStatus.value.statusCode === 202) return '/payment'
  if (planStatus.value.statusCode === 403) return '/memberShip/plans'
})
</script>