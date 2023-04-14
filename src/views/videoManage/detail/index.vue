<template>
  <div class="wrapper">
    <el-page-header
      title="返回"
      :content="isAudit ? '视频详情' : '视频审核'"
      @back="goBack"
    />
    <el-descriptions class="descWrapper" :column="3" border>
      <el-descriptions-item
        label="课程名称"
        label-class-name="my-label"
        content-class-name="my-content"
      >{{ courseDetail.courseName }}</el-descriptions-item>
      <el-descriptions-item label="课程简介">{{
        courseDetail.introduction
      }}</el-descriptions-item>
      <el-descriptions-item label="授课讲师">{{
        courseDetail.user.username
      }}</el-descriptions-item>
      <el-descriptions-item label="一级分类">
        <el-tag>
          {{ courseDetail.coursetype.super.title }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="二级分类">
        <el-tag>
          {{ courseDetail.coursetype.title }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="发布时间">{{
        coursePublishTime
      }}</el-descriptions-item>
      <el-descriptions-item label="课程封面">
        <el-image
          class="myImage"
          :src="coursePic"
          :preview-src-list="srcList"
        />
      </el-descriptions-item>
      <el-descriptions-item label="课程详情">
        <div v-if="courseDetail.detail">
          <el-image
            class="myImage"
            :src="detailPic"
            :preview-src-list="srcList"
          />
        </div>
        <div v-else>暂无</div>
      </el-descriptions-item>
    </el-descriptions>
    <div class="videoListWrapper">
      <h4>视频列表</h4>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="50" />
        <!-- 同时是活动标签 -->

        <el-table-column prop="title" label="视频标题" />
        <el-table-column prop="part" label="视频章节" />
        <el-table-column prop="duration" label="视频时长" />
        <!-- 线上或线下 -->
        <el-table-column prop="publishTime" label="发布时间" />

        <!-- <el-table-column prop="address" label="活动简介" /> -->
        <el-table-column prop="place" label="审核状态">
          <template v-slot="{ row }">
            <div v-if="row.isAudit === 0" style="color: #eb0827">待审核</div>
            <div v-else>已审核</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="">
            <el-button
              type="text"
              size="small"
              @click="checkVideo"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="视频标题" :visible.sync="dialogTableVisible">
      这里放视频组件
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { reqCourseDetail } from '@/api/course'
export default {
  data() {
    return {
      isLoading: false,
      dialogTableVisible: false,
      tableData: [
        {
          courseName: '12'
        }
      ],
      courseDetail: {
        user: {},
        coursetype: {
          super: {}
        }
      }
    }
  },

  computed: {
    isAudit() {
      return JSON.parse(this.$route.query.isAudit)
    },
    id() {
      return this.$route.query.id
    },
    coursePublishTime() {
      return dayjs(this.courseDetail.publishTime).format('YYYY-MM-DD HH:mm:ss')
    },
    coursePic() {
      return process.env.VUE_APP_Back_End_Resource + this.courseDetail.pic
    },
    detailPic() {
      return process.env.VUE_APP_Back_End_Resource + this.courseDetail.detail
    },
    srcList() {
      return [this.coursePic, this.detailPic]
    }
  },
  mounted() {
    console.log('isAudit', this.isAudit)
    this.getCourseDetail()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    checkVideo() {
      this.dialogTableVisible = true
    },
    async getCourseDetail() {
      this.isLoading = true
      const res = await reqCourseDetail(this.id)
      console.log('详情', res)
      if (res.status === 200) {
        this.isLoading = false
        this.courseDetail = res.data
        this.tableData = res.data.videos
        this.tableData.forEach((item) => {
          item.publishTime = dayjs(item.publishTime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        })
      }
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  padding: 20px;
}

.descWrapper {
  margin: 20px 0;
}

.videoListWrapper {
  h4 {
    margin-bottom: 10px;
  }
}
.myImage {
  width: 150px;
  height: 100px;
  border-radius: 8px;
  border: 1px solid #eee;
}
</style>
