<template>
  <div class="flex justify-between items-center-safe">
    <LazyTheSlider />
    <div class="flex justify-center items-center-safe gap-5">
      <span class="text-lg">{{ useJDate(new Date()) }} ساعت {{ currentTime }}</span>
      <UIcon name="ant-design:fullscreen-outlined" mode="svg" class="size-7 text-black cursor-pointer  max-lg:hidden"
        @click="toggleFullScreen" />
      <UDropdownMenu v-model:open="isOpen" :items="dropDownMenu"
        :content="{ align: 'end', side: 'bottom', sideOffset: 8 }" :ui="{ content: 'w-48' }">
        <UIcon name="material-symbols:account-circle-full" mode="svg" class="size-7 text-black cursor-pointer" />
      </UDropdownMenu>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useJDate } from "../composables/useJdate";
import { getDataAllUsersService } from "~/services/users.service";
import type { DataUsers } from "~/models/users/dataUsers";

const dropDownMenu = ref<DropdownMenuItem[][]>([])
const isFullScreen: Ref<boolean> = ref(false);
const currentTime: Ref<string> = ref('');
const isOpen: Ref<boolean> = ref(false)
const formData: Ref<DataUsers | null> = ref(null)
const route = useRoute()
const accountStore = useAccountStore()
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

const updateTime = () => {
  const now = new Date();
  const options = { hour: 'numeric', minute: 'numeric' };
  currentTime.value = now.toLocaleTimeString('fa-IR', options);
};

async function viewDataUser() {
  try {
    const result = await getDataAllUsersService()
    if (result.statusCode === 200) {
      formData.value = result.data as DataUsers
    } else if (result.statusCode === 401) {
      accountStore.isLogout();
    }
  } catch (e: any) {
    console.log(e)
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', updateFullScreenStatus);

  updateTime();
  timerId = setInterval(updateTime, 1000);

  viewDataUser()
});

onUnmounted(() => {
  clearInterval(timerId);
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', updateFullScreenStatus);
});

defineShortcuts({
  o: () => isOpen.value = !isOpen.value,
  p: () => navigateTo("/profile", { replace: true }),
  f: () => navigateTo("/settings", { replace: true }),
  'alt_t': () => navigateTo("/supports", { replace: true }),
  s: () => navigateTo("/supports/ticket", { replace: true }),
  'shift_q': () => navigateTo("/", { replace: true }),
})

watch(formData, (value) => {
  dropDownMenu.value = [
    [
      {
        label: value?.fullName,
        avatar: {
          src: 'https://github.com/benjamincanac.png'
        },
        type: 'label'
      }
    ],
    [
      {
        label: 'پروفایل هنرجو',
        icon: 'i-lucide-user',
        kbds: ['p'],
        to: '/profile/student',
      },
      {
        label: 'پروفایل مربی',
        icon: 'i-lucide-user',
        kbds: ['p'],
        to: '/profile/coaches',
      },
      {
        label: 'تیکت ها',
        icon: 'bi:patch-question-fll',
        kbds: ['t'],
        to: '/supports',
      },
      {
        label: 'پشتیبانی',
        icon: 'bi:patch-question-fll',
        kbds: ['alt', 's'],
        to: '/supports/ticket',
      },
      {
        label: 'تنظیمات',
        icon: 'i-lucide-cog',
        kbds: ['f'],
        to: '/settings',
      }
    ],
    [
      {
        label: 'خروج',
        icon: 'i-lucide-log-out',
        color: "error",
        kbds: ['shift', 'q'],
        onSelect() {
          accountStore.isLogout()
          setTimeout(() => {
            navigateTo(`/auth?redirectTo=${encodeURIComponent(route.fullPath)}`, { replace: true })
          }, 200)
        }
      }
    ]
  ]
})
</script>