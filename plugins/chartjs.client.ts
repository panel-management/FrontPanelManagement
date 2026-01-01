// plugins/chartjs.client.ts

import {
  Chart,
  // Bar
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  // Doughnut
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

export default defineNuxtPlugin(() => {
  Chart.register(
    // Bar
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    // Doughnut
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend,
    Title
  )

  return {
    provide: {
      chart: Chart,
    },
  }
})
