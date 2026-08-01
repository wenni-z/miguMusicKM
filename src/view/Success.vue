<template>
  <div class="success">
    <img src="@/assets/images/success-bg.png" alt="" />
    <div class="success-content flex">
      <div class="go-top" @click="openMiguLink()"></div>

      <img
        src="../assets/images/mgapp-icon.jpg"
        alt=""
        style="position: absolute; z-index: 9; left: 1vw; top: 60vw; width: 11vw"
        @click="redirectToMiguDownload()"
      />
      <img
        src="../assets/images/tuiding.png"
        alt=""
        style="position: absolute; z-index: 9; right: 1vw; top: 60vw; width: 11vw"
        @click="showTuiding = true"
      />

      <!-- <div>
        <div class="flex">
          <div class="video-grid-custom">
            <VideoPlayer
              :videoSrc="preVideo.src"
              :thumbnail="preVideo.thumbnail"
              :showSettingsButton="false"
            />
          </div>
        </div>
      </div> -->

      <!-- <div class="text">
        <h1>如何设置</h1>
        <p>
          1、可进入商户中心(<a href="https://sxh.migu.cn/qysch/">https://sxh.migu.cn/qysch/</a>)用订购业务对应的手机号码进行登录后进行视频彩铃的使用和管理。
          <br>2、关注微信公众号““铃音多多-盛川”-川川视宣-热门圈子彩铃”-选择“视宣号商户中心”，制作和设置专属的视频彩铃。
          <br>3、如未开通视频彩铃功能，需前往商户中心开通。
          <br><span style="color:blue;" @click="showTips = true">0元视频彩铃功能开通指引</span>
        </p>
      </div> -->

      <div class="showTips-entry" @click="showTips = true"></div>

      <div v-if="showTips" class="popUp">
        <h2>视频彩铃功能开通指引</h2>
        <p>
          <br>1、进入“视宣号商户中心”登录页面,输入手机号和验证码,点击登录进入“视宣号商户中心”
          <br>2、点击“开通视频彩铃功能”,进入视频彩铃功能开通弹窗输入验证码,点击确认按钮。
          <br>3、视频彩铃功能开通成功,收到短信提醒。
        </p> 
        <div>
            <button @click="showTips = false">确认</button>
        </div>
      </div>

      <div class="kefu" @click="qyqylq()"></div>

      <div class="linkBox" @click="qyqylq()"></div>

      <div class="linkBox2" @click="downLoadApk()"></div>

      <!-- 视频展示 -->
      <!-- <div class="section-wrapper">
        <div class="video-grid-suc">
          <div v-for="video in processedVideos" :key="video.vrbtId">
            <VideoPlayer
              :ref="`player-${video.vrbtId}`"
              :videoSrc="video.loaded ? video.src : ''"
              :thumbnail="video.thumbnail"
              :showSettingsButton="false"
              @play-requested="loadAndPlayVideo(video.vrbtId)"
              @set-click="openMiguLink"
            />
            <div class="setBtn" @click="setVrbtId(video.vrbtId)">马上设置</div>
          </div>
        </div>
      </div> -->

      <!-- 退订输入弹框 -->
      <div v-if="showTuiding" @touchmove.prevent @mousewheel.prevent>
        <div class="rw-mask"></div>
        <div class="tuiding-mask" style="z-index: 999">
          <div
            style="
              background: rgb(255, 255, 255);
              border-radius: 2.56vw;
              color: rgb(0, 0, 0);
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-top: 3.72vw;
            "
          >
            <b style="font-size: 4vw;">您正在退订业务</b>
            <div class="input_number">
              <input
                type="number"
                v-model="mobile"
                class="inputdiv input"
                placeholder="请输入您的移动手机号"
                maxlength="11"
              />
            </div>
            <div style="margin: 3.72vw; display: flex">
              <button @click="showTuiding = false">取消</button>
              <button @click="cancelOrder()" style="background-color: #1989fa" id="confirmTD">确认</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="successPop" class="mask">
        <div class="mask-wrapper">
          <h2>开通成功</h2>
          <div class="content">
            您已成功订购咪咕音乐视宣号标准版，并设置《老板发财》视频彩铃，立即生效。
          </div>
          <router-link class="determine" to="/qzvideo">
            查看视频彩铃
          </router-link>
          <div class="mask-close" @click="successPop = false"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import encryptionMixin from "../assets/js/encryptionMixin";

export default {
  components: {
  },
  data() {
    return {
      apkUrl: "https://d.musicapp.migu.cn/upload/fbpt_rsync_apps/local/signed/MobileMusic7611/MobileMusic7611_014782K_20260128162625126.apk",
      successPop: true,
      mobile: "",
      token: '',
      channelCode: '',
      serviceId: "698039047105951781", // 包月包业务ID
      showTips: false, // 展示视彩开通指引
      showLoading: true, // 控制进度条动图的显示
      showVideos: false, // 控制用户自定义视频展示的显示
      showTuiding: false, // 退订弹框
      preVideo: {
          src: require("@/assets/videos/preVideo.mp4"),
          thumbnail: require("@/assets/images/preThumbnail.png"),
      },
      currentVrbtId: "",
      resourceHost: "https://xy.suregm.com/sxh/",
      videos: [
        { vrbtId: "600926100700397386", loaded: false },
        { vrbtId: "600926100700334429", loaded: false },
        { vrbtId: "600926100700348033", loaded: false },
        { vrbtId: "600926100700348032", loaded: false },
        { vrbtId: "600926100700348034", loaded: false },
        { vrbtId: "600926100700348025", loaded: false },
        { vrbtId: "600926100700338509", loaded: false },
        { vrbtId: "600926100700347906", loaded: false },
        { vrbtId: "600926100700348036", loaded: false },
        { vrbtId: "600926100700334428", loaded: false },
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
    openMiguLink() {
      // 跳转到视宣号商户中心
      window.location.href =
        "https://sxh.migu.cn/qysch/";
    },
    redirectToMiguDownload() {
      // 跳转到咪咕下载页面
      window.location.href = "https://music.migu.cn/v3/app/h5";
    },
    qyqylq() {
      // 跳转到企业权益领取页面
      window.location.href = "https://h5.nf.migu.cn/app/v4/n/rights-center/index.html?cfrom=cxtzzx_0029_bfb#/";
    },
    downLoadApk() {
      var e = document.createElement("a");
      e.href = this.apkUrl,
      e.download = "MobileMusic7611.apk",
      document.body.appendChild(e),
      e.click(),
      document.body.removeChild(e)
    },
    callPhone() {
      window.location.href = "tel:4006163810";
    },
    setVrbtId(vrbtId) {
      this.currentVrbtId = vrbtId;
      this.showInput = true;
    },
    fetchData() {
      window.openMiGuInit(this.channelCode,'window.initBackFun','paramdialog1','','','common2',''); 
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
    async setDefaultRing(token, toneID) {
      this.mLoading(true);
      if (!toneID) {
        toneID = '600926100700348032'
      }
      try {
        let reqData = this.getReqData({
          channelCode: this.channelCode,
          token: token,
          toneID: toneID,
          serviceId: this.serviceId,
        });
        const response = await this.$http.post("/migu/P23A6", reqData);
        if (response.result.resCode === '000000') {
          console.log("setDefaultRing: " + toneID + response.result.settingID + response.result.resMsg);
        } else {
          console.error('setDefaultRing: ' + toneID+ response.result.resMsg || response.message);
        }
      } catch (err) {
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
    queryRingPolicy() {
      var data = {
        youCallbackName:"window.ringPolicyBackFun",
        channelCode: this.channelCode,
        token: this.token,
        vrbtId: '600926100700348032', //18位内容ID,11位版权ID,12位版权ID
      };
      console.log("miguVrbtPolicy:" + JSON.stringify(data));
      window.miguVrbtPolicy(data);
    },
    ringPolicyBackFun(result) {
      console.log("miguVrbtPolicy:" + JSON.stringify(result));
    },
    // 退订
    async cancelOrder() {
      if (!this.mobile) {
        this.mToast("请输入手机号");
        return false;
      }

      var reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
      if (!reg.test(this.mobile)) {
        this.mToast("您输入手机号格式不正确");
        return false;
      }

      try {
        this.token = await this.getToken();
        this.cancel(this.token);
      } catch (err) {
        console.error("cancelOrder流程出错:", err.message);
      }
    },
    // 退订
    cancel(token) {
      // console.log("cancel:" + token);
      var data = {
        youCallbackName: "window.cancelBackFun",
        channelCode: this.channelCode,
        token: token,
        serviceId: this.serviceId, // 18位业务ID/包月包ID
        cancelType:"0",
      };
      console.log("cancel:" + JSON.stringify(data));

      window.commonCancel(data);
    },
    removeLocalStorage() {
      localStorage.removeItem("token");
      localStorage.removeItem("channelCode");
      localStorage.removeItem("mgptUrl");
    },
  },
  mounted() {
    this.channelCode = localStorage.getItem("channelCode");
    if (!this.channelCode) {
      this.channelCode = "002129B"; //mg视宣号渠道号
    }
    this.token = localStorage.getItem("token");
    this.fetchData();
    window.ringPolicyBackFun = this.ringPolicyBackFun;
    this.setDefaultRing(this.token);
  },
  beforeUnmount() {
    this.removeLocalStorage();
  },
};
</script>

<style scoped>
@import "./../assets/css/main.css";
</style>
<style scoped>
.success {
  text-align: center;
  background-color: #021a56;
  min-height: 100vh;
}

.success img {
  width: 100%;
}

.go-top {
  position: absolute;
  top: 17vw;
  left: 13vw;
  width: 76vw;
  height: 15vw;
}

.success .kefu {
  position: absolute;
  top: 112.5vw;
  width: 78vw;
  height: 12vw;
}

.success .linkBox2, .success .linkBox {
  position: absolute;
  top: 133vw;
  width: 86vw;
  height: 31vw;
}

.success .linkBox2 {
  top: 178vw;
  height: 26vw;
}

.showTips-entry {
  position: absolute;
  top: 38vw;
  width: 78vw;
  height: 31vw;
}

.success .success-content {
  position: absolute;
  top: 30vw;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 7vw;
}

.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading {
  margin: 3vw 0;
}

.loading img {
  width: 45vw;
  /* height: 7vw; */
}

.loading p {
  margin-top: 2vw;
  font-size: 4vw;
  color: #666;
}

.success .text {
  width: 90%;
  font-size: 3.2vw;
  font-weight: 600;
  text-align: left;
}

.success .text h1 {
  text-align: center;
  font-size: 6vw;
  color: white;
  letter-spacing: .8vw;
  margin: 3vw 0;
}

.success .text p {
  line-height: 5vw;
}

.popUp {
  position: fixed;
  top: 35vh;
  width: 80%;
  background-color: white;
  text-align: center;
  padding: 3vw;
  border-radius: 5vw;
  z-index: 10;
}

.popUp button {
  margin-top: 3.49vw;
  height: 9.3vw;
  background: linear-gradient(135deg, rgb(38, 191, 38) 0%, rgb(39, 197, 48) 45%, rgb(40, 207, 63) 83%, rgb(41, 212, 70) 100%);
  border: none;
  border-radius: 2.33vw;
  color: #fff;
  padding: 0px 1.16vw;
  width: 50%;
  font-size: 4vw;
}

.video-grid-suc {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3vw 8vw;
  width: 74vw;
  margin: 3vw auto;
}

.video-grid-suc .setBtn {
  margin: 2vw auto 0;
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

.video-grid-custom {
  display: grid;
  gap: 4.1vw;
  align-content: center;
  background-color: #afacac;
  width: 40vw;
  height: 65vw;
  border-radius: 3vw;
  margin: 2vw auto;
}

.status-tag {
  color: #c25603;
  font-size: 4vw;
  font-weight: 600;
  letter-spacing: .5vw;
  font-family: BlinkMacSystemFont;
}

.section-wrapper {
  margin-top: 24vw;
  /* border: 1px solid blue; */
  border-radius: 5vw;
}

.section-wrapper h1 {
  color: blue;
}

.section-wrapper h2 {
  margin: 2vw 0 3vw 0;
}

.steps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5.12vw;
}

.step {
  text-align: center;
}

.step-icon {
  width: 12vw;
  height: 12vw;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5.12vw;
  font-weight: bold;
  margin: 0 auto 1.5vw;
}

.step p {
  margin: 0;
  font-size: 3.6vw;
  color: #333;
}

.step-arrow {
  font-size: 6.15vw;
  color: #007bff;
}

.make-button {
  padding: 2.5vw 7vw;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6vw;
  cursor: pointer;
  font-size: 5vw;
  letter-spacing: 1vw;
  margin: 3vw;
}

.make-button:hover {
  background-color: #0056b3;
}

.success .mask {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  position: fixed;
  top: 0;
  z-index: 99;
}

.success .mask .mask-wrapper {
  margin: 50% auto;
  width: 70%;
  background-color: #fff;
  padding: 2.5vw;
  border-radius: 2vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success .mask .mask-wrapper .content {
  width: 85%;
  font-size: 4vw;
  line-height: 6vw;
  letter-spacing: .5vw;
}

.success .mask .mask-wrapper .determine {
  font-weight: 600;
  display: block;
  height: 10vw;
  background-color: #ff5860;
  color: #fff;
  font-size: 5vw;
  line-height: 10vw;
  letter-spacing: 1vw;
  width: 80%;
  border-radius: 1rem;
  border: none;
  outline: none;
  text-align: center;
  margin: 3vw;
}

.success .mask .mask-wrapper .mask-close {
  background: url("../assets/images/close.png") no-repeat 50%;
  background-size: 100% 100%;
  width: 6vw;
  height: 6vw;
  position: absolute;
  top: 6rem;
}
</style>
