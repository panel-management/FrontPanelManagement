<template>
  <section class="container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">حضور و غیاب</h2>
      <span class="text-xs sm:text-sm font-medium">مدیریت و ثبت حضور و غیاب هنرجویان</span>
    </div>
    <LazyBaseTabs :items="items" color="tertiary">
      <template #reports>
        <div class="w-full h-full flex flex-col gap-5">
          <LazyTablePresenceAbsence/>
        </div>
      </template>
      <template #attendanceRecord>
        <div class="w-full h-full p-4 bg-white flex flex-col gap-5 rounded-xl">
          <div class="flex flex-col gap-2">
            <span class="text-lg md:text-2xl font-bold">ثبت حضور غیاب هنرجویان</span>
            <p class="break-words font-medium text-sm">بر روی دکمه‌های وضعیت برای ثبت حضور کلیک کنید.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full h-full">
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4">
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-14 rounded-full bg-muted">ع</div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">علی احمدی</span>
                  <span class="belt-blue text-xs">کمربند ابی</span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton label="حاضر" icon="clarity:success-line" color="primary" variant="soft"/>
                  <UButton label="غیبت" icon="material-symbols:close-rounded" color="error" variant="soft"/>
                </div>
                <div class="w-full flex justify-around">
                  <UButton label="تاخیر" icon="material-symbols:alarm-on-rounded" color="warning" variant="soft"/>
                  <UButton label="موجه" icon="mdi:file-document-multiple" color="secondary" variant="soft"/>
                </div>
              </div>
            </div>
          </div>
          <USeparator/>
          <div class="w-full flex justify-center items-center">
            <UPagination v-model:page="page" show-edges :sibling-count="1" :total="50"/>
          </div>
        </div>
      </template>
    </LazyBaseTabs>
  </section>
</template>
<script setup lang="ts">
import type {TabsItem} from '@nuxt/ui'

const page = ref(5)

const items = [
  {
    label: 'گزارشات',
    slot: 'reports' as const
  },
  {
    label: 'ثبت حضور',
    slot: 'attendanceRecord' as const
  }
] satisfies TabsItem[]
</script>