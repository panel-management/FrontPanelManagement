import { LazyWidgetDialog } from '#components'

export const useConfirmDialog = () => {
  const overlay = useOverlay()

  const showConfirmDialog = (title: string, onConfirm: () => void) => {
    const modal = overlay.create(LazyWidgetDialog)
    modal.open({
      title,
      onConfirm,
      onClose: () => modal.close(),
    })
  }

  return {
    showConfirmDialog,
  }
}
