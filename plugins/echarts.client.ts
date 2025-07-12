export default defineNuxtPlugin(async () => {
    const echarts = await import('echarts/core')
    const {LineChart, PieChart} = await import('echarts/charts')
    const {
        TitleComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        ToolboxComponent
    } = await import('echarts/components')
    const {CanvasRenderer} = await import('echarts/renderers')

    echarts.use([
        LineChart,
        PieChart,
        TitleComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        ToolboxComponent,
        CanvasRenderer
    ])

    return {
        provide: {
            echarts
        }
    }
})