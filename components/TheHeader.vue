<template>
  <div class="flex justify-between items-center-safe">
    <LazyTheSlider />
    <div class="flex justify-center items-center-safe gap-4">
      <span class="text-base sm:text-lg tabular-nums"> {{ jDate }} ساعت {{ currentTime }} </span>
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
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="avatar" />
      </UDropdownMenu>
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { DropdownMenuItem } from '@nuxt/ui'
  import { useJDate } from '../composables/useJdate'
  import { Role } from '~/models/Role'
  import type { BeforeInstallPromptEvent } from '@vite-pwa/nuxt/dist/runtime/plugins/types.js'

  const router = useRouter()
  const accountStore = useAccountStore()
  const roleStore = useRolesStore()
  const toastStore = useToastStore()
  const { isFullscreen, toggle } = useFullscreen()
  const now = useNow({ interval: 1000 })
  const isOpen: Ref<boolean> = ref(false)
  const isMounted: Ref<boolean> = ref(false)
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

  const jDate = computed(() => useJDate(now.value))
  const currentTime = computed(() => {
    if (!isMounted.value) return '...'
    return now.value.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  })

  onMounted(() => {
    isMounted.value = true
    roleStore.getDetailUser()
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
    })
  })

  defineShortcuts({
    o: () => (isOpen.value = !isOpen.value),
    m: () => navigateTo('/profile/master', { replace: true }),
    c: () => navigateTo('/profile/coach', { replace: true }),
    u: () => navigateTo('/profile/student', { replace: true }),
    g: () => navigateTo('/setting/master', { replace: true }),
    a: () => navigateTo('/setting/admin', { replace: true }),
    t: () => navigateTo('/supports', { replace: true }),
    s: () => navigateTo('/supports/ticket', { replace: true }),
  })

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
          kbds: ['a'],
          to: '/setting/admin',
        }
      )
    } else if (role === Role.Master) {
      sectionActions.push(
        {
          label: 'پروفایل',
          icon: 'i-lucide-user',
          kbds: ['m'],
          to: '/profile/master',
        },
        {
          label: 'پشتیبانی',
          icon: 'bi:patch-question-fll',
          kbds: ['s'],
          to: '/supports/ticket',
        },
        {
          label: 'تنظیمات',
          icon: 'i-lucide-cog',
          kbds: ['g'],
          to: '/setting/master',
        }
      )
    } else if (role === Role.Coach) {
      sectionActions.push({
        label: 'پروفایل',
        icon: 'i-lucide-user',
        kbds: ['c'],
        to: '/profile/coach',
      })
    } else if (role === Role.Student) {
      sectionActions.push({
        label: 'پروفایل',
        icon: 'i-lucide-user',
        kbds: ['u'],
        to: '/profile/student',
      })
    }

    sectionActions.push(
      {
        label: 'دانلود اپلیکیشن',
        icon: 'carbon:application-web',
        color: 'info',
        onSelect() {
          if (!deferredPrompt.value) return
          deferredPrompt.value.prompt()
          deferredPrompt.value.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              toastStore.setAlert('اپلیکیشن با موفقیت نصب شد', '', 'success', 'ep:success-filled')
            } else {
              toastStore.setAlert('خطا اپلیکیشن نصب نشد', '', 'error', 'bx:bxs-error')
            }
            deferredPrompt.value = null
          })
        },
      },
      {
        label: 'خروج',
        icon: 'i-lucide-log-out',
        color: 'error',
        onSelect() {
          accountStore.isLogout()
          setTimeout(() => {
            router.push('/auth')
          }, 200)
        },
      }
    )

    return [sectionHeader, sectionActions]
  })
</script>
