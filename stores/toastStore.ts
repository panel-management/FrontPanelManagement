export const useToastStore = defineStore('toast', () => {
  const toast = useToast()

  const setAlert = (title?: string, description?: string, color: string, icon?: string) => {
    toast.add({
      title: title,
      description: description,
      color: color,
      icon: icon,
      duration: 2000,
    })
  }

  return { setAlert }
})
