import { LazyWidgetShowImagePreview } from "#components";

export const useShowImagePreview = () => {
  const overlay = useOverlay();

  const showImagePreview = (title: string, imageSrc: string) => {
    const modal = overlay.create(LazyWidgetShowImagePreview);
    modal.open({
      title,
      imageSrc,
    });
  };

  return {
    showImagePreview,
  };
};
