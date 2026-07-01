<template>
  <div class="quanyi">
    <img src="@/assets/images/quanyi-bg.png" alt="" />
    <div class="returnHome" @click="backHome">返回首页</div>

    <!-- 视频展示 -->
    <div class="video-grid">
      <div v-for="video in processedVideos" :key="video.vrbtId" class="video-item">
        <VideoPlayer
          :ref="`player-${video.vrbtId}`"
          :videoSrc="video.loaded ? video.src : ''"
          :thumbnail="video.thumbnail"
          :showSettingsButton="false"
          @play-requested="loadAndPlayVideo(video.vrbtId)"
          style="border: 0.5vw solid #b8b5b5; border-radius: 3vw"
        />
        <div class="setBtn" @click="setVrbtId(video.vrbtId)">马上设置</div>
      </div>
    </div>

    <div v-if="showInput" class="mask">
      <div class="mask-wrapper">
        <input
          class="inputNum"
          type="number"
          v-model="mobile"
          placeholder="请输入您的移动手机号码"
          maxlength="11"
          ref="phoneNum"
        />
        <button class="determine" @click="checkAndSet">确定</button>
        <div class="mask-close" @click="showInput = false"></div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer.vue";
import encryptionMixin from "../assets/js/encryptionMixin";

export default {
  components: {
    VideoPlayer,
  },
  data() {
    return {
      mobile: "",
      token: "",
      channelCode: "002129B", //mg视宣号渠道号
      serviceId: "698039047105951781", // 包月包业务ID
      showInput: false,
      testPhoneNum: "19849063174",
      testKey: "52F11FDF634D47A45418F07918B1BD33",
      resourceHost: "https://xy.suregm.com/sxh/",
      currentVrbtId: "",
      videos: [
        { vrbtId: "600926000018889888", loaded: false },
        { vrbtId: "600926000018889899", loaded: false },
        { vrbtId: "600926000018889904", loaded: false },
        { vrbtId: "600926000018889965", loaded: false },
        { vrbtId: "600926000019217306", loaded: false },
        { vrbtId: "600926000018889936", loaded: false },
        { vrbtId: "600926000018889970", loaded: false },
        { vrbtId: "600926000019217341", loaded: false },
        { vrbtId: "600926000018890011", loaded: false },
        { vrbtId: "600926000018889993", loaded: false },
      ],
    };
  },
  mixins: [encryptionMixin],
  computed: {
    processedVideos() {
      return this.videos.map(video => ({
        ...video,
        thumbnail: `${this.resourceHost}/img/${video.vrbtId}.jpg`,
        src: `${this.resourceHost}/video/${video.vrbtId}.mp4`
      }));
    }
  },
  methods: {
    backHome() {
      this.$router.push("/home");
    },
    setVrbtId(vrbtId) {
      this.currentVrbtId = vrbtId;
      this.showInput = true;
    },
    // 点击设置事件
    async checkAndSet() {
      if (!this.mobile) {
        this.$refs.phoneNum.focus();
        this.mToast("请输入手机号");
        return false;
      }

      var reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
      if (!reg.test(this.mobile)) {
        this.$refs.phoneNum.focus();
        this.mToast("您输入手机号格式不正确");
        return false;
      }

      try {
        // 1. 先获取token
        this.token = await this.getToken();
        if (!this.token) {
          return;
        }
        // 2. 查询订购包月状态
        const orderStatus = await this.queryOrder(this.token);
        if (!orderStatus) {
          return;
        } else if (orderStatus === "1") {
          //0已订购 1未订购
          this.mToast("您不是包月用户，请先返回办理。");
        } else {
          // 3. 已订购，设置主叫彩铃
          this.setDefaultRing(this.token, this.currentVrbtId);
        }
      } catch (err) {
        this.mToast("checkAndOrder流程出错:", err.message);
      } finally {
        this.showInput = false;
      }
    },
    // 获取token
    async getToken() {
      this.mLoading(true);
      try {
        let reqData = this.getReqData({
          channelCode: this.channelCode,
          msisdn: this.mobile.toString(), // 秘钥登陆手机号
        });
        const response = await this.$http.post("/migu/P2973", reqData);
        if (response.result && response.result.resCode === "000000") {
          console.log("token: " + response.result.token);
          return response.result.token;
        } else {
          console.error("Invalid response structure", response);
          this.mToast(response.result.resMsg);
          return false;
        }
      } catch (err) {
        this.mToast(err.message);
        console.error("Request failed:", err.message);
      } finally {
        this.mLoading(false);
      }
    },
    // 查询订购包月状态
    async queryOrder(token) {
      this.mLoading(true);
      try {
        let reqData = this.getReqData({
          channelCode: this.channelCode,
          token: token,
          serviceId: this.serviceId,
        });
        const response = await this.$http.post("/migu/P2310", reqData);
        if (response.result && response.result.resCode === "000000") {
          console.log("orderStatus: " + response.result.status);
          return response.result.status;
        } else {
          console.error("[queryOrder] Invalid response structure", response);
          this.mToast(response.result.resMsg);
          return false;
        }
      } catch (err) {
        this.mToast(err.message);
        console.error("Request failed:", err.message);
      } finally {
        this.mLoading(false);
      }
    },
    // 设置主叫彩铃
    async setDefaultRing(token, toneID) {
      this.mLoading(true);
      try {
        let reqData = this.getReqData({
          channelCode: this.channelCode,
          token: token,
          toneID: toneID,
          serviceId: this.serviceId,
        });
        const response = await this.$http.post("/migu/P23A6", reqData);
        if (response.result.resCode === "000000") {
          console.log(
            "setDefaultRing Success: " +
              response.result.settingID +
              response.result.resMsg
          );
        } else {
          this.mToast(response.result.resMsg || response.message);
          console.error(
            "setDefaultRing failed: " + response.result.resMsg || response.message
          );
        }
      } catch (err) {
        this.mToast(err.message);
        console.error("setDefaultRing failed:", err.message);
      } finally {
        this.mLoading(false);
      }
    },
    loadAndPlayVideo(vrbtId) {
      // console.log(this.processedVideos)
      const videoIndex  = this.videos.findIndex(v => v.vrbtId === vrbtId);
      if (videoIndex !== -1 && !this.videos[videoIndex].loaded) {
        this.videos[videoIndex].loaded = true;
        this.$forceUpdate(); // 确保视图更新
        console.log(`开始加载视频 ${vrbtId}`);
        // 视频预加载（optional）
        // this.preloadVideo(vrbtId);

        // 使用nextTick确保DOM更新完成
        this.$nextTick(() => {
          const videoPlayer = this.$refs[`player-${vrbtId}`];
          if (videoPlayer && videoPlayer[0].togglePlay) {
            videoPlayer[0].togglePlay();
          }
        });
      }
    },
    preloadVideo(vrbtId) {
      const videoElement = document.createElement('video');
      videoElement.src = `${this.resourceHost}/video/${vrbtId}.mp4`;
      videoElement.preload = 'auto';
    },
  },
  mounted() {
    document.title = "视频彩铃权益专区";
  },
  beforeUnmount() {},
};
</script>

<style scoped>
.quanyi {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quanyi img {
  width: 100%;
}

.quanyi .returnHome {
  position: fixed;
    left: -3vw;
    top: 5vw;
    width: 36vw;
    height: 7.5vw;
    line-height: 7.5vw;
    background: linear-gradient(180deg, #8ce2fc, #2b7af9);
    border-radius: 4vw;
    font-weight: 700;
    font-size: 3.8vw;
    text-align: center;
    color: white;
    box-sizing: border-box;
    /* padding-right: 0.45rem; */
    animation: animateBig 1.5s ease infinite;
    letter-spacing: .4vw;
    text-indent: .2vw;
    z-index: 9;
}

@keyframes animateBig {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.video-grid {
  position: absolute;
  top: 140vw;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3vw 8vw;
  width: 84vw;
  margin: 3vw auto;
  max-height: 400vw;
}

.video-grid .video-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-grid .setBtn {
  margin-top: 2vw;
  width: 70%;
  height: 6vw;
  background-color: rgb(59 123 249);
  border-radius: 2vw;
  font-size: 3.5vw;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5vw;
  text-align: center;
  line-height: 6vw;
}

.quanyi .mask {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  z-index: 99;
}

.quanyi .mask .mask-wrapper {
  margin: 50% auto;
  width: 90%;
  background-color: #fff;
  padding: 2.5vw;
  border-radius: 2vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quanyi .mask .mask-wrapper .inputNum {
  padding: 1vw 2vw;
  width: 80%;
  height: 10vw;
  margin: 0 auto;
  margin-top: 3vw;
  margin-bottom: 5vw;
  letter-spacing: 0.01rem;
  line-height: 1rem;
  border: 0.0533rem solid #e6e6e6;
  border-radius: 0.5rem;
  display: block;
  font-size: 0.45rem;
}
.quanyi .mask .mask-wrapper .determine {
  font-weight: 600;
  display: block;
  height: 11vw;
  background-color: #ff5860;
  color: #fff;
  font-size: 5vw;
  line-height: 11vw;
  letter-spacing: 1vw;
  width: 80%;
  border-radius: 1rem;
  border: none;
  outline: none;
  text-align: center;
  margin-bottom: 3vw;
}

.quanyi .mask .mask-wrapper .mask-close {
  background: url("../assets/images/close.png") no-repeat 50%;
  background-size: 100% 100%;
  width: 6vw;
  height: 6vw;
  position: absolute;
  top: 7rem;
}
</style>
