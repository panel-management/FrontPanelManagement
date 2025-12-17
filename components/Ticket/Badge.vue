<script setup lang="ts">
import { TicketCategory, TicketPriority, TicketStatus } from '~/models/ticket/TicketData'

const TicketStatusLabel: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'باز',
  [TicketStatus.CLOSED]: 'بسته',
  [TicketStatus.PENDING]: 'در انتظار',
  [TicketStatus.RESOLVED]: 'حل شد',
}

const TicketStatusColor: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'primary',
  [TicketStatus.CLOSED]: 'neutral',
  [TicketStatus.PENDING]: 'warning',
  [TicketStatus.RESOLVED]: 'success',
}

const TicketPriorityLabel: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: 'کم',
  [TicketPriority.MEDIUM]: 'متوسط',
  [TicketPriority.HIGH]: 'زیاد',
}

const TicketPriorityColor: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: 'primary',
  [TicketPriority.MEDIUM]: 'warning',
  [TicketPriority.HIGH]: 'error',
}

const TicketCategoryLabel: Record<TicketCategory, string> = {
  [TicketCategory.GENERAL]: 'عمومی',
  [TicketCategory.FEATURE_REQUEST]: 'درخواست ویژگی',
  [TicketCategory.FINANCIAL_AFFAIRS]: 'امور مالی',
  [TicketCategory.TECHNICAL_ISSUE]: 'مشکل فنی',
}

type BadgeType = 'status' | 'priority' | 'category'

const props = defineProps<{
  type: BadgeType
  value: TicketStatus | TicketPriority | TicketCategory
}>()

const badgeConfig = computed(() => {
  switch (props.type) {
    case 'status':
      return {
        label: TicketStatusLabel[props.value as TicketStatus],
        color: TicketStatusColor[props.value as TicketStatus]
      }

    case 'priority':
      return {
        label: TicketPriorityLabel[props.value as TicketPriority],
        color: TicketPriorityColor[props.value as TicketPriority]
      }

    case 'category':
      return {
        label: TicketCategoryLabel[props.value as TicketCategory],
        color: 'tertiary'
      }
  }
})
</script>

<template>
  <UBadge v-if="badgeConfig" :label="badgeConfig.label" variant="solid" :color="badgeConfig.color" class="w-fit" />
</template>