<template>
  <div class="quanyi">
    <img src="@/assets/images/quanzi-bg.png" alt="" />
    <div class="returnHome" @click="backHome">返回首页</div>
    <a class="sxhLink" href="https://sxh.migu.cn/qysch/"></a>

    <div class="login" @click="showInput = true"></div>

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
        <div class="inputNum">
          <input
            type="number"
            v-model="code"
            class="inputValidate input"
            placeholder="请输入验证码"
          />
          <button
            :disabled="btnVailCode"
            @click="requestCode"
            :style="{ color: btnVailCode ? 'red' : 'rgb(99, 163, 92)' }"
          >
            {{ btnVailCode ? timeVailCode + "s" + "重新获取" : "获取验证码" }}
          </button>
        </div>
        <button class="determine" @click="submitCode">确定</button>
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
        { vrbtId: "600926100700397386", loaded: false },
        { vrbtId: "600926100700334429", loaded: false },
        { vrbtId: "600926100700348033", loaded: false },
        { vrbtId: "600926100700348032", loaded: false },
        { vrbtId: "600926100700348034", loaded: false },
        { vrbtId: "600926100700348025", loaded: false },
      ],
      isLogin: false,
      code: "",
      sendCode: false,
      btnVailCode: false,
      timeVailCode: 60,
      timerVailCode: null,
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
      const targetPath = this.getTargetPath();
      this.$router.push(targetPath);
    },
    getTargetPath() {
      // 根据来源页面决定返回目标
      switch (this.fromPage) {
        case 'mgMusicKMgd':
          return '/mgMusicKMgd';
        default:
          return '/home';
      }
    },
    requestCode() {
      if (!this.mobile) {
        this.mToast("请输入手机号");
        return false;
      }
      var reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
      if (!reg.test(this.mobile)) {
        this.mToast("您输入手机号格式不正确");
        return false;
      }

      this.mLoading(true);
      this.btnVailCode = true;
      this.timerVailCode = setTimeout(() => {
        this.mTimerCode();
      }, 1000);

      let reqData = this.getReqData({
        phone: this.mobile,
        sign: "SC", // 盛川
      });
      this.$http.post("/rights/smsLogin", reqData).then((res) => {
        if (res.success) {
          this.sendCode = true;
          console.log("requestCode: " + res.code + res.message);
          this.mToast("验证码已发送，请查收", true);
        } else {
          clearTimeout(this.timerVailCode);
          this.timeVailCode = 60;
          this.btnVailCode = false;
          this.mToast(res.message, false);
        }
        this.mLoading(false);
      })
    },
    submitCode() {
      if (!this.sendCode) {
        this.requestCode();
        return false;
      }

      if (!this.code) {
        this.mToast("请输入验证码");
        return false;
      }

      let reqData = this.getReqData({
        phone: this.mobile,
        code: this.code,
      });
      this.$http.post("/rights/smsLoginCheck", reqData).then((res) => {
        if (res.success) {
          this.showInput = false;
          this.isLogin = true;
          console.log("submitCode: " + res.code + res.message);
          this.mToast("登录成功！", true);
        } else {
          this.mToast(res.message, false);
        }
        this.mLoading(false);
      })
    },
    // 点击设置事件
    async setVrbtId(vrbtId) {
      if (!this.isLogin) {
        this.mToast("请先登录！");
        return false;
      }

      this.currentVrbtId = vrbtId;
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
          this.mToast("设置成功！");
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
    // 加载视频展示列表
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
    mTimerCode() {
      if (this.timeVailCode <= 0) {
        clearTimeout(this.timerVailCode);
        this.timeVailCode = 60;
        this.btnVailCode = false;
      } else {
        this.timeVailCode--;
        this.timerVailCode = setTimeout(() => {
          this.mTimerCode();
        }, 1000);
      }
    },
    resetpage() {
      this.pid = "";
      this.code = "";
      this.show = false;
      clearTimeout(this.timerVailCode);
      this.timeVailCode = 60;
      this.btnVailCode = false;
    },
  },
  mounted() {
    document.title = "热门圈子彩铃";
    // 获取来源页面信息
    this.fromPage = this.$route.query.from || 'home';
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
  background: #8a97fa;
  /* padding: 8vw 4vw; */
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
  background: linear-gradient(180deg, #de8cfc, #965dfe);
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

.quanyi .sxhLink {
  position: absolute;
  top: 41vw;
  width: 72vw;
  height: 15vw;
}

.quanyi .video-grid {
  position: absolute;
  top: 77vw;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3vw 5vw;
  width: 74vw;
  margin: 3vw auto;
  max-height: 320vw;
  overflow: scroll;
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
  background-color: #965dfe;
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
  height: 11vw;
  margin: 0 auto;
  margin-top: 3vw;
  /* margin-bottom: 5vw; */
  letter-spacing: 0.01rem;
  line-height: 1rem;
  border: 0.0533rem solid #e6e6e6;
  border-radius: 0.5rem;
  /* display: block; */
  font-size: 0.45rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.quanyi .mask .mask-wrapper .inputNum input {
  /* font-size: 5vw;
  font-weight: 700; */
  /* text-align: center; */
  letter-spacing: .3vw;
  border: none;
  outline: none;
  background: none;
}

.quanyi .mask .mask-wrapper .inputNum .inputValidate {
  width: 100%;
  flex: 1;
}

.quanyi .mask .mask-wrapper .inputNum button {
  margin-left: 1.066667vw;
  font-size: 4vw;
  font-weight: 500;
  line-height: 4vw;
  /* border: 0; */
  background: none;
  border: none;
  /* height: 11vw; */
  /* border-radius: 0.5rem; */
  color: white;
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
  margin: 5vw;
}

.quanyi .mask .mask-wrapper .mask-close {
  background: url("../assets/images/close.png") no-repeat 50%;
  background-size: 100% 100%;
  width: 6vw;
  height: 6vw;
  position: absolute;
  top: 7rem;
}

.quanyi .login {
  position: absolute;
  width: .7rem;
  height: 4.7em;
  right: 0;
  top: 3.5rem;
}
</style>
