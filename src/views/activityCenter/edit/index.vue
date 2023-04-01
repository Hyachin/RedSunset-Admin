<template>
  <div class="wrapper">
    <el-page-header title="返回" content="活动编辑" @back="goBack" />
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      class="form"
      :rules="rules"
    >
      <el-form-item label="活动名称" prop="activityName">
        <el-input v-model="form.activityName" />
      </el-form-item>
      <el-form-item label="活动地点" prop="place">
        <el-input v-model="form.place" />
      </el-form-item>
      <el-form-item label="活动时间" prop="time">
        <el-date-picker
          v-model="form.time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="截止时间" prop="deadline">
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择报名截止时间"
        />
      </el-form-item>
      <el-form-item label="活动封面" prop="imageId">
        <el-upload
          :limit="1"
          :action="baseUrl + '/activity/upload'"
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
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download" />
              </span>
              <span
                v-if="!disabled"
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
      <el-form-item label="活动详情" prop="detail">
        <div style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :default-config="toolbarConfig"
            :mode="mode"
          />
          <Editor
            v-model="form.detail"
            style="height: 500px; overflow-y: hidden"
            :default-config="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import {
  reqActivityInfo,
  reqActivityEdit,
  reqActivityAdd
} from '@/api/activity'
import dayjs from 'dayjs'
import { getText, isNull } from '@/utils/judgeEditor'
export default {
  components: { Editor, Toolbar },
  data() {
    return {
      headers: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc4OTU3Mjg5fQ.pVOMBPTYD4_6JH4MhVaT6MoExJ054mxhaTSOtiQTPcU'
      },
      rules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        place: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
        time: [{ required: true, message: '请输入活动时间', trigger: 'blur' }],
        detail: [
          { required: true, message: '请输入活动详情', trigger: 'blur' }
        ],
        deadline: [
          {
            required: true,
            message: '请选择报名结束时间',
            trigger: 'blur'
          }
        ],
        imageId: [
          { required: true, message: '请上传活动封面', trigger: 'change' }
        ]
      },
      form: {
        activityName: '',
        place: '',
        time: '',
        detail: '',
        deadline: ''
        //
      },
      //
      editor: null,
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...', MENU_CONF: {}},
      mode: 'default',
      //
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() < new Date().getTime() - 86400000 //  - 86400000是否包括当天
        }
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      baseUrl: process.env.VUE_APP_Back_End,
      fileList: []
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetailInfo()
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    async getDetailInfo() {
      const res = await reqActivityInfo(this.$route.query.id)
      if (res.status === 200) {
        this.form = res.data
        this.$set(this.form, 'imageId', this.form.cover)
        this.fileList = [
          {
            name: '1.jpg',
            url: process.env.VUE_APP_Back_End_Resource + this.form.cover
          }
        ]
        this.$set(this.form, 'time', [
          dayjs(res.data.startTime).format('YYYY-MM-DD HH:mm:ss'),
          dayjs(res.data.endTime).format('YYYY-MM-DD HH:mm:ss')
        ])
        this.$set(
          this.form,
          'deadline',
          dayjs(res.data.deadline).format('YYYY-MM-DD HH:mm:ss')
        )
      }
    },

    goBack() {
      this.$router.back()
    },
    onSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          console.log('submit!', this.form, this.html)
          const text = getText(this.form.detail)
          if (isNull(text)) {
            this.$message.error('请输入活动详情')
            return
          }
          const { activityName, place, time, detail, deadline } = this.form
          const params = {
            activityName,
            place,
            startTime: time[0],
            endTime: time[1],
            detail,
            deadline,
            id: this.$route.query.id,
            cover: this.form.imageId
          }
          if (params.id) {
            const res = await reqActivityEdit(params)
            if (res.status === 200) {
              this.$message.success('修改成功')
              this.$router.back()
            }
          } else {
            const res = await reqActivityAdd(params)
            if (res.status === 200) {
              this.$message.success('添加成功')
              this.$router.back()
            }
          }
        }
      })
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    handleRemove(file) {
      console.log(file)
      this.$set(this.form, 'imageId', '')
      this.fileList = []
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleUploadSuccess(res, file) {
      console.log('成功回调', res, file)
      this.$set(this.form, 'imageId', res.data.url)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$refs.form.clearValidate('imageId')
    },
    handlePictureCardExceed(files, fileList) {
      this.$message.error('你只能上传一张图片')
    }
  }
}
</script>

<style>
.wrapper {
  padding: 20px;
}
.form {
  width: 1000px;
  /* margin: 0 auto; */
  margin-top: 20px;
}
</style>
