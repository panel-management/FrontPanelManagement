<template>
  <section class="container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full h-full flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">تنظیمات سیستم</h2>
      <span class="text-xs sm:text-sm font-medium">مدیریت و پیکربندی تنظیمات کلی سیستم</span>
    </div>
    <LazyBaseTabs v-model="active" :items="items" color="tertiary">
      <template #public>
        <div class="flex flex-col gap-6 p-4 bg-white rounded-lg w-full h-full">
          <div class="flex flex-col gap-2">
            <span class="text-2xl font-bold">اطلاعات عمومی باشگاه</span>
            <p class="break-words font-medium text-sm">اطلاعات تماس و معرفی باشگاه را تنظیم کنید.</p>
          </div>
          <UForm :schema="schema" :state="state" @submit.prevent="onSubmit">
            <div class="flex flex-col gap-5 w-full">
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput :required="false" v-model="state.name" label="نام باشگاه" name="name" type="text"
                               class="w-full"/>
                <BaseFormInput :required="false" v-model="state.phoneNumber" label="شماره تلفن باشگاه"
                               name="phoneNumber" type="text" class="w-full"/>
              </div>
              <div class="flex max-sm:flex-col items-center gap-5 sm:gap-2 w-full">
                <BaseFormInput :required="false" v-model="state.email" label="ایمیل باشگاه" name="email" type="text"
                               class="w-full"/>
                <BaseFormInput :required="false" v-model="state.webSite" label="وب سایت باشگاه" name="webSite"
                               type="text" class="w-full"/>
              </div>
              <div class="w-full">
                <BaseFormTextArea :required="false" v-model="state.address" label="آدرس باشگاه" name="address"
                                  class="w-full"/>
              </div>
              <div class="w-full">
                <BaseFormTextArea :required="false" v-model="state.about" label="درباره باشگاه" name="about"
                                  class="w-full"/>
              </div>
              <div class="flex justify-end gap-2 pt-4">
                <UButton label="ثبت اطلاعات" color="primary" type="submit" class="disabled:blur-[1px]"/>
              </div>
            </div>
          </UForm>
        </div>
      </template>
      <template #mali>
        <div class="flex flex-col gap-6 rounded-lg w-full h-full">
          <div class="bg-white p-4 rounded-xl w-full flex max-sm:flex-col sm:items-center justify-between gap-3 sm:gap-0">
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-2xl">انواع طرح ها</span>
              <p class="font-light text-sm">مدیریت طرح‌های مختلف عضویت و قیمت‌ ها</p>
            </div>
            <UButton @click="modalStore.toggleModal('paymentAdd')" label="طرح جدید" size="lg" icon="material-symbols:add-rounded" variant="solid" color="neutral" class="flex justify-center w-full sm:w-fit"/>
          </div>
          <div class="bg-white p-4 rounded-xl w-full flex flex-col gap-5">
            <div class="flex items-center gap-2">
              <UIcon name="heroicons:fire-16-solid" class="size-7 text-yellow-200"/>
              <span class="text-2xl font-bold">طرح‌ ها</span>
            </div>
            <div class="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4">
                <div class="w-full flex flex-col gap-1">
                  <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه شهریور</span>
                  <p class="text-sm font-medium">مدت: ۱ ماه</p>
                </div>
                <USeparator/>
                <div class="flex w-full justify-between">
                  <span class="font-medium">مبلغ:</span>
                  <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
                </div>
                <USeparator/>
                <div class="w-full flex gap-2">
                  <UButton @click="modalStore.toggleModal('paymentEdit')" color="primary" variant="solid"
                           icon="material-symbols-light:edit-document-rounded"
                           class="w-full flex content-center items-center justify-center" label="ویرایش"/>
                  <UButton color="error" variant="solid" icon="material-symbols:delete-forever-rounded"
                           class="w-full flex content-center items-center justify-center" label="حذف"/>
                </div>
              </div>
              <div class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4">
                <div class="w-full flex flex-col gap-1">
                  <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه شهریور</span>
                  <p class="text-sm font-medium">مدت: ۱ ماه</p>
                </div>
                <USeparator/>
                <div class="flex w-full justify-between">
                  <span class="font-medium">مبلغ:</span>
                  <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
                </div>
                <USeparator/>
                <div class="w-full flex gap-2">
                  <UButton @click="modalStore.toggleModal('paymentEdit')" color="primary" variant="solid"
                           icon="material-symbols-light:edit-document-rounded"
                           class="w-full flex content-center items-center justify-center" label="ویرایش"/>
                  <UButton color="error" variant="solid" icon="material-symbols:delete-forever-rounded"
                           class="w-full flex content-center items-center justify-center" label="حذف"/>
                </div>
              </div>
              <div class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4">
                <div class="w-full flex flex-col gap-1">
                  <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه شهریور</span>
                  <p class="text-sm font-medium">مدت: ۱ ماه</p>
                </div>
                <USeparator/>
                <div class="flex w-full justify-between">
                  <span class="font-medium">مبلغ:</span>
                  <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
                </div>
                <USeparator/>
                <div class="w-full flex gap-2">
                  <UButton @click="modalStore.toggleModal('paymentEdit')" color="primary" variant="solid"
                           icon="material-symbols-light:edit-document-rounded"
                           class="w-full flex content-center items-center justify-center" label="ویرایش"/>
                  <UButton color="error" variant="solid" icon="material-symbols:delete-forever-rounded"
                           class="w-full flex content-center items-center justify-center" label="حذف"/>
                </div>
              </div>
              <div class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4">
                <div class="w-full flex flex-col gap-1">
                  <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه شهریور</span>
                  <p class="text-sm font-medium">مدت: ۱ ماه</p>
                </div>
                <USeparator/>
                <div class="flex w-full justify-between">
                  <span class="font-medium">مبلغ:</span>
                  <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
                </div>
                <USeparator/>
                <div class="w-full flex gap-2">
                  <UButton @click="modalStore.toggleModal('paymentEdit')" color="primary" variant="solid"
                           icon="material-symbols-light:edit-document-rounded"
                           class="w-full flex content-center items-center justify-center" label="ویرایش"/>
                  <UButton color="error" variant="solid" icon="material-symbols:delete-forever-rounded"
                           class="w-full flex content-center items-center justify-center" label="حذف"/>
                </div>
              </div>
              <div class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4">
                <div class="w-full flex flex-col gap-1">
                  <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه شهریور</span>
                  <p class="text-sm font-medium">مدت: ۱ ماه</p>
                </div>
                <USeparator/>
                <div class="flex w-full justify-between">
                  <span class="font-medium">مبلغ:</span>
                  <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
                </div>
                <USeparator/>
                <div class="w-full flex gap-2">
                  <UButton @click="modalStore.toggleModal('paymentEdit')" color="primary" variant="solid"
                           icon="material-symbols-light:edit-document-rounded"
                           class="w-full flex content-center items-center justify-center" label="ویرایش"/>
                  <UButton color="error" variant="solid" icon="material-symbols:delete-forever-rounded"
                           class="w-full flex content-center items-center justify-center" label="حذف"/>
                </div>
              </div>
              <div class="bg-turquoise-50 rounded-lg p-4 w-full flex flex-col gap-4">
                <div class="w-full flex flex-col gap-1">
                  <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه شهریور</span>
                  <p class="text-sm font-medium">مدت: ۱ ماه</p>
                </div>
                <USeparator/>
                <div class="flex w-full justify-between">
                  <span class="font-medium">مبلغ:</span>
                  <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
                </div>
                <USeparator/>
                <div class="w-full flex gap-2">
                  <UButton @click="modalStore.toggleModal('paymentEdit')" color="primary" variant="solid"
                           icon="material-symbols-light:edit-document-rounded"
                           class="w-full flex content-center items-center justify-center" label="ویرایش"/>
                  <UButton color="error" variant="solid" icon="material-symbols:delete-forever-rounded"
                           class="w-full flex content-center items-center justify-center" label="حذف"/>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-xl w-full flex justify-center items-center">
            <UPagination v-model:page="page" show-edges :sibling-count="1" :total="50"/>
          </div>
        </div>
        <LazyWidgetModalPaymentAdd v-model:open="modalStore.modals.paymentAdd"/>
        <LazyWidgetModalPaymentEdit v-model:open="modalStore.modals.paymentEdit"/>
      </template>
      <template #ranks>
        <div class="flex flex-col gap-6 p-4 bg-white rounded-lg w-full h-full">
          <div class="w-full flex max-sm:flex-col items-center justify-between gap-4 sm:gap-2">
            <div class="flex flex-col gap-2">
              <span class="text-2xl font-bold">کمربندهای کاراته</span>
              <p class="break-words font-medium text-sm">ترتیب و رنگ کمربندها یا رتبه ها را مدیریت کنید.</p>
            </div>
            <UButton @click="modalStore.toggleModal('rankAdd')" label="رتبه جدید" size="lg"
                     icon="material-symbols:add-rounded" variant="solid" color="neutral"
                     class="max-sm:w-full flex justify-center"/>
          </div>
          <div class="flex flex-col gap-5 w-full p-2">
            <div class="flex items-center justify-between gap-2 w-full">
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center bg-muted rounded-full size-10">1</div>
                <div class="flex justify-center items-center belt-blue rounded-full size-14"></div>
                <div class="flex flex-col gap-1 mr-2">
                  <span class="font-semibold text-xl">کمربند ابی</span>
                  <p class="font-medium text-muted text-sm">رنگ: آبی</p>
                </div>
              </div>
              <div class="flex max-sm:flex-col gap-3">
                <UButton @click="modalStore.toggleModal('rankEdit')" icon="material-symbols-light:edit-document-rounded"
                         color="primary" size="lg" variant="outline" class="rounded-full"/>
                <UButton icon="material-symbols:delete-forever-rounded" color="error" size="lg" variant="outline"
                         class="rounded-full"/>
              </div>
            </div>
            <div class="flex items-center justify-between gap-2 w-full">
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center bg-muted rounded-full size-10">2</div>
                <div class="flex justify-center items-center belt-yellow rounded-full size-14"></div>
                <div class="flex flex-col gap-1 mr-2">
                  <span class="font-semibold text-xl">کمربند ابی</span>
                  <p class="font-medium text-muted text-sm">رنگ: آبی</p>
                </div>
              </div>
              <div class="flex max-sm:flex-col gap-3">
                <UButton @click="modalStore.toggleModal('rankEdit')" icon="material-symbols-light:edit-document-rounded"
                         color="primary" size="lg" variant="outline" class="rounded-full"/>
                <UButton icon="material-symbols:delete-forever-rounded" color="error" size="lg" variant="outline"
                         class="rounded-full"/>
              </div>
            </div>
            <div class="flex items-center justify-between gap-2 w-full">
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center bg-muted rounded-full size-10">3</div>
                <div class="flex justify-center items-center belt-orange rounded-full size-14"></div>
                <div class="flex flex-col gap-1 mr-2">
                  <span class="font-semibold text-xl">کمربند ابی</span>
                  <p class="font-medium text-muted text-sm">رنگ: آبی</p>
                </div>
              </div>
              <div class="flex max-sm:flex-col gap-3">
                <UButton @click="modalStore.toggleModal('rankEdit')" icon="material-symbols-light:edit-document-rounded"
                         color="primary" size="lg" variant="outline" class="rounded-full"/>
                <UButton icon="material-symbols:delete-forever-rounded" color="error" size="lg" variant="outline"
                         class="rounded-full"/>
              </div>
            </div>
            <div class="flex items-center justify-between gap-2 w-full">
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center bg-muted rounded-full size-10">4</div>
                <div class="flex justify-center items-center belt-green rounded-full size-14"></div>
                <div class="flex flex-col gap-1 mr-2">
                  <span class="font-semibold text-xl">کمربند ابی</span>
                  <p class="font-medium text-muted text-sm">رنگ: آبی</p>
                </div>
              </div>
              <div class="flex max-sm:flex-col gap-3">
                <UButton @click="modalStore.toggleModal('rankEdit')" icon="material-symbols-light:edit-document-rounded"
                         color="primary" size="lg" variant="outline" class="rounded-full"/>
                <UButton icon="material-symbols:delete-forever-rounded" color="error" size="lg" variant="outline"
                         class="rounded-full"/>
              </div>
            </div>
            <div class="flex items-center justify-between gap-2 w-full">
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center bg-muted rounded-full size-10">5</div>
                <div class="flex justify-center items-center belt-brown rounded-full size-14"></div>
                <div class="flex flex-col gap-1 mr-2">
                  <span class="font-semibold text-xl">کمربند ابی</span>
                  <p class="font-medium text-muted text-sm">رنگ: آبی</p>
                </div>
              </div>
              <div class="flex max-sm:flex-col gap-3">
                <UButton @click="modalStore.toggleModal('rankEdit')" icon="material-symbols-light:edit-document-rounded"
                         color="primary" size="lg" variant="outline" class="rounded-full"/>
                <UButton icon="material-symbols:delete-forever-rounded" color="error" size="lg" variant="outline"
                         class="rounded-full"/>
              </div>
            </div>
            <div class="flex items-center justify-between gap-2 w-full">
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center bg-muted rounded-full size-10">6</div>
                <div class="flex justify-center items-center belt-black rounded-full size-14"></div>
                <div class="flex flex-col gap-1 mr-2">
                  <span class="font-semibold text-xl">کمربند ابی</span>
                  <p class="font-medium text-muted text-sm">رنگ: آبی</p>
                </div>
              </div>
              <div @click="modalStore.toggleModal('rankEdit')" class="flex max-sm:flex-col gap-3">
                <UButton icon="material-symbols-light:edit-document-rounded" color="primary" size="lg" variant="outline"
                         class="rounded-full"/>
                <UButton icon="material-symbols:delete-forever-rounded" color="error" size="lg" variant="outline"
                         class="rounded-full"/>
              </div>
            </div>
          </div>
        </div>
        <LazyWidgetModalRankAdd v-model:open="modalStore.modals.rankAdd"/>
        <LazyWidgetModalRankEdit v-model:open="modalStore.modals.rankEdit"/>
      </template>
    </LazyBaseTabs>
  </section>
</template>
<script setup lang="ts">
import type {FormSubmitEvent, TabsItem} from "@nuxt/ui";
import * as v from "valibot";

const modalStore = useModalStore()
const route = useRoute()
const router = useRouter()
const page = ref(5)
const validTabs = ['public', 'mali', 'ranks']
const active = computed({
  get() {
    const currentTab = route.query.tab as string || 'public'
    if (!validTabs.includes(currentTab)) {
      navigateTo({path: '/settings', query: {tab: 'public'}}, {replace: true})
    }
    return currentTab
  },
  set(tab) {
    if (validTabs.includes(tab)) {
      router.push({
        path: '/settings',
        query: {tab}
      })
    }
  }
})
const items = [
  {
    label: 'عمومی',
    icon: 'hugeicons:setting-07',
    value: 'public',
    slot: 'public' as const
  },
  {
    label: 'مالی',
    icon: 'solar:dollar-minimalistic-line-duotone',
    value: 'mali',
    slot: 'mali' as const
  },
  {
    label: 'رتبه ها',
    icon: 'solar:pallete-2-linear',
    value: 'ranks',
    slot: 'ranks' as const
  }
] satisfies TabsItem[]

const schema = v.object({
  name: v.pipe(
      v.string(),
      v.trim(),
  ),
  email: v.pipe(
      v.string(),
      v.trim()
  ),
  webSite: v.pipe(
      v.string(),
      v.trim()
  ),
  phoneNumber: v.pipe(
      v.string(),
      v.trim(),
      v.maxLength(12, 'شماره تلفن نباید بیشتر از ۱۲ رقم باشد.')
  ),
  address: v.pipe(
      v.string(),
      v.trim(),
  ),
  about: v.pipe(
      v.string(),
      v.trim(),
  )
})

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
  name: '',
  email: '',
  webSite: '',
  phoneNumber: '',
  address: '',
  about: ''
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>