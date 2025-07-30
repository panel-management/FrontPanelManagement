<template>
  <section class="container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full h-full flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">سیستم پشتیبانی</h2>
      <span class="text-xs sm:text-sm font-medium">مدیریت تیکت‌ها و پشتیبانی کاربران</span>
    </div>
    <div class="w-full h-full sm:p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-center items-center gap-4">
        <div class="size-14 rounded-full bg-turquoise-100 flex justify-center items-center">
          <UIcon name="streamline:interface-validation-check-circle-checkmark-addition-circle-success-check-validation-add-form" class="size-6 text-turquoise-500" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-semibold">1</span>
          <span class="text-sm font-light">تیکت‌های باز</span>
        </div>
      </div>
      <div class="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-center items-center gap-4">
        <div class="size-14 rounded-full bg-yellow-100 flex justify-center items-center">
          <UIcon name="ic:twotone-access-time-filled" class="size-6 text-yellow-400" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-semibold">1</span>
          <span class="text-sm font-light">در انتظار</span>
        </div>
      </div>
      <div class="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-center items-center gap-4">
        <div class="size-14 rounded-full bg-error-100 flex justify-center items-center">
          <UIcon name="proicons:question-circle" class="size-6 text-error-400" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-semibold">2</span>
          <span class="text-sm font-light">اولویت بالا</span>
        </div>
      </div>
      <div class="w-full h-full p-5 bg-white rounded-lg flex flex-col justify-center items-center gap-4">
        <div class="size-14 rounded-full bg-info-100 flex justify-center items-center">
          <UIcon name="material-symbols:android-chat" class="size-6 text-info-400" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-semibold">4</span>
          <span class="text-sm font-light">کل تیکت‌ها</span>
        </div>
      </div>
    </div>
    <div class="flex max-sm:flex-col gap-2 w-full h-full p-3 bg-white rounded-lg">
      <BaseSelectBoxDropdown v-model="state.priority" :items="prioritySelect" placeholder="همه اولویت ها"/>
      <BaseSelectBoxDropdown v-model="state.category" :items="categorySelect" placeholder="همه دسته بندی ها"/>
      <BaseSelectBoxDropdown v-model="state.status" :items="statusSelect" placeholder="همه وضعیت ها"/>
    </div>
    <div class="flex flex-col gap-3 p-4 bg-white rounded-lg">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-bold">مدیریت تیکت‌ها (4 مورد)</span>
        <p class="break-words font-medium text-sm">مشاهده و پاسخگویی به تیکت‌های کاربران</p>
      </div>
      <div class="w-full h-full flex flex-col gap-3">
        <NuxtLink to="/supports/chat-ticketnumber1" class="w-full p-4 rounded-xl bg-white border border-black/30 flex max-sm:flex-col gap-3 justify-between">
          <div class="flex max-sm:flex-col sm:items-center gap-2">
            <div class="size-12 rounded-full bg-muted hidden sm:flex justify-center items-center">
              <span class="font-light">1#</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-lg"><span class="font-light sm:hidden">1#</span> مشکل در ثبت حضور غیاب</span>
              <p class="text-sm font-light text-muted">توسط احمد رضایی • ۱۴۰۳/۰۶/۲۵ - ۱۴:۳۰</p>
            </div>
          </div>
          <div class="flex sm:flex-col gap-2">
            <UBadge label="باز" variant="solid" color="primary" class="w-fit"/>
            <UBadge label="بالا" variant="solid" color="warning" class="w-fit"/>
          </div>
        </NuxtLink>
        <NuxtLink to="/supports/chat-ticketnumber1" class="w-full p-4 rounded-xl bg-white border border-black/30 flex max-sm:flex-col gap-3 justify-between">
          <div class="flex max-sm:flex-col sm:items-center gap-2">
            <div class="size-12 rounded-full bg-muted hidden sm:flex justify-center items-center">
              <span class="font-light">1#</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-lg"><span class="font-light sm:hidden">1#</span> مشکل در ثبت حضور غیاب</span>
              <p class="text-sm font-light text-muted">توسط احمد رضایی • ۱۴۰۳/۰۶/۲۵ - ۱۴:۳۰</p>
            </div>
          </div>
          <div class="flex sm:flex-col gap-2">
            <UBadge label="باز" variant="solid" color="primary" class="w-fit"/>
            <UBadge label="بالا" variant="solid" color="warning" class="w-fit"/>
          </div>
        </NuxtLink>
        <NuxtLink to="/supports/chat-ticketnumber1" class="w-full p-4 rounded-xl bg-white border border-black/30 flex max-sm:flex-col gap-3 justify-between">
          <div class="flex max-sm:flex-col sm:items-center gap-2">
            <div class="size-12 rounded-full bg-muted hidden sm:flex justify-center items-center">
              <span class="font-light">1#</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-lg"><span class="font-light sm:hidden">1#</span> مشکل در ثبت حضور غیاب</span>
              <p class="text-sm font-light text-muted">توسط احمد رضایی • ۱۴۰۳/۰۶/۲۵ - ۱۴:۳۰</p>
            </div>
          </div>
          <div class="flex sm:flex-col gap-2">
            <UBadge label="باز" variant="solid" color="primary" class="w-fit"/>
            <UBadge label="بالا" variant="solid" color="warning" class="w-fit"/>
          </div>
        </NuxtLink>
        <NuxtLink to="/supports/chat-ticketnumber1" class="w-full p-4 rounded-xl bg-white border border-black/30 flex max-sm:flex-col gap-3 justify-between">
          <div class="flex max-sm:flex-col sm:items-center gap-2">
            <div class="size-12 rounded-full bg-muted hidden sm:flex justify-center items-center">
              <span class="font-light">1#</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-lg"><span class="font-light sm:hidden">1#</span> مشکل در ثبت حضور غیاب</span>
              <p class="text-sm font-light text-muted">توسط احمد رضایی • ۱۴۰۳/۰۶/۲۵ - ۱۴:۳۰</p>
            </div>
          </div>
          <div class="flex sm:flex-col gap-2">
            <UBadge label="باز" variant="solid" color="primary" class="w-fit"/>
            <UBadge label="بالا" variant="solid" color="warning" class="w-fit"/>
          </div>
        </NuxtLink>
        <NuxtLink to="/supports/chat-ticketnumber1" class="w-full p-4 rounded-xl bg-white border border-black/30 flex max-sm:flex-col gap-3 justify-between">
          <div class="flex max-sm:flex-col sm:items-center gap-2">
            <div class="size-12 rounded-full bg-muted hidden sm:flex justify-center items-center">
              <span class="font-light">1#</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-lg"><span class="font-light sm:hidden">1#</span> مشکل در ثبت حضور غیاب</span>
              <p class="text-sm font-light text-muted">توسط احمد رضایی • ۱۴۰۳/۰۶/۲۵ - ۱۴:۳۰</p>
            </div>
          </div>
          <div class="flex sm:flex-col gap-2">
            <UBadge label="باز" variant="solid" color="primary" class="w-fit"/>
            <UBadge label="بالا" variant="solid" color="warning" class="w-fit"/>
          </div>
        </NuxtLink>
      </div>
    </div>
    <USeparator/>
    <div class="w-full flex justify-center items-center">
      <UPagination v-model:page="page" show-edges :sibling-count="1" :total="50"/>
    </div>
  </section>
</template>
<script setup lang="ts">
const page = ref(5)

const statusSelect = ref(['باز', 'در انتظار', 'حل شده', 'بسته'])
const categorySelect = ref(['مشکل فنی', 'امور مالی', 'در خواست ویژگی', 'عمومی'])
const prioritySelect = ref(['کم', 'متوسط', 'زیاد'])

const state = reactive({
  status: '',
  category: '',
  priority: '',
});
</script>