<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'CourseList',
  mounted() {
    const lineCharts = echarts.init(this.$refs.charts)
    console.log(lineCharts)
    lineCharts.setOption({
      title: {
        text: '视频播放量排行',
        x: 'center',
        y: '10'
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value'
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: {
            show: false
          },
          data: [
            '项目十',
            '项目九',
            '项目八',
            '项目七',
            '项目六',
            '项目五',
            '项目四',
            '项目三',
            '项目二',
            '项目一'
          ]
        }
      ],
      series: [
        {
          name: '利润',
          type: 'bar',
          label: {
            show: true,
            position: 'right'
          },
          data: [200, 170, 240, 244, 200, 220, 210, 100, 289, 187],
          barWidth: '50%',
          itemStyle: {
            color: function(params) {
              var colorList = [
                '#c23531',
                '#2f4554',
                '#61a0a8',
                '#d48265',
                '#91c7ae',
                '#749f83',
                '#ca8622',
                '#BDA29A',
                '#6E7074',
                '#546570',
                '#C4CCD3'
              ]
              return colorList[params.dataIndex % colorList.length]
            }
          }
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
