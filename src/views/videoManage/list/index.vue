<template>
  <div class="wrapper">
    <el-form :inline="true" size="mini" :model="tableFormFilter">
      <el-form-item label="课程名称">
        <el-input
          v-model="tableFormFilter.courseName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="老师名称">
        <el-input
          v-model="tableFormFilter.teacherName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="一级分类">
        <el-select
          v-model="tableFormFilter.type1"
          clearable
          placeholder="请选择"
          @change="handleTypeChange"
        >
          <el-option
            v-for="item in typeList1"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="tableFormFilter.type2"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in typeList2"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select
          v-model="tableFormFilter.isAudit"
          clearable
          placeholder="请选择"
        >
          <el-option label="已审核" :value="1" />
          <el-option label="待审核" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
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
      <el-table-column prop="courseName" label="课程名称" />
      <el-table-column prop="teacherName" label="老师" />
      <el-table-column prop="typeName1" label="一级分类" />
      <!-- 线上或线下 -->
      <el-table-column prop="typeName2" label="二级分类" />

      <!-- <el-table-column prop="address" label="活动简介" /> -->
      <el-table-column prop="publishTime" label="发布时间" />
      <el-table-column prop="place" label="审核状态">
        <template v-slot="{ row }">
          <!-- <div>已审核</div> -->
          <div v-if="row.isAudit === false" style="color: #eb0827">待审核</div>
          <div v-else>已审核</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toEdit(scope.row)">{{
            scope.row.isAudit === false ? "审核" : "详情"
          }}</el-button>
          <template>
            <el-popconfirm
              title="你确定删除此课程吗？"
              @confirm="deleteCourse(scope.row)"
            >
              <el-button
                slot="reference"
                style="margin-left: 10px"
                type="text"
                size="small"
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
import { reqCourseList, reqCourseDel } from '@/api/course'
import { reqCourseTypeList, reqCourseTypeList2 } from '@/api/courseType'
export default {
  data() {
    return {
      isLoading: false,
      tableFormFilter: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        courseName: undefined
        // time: [undefined, undefined],
      },
      tableData: [],
      typeList1: [], // 一级分类下拉框
      typeList2: [], // 二级分类下拉框
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
    this.initSelectOptions()
  },
  methods: {
    // 只有一级分类在一开始加载，二级分类随着一级选中动态加载
    async initSelectOptions() {
      const type1 = await reqCourseTypeList()
      console.log('type1', type1)
      if (type1.status === 200) {
        this.typeList1 = type1.data
      }
    },
    async getTableData() {
      this.isLoading = true

      const res = await reqCourseList({
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
        console.log('res', res)
        this.tableData.forEach((item) => {
          item.teacherName = item.user.username
          item.typeName1 = item.coursetype.super.title
          item.typeName2 = item.coursetype.title
          item.isAudit = !item.videos.some((item2) => {
            return item2.isAudit === 0
          })
          // console.log("isAudit", isAudit); // true 是审核完
        })
      }
    },
    toEdit(item) {
      console.log('item', item)
      // if (item) {
      //   this.$router.push(`/videoManage/edit?id=${item.id}`);
      // } else {
      this.$router.push(
        `/videoManage/detail?isAudit=${item.isAudit}&id=${item.id}`
      )
      // }
    },
    async deleteCourse(row) {
      console.log(row)
      const res = await reqCourseDel(row.id)
      if (res.status === 200) {
        this.$message.success('删除成功')
        this.getTableData()
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.tableFormFilter.pageNum = val
      this.getTableData()
    },
    async handleTypeChange() {
      console.log(this.tableFormFilter.type1)
      const type2 = await reqCourseTypeList2(this.tableFormFilter.type1)
      if (type2.status === 200) {
        this.typeList2 = type2.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 20px;
}
</style>
