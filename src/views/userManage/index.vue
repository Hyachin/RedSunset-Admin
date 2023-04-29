<template>
  <div class="wrapper">
    <el-form :inline="true" size="mini" :model="tableFormFilter">
      <el-form-item label="用户名">
        <el-input
          v-model="tableFormFilter.username"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          v-model="tableFormFilter.phone"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="角色">
        <el-select
          v-model="tableFormFilter.role"
          clearable
          placeholder="请选择"
        >
          <el-option label="老年人" value="0" />
          <el-option label="授课教师" value="1" />
          <el-option label="系统管理员" value="2" />
        </el-select>
      </el-form-item>

      <div style="margin-bottom: 20px">
        <el-button
          size="mini"
          type="primary"
          @click="getTableData"
        >查询</el-button>
        <el-button size="mini" type="success" @click="add">添加</el-button>
      </div>
    </el-form>
    <el-table
      :height="tableHeight"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column label="头像">
        <template v-slot="{ row }">
          <img :src="baseUrl + row.avatar" style="height: 50px; width: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="sign" label="个性签名" />
      <el-table-column prop="role" label="角色">
        <template v-slot="{ row }">
          <span v-if="row.role == 0">老年人</span>
          <span v-else-if="row.role == 1">授课教师</span>
          <span v-else>系统管理员</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="{ row }">
          <el-button
            icon="el-icon-edit"
            type="text"
            size="small"
            @click="edit(row)"
          >编辑</el-button>
          <!-- 123456 -->
          <el-button
            icon="el-icon-refresh"
            type="text"
            size="small"
          >重置密码</el-button>
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
import { reqUserList } from '@/api/user2'
export default {
  data() {
    return {
      tableHeight: document.body.offsetHeight - 300,
      tableFormFilter: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      tableData: [],
      baseUrl: process.env.VUE_APP_Back_End_Resource
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      console.log('获取数据')

      const res = await reqUserList(this.tableFormFilter)
      if (res.status === 200) {
        this.tableData = res.data.rows
        this.tableFormFilter.total = res.data.count
      }
    },
    edit() {},
    handleSizeChange(val) {
      this.tableFormFilter.pageSize = val
      console.log(`每页 ${val} 条`)
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableFormFilter.pageNum = val
      console.log(`当前页: ${val}`)
      this.getTableData()
    }
  }
}
</script>
<style>
.wrapper {
  margin: 20px;
}
</style>
