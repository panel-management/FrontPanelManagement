export const useFormattedPrice = (priceRef: Ref<string | number>) => {
  const displayPrice = computed({
    get() {
      if (!priceRef.value) return "";
      return Number(priceRef.value).toLocaleString("en-US");
    },
    set(val: string) {
      const numeric = val.replace(/[^\d]/g, "");
      priceRef.value = numeric;
    },
  });

  return {
    displayPrice,
  };
};
