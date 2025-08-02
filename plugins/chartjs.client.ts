import {Chart, registerables} from 'chart.js';

export default defineNuxtPlugin(() => {
    // Register all chart types, controllers, elements, etc.
    Chart.register(...registerables);
    return {
        provide: {
            chart: Chart
        }
    };
});