// Loads ApexCharts (the library Tabler's charts use), the first time a TChart is shown.
import { once } from './once'

export const loadApexCharts = once(async () => (await import('apexcharts')).default)
