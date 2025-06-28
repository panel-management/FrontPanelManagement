<template>
  <div class="flex justify-between items-center-safe">
    <UIcon name="material-symbols:menu-rounded" mode="svg" class="size-7 text-black"/>
    <div class="flex justify-center items-center-safe gap-5">
      <span class="text-lg">{{ useJDate(new Date()) }} ساعت {{ currentTime }}</span>
      <UIcon name="ant-design:fullscreen-outlined" mode="svg" class="size-7 text-black cursor-pointer"
             @click="toggleFullScreen"/>
      <UDropdownMenu :items="items" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
                     :ui="{ content: 'w-48' }">
        <UIcon name="material-symbols:account-circle-full" mode="svg" class="size-7 text-black cursor-pointer"/>
      </UDropdownMenu>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {DropdownMenuItem} from '@nuxt/ui'
import {useJDate} from "../composables/useJdate";

const isFullScreen = ref(false);
const currentTime = ref('');
let timerId = ref(null);

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

const updateFullScreenStatus = () => {
  isFullScreen.value = !!document.fullscreenElement;
};

onMounted(() => {
  document.addEventListener('fullscreenchange', updateFullScreenStatus);
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', updateFullScreenStatus);
});

const updateTime = () => {
  const now = new Date();
  const options = { hour: 'numeric', minute: 'numeric' };
  currentTime.value = now.toLocaleTimeString('fa-IR', options);
};

onMounted(() => {
  updateTime();
  timerId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timerId);
});

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'احسان فولادی',
      avatar: {
        src: 'https://github.com/benjamincanac.png'
      },
      type: 'label'
    }
  ],
  [
    {
      label: 'پروفایل',
      icon: 'i-lucide-user',
      kbds: ['p']
    },
    {
      label: 'تنظیمات',
      icon: 'i-lucide-cog',
      kbds: ['f']
    },
  ],
  [
    {
      label: 'خروج',
      icon: 'i-lucide-log-out',
      color: "error",
      kbds: ['shift', 'q']
    }
  ]
]);
</script>