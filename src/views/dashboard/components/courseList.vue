<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
import { reqCourseRank } from '@/api/analysis'
export default {
  name: 'CourseList',
  data() {
    return {
      rankName: [],
      rankVal: []
    }
  },
  mounted() {
    this.getData()
  },

  methods: {
    initChart() {
      const lineCharts = echarts.init(this.$refs.charts)
      console.log(lineCharts)
      lineCharts.setOption({
        title: {
          text: '课程播放量排行',
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
            data: this.rankName
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
            data: this.rankVal,
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
    },
    async getData() {
      const res = await reqCourseRank()
      if (res.status === 200) {
        const list = res.data
        this.rankName = list.map((item) => item.courseName)
        this.rankVal = list.map((item) => item.showCount)
        this.initChart()
      }
    }
  }
}
</script>

<style>
.charts {
  width: 100%;
  height: 580px;
}
</style>
