<template>
  <UDrawer handle-only v-model:open="isOpen">
    <UIcon name="material-symbols:menu-rounded" mode="svg" class="size-7 text-black cursor-pointer" />
    <template #title>
      <div class="md:px-2 lg:px-5 flex items-center gap-2">
        <img class="size-10 rounded object-cover" src="/image/logo.png" alt="club logo" loading="lazy"
          draggable="false">
        <span class="font-medium text-2xl">پنل مدیریت باشگاه</span>
      </div>
    </template>
    <template #description></template>
    <template #body>
      <div class="md:p-2 lg:p-5">
        <UNavigationMenu orientation="vertical" :items="items" />
      </div>
    </template>
  </UDrawer>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { Role } from '~/models/Role'

const roleStore = useRolesStore()
const isOpen: Ref<boolean> = ref(false)

onMounted(roleStore.getDetailUser)

const items = computed<NavigationMenuItem[][]>(() => {
  const role = roleStore.detailUser?.type

  if (role === Role.Admin) {
    return [[
      {
        label: 'داشبورد',
        icon: 'mage:dashboard-2-fill',
        to: '/dashboard',
        onSelect: () => isOpen.value = false
      },
      {
        label: 'مدیریت اساتید',
        icon: 'ic:sharp-supervisor-account',
        to: '/management-master',
        onSelect: () => isOpen.value = false
      },
      {
        label: 'مدیریت مالی',
        icon: 'file-icons:shopify',
        to: '/payment/list',
        onSelect: () => isOpen.value = false
      },
    ]]
  } else if (role === Role.Master) {
    return [[
      {
        label: 'داشبورد',
        icon: 'mage:dashboard-2-fill',
        to: '/dashboard',
        onSelect: () => isOpen.value = false
      },
      {
        label: 'مدیریت هنرجویان',
        icon: 'material-symbols:person-raised-hand-rounded',
        to: '/management-student',
        onSelect: () => isOpen.value = false
      },
      {
        label: 'مدیریت مربیان',
        icon: 'ic:sharp-supervisor-account',
        to: '/management-coach',
        onSelect: () => isOpen.value = false
      },
      {
        label: 'حضور و غیاب',
        icon: 'i-lucide-clipboard-check',
        to: '/presence-absence',
        onSelect: () => isOpen.value = false
      },
      {
        label: 'مدیریت مالی',
        icon: 'i-lucide-banknote',
        to: '/management-financial',
        onSelect: () => isOpen.value = false
      },
      {
        label: 'پلن ها',
        icon: 'solar:planet-broken',
        to: '/membership/plans',
        onSelect: () => isOpen.value = false
      }
    ]]
  } else if (role === Role.Student) {
    return [[
      {
        label: 'امور مالی من',
        icon: 'i-lucide-wallet',
        to: '/management-financial/my-financial',
        click: () => isOpen.value = false
      },
      // {
      //   label: 'داشبورد من',
      //   icon: 'mage:dashboard-2-fill',
      //   to: '/dashboard',
      //   click: () => isOpen.value = false
      // },
      // {
      //   label: 'برنامه تمرینی',
      //   icon: 'i-lucide-calendar',
      //   to: '/schedule',
      //   click: () => isOpen.value = false
      // }
    ]]
  }

  return [[]];
})
</script>