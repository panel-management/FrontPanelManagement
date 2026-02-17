<template>
  <ApexChart height="560" type="bar" :series="props.series" :options="chartOptions" />
</template>
<script setup lang="ts">
  const props = defineProps<{
    categories: string[]
    series: { name: string; data: number[] }[]
    colors: string[]
  }>()

  const chartOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Vazirmatn, sans-serif',
    },
    plotOptions: {
      bar: {
        borderRadius: 3,
        distributed: true,
      },
    },
    colors: props.colors,
    dataLabels: { enabled: false },
    xaxis: {
      categories: props.categories,
      labels: {
        style: {
          fontFamily: 'Vazirmatn, sans-serif',
          fontSize: '14px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => val.toLocaleString('fa-IR'),
        style: { fontFamily: 'Vazirmatn, sans-serif' },
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => val.toLocaleString('fa-IR') + ' تومان',
      },
      style: {
        fontFamily: 'Vazirmatn, sans-serif',
        fontSize: '14px',
      },
    },
    title: {
      text: 'پرداخت‌ ها',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
      },
    },
  }
</script>
