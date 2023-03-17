<template>
  <div class="wrapper">
    <el-form :inline="true" size="mini" :model="tableFormFilter">
      <el-form-item label="活动名称">
        <el-input
          v-model="tableFormFilter.activityName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>

      <el-form-item label="活动时间">
        <el-date-picker
          v-model="tableFormFilter.time"
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
        <el-button
          size="mini"
          type="primary"
          @click="getTableData"
        >查询</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="toEdit(null)"
        >新增</el-button>
      </div>
    </el-form>
    <el-table
      v-loading="isLoading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="50" />
      <!-- 同时是活动标签 -->
      <el-table-column prop="activityName" label="活动名称" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
      <!-- 线上或线下 -->
      <el-table-column prop="place" label="活动地点" />
      <el-table-column prop="participants" label="当前参与/报名人数" />
      <!-- <el-table-column prop="address" label="活动简介" /> -->
      <el-table-column prop="publishTime" label="发布时间" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="toEdit(scope.row)"
          >编辑</el-button>
          <template>
            <el-popconfirm title="你确定删除此活动吗？">
              <el-button
                slot="reference"
                style="margin-left: 10px"
                type="text"
                size="small"
                @click="handleClick(scope.row)"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="tableFormFilter.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="->, total, sizes, prev, pager, next, jumper"
      :total="tableFormFilter.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { reqActivityList } from '@/api/activity'
import * as dayjs from 'dayjs'
export default {
  data() {
    return {
      isLoading: false,
      tableFormFilter: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        activityName: undefined,
        time: [undefined, undefined]
      },
      tableData: [],
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
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.isLoading = true

      const res = await reqActivityList({
        ...this.tableFormFilter,
        startTime: this.tableFormFilter.time
          ? this.tableFormFilter.time[0]
          : undefined,
        endTime: this.tableFormFilter.time
          ? this.tableFormFilter.time[1]
          : undefined
      })
      console.log('获取活动列表', res)
      if (res.status === 200) {
        this.isLoading = false
        this.tableFormFilter.total = res.data.count
        this.tableData = res.data.rows
        this.tableData.forEach((item) => {
          item.startTime = dayjs(item.startTime).format('YYYY-MM-DD')
          item.endTime = dayjs(item.endTime).format('YYYY-MM-DD')
          item.publishTime = dayjs(item.publishTime).format('YYYY-MM-DD')
        })
      }
    },
    toEdit(item) {
      console.log('item', item)
      if (item) {
        this.$router.push(`/activityCenter/edit?id=${item.id}`)
      } else {
        this.$router.push(`/activityCenter/edit`)
      }
    },
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.tableFormFilter.pageNum = val
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 20px;
}
</style>
