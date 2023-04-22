<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineChart',
  mounted() {
    const lineCharts = echarts.init(this.$refs.charts)
    console.log(lineCharts)
    lineCharts.setOption({
      title: {
        text: '动态发布数和课程讨论数统计',
        x: 'center',
        y: '10'
      },
      tooltip: {
        trigger: 'axis',
        y: '10%',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['动态发布数', '课程讨论数'],
        y: '10%'
      },

      grid: {
        top: '20%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: [
            '06:00',
            '08:00',
            '10:00',
            '12:00',
            '14:00',
            '16:00',
            '18:00',
            '20:00',
            '22:00',
            '24:00'
          ]
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '动态发布数',
          type: 'line',
          areaStyle: {},
          smooth: 0.3,
          emphasis: {
            focus: 'series'
          },
          data: [0, 0, 0, 1, 1, 3, 0, 0, 0, 0]
        },
        {
          name: '课程讨论数',
          type: 'line',
          smooth: 0.3,
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [0, 0, 0, 2, 0, 1, 5, 0, 0, 0]
        }
      ]
    })
  }
}
</script>

<style>
.charts {
  width: 100%;
  height: 580px;
}
</style>
