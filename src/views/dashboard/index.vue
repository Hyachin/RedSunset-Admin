<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col
        :span="6"
      ><div class="item item1">
        <h3 class="item-title">用户数</h3>
        <div class="item-bottom">
          <i class="iconfont icon-customer-official-fill" />
          <span class="item-count">{{ userTotal }}</span>
        </div>
      </div></el-col>
      <el-col
        :span="6"
      ><div class="item item2">
        <h3 class="item-title">课程数</h3>
        <div class="item-bottom">
          <i class="iconfont icon-vip-fill" />
          <span class="item-count">{{ courseTotal }}</span>
        </div>
      </div></el-col>
      <el-col
        :span="6"
      ><div class="item item3">
        <h3 class="item-title">讨论数</h3>
        <div class="item-bottom">
          <i class="iconfont icon-hot-for-atmosphere" />
          <span class="item-count">{{ courseCommentTotal }}</span>
        </div>
      </div></el-col>
      <el-col
        :span="6"
      ><div class="item item4">
        <h3 class="item-title">动态数</h3>
        <div class="item-bottom">
          <i class="iconfont icon-charts-line" />
          <span class="item-count">{{ dynamicTotal }}</span>
        </div>
      </div></el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top: 20px">
      <el-col :span="9">
        <div class="chart-item">
          <CourseList /></div></el-col>
      <el-col :span="9">
        <div class="chart-item">
          <LineChart /></div></el-col>
      <el-col :span="6">
        <div class="chart-item">
          <PieChart /></div></el-col>
    </el-row>
  </div>
</template>

<script>
import {
  reqUserTotal,
  reqCourseTotal,
  reqCourseCommentTotal,
  reqDynamicTotal
} from '@/api/analysis'
import CourseList from './components/courseList.vue'
import LineChart from './components/lineChart.vue'
import PieChart from './components/pieChart.vue'
export default {
  name: 'Dashboard',
  components: {
    CourseList,
    LineChart,
    PieChart
  },
  data() {
    return {
      userTotal: 0,
      courseTotal: 0,
      courseCommentTotal: 0,
      dynamicTotal: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      let res = {}
      res = await Promise.all([
        await reqUserTotal(),
        await reqCourseTotal(),
        await reqCourseCommentTotal(),
        await reqDynamicTotal()
      ])
      this.userTotal = res[0].data
      this.courseTotal = res[1].data
      this.courseCommentTotal = res[2].data
      this.dynamicTotal = res[3].data

      // if (res.status === 200) {
      //   this[key] = res.data;
      // }
      // console.log("赋值", this[key]);
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  padding: 20px;
}
.item {
  color: #fff;
  background: pink;
  padding: 16px;
  border-radius: 10px;
  .item-title {
    font-size: 16px;
    font-weight: normal;
  }
  .item-bottom {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    .iconfont {
      font-size: 24px;
    }
    .item-count {
      font-size: 30px;
    }
  }
  &.item1 {
    background-image: linear-gradient(
      to right bottom,
      rgb(236, 71, 134),
      rgb(185, 85, 164)
    );
  }
  &.item2 {
    background-image: linear-gradient(
      to right bottom,
      rgb(134, 94, 192),
      rgb(81, 68, 180)
    );
  }
  &.item3 {
    background-image: linear-gradient(
      to right bottom,
      rgb(86, 205, 243),
      rgb(113, 157, 227)
    );
  }
  &.item4 {
    background-image: linear-gradient(
      to right bottom,
      rgb(252, 188, 37),
      rgb(246, 128, 87)
    );
  }
}
.chart-item {
  box-shadow: 0 2px 8px 0 rgba(99, 99, 99, 0.2);
}
</style>
