<template>
  <div class="flex justify-between items-center-safe">
    <LazyTheSlider />
    <div class="flex justify-center items-center-safe gap-4">
      <ClientOnly>
        <span class="text-lg">
          {{ jDate }} ساعت {{ currentTime }}
        </span>
        <template #fallback>
          <div class="bg-muted h-6 w-44 rounded animate-pulse"></div>
        </template>
      </ClientOnly>
      <UIcon v-if="isFullscreen" name="garden:minimize-stroke-12" mode="svg"
        class="size-[22px] text-black cursor-pointer  max-lg:hidden" @click="toggle" />
      <UIcon v-else name="garden:maximize-stroke-12" mode="svg"
        class="size-[22px] text-black cursor-pointer  max-lg:hidden" @click="toggle" />
      <UDropdownMenu v-model:open="isOpen" :items="dropDownMenu"
        :content="{ align: 'end', side: 'bottom', sideOffset: 8 }" :ui="{ content: 'w-48' }">
        <!-- <UIcon name="material-symbols:account-circle-full" mode="svg" class="size-7 text-black cursor-pointer" /> -->
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
      </UDropdownMenu>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useJDate } from "../composables/useJdate";
import type { DataUsers } from "~/models/users/dataUsers";
import { getDataUserService } from '~/services/users.service';

const route = useRoute()
const accountStore = useAccountStore()
const { isFullscreen, toggle } = useFullscreen();
const now = useNow()
const dropDownMenu = ref<DropdownMenuItem[][]>([])
const formData: Ref<DataUsers | null> = ref(null)
const isOpen: Ref<boolean> = ref(false)

const jDate = computed(() => useJDate(now.value))
const currentTime = computed(() =>
  now.value.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
)

async function viewDataUser() {
  try {
    const result = await getDataUserService()
    if (result.statusCode === 200) {
      formData.value = result.data as DataUsers
    } else if (result.statusCode === 401) {
      accountStore.isLogout();
    }
  } catch (e: any) {
    console.log(e)
  }
}

onMounted(viewDataUser);

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
          src: 'https://avatars.githubusercontent.com/u/739984?v=4'
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
        to: '/profile/coach',
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