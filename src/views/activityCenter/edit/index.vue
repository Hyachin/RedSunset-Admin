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
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        />
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
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
export default {
  components: { Editor, Toolbar },
  data() {
    return {
      rules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        place: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
        time: [{ required: true, message: '请输入活动时间', trigger: 'blur' }],
        detail: [
          { required: true, message: '请输入活动详情', trigger: 'blur' }
        ]
      },
      form: {
        activityName: '',
        place: '',
        time: '',
        detail: ''
        //
      },
      //
      editor: null,
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...', MENU_CONF: {}},
      mode: 'default',
      //
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
  mounted() {},
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('submit!', this.form, this.html)
          if (!this.form.detail) {
            this.$message.error('请输入活动详情')
            return
          }
          const { activityName, place, time, detail } = this.form
          const params = {
            activityName,
            place,
            startTime: time[0],
            endTime: time[1],
            detail
          }
          console.log('发布', params)
        }
      })
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
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
