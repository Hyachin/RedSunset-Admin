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
      <el-table-column label="头像" width="100">
        <template v-slot="{ row }">
          <img :src="baseUrl + row.avatar" style="height: 50px; width: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="110" />
      <el-table-column prop="sign" label="个性签名" />
      <el-table-column prop="role" label="角色" width="100">
        <template v-slot="{ row }">
          <span v-if="row.role == 0">老年人</span>
          <span v-else-if="row.role == 1">授课教师</span>
          <span v-else>系统管理员</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column fixed="right" label="操作">
        <template slot-scope="{ row }">
          <el-button
            style="margin-right: 10px"
            icon="el-icon-edit"
            type="text"
            size="small"
            @click="edit(row)"
          >编辑</el-button>
          <!-- 123456 -->
          <el-popconfirm title="确定重置密码吗" @confirm="refreshPassword(row)">
            <el-button
              slot="reference"
              icon="el-icon-refresh"
              type="text"
              size="small"
            >重置密码</el-button>
          </el-popconfirm>
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
    <el-dialog
      :title="isEdit ? '编辑信息' : '添加用户'"
      :visible.sync="showDialog"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item prop="username" style="width: 400px" label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item prop="role" label="角色">
          <el-select v-model="form.role" clearable placeholder="请选择">
            <el-option label="老年人" value="0" />
            <el-option label="授课教师" value="1" />
            <el-option label="系统管理员" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            :limit="1"
            :action="baseUrl2 + '/avatar/upload'"
            list-type="picture-card"
            :headers="headers"
            :on-success="handleUploadSuccess"
            :on-preview="handlePictureCardPreview"
            :on-exceed="handlePictureCardExceed"
            :file-list="fileList"
          >
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item style="width: 400px" label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item style="width: 400px" label="个性签名">
          <el-input v-model="form.sign" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  reqUserList,
  reqUserRegister,
  reqUserEdit2,
  reqRefreshPassword
} from '@/api/user2'
import * as dayjs from 'dayjs'
export default {
  data() {
    return {
      headers: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc4OTU3Mjg5fQ.pVOMBPTYD4_6JH4MhVaT6MoExJ054mxhaTSOtiQTPcU'
      },
      tableHeight: document.body.offsetHeight - 300,
      tableFormFilter: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      tableData: [],
      baseUrl: process.env.VUE_APP_Back_End_Resource,
      baseUrl2: process.env.VUE_APP_Back_End,
      form: {},
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      showDialog: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      isEdit: false
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
        this.tableData.forEach((item) => {
          item.createTime = dayjs(item.createTime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          item.updateTime = dayjs(item.updateTime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        })
        this.tableFormFilter.total = res.data.count
      }
    },
    edit(row) {
      this.isEdit = true
      this.showDialog = true
      console.log('row', row)
      this.form = {
        ...row,
        role: row.role + ''
      }
      this.fileList = [
        {
          name: '1.jpg',
          url: process.env.VUE_APP_Back_End_Resource + row.avatar
        }
      ]
    },
    handleSizeChange(val) {
      this.tableFormFilter.pageSize = val
      console.log(`每页 ${val} 条`)
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableFormFilter.pageNum = val
      console.log(`当前页: ${val}`)
      this.getTableData()
    },
    add() {
      this.isEdit = false
      this.showDialog = true
    },
    async save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          if (this.isEdit) {
            console.log('this.form', this.form)
            const res = await reqUserEdit2(this.form)
            if (res.status === 200) {
              this.$message.success('修改成功')
              this.showDialog = false
              this.getTableData()
            }
          } else {
            console.log('this.form', this.form)
            this.form.password = '123456' // 默认密码
            const res = await reqUserRegister(this.form)
            if (res.status === 200) {
              this.$message.success('添加成功')
              this.showDialog = false
              this.getTableData()
            }
          }
        }
      })
    },
    async refreshPassword(row) {
      console.log('重置密码')
      const { id } = row
      const res = await reqRefreshPassword({ id })
      if (res.status === 200) {
        this.$message.success('重置成功')
      }
    },
    handleRemove(file) {
      console.log(file)
      this.$set(this.form, 'avatar', '')
      this.fileList = []
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleUploadSuccess(res, file) {
      console.log('成功回调', res, file)
      this.$set(this.form, 'avatar', res.data.url)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$refs.form.clearValidate('avatar')
    },
    handlePictureCardExceed(files, fileList) {
      this.$message.error('你只能上传一张图片')
    }
  }
}
</script>
<style>
.wrapper {
  margin: 20px;
}
</style>
