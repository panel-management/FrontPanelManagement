<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="shouldShow"
        class="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl bg-black/60">
        <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full flex flex-col items-center gap-6">
          <div class="size-20 bg-error-50 rounded-full flex items-center justify-center">
            <UIcon name="i-lucide-lock" class="size-10 text-error-500" />
          </div>
          <div class="text-center space-y-2">
            <h3 class="font-bold text-xl text-gray-900">دسترسی محدود</h3>
            <p class="text-gray-500 leading-relaxed">
              {{ displayMessage }}
            </p>
          </div>
          <UButton v-if="planStatus?.userType === 'MASTER' && !planStatus?.isPending" :to="targetLink" size="xl" block
            color="primary" :label="buttonLabel" />
          <p v-if="planStatus?.userType === 'STUDENT'" class="text-sm text-gray-400 italic">
            لطفاً برای تمدید دسترسی با مدیر مجموعه تماس بگیرید.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
const route = useRoute()
const userStore = useUsersStore()
const { planStatus, planStatusLoaded } = storeToRefs(userStore)

const shouldShow = computed(() => {
  if (!planStatusLoaded.value) return false
  return !planStatus.value?.isActive && !['/memberShip/plans', '/payment'].includes(route.path)
})

const displayMessage = computed(() => {
  if (planStatus.value?.userType === 'STUDENT') {
    return "حساب کاربری شما غیرفعال شده است. احتمالاً اعتبار پلن شما به پایان رسیده است.";
  }
  return planStatus.value?.message || "برای دسترسی نیاز به پلن فعال دارید.";
})

const targetLink = computed(() => {
  if (planStatus.value?.needsPayment) return '/payment'
  return '/memberShip/plans'
})

const buttonLabel = computed(() => {
  if (planStatus.value?.isExpired) return "تمدید اشتراک";
  if (planStatus.value?.needsPayment) return "پرداخت صورتحساب";
  return "انتخاب پلن جدید";
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