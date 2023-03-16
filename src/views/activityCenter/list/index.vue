<template>
  <div class="wrapper">
    <el-form :inline="true" size="mini">
      <el-form-item label="活动名称">
        <el-input placeholder="请输入" />
      </el-form-item>

      <el-form-item label="活动时间">
        <el-date-picker
          v-model="value2"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <div style="margin-bottom: 20px">
        <el-button size="mini" type="primary">查询</el-button>
      </div>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="序号" type="index" width="50" />
      <!-- 同时是活动标签 -->
      <el-table-column prop="date" label="活动名称" />
      <el-table-column prop="province" label="开始时间" />
      <el-table-column prop="city" label="结束时间" />
      <!-- 线上或线下 -->
      <el-table-column prop="name" label="活动地点" />
      <el-table-column prop="city" label="当前参与/报名人数" />
      <!-- <el-table-column prop="address" label="活动简介" /> -->
      <el-table-column prop="zip" label="发布时间" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toEdit">编辑</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: ''
    }
  },
  methods: {
    toEdit() {
      this.$router.push('/activityCenter/edit')
    },
    handleClick(row) {
      console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 20px;
}
</style>
