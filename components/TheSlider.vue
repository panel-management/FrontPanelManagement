<template>
  <UDrawer handle-only v-model:open="isOpen">
    <UIcon name="material-symbols:menu-rounded" mode="svg" class="size-7 text-black cursor-pointer"/>
    <template #title>
      <div class="md:px-2 lg:px-5">
        <span class="font-medium text-xl">logo title</span>
      </div>
    </template>
    <template #description></template>
    <template #body>
      <div class="md:p-2 lg:p-5">
        <UNavigationMenu orientation="vertical" :items="items"/>
      </div>
    </template>
  </UDrawer>
</template>
<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const isOpen: Ref<boolean> = ref(false)

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'داشتبورد',
      icon: 'mage:dashboard-2-fill',
      to: '/dashboard',
      onSelect: (e) => {
        isOpen.value = false
      }
    },
    {
      label: 'مدیریت هنرجویان',
      icon: 'material-symbols:person-raised-hand-rounded',
      to: '/management-students',
      onSelect: (e) => {
        isOpen.value = false
      }
    },
    {
      label: 'مدیریت مربیان',
      icon: 'ic:sharp-supervisor-account',
      to: '/management-coaches',
      onSelect: (e) => {
        isOpen.value = false
      }
    },
    {
      label: 'حضور و غیاب',
      icon: 'streamline:interface-file-clipboard-check-checkmark-edit-task-edition-checklist-check-success-clipboard-form',
      to: '/presence-absence',
      onSelect: (e) => {
        isOpen.value = false
      }
    },
    {
      label: 'مدیریت مالی',
      icon: 'file-icons:shopify',
      to: '/management-financial',
      onSelect: (e) => {
        isOpen.value = false
      }
    }
  ]
])
</script>