<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
import { reqCourseType } from '@/api/analysis'
export default {
  name: 'LineChart',
  data() {
    return {
      pieData: {}
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
            data: this.pieData
          }
        ]
      })
    },
    async getData() {
      const res = await reqCourseType()
      if (res.status === 200) {
        console.log('res', res)
        this.pieData = res.data.map((item) => {
          return {
            value: item.count,
            name: item.title
          }
        })
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
