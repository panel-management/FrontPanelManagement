<template>
  <section class="xl:container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full h-full flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">پشتیبانی</h2>
      <span class="text-xs sm:text-sm font-medium">مدیریت تیکت ‌ها</span>
    </div>
    <div
        class="w-full h-full p-4 flex max-sm:flex-col sm:items-center sm:justify-between gap-3 sm:gap-0 rounded-xl bg-white">
      <div class="flex flex-col gap-2">
        <span class="font-medium text-2xl">تیکت‌های من</span>
        <p class="font-light text-sm">مشاهده و پیگیری تیکت‌های شما</p>
      </div>
      <UButton @click="modalStore.toggleModal('supportAdd')" class="max-sm:flex max-sm:justify-center" color="primary"
               variant="solid" size="xl" label="ثبت تیکت جدید" icon="material-symbols-light:add-comment-outline"/>
    </div>
    <div class="w-full h-full flex flex-col gap-3">
      <NuxtLink to="/supports/chat-ticketnumber1" class="w-full p-4 rounded-xl bg-white flex justify-between">
        <div class="flex flex-col gap-2">
          <span class="font-medium text-lg sm:text-xl"><span>1#</span> مشکل در ثبت حضور و غیاب</span>
          <div class="flex max-md:flex-col gap-2">
            <div class="flex items-center gap-1">
              <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-5 bg-black"/>
              <span class="font-medium">۱۴۰۳/۰۶/۲۵ - ۱۴:۳۰</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ic:twotone-access-time-filled" class="size-5 bg-black"/>
              <span class="font-medium">آخرین بروزرسانی:</span>
              <span class="font-medium">۱۴۰۳/۰۶/۲۵ - ۱۶:۱۵</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <UBadge label="باز" variant="solid" color="primary"/>
          <UBadge label="بالا" variant="solid" color="warning"/>
        </div>
      </NuxtLink>
      <NuxtLink to="/supports/chat-ticketnumber2" class="w-full p-4 rounded-xl bg-white flex justify-between">
        <div class="flex flex-col gap-2">
          <span class="font-medium text-lg sm:text-xl"><span>2#</span> مشکل در ثبت حضور و غیاب</span>
          <div class="flex max-md:flex-col gap-2">
            <div class="flex items-center gap-1">
              <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-5 bg-black"/>
              <span class="font-medium">۱۴۰۳/۰۶/۲۵ - ۱۴:۳۰</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ic:twotone-access-time-filled" class="size-5 bg-black"/>
              <span class="font-medium">آخرین بروزرسانی:</span>
              <span class="font-medium">۱۴۰۳/۰۶/۲۵ - ۱۶:۱۵</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <UBadge label="در انتظار" variant="solid" color="warning"/>
          <UBadge label="متوسط" variant="solid" color="tertiary" class="flex justify-center"/>
        </div>
      </NuxtLink>
      <NuxtLink to="/supports/chat-ticketnumber3" class="w-full p-4 rounded-xl bg-white flex justify-between">
        <div class="flex flex-col gap-2">
          <span class="font-medium text-lg sm:text-xl"><span>3#</span> مشکل در صفحه پرداخت</span>
          <div class="flex max-md:flex-col gap-2">
            <div class="flex items-center gap-1">
              <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-5 bg-black"/>
              <span class="font-medium">۱۴۰۳/۰۶/۲۵ - ۱۴:۳۰</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ic:twotone-access-time-filled" class="size-5 bg-black"/>
              <span class="font-medium">آخرین بروزرسانی:</span>
              <span class="font-medium">۱۴۰۳/۰۶/۲۵ - ۱۶:۱۵</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <UBadge label="حل شده" variant="solid" color="neutral"/>
          <UBadge label="بالا" variant="solid" color="error" class="flex justify-center"/>
        </div>
      </NuxtLink>
      <NuxtLink to="/supports/chat-ticketnumber4" class="w-full p-4 rounded-xl bg-white flex justify-between">
        <div class="flex flex-col gap-2">
          <span class="font-medium text-lg sm:text-xl"><span>4#</span> درخواست گزارش حضور</span>
          <div class="flex max-md:flex-col gap-2">
            <div class="flex items-center gap-1">
              <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-5 bg-black"/>
              <span class="font-medium">۱۴۰۳/۰۶/۲۵ - ۱۴:۳۰</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="ic:twotone-access-time-filled" class="size-5 bg-black"/>
              <span class="font-medium">آخرین بروزرسانی:</span>
              <span class="font-medium">۱۴۰۳/۰۶/۲۵ - ۱۶:۱۵</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <UBadge label="بسته" variant="solid" color="success"/>
          <UBadge label="کم" variant="solid" color="info" class="flex justify-center"/>
        </div>
      </NuxtLink>
    </div>
    <div class="w-full flex bg-white p-4 rounded-lg justify-center items-center">
      <UPagination v-model:page="page" show-edges :sibling-count="1" :total="50"/>
    </div>
    <LazyWidgetModalSupportAdd v-model:open="modalStore.modals.supportAdd"/>
  </section>
</template>
<script setup lang="ts">
const page = ref(5)
const modalStore = useModalStore()
</script>