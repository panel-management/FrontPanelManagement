import { LazyWidgetSendMessage } from "#components";

export const useSendMessage = () => {
  const overlay = useOverlay();

  const showSendMessage = (title: string, onConfirm: (desc: string) => void) => {
    const modal = overlay.create(LazyWidgetSendMessage);
    modal.open({
      title,
      onConfirm: (desc: string) => {
        onConfirm(desc);
        modal.close();
      },
      onClose: () => modal.close(),
    });
  };

  return {
    showSendMessage,
  };
};
