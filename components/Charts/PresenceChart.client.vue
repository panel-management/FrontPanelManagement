<template>
  <canvas ref="canvasRef" class="w-full h-[35rem]"></canvas>
</template>
<script setup lang="ts">
const {$chart} = useNuxtApp();
const canvasRef = ref<HTMLCanvasElement | null>(null);

const Utils = {
  numbers: ({count, min, max}: { count: number; min: number; max: number }) =>
      Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min),

  CHART_COLORS: {
    green: 'rgb(75, 192, 192)',
  },

  transparentize: (color: string, opacity: number) => {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  },
};

const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

const labels = ['شنبه', 'یک شنبه', 'دوشنبه', 'سه شنبه', 'چهار شنبه', 'پنجشبه', 'جمعه'];

const data = {
  labels,
  datasets: [
    {
      type: 'bar',
      label: 'هنرجو',
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.6),
      borderColor: Utils.CHART_COLORS.green,
      data: Utils.numbers(NUMBER_CFG),
    }
  ]
};

let chartInstance: any = null;

onMounted(() => {
  nextTick(() => {
    if (canvasRef.value) {
      chartInstance = new $chart(canvasRef.value, {
        type: 'bar',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              rtl: true
            },
            title: {
              display: true,
              text: 'حضور هنرجو ها',
              font: {
                size: 20,
                weight: 800,
                family: 'Vazirmatn',
              }
            }
          },
        }
      });
    }
  })
});
</script>