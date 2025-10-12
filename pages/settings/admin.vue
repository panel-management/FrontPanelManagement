<template>
  <section class="container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full h-full flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">تنظیمات سیستم</h2>
      <span class="text-xs sm:text-sm font-medium">مدیریت و پیکربندی تنظیمات کلی سیستم</span>
    </div>
    <LazyBaseTabs v-model="active" :items="items" color="tertiary">
      <template #mali>
        <div class="flex flex-col gap-6 rounded-lg w-full h-full">
          <div
            class="bg-white p-4 rounded-xl w-full flex max-sm:flex-col sm:items-center justify-between gap-3 sm:gap-0">
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-2xl">انواع پلن</span>
              <p class="font-light text-sm">مدیریت پلن های مختلف عضویت و قیمت‌ ها</p>
            </div>
            <UButton @click="modalStore.toggleModal('paymentAdminAdd')" label="پلن جدید" size="lg"
              icon="material-symbols:add-rounded" variant="solid" color="neutral"
              class="flex justify-center w-full sm:w-fit" />
          </div>
          <div class="bg-white p-4 rounded-xl w-full flex flex-col gap-5">
            <div class="flex items-center gap-2">
              <UIcon name="bx:bxs-planet" class="size-7 text-sky-400" />
              <span class="text-2xl font-bold">پلن ها</span>
            </div>
            <div v-if="!formData.length" class="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="n in 12" :key="n"
                class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4 animate-pulse">
                <div class="w-full flex flex-col gap-2">
                  <div class="h-6 bg-turquoise-200 rounded w-1/3"></div> <!-- name placeholder -->
                  <div class="h-4 bg-turquoise-200 rounded w-2/3"></div> <!-- description placeholder -->
                </div>
                <div class="w-full flex flex-col gap-4">
                  <div class="h-4 bg-turquoise-200 rounded w-full"></div>
                  <div class="flex w-full justify-between items-center gap-2">
                    <div class="h-4 bg-turquoise-200 rounded w-1/4"></div>
                    <div class="h-4 bg-turquoise-200 rounded w-1/2"></div>
                  </div>
                  <div class="h-4 bg-turquoise-200 rounded w-full"></div>
                  <div class="flex w-full justify-between items-center gap-2">
                    <div class="h-4 bg-turquoise-200 rounded w-1/4"></div>
                    <div class="h-4 bg-turquoise-200 rounded w-1/2"></div>
                  </div>
                  <div class="h-4 bg-turquoise-200 rounded w-full"></div>
                  <div class="flex w-full justify-between items-center gap-2">
                    <div class="h-4 bg-turquoise-200 rounded w-1/4"></div>
                    <div class="h-4 bg-turquoise-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div class="w-full flex gap-2">
                  <div class="h-10 bg-turquoise-200 rounded w-1/2"></div>
                  <div class="h-10 bg-turquoise-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div v-else class="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- <div class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4">
                <div class="w-full flex flex-col gap-1">
                  <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه شهریور</span>
                  <p class="text-sm font-medium">مدت: ۱ ماه</p>
                </div>
                <USeparator />
                <div class="flex w-full justify-between">
                  <span class="font-medium">مبلغ:</span>
                  <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
                </div>
                <USeparator />
                <div class="w-full flex gap-2">
                  <UButton @click="modalStore.toggleModal('paymentAdminEdit')" color="primary" variant="solid"
                    icon="material-symbols-light:edit-document-rounded"
                    class="w-full flex content-center items-center justify-center" label="ویرایش" />
                  <UButton color="error" variant="solid" icon="material-symbols:delete-forever-rounded"
                    class="w-full flex content-center items-center justify-center" label="حذف" />
                </div>
              </div> -->
              <div class="bg-teal-50 rounded-lg p-4 w-full flex flex-col items-center justify-between gap-4"
                v-for="data in formData" :key="data.id">
                <div class="w-full flex flex-col gap-2">
                  <span class="font-semibold text-lg xl:text-xl">{{ data.name }}</span>
                  <p class="font-semibold text-base">{{ data.description }}</p>
                </div>
                <div class="w-full flex flex-col gap-4">
                  <USeparator />
                  <div class="flex w-full justify-between items-center">
                    <span class="font-medium">ویژگی:</span>
                    <div class="flex flex-col gap-2">
                      <span class="font-medium" v-for="feature in data.features">{{ feature }}</span>
                    </div>
                  </div>
                  <USeparator />
                  <div class="flex w-full justify-between items-center">
                    <span class="font-medium">نوع:</span>
                    <span class="font-medium">{{ GetTypePlanMaster(data.type) }}</span>
                  </div>
                  <USeparator />
                  <div class="flex w-full justify-between items-center">
                    <span class="font-medium">مدت زمان:</span>
                    <span class="font-medium"><span>{{ data.durationInDays }}</span> روز</span>
                  </div>
                  <USeparator />
                  <div class="w-full" v-if="Number(data.price) === 0">
                    <span class="font-medium">پلن رایگان</span>
                  </div>
                  <div class="flex w-full justify-between items-center" v-else>
                    <span class="font-medium">مبلغ:</span>
                    <span class="font-medium"><span>{{ Number(data.price).toLocaleString('fa-IR') }}</span> تومان</span>
                  </div>
                  <USeparator />
                  <div class="flex w-full justify-between items-center">
                    <span class="font-medium">تاریخ ایجاد:</span>
                    <span class="font-medium">{{ useJDate(data.createdAt) }}</span>
                  </div>
                  <USeparator />
                </div>
                <div class="w-full flex gap-2">
                  <UButton @click="modalStore.toggleModal('paymentAdminEdit', data)" color="primary" variant="solid"
                    icon="material-symbols-light:edit-document-rounded"
                    class="w-full flex content-center items-center justify-center" label="ویرایش" />
                  <UButton :loading="isLoading" @click="deletePlanMaster(data.id)" color="error" variant="solid"
                    icon="material-symbols:delete-forever-rounded"
                    class="w-full flex content-center items-center justify-center" label="حذف" />
                </div>
              </div>
            </div>
            <!-- <div class="p-4 w-full flex justify-center items-center">
              <UPagination v-model:page="page" show-edges :sibling-count="1" :total="50" />
            </div> -->
          </div>
        </div>
        <LazyWidgetModalPaymentAdminAdd v-model:open="modalStore.modals.paymentAdminAdd" @success="handlerFetchPlanMaster"/>
        <LazyWidgetModalPaymentAdminEdit v-model:open="modalStore.modals.paymentAdminEdit" @success="handlerFetchPlanMaster" />
      </template>
    </LazyBaseTabs>
  </section>
</template>
<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import type { MasterPlanData } from "~/models/plan/masterPlan/MasterPlanData";
import { deleteMasterPlanService, getPlanMasterOrAdminService } from "~/services/masterPlan.service";

const isLoading: Ref<boolean> = ref(false)
const modalStore = useModalStore()
const toastStore = useToastStore()
const { showConfirmDialog } = useConfirmDialog()
const route = useRoute()
const router = useRouter()
// const page = ref(5)
const validTabs = ['mali']
const formData: Ref<MasterPlanData[]> = ref([])

const active = computed({
  get() {
    const currentTab = route.query.tab as string || 'mali'
    if (!validTabs.includes(currentTab)) {
      navigateTo({ path: '/settings/admin', query: { tab: 'mali' } }, { replace: true })
    }
    return currentTab
  },
  set(tab) {
    if (validTabs.includes(tab)) {
      router.push({
        path: '/settings/admin',
        query: { tab }
      })
    }
  }
})

const items = [
  {
    label: 'مالی',
    icon: 'solar:dollar-minimalistic-line-duotone',
    value: 'mali',
    slot: 'mali' as const
  }
] satisfies TabsItem[]

async function getPlanMaster() {
  try {
    const result = await getPlanMasterOrAdminService()
    if (result.statusCode === 200) {
      console.log(result.data);
      formData.value = Array.isArray(result.data) ? result.data : [];
    }
  } catch (error: any) {
    console.log(error.message || error);
  }
}

async function handlerFetchPlanMaster() {
  await getPlanMaster()
}

async function deletePlanMaster(id: number) {
  const plan = formData.value.find(item => item.id === id)
  if (!plan) return
  showConfirmDialog(`آیا مطمئن هستید که می‌خواهید پلن ${plan?.name} را حذف کنید؟`, async () => {
    try {
      const result = await deleteMasterPlanService(id)
      if (result.statusCode === 200) {
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
        handlerFetchPlanMaster()
      }
    } catch (error: any) {
      console.log(error.message || error);
    }
  })
}

onMounted(() => {
  nextTick(() => getPlanMaster())
})
</script>