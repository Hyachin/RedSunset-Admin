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
        text: '课程分类',
        x: 'center',
        y: '10'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '10%',
        left: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 26,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '乐器弹奏' },
            { value: 735, name: '美术书法' },
            { value: 580, name: '手机电脑' }
          ]
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
