import {defineStore} from "pinia";

export const useModalStore = defineStore("modal", () => {
    const modals = ref<Record<string, boolean>>({
        paymentAdd: false,
        paymentEdit: false,
        rankAdd: false,
        rankEdit: false,
        studentAdd: false,
    })

    function toggleModal(name: string) {
        modals.value[name] = !modals.value[name]
    }

    return {
        modals,
        toggleModal,
    }
});