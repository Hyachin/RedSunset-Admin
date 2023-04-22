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
      <el-descriptions-item content-style="max-width:380px" label="课程简介">{{
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
            fit="contain"
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
            <div v-if="row.isAudit === 0">待审核</div>
            <div v-else-if="row.isAudit === 1" style="color: #22b14c">
              审核通过
            </div>
            <div v-else style="color: #eb0827">审核未通过</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="checkVideo(row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="currentRow.title" :visible.sync="dialogTableVisible">
      <div v-if="dialogTableVisible">
        <video-player
          ref="videoPlayer"
          style="width: 100%; height: 100%"
          class="video-player-box"
          :options="playerOptions"
          :playsinline="true"
          custom-event-name="customstatechangedeventname"
        />
        <div v-if="showAuditBtnGroup" class="auditBtnGroup">
          <el-button type="primary" @click="auditEdit(1)">审核通过</el-button>
          <el-button
            style="background: #eb0827; color: #fff"
            @click="auditEdit(2)"
          >审核不通过</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import 'video.js/dist/video-js.css'

import { videoPlayer } from 'vue-video-player'
import { reqCourseDetail, reqVideoAuditEdit } from '@/api/course'
export default {
  components: {
    videoPlayer
  },
  data() {
    return {
      currentRow: {
        url: ''
      },
      isLoading: false,
      dialogTableVisible: false,
      tableData: [],
      courseDetail: {
        user: {},
        coursetype: {
          super: {}
        }
      },
      showAuditBtnGroup: false,
      // 视频配置
      playerOptions: {
        // videojs options
        autoplay: true,
        fluid: true,
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: 'video/mp4',
            src: 'https://vjs.zencdn.net/v/oceans.mp4'
          }
        ],
        poster: '/static/images/author.jpg'
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
    },
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  mounted() {
    this.getCourseDetail()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    checkVideo(row) {
      console.log('row', row)
      this.dialogTableVisible = true
      this.currentRow = row
      this.showAuditBtnGroup = row.isAudit === 0
      this.playerOptions.sources[0].src =
        process.env.VUE_APP_Back_End_Resource + this.currentRow.url
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
    },
    async auditEdit(isAudit) {
      console.log('同意', isAudit)
      const res = await reqVideoAuditEdit({
        id: this.currentRow.id,
        isAudit
      })
      if (res.status === 200) {
        this.showAuditBtnGroup = false
        this.getCourseDetail()
      }
    }
  }
}
</script>

<style lang="scss">
.video-js .vjs-big-play-button {
  margin-left: 50%;
  margin-top: 25%;
  transform: translate(-50%, -50%);
}
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
.auditBtnGroup {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
