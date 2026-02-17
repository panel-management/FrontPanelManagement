<template>
  <ApexChart height="560" type="donut" :series="props.series" :options="chartOptions" />
</template>
<script setup lang="ts">
  const props = defineProps<{
    series: number[]
    chartLabels: string[]
  }>()

  const chartOptions = computed(() => ({
    chart: {
      type: 'donut',
      fontFamily: 'Vazirmatn, sans-serif',
    },
    labels: props.chartLabels,
    colors: ['#FF6384', '#36A2EB'],
    dataLabels: { enabled: false },
    title: {
      text: 'جمع تراکنش ها مالی',
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: '800',
        fontFamily: 'Vazirmatn, sans-serif',
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontFamily: 'Vazirmatn, sans-serif',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            value: {
              show: true,
              formatter: (val: string) => Number(val).toLocaleString('fa-IR') + ' تومان',
              fontFamily: 'Vazirmatn, sans-serif',
            },
            total: {
              show: true,
              label: 'مجموع',
              formatter: (w: any) =>
                w.globals.seriesTotals
                  .reduce((a: number, b: number) => a + b, 0)
                  .toLocaleString('fa-IR') + ' تومان',
              fontFamily: 'Vazirmatn, sans-serif',
            },
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => val.toLocaleString('fa-IR') + ' تومان',
      },
      style: {
        fontFamily: 'Vazirmatn, sans-serif',
      },
    },
  }))
</script>
