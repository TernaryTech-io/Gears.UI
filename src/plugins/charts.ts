// Loads Apache ECharts (Apache-2.0), the first time a TChart is shown: its core, with only the
// charts, components and renderers TChart uses registered, so the rest isn't bundled.
import { once } from './once'

export const loadECharts = once(async () => {
  const [core, charts, components, renderers] = await Promise.all([
    import('echarts/core'),
    import('echarts/charts'),
    import('echarts/components'),
    import('echarts/renderers')
  ])
  core.use([
    charts.LineChart, charts.BarChart, charts.PieChart,
    components.GridComponent, components.TooltipComponent, components.LegendComponent,
    renderers.SVGRenderer, renderers.CanvasRenderer
  ])
  return core
})
