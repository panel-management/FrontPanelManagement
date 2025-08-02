<template>
  <canvas ref="canvasRef" class="w-full h-[35rem]"></canvas>
</template>

<script setup lang="ts">
const {$chart} = useNuxtApp();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<any | null>(null);

const Utils = {
  numbers: ({count, min, max}: { count: number; min: number; max: number }) =>
      Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min),
  CHART_COLORS: {
    red: 'rgb(255, 99, 132)',
    blue: 'rgb(54, 162, 235)',
  },
};

const chartData = reactive({
  labels: ['خرید لوازم ورزشی', 'شهریه'],
  datasets: [
    {
      label: 'مبلغ',
      data: Utils.numbers({count: 5, min: 0, max: 100}),
      backgroundColor: Object.values(Utils.CHART_COLORS),
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      rtl: true,
    },
    title: {
      display: true,
      text: 'مبلغ ها',
      font: {
        size: 20,
        weight: 800,
        family: 'Vazirmatn',
      }
    },
  },
};

onMounted(() => {
  nextTick(() => {
    if (canvasRef.value) {
      chartInstance.value = new $chart(canvasRef.value, {
        type: 'doughnut',
        data: chartData,
        options: chartOptions,
      });
    }
  })
});
</script>