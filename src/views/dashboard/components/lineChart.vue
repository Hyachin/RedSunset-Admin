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
        text: '播放量和讨论数统计',
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
        data: ['播放量', '讨论数'],
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
          name: '播放量',
          type: 'line',
          stack: 'Total',
          smooth: 0.6,
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210, 100, 200, 300]
        },
        {
          name: '讨论数',
          type: 'line',
          smooth: 0.6,
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310, 158, 198, 278]
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
