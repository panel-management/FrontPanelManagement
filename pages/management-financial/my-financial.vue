<template>
  <section class="container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full">
      <div class="flex flex-col gap-2 sm:p-2">
        <h2 class="text-lg sm:text-3xl font-bold">صورتحساب‌ های شما</h2>
        <span class="text-xs sm:text-sm font-medium">مشاهده و پرداخت صورتحساب‌ های معوق و آینده</span>
      </div>
    </div>
    <div class="w-full">
      <div class="w-full h-full flex flex-col gap-5">
        <div class="w-full h-full bg-white rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-teal-50 rounded-lg p-4 w-full flex flex-col gap-4">
            <div class="w-full flex max-sm:flex-col-reverse gap-2 justify-between">
              <div>
                <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه شهریور</span>
                <p class="text-sm font-medium">شهریه ماهانه</p>
              </div>
              <div>
                <UBadge color="success" icon="clarity:success-line" variant="soft" size="lg" label="پرداخت شده"/>
              </div>
            </div>
            <USeparator/>
            <div class="flex w-full justify-between">
              <span class="font-medium">مبلغ قابل پرداخت:</span>
              <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
            </div>
            <USeparator/>
            <div class="w-full flex flex-col gap-3">
              <div class="flex items-center gap-1">
                <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-5 text-black"/>
                <span class="font-medium">سررسید:</span>
                <span class="font-medium">۱۴۰۳/۰۷/۰۱</span>
              </div>
              <UButton color="primary" variant="solid" class="flex content-center items-center justify-center" label="پرداخت انلاین"/>
            </div>
          </div>
          <div class="bg-error-50 rounded-lg p-4 w-full flex flex-col gap-4">
            <div class="w-full flex max-sm:flex-col-reverse gap-2 justify-between">
              <div>
                <span class="font-semibold text-lg xl:text-xl">دستکش بوکس</span>
                <p class="text-sm font-medium">خرید دستکش بوکس حرفه‌ای</p>
              </div>
              <div>
                <UBadge color="error" icon="clarity:success-line" variant="soft" size="lg" label="پرداخت نشده"/>
              </div>
            </div>
            <USeparator/>
            <div class="flex w-full justify-between">
              <span class="font-medium">مبلغ قابل پرداخت:</span>
              <span class="font-medium"><span>۸۵۰,۰۰۰</span> تومان</span>
            </div>
            <USeparator/>
            <div class="w-full flex flex-col gap-3">
              <div class="flex items-center gap-1">
                <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-5 text-black"/>
                <span class="font-medium">سررسید:</span>
                <span class="font-medium">۱۴۰۳/۰۷/۰۱</span>
              </div>
              <UButton color="primary" variant="solid" class="flex content-center items-center justify-center" label="پرداخت انلاین"/>
            </div>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4 w-full flex flex-col gap-4">
            <div class="w-full flex max-sm:flex-col-reverse gap-2 justify-between">
              <div>
                <span class="font-semibold text-lg xl:text-xl">شهریه ماهانه مهر</span>
                <p class="text-sm font-medium">شهریه ماهانه کلاس کاراته</p>
              </div>
              <div>
                <UBadge color="warning" icon="clarity:success-line" variant="soft" size="lg" label="آینده"/>
              </div>
            </div>
            <USeparator/>
            <div class="flex w-full justify-between">
              <span class="font-medium">مبلغ قابل پرداخت:</span>
              <span class="font-medium"><span>۲,۵۰۰,۰۰۰</span> تومان</span>
            </div>
            <USeparator/>
            <div class="w-full flex flex-col gap-3">
              <div class="flex items-center gap-1">
                <UIcon name="material-symbols:calendar-today-outline-rounded" class="size-5 text-black"/>
                <span class="font-medium">سررسید:</span>
                <span class="font-medium">۱۴۰۳/۰۷/۰۱</span>
              </div>
              <UButton color="neutral" disabled variant="solid" class="flex content-center items-center justify-center" label="هنوز سر رسید نشده"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>