import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  const modals = ref<Record<string, any>>({
    paymentAdd: false,
    paymentAdminAdd: false,
    paymentEdit: false,
    paymentAdminEdit: false,
    studentAdd: false,
    studentEdit: false,
    coachesAdd: false,
    coachesEdit: false,
    equipmentAdd: false,
    masterEdit: false,
    supportAdd: false,
  })

  function toggleModal(name: string, payload?: any) {
    if (typeof modals.value[name] === 'boolean') {
      modals.value[name] = payload ?? !modals.value[name]
    } else {
      modals.value[name] = payload ?? null
    }
  }

  return {
    modals,
    toggleModal,
  }
})
