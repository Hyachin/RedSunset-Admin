<template>
  <!-- <div>1</div> -->
  <div class="wrapper">
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column
        type=""
        prop="id"
        label="分类ID"
        width="70"
        align="center"
      />
      <el-table-column prop="title" label="分类名称" sortable width="200" />
      <el-table-column label="头图" width="200">
        <template v-slot="{ row }">
          <img
            v-if="row.pic"
            :src="row.picUrl"
            alt=""
            style="width: 100px; height: 50px"
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="success"
            icon="el-icon-plus"
            size="mini"
            @click="add(row)"
          >添加</el-button>
          <el-button
            style="margin-right: 10px"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(row)"
          >编辑</el-button>
          <el-popconfirm title="这是一段内容确定删除吗？" @confirm="del(row)">
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加分类" :visible.sync="showDialog">
      <!-- <div>1</div> -->
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        class="form"
        :rules="rules"
      >
        <el-form-item prop="level" label="分类层级">
          <el-radio-group v-model="form.level">
            <!-- 一级 -->
            <el-radio
              v-show="isParent"
              :disabled="isEdit"
              :label="1"
            >同级</el-radio>
            <!-- 二级 -->
            <el-radio :disabled="isEdit" :label="2">{{
              isParent ? "子级" : "同级"
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="form.title" style="width: 300px" />
        </el-form-item>
        <el-form-item v-if="form.level === 1" label="分类头图" prop="pic">
          <el-upload
            :limit="1"
            :action="baseUrl + '/courseType/upload'"
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
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  reqCourseTypeList3,
  reqCourseTypeAdd,
  reqCourseTypeEdit,
  reqCourseTypeDel
} from '@/api/courseType'
export default {
  data() {
    return {
      headers: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc4OTU3Mjg5fQ.pVOMBPTYD4_6JH4MhVaT6MoExJ054mxhaTSOtiQTPcU'
      },
      tableData: [],
      showDialog: false,
      form: {
        level: 1
      },
      baseUrl: process.env.VUE_APP_Back_End,
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      isEdit: false, // 编辑or添加
      isParent: false, // 点击的是一级的还是二级的添加按钮
      currentItem: {},
      rules: {
        level: [
          {
            required: true,
            message: '请选择分类层级',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ],
        pic: [{ required: true, message: '请上传分类头图', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await reqCourseTypeList3()
      if (res.status === 200) {
        this.tableData = res.data
        this.tableData.forEach((item, index) => {
          item.picUrl = process.env.VUE_APP_Back_End_Resource + item.pic
        })
      }
    },
    add(row) {
      this.currentItem = row
      console.log('row', row)
      // 有父级id
      if (row.parentId) {
        this.isParent = false
        this.form.level = 2
        console.log('二级', this.form)
      } else {
        this.isParent = true
      }
      this.showDialog = true
      this.isEdit = false
      // this.form = {
      //   level: 1,
      // };
    },
    async edit(row) {
      this.currentItem = row
      this.showDialog = true
      this.isEdit = true
      if (row.parentId) {
        this.isParent = false
        this.form.level = 2
      } else {
        this.isParent = true
        this.form.level = 1
        this.fileList = [
          {
            name: '1.jpg',
            url: process.env.VUE_APP_Back_End_Resource + row.pic
          }
        ]
        this.form.pic = row.pic
      }
      this.$set(this.form, 'title', row.title)
    },
    async del(row) {
      const res = await reqCourseTypeDel({
        id: row.id
      })
      if (res.status === 200) {
        this.$message.success('删除成功')
        this.getData()
      }
    },
    async save() {
      this.$refs.form.validate(async(valid) => {
        console.log('this.form', this.form)
        if (valid) {
          console.log('valid', valid)
          console.log('current', this.currentItem)
          if (this.isEdit === false) {
            if (this.form.level === 1) {
              // 一级
              delete this.form.parentId
            } else {
              // 二级
              delete this.form.pic
              if (this.currentItem.parentId) {
                // 点的二级
                this.form.parentId = this.currentItem.parentId
              } else {
                // 点的一级
                this.form.parentId = this.currentItem.id
              }
            }
            const res = await reqCourseTypeAdd(this.form)
            if (res.status === 200) {
              this.$message.success('添加成功')
              this.showDialog = false
              this.getData()
            }
          } else {
            console.log('id', this.currentItem.id)
            console.log('编辑', this.form)
            if (this.form.level === 1) delete this.form.parentId
            this.form.id = this.currentItem.id
            const res = await reqCourseTypeEdit(this.form)
            if (res.status === 200) {
              this.$message.success('修改成功')
              this.showDialog = false
              this.getData()
              delete this.form.id
              delete this.form.pic
            }
          }
        }
      })
    },
    handleRemove(file) {
      console.log(file)
      this.$set(this.form, 'pic', '')
      this.fileList = []
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleUploadSuccess(res, file) {
      console.log('成功回调', res, file)
      this.$set(this.form, 'pic', res.data.url)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$refs.form.clearValidate('pic')
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
