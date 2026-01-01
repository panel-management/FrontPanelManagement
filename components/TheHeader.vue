<template>
  <div class="flex justify-between items-center-safe">
    <LazyTheSlider />
    <div class="flex justify-center items-center-safe gap-4">
      <ClientOnly>
        <span class="text-lg"> {{ jDate }} ساعت {{ currentTime }} </span>
        <template #fallback>
          <div class="bg-muted h-6 w-44 rounded animate-pulse"></div>
        </template>
      </ClientOnly>
      <UIcon
        v-if="isFullscreen"
        name="garden:minimize-stroke-12"
        mode="svg"
        class="size-[22px] text-black cursor-pointer max-lg:hidden"
        @click="toggle"
      />
      <UIcon
        v-else
        name="garden:maximize-stroke-12"
        mode="svg"
        class="size-[22px] text-black cursor-pointer max-lg:hidden"
        @click="toggle"
      />
      <UDropdownMenu
        v-model:open="isOpen"
        :items="dropDownMenu"
        :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
        :ui="{ content: 'w-48' }"
      >
        <!-- <UIcon name="material-symbols:account-circle-full" mode="svg" class="size-7 text-black cursor-pointer" /> -->
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
      </UDropdownMenu>
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { DropdownMenuItem } from '@nuxt/ui'
  import { useJDate } from '../composables/useJdate'
  import { Role } from '~/models/Role'

  const router = useRouter()
  const accountStore = useAccountStore()
  const roleStore = useRolesStore()
  const { isFullscreen, toggle } = useFullscreen()
  const now = useNow()
  const isOpen: Ref<boolean> = ref(false)

  const jDate = computed(() => useJDate(now.value))
  const currentTime = computed(() =>
    now.value.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  )

  onMounted(roleStore.getDetailUser)

  // defineShortcuts({
  //   o: () => isOpen.value = !isOpen.value,
  //   m: () => navigateTo("/profile/master", { replace: true }),
  //   c: () => navigateTo("/profile/coach", { replace: true }),
  //   u: () => navigateTo("/profile/student", { replace: true }),
  //   g: () => navigateTo("/setting/master", { replace: true }),
  //   a: () => navigateTo("/setting/admin", { replace: true }),
  //   t: () => navigateTo("/supports", { replace: true }),
  //   s: () => navigateTo("/supports/ticket", { replace: true }),
  // })

  const dropDownMenu = computed<DropdownMenuItem[][]>(() => {
    const user = roleStore.detailUser
    const role = user?.type

    const sectionHeader: DropdownMenuItem[] = [
      {
        label: user?.fullName || 'کاربر سیستم',
        avatar: {
          src: 'https://avatars.githubusercontent.com/u/739984?v=4',
        },
        type: 'label',
      },
    ]

    const sectionActions: DropdownMenuItem[] = []

    if (role === Role.Admin) {
      sectionActions.push(
        {
          label: 'تیکت ها',
          icon: 'bi:patch-question-fll',
          kbds: ['t'],
          to: '/supports',
        },
        {
          label: 'تنظیمات',
          icon: 'i-lucide-cog',
          kbds: ['f'],
          to: '/setting/admin',
        }
      )
    } else if (role === Role.Master) {
      sectionActions.push(
        {
          label: 'پروفایل',
          icon: 'i-lucide-user',
          kbds: ['p'],
          to: '/profile/master',
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
          to: '/setting/master',
        }
      )
    } else if (role === Role.Coach) {
      sectionActions.push({
        label: 'پروفایل',
        icon: 'i-lucide-user',
        kbds: ['p'],
        to: '/profile/coach',
      })
    } else if (role === Role.Student) {
      sectionActions.push({
        label: 'پروفایل',
        icon: 'i-lucide-user',
        kbds: ['p'],
        to: '/profile/student',
      })
    }

    sectionActions.push({
      label: 'خروج',
      icon: 'i-lucide-log-out',
      color: 'error',
      kbds: ['shift', 'q'],
      onSelect() {
        accountStore.isLogout()
        setTimeout(() => {
          router.push('/auth')
        }, 200)
      },
    })

    return [sectionHeader, sectionActions]
  })
</script>
