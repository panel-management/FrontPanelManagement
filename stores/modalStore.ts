import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", () => {
  const modals = ref<Record<string, any>>({
    paymentAdd: false,
    paymentEdit: false,
    rankAdd: false,
    rankEdit: false,
    studentAdd: false,
    studentEdit: false,
    coachesAdd: false,
    coachesEdit: false,
    equipmentAdd: false,
    masterEdit: null,
    supportAdd: false,
  });

  function toggleModal(name: string, payload: any = null) {
    if (typeof modals.value[name] === "boolean") {
      modals.value[name] = !modals.value[name];
    } else {
      modals.value[name] = modals.value[name] ? null : payload;
    }
  }

  return {
    modals,
    toggleModal,
  };
});
