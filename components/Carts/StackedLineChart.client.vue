<template>
  <div ref="chartRef" class="w-full" style="height: 400px; touch-action: none"></div>
</template>

<script setup lang="ts">
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ReturnType<typeof import('echarts/core').init> | null = null
const {$echarts} = useNuxtApp()

const initChartLine = () => {
  if (!chartRef.value) return
  chartInstance = $echarts.init(chartRef.value)

  chartInstance.setOption({
    title: {
      text: 'روند ثبت نام',
      subtext: 'تعداد ثبت نام‌های ماهانه هنرجویان و مربیان',
      right: '-17%',
      textAlign: 'right',
      textStyle: {fontStyle: 'normal', fontSize: 18, fontFamily: 'Vazirmatn, sans-serif'},
      subtextStyle: {fontStyle: 'normal', fontSize: 15, fontFamily: 'Vazirmatn, sans-serif'},
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'ابان', 'آذر', 'دی', 'بهمن', 'اسفند']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'هنر جویان',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210, 10, 550, 450, 320, 740]
      },
      {
        name: 'مربیان',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310, 50, 40, 240, 110, 100]
      },
    ]
  })
}

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  nextTick(() => {
    initChartLine()
    window.addEventListener('resize', resizeChart)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>