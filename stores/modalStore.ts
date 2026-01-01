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

  // function toggleModal(name: string, payload: any = null) {
  //   if (typeof modals.value[name] === "boolean") {
  //     modals.value[name] = !modals.value[name];
  //   } else {
  //     modals.value[name] = modals.value[name] ? null : payload;
  //   }
  // }

  // function toggleModal(name: string, payload: any = null) {
  //   if (payload && typeof payload === "object") {
  //     modals.value[name] = payload;
  //   } else if (modals.value[name] && typeof modals.value[name] === "object") {
  //     modals.value[name] = false;
  //   } else {
  //     modals.value[name] = !modals.value[name];
  //   }
  // }

  // function toggleModal(name: string, payload: any = null) {
  //   modals.value[name] = payload;
  // }

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
