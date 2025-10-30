<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showOverlay"
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/40 overflow-hidden">
        <div class="bg-white p-6 rounded-lg shadow-lg min-w-lg h-54 flex flex-col justify-center items-center gap-5">
          <p class="font-medium w-96 text-center">{{ planStatus.message || 'پلن شما فعال نیست' }}</p>
          <UButton v-if="!planStatus.isPending" :to="linkPage" color="primary" class="p-3" :label="getLabelButton" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
import { Transition } from 'vue'

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
  return !planStatus.value?.isActive && !listLinkPage.includes(route.path)
})

const linkPage = computed(() => {
  const { statusCode, needsPayment, isPending } = planStatus.value
  if (statusCode === 200 || statusCode === 403) {
    return '/memberShip/plans'
  } else if (needsPayment) {
    return '/payment'
  } else if (isPending) {
    return null
  }
})

const getLabelButton = computed(() => {
  const { statusCode, needsPayment } = planStatus.value
  if (statusCode === 200 || statusCode === 403) {
    return "انتخاب پلن"
  } else if (needsPayment) {
    return "پرداخت پلن"
  }
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>