<template>
  <div class="main" ref="container" @scroll="handleScroll">
    <img src="../assets/images/main-bg.png" alt="" />
    <img src="../assets/images/yd-agency.jpg" alt="" />

    <!-- 全屏视频播放层 -->
    <div
      v-if="preVideoState.showFullscreenVideo"
      class="fullscreen-video"
      @click="toggleVideoPlay"
    >
      <video
        ref="fullscreenVideo"
        style="width: 100%; height: 100%; object-fit: contain; background: #000"
        :src="require('../assets/videos/preVideo.mp4')"
      ></video>
      <img
        src="../assets/images/back-1.png"
        class="back-btn"
        @click.stop="exitFullscreen"
      />
      <div class="setRing" @click.stop="exitFullscreen"></div>
      <div class="keyboard">
        <img src="../assets/images/video_bg.png" alt="" />
      </div>
    </div>

    <!-- 首页tab展示 - Old 替换成以下视频展示-->
    <!-- <div class="custom-tab-container">
      <img
        class="van-titile-img"
        :src="
          activeTab === 0
            ? require('../assets/images/nav1-active.png')
            : require('../assets/images/nav2-active.png')
        "
        alt=""
      />
      <van-tabs
        v-model="activeTab"
        :swipeable="false"
        :border="false"
        :title-active-color="'transparent'"
        :title-inactive-color="'transparent'"
      >
        Tab 1 热门圈子彩铃
        <van-tab>
          <template #title></template>
          <div class="tab-content">
            <div class="video-thumbnail" @click="playVideo">
              <img
                src="../assets/images/preThumbnail.png"
                style="
                  border-radius: 3vw;
                  border: 1vw solid #575afc;
                  box-sizing: border-box;
                "
              />
              <img src="../assets/images/play-btn.png" class="play-btn" />
            </div>
            <router-link class="btn" 
              :to="{
                path: '/qzvideo',
                query: { from: 'mgMusicKMgd' },
              }">
            </router-link>
          </div>
        </van-tab>

        Tab 2 视宣号商户中心
        <van-tab>
          <template #title></template>
          <div class="tab-content">
            <a class="btn btn2"
              href="https://sxh.migu.cn/qysch/"
            >
            </a>
          </div>
        </van-tab>

        Tab 3 视频彩铃权益 - Archived
        <van-tab>
          <template #title></template>
          <div class="tab-content">
            <img src="../assets/images/nav3-content.png" />
            <router-link to="/spcl">
              <img src="../assets/images/enter-btn1.png" alt="" class="btn" />
            </router-link>
          </div>
        </van-tab>
      </van-tabs>
    </div> -->

    <div class="video-thumbnail-front" @click="playVideo">
      <div style="position: relative; height: 100%;">
        <img
          src="../assets/images/preThumbnail.png"
          style="
            border-radius: 5vw;
            padding: 2vw;
          "
        />
        <img
          src="../assets/images/phone-screen.png"
          style="position: absolute; top: 0; left: 0;"
        />
        <img src="../assets/images/play-btn.png" class="play-btn" />
      </div>
    </div>

    <!-- 热门商户彩铃入口 -->
    <router-link class="qzvideoLink" to="/qzvideo"></router-link>

    <a class="bottom-link" href="https://sxh.migu.cn/qysch/" ></a>

    <div class="rule-btn" @click="showProductRule = true"></div>
    <img
      src="../assets/images/mgapp-icon.jpg"
      alt=""
      style="position: absolute; z-index: 9; right: 1vw; top: 170vw; width: 9vw"
      @click="redirectToMiguDownload()"
    />
    <img
      src="../assets/images/tuiding.png"
      alt=""
      style="position: absolute; z-index: 9; right: 1vw; top: 130vw; width: 9vw"
      @click="showTuiding = true"
    />

    <!-- input box -->
    <div class="greyMask main-box">
      <div class="input_number">
        <input
          type="number"
          v-model="mobile"
          class="inputdiv input"
          placeholder="请输入您的移动手机号码"
          maxlength="11"
          ref="phoneNum"
          @click="gdpInput"
        />
      </div>

      <!-- <div class="input_number" v-if="showVailCode"> -->
      <!-- <div class="input_number">
        <input
          type="number"
          v-model="code"
          class="inputValidate input"
          placeholder="请输入验证码"
        />
        <button
          :disabled="btnVailCode"
          @click="requestCode"
          :style="{ color: btnVailCode ? '' : 'rgb(99, 163, 92)' }"
        >
          {{ btnVailCode ? timeVailCode + "s" + "重新获取" : "获取验证码" }}
        </button>
      </div> -->

      <div>
        <div class="update-btn" @click="checkAndOrder">
          知悉同意业务说明并办理
        </div>
      </div>

      <div class="file-agree-box greyMask">
        <input id="checkboxAgree" type="checkbox" v-model="agree" @click="autoAgree" />
        <!-- <div @click="showYdRule = true">
          我已阅读《合约条款》并同意开通“{{
            product.productName
          }}”，资费：19.9元/月，通过话费扣取，开通立即生效，费用按月扣取，不按天进行折算；退订立即失效，退订的次月起不再扣费。
        </div> -->
        <div>
          知悉同意<span class="highlight" @click="showProductRule = true">《业务说明》</span>
          <!-- 知悉同意<span class="highlight" @click="scrollToBottom">《业务说明》</span> -->
          <!-- <a class="highlight" href="https://y.migu.cn/app/gm/v1/index.html?id=101120">《咪咕视宣号用户服务协议》</a>
          、<span class="highlight" @click="showYdRule = true">《音视频作品承诺书》</span> -->
          并用该手机号码登录办理
        </div>
      </div>
    </div>

    <!-- 协议提示弹框 -->
    <div v-if="xieyiPop" @touchmove.prevent @mousewheel.prevent>
      <div class="rw-mask"></div>
      <div class="tuiding-mask" style="z-index: 999; width:85vw">
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
          <!-- <h3>提示</h3>
          <div>
            点击同意，视为您已阅读并同意<span class="highlight" @click="showProductRule = true">《业务说明》</span>、
            <a href="https://y.migu.cn/app/gm/v1/index.html?id=101120">《咪咕视宣号用户服务协议》</a>
            、<span class="highlight" @click="showYdRule = true">《音视频作品承诺书》</span>
            ，同时会为您将此首视频彩铃设置为当前在播铃音
          </div> -->
          <h3>温馨提示</h3>
          <div>点击确认，视为您已阅读并同意<span class="highlight" @click="showProductRule = true">《业务说明》</span></div>
          <div style="margin: 3.72vw; width:90%; display: flex; justify-content: space-between;">
            <button @click="xieyiPop = false">取消</button>
            <button @click="checkAndOrder()" style="background-color: #1989fa">确认</button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="bottom-container" style="position: relative; width: 100%">
      <div class="rules-container">
        <p>
          1．“AI视频彩铃-标准版”目前仅支持<b>中国移动</b>用户(不含港澳台用户)，<b>19.9元/月</b>，通过<b>话费</b>扣取，<b>开通立即生效，费用按月扣取</b>，不按天进行折算；<b>退订立即失效，退订的次月起不再扣费</b>。
        </p>
        <p>
          2．开通该业务，每月可在咪咕音乐App/咪咕彩媒微信小程序/四度网络微信公众号，使用“AI一语成片/AI一语成歌/AI一图写真/AI一图变装/AI一图成曲/AI一图炫彩/AI一笔成画/AI一帧萌宠”AI工具，进行<b>12次</b>短视频创作和发布；创作的作品可通过对应AI工具页面的“创作记录”进行查看。（注：四度网络微信公众号暂只支持使用AI一帧萌宠。）
        </p>
        <p>
          3．开通该业务，可进入微信公众号“四度网络-一帧萌宠-视频彩铃专区”，免费设置专区页面的所有视频彩铃。
        </p>
        <p>
          4．开通该业务时，为具备业务生效所需的功能支持，将为您同步开通0元视频彩铃功能<span>(含主被叫视频彩铃功能，具体以实际为准)</span>，如已开通则不会重复开通。同步开通的0元视频彩铃功能<b>立即生效</b>，可单独退订，<b>未退订保持0元按月生效</b>。
        </p>
        <p><b>5．退订该业务后，若当月的创作次数未使用完，不能再使用。</b></p>
        <p>6．退订该业务时，不关联退订0元视频彩铃功能/主叫视频彩铃功能。</p>
        <p>7．如需退订，可短信发送<b>0000至10086</b>，根据收到的短信提示操作。</p>
        <p>
          8．办理发起后，平台会通过短信进行验证码、办理结果通知、客服信息等相关的告知，在发起办理时，即视为您同意接收短信。
        </p>
        <p>
          9．业务平台客服电话：<a href="tel:4008009682">400-800-9682</a
          >（服务时间：09:00-21:00）。
        </p>
      </div>

      <div class="video-grid">
        <VideoPlayer
          v-for="(video, index) in videos"
          :key="index"
          :videoSrc="video.src"
          :thumbnail="video.thumbnail"
          @set-click="onSetClick"
        />
      </div>
    </div> -->

    <!-- 二次确认弹框 -->
    <!-- <div v-if="show2ndConfirm" @touchmove.prevent @mousewheel.prevent>
      <div class="rw-mask"></div>
      <div class="rw-mask-sim" style="z-index: 999">
        <div
          style="
            width: 100%;
            background: rgb(255, 255, 255);
            height: 50vh;
            border-radius: 2.56vw;
            color: rgb(0, 0, 0);
            text-align: center;
          "
        >
          <div style="height: calc(100% - 35vw); overflow-y: auto; padding: 12vw">
            <h1><strong>确认订单</strong></h1>
            <h2>正在为您办理：“AI视频彩铃-标准版”</h2>
            <p>
              资费：19.9元/月，通过话费扣取，开通立即生效，费用按月扣取，不按天进行折算；退订立即失效，退订的次月起不再扣费。
            </p>
          </div>
          <div style="text-align: center">
            <button class="cancelOrder" @click="show2ndConfirm = false">残忍拒绝</button>
            <button class="confirmOrder" @click="onBuy(token)">确认办理</button>
          </div>
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
            <button @click="cancelOrder()" style="background-color: #1989fa">确认</button>
          </div>
        </div>
      </div>
    </div>

    <div class="rules-container">
      1．“咪咕音乐视宣号标准版”目前仅支持<b>中国移动</b>用户（不含港澳台）订购，资费<b>30元/月</b>，通过<b>话费</b>收取，<b>订购立即生效，退订立即失效</b>，退订的次月起不再收费。
      <br>2．该业务可享专区页面使用模板或上传短视频制作店铺专属视频彩铃、彩印(网内2000条/月)、挂机短信(50条/月)等权益。<span>（注：专区页面可通过微信服务号“咪咕视宣号-订购服务-商户中心”、微信公众号“铃音多多-酷美视宣-热门圈子彩铃”进入。）</span>
      <!-- <br>3．订购该业务时，为具备业务生效所需的功能支持，将为您<b>同步开通</b>0元的视频彩铃功能，如已开通则不会重复开通。同步开通的视频彩铃功能，开通立即生效，退订立即失效（部分省份退订次月生效，具体以所属省份实际规定为准）；如不退订，资费将保持0元/月。 -->
      <br>3．截至2026年12月31日24:00，通过此页面订购该业务的用户，在业务保持订购期间，可每月领取1张50元充电电费抵用券。进入“咪咕音乐App-我的-全部（页面中部四个方块图标）-权益中心”，输入订购业务手机号码和验证码即可进行领取，领取有效期为当月有效，领取时若已退订咪咕视宣号标准版，则无法领取。领取成功后，2小时内到账对应手机号码的特来电账号，使用有效期为30天，从到账当天开始计算。可通过“特来电App-我的或特来电小程序-我的”查看和使用。
      <br>4．资费有效期3年（36个自然月），如双方在有效期届满前无异议，有效期自动续展，每次续展3年；有效期内变更/退订/销户/携转，无需承担相应的违约责任。
      <br>5．订购该业务后，进入<span>微信服务号“咪咕视宣号-订购服务-商户中心”，</span>用订购业务手机号码登录后使用业务权益。使用“挂机短信”和“彩印”权益时，需根据提示开通0元的“企业彩印-主被叫彩印体验版”，如已开通则不会重复开通；开通立即生效，退订立即失效；如不退订，资费将保持不变。<span>（注：①部分省份退订次月生效，</span>具体以所属省份实际规定为准。<span>②浙江地区用户暂不支持挂机短信、彩印服务）。</span>
      <br>6．使用该业务权益制作的店铺专属视频彩铃时长需在<b>7-48秒</b>以内，彩铃名称及内容不能有涉及宗教、违法、违规、色情、反动、敏感、不文明用语、危害公共安全、不清晰、有噪音、无声音或某段无声音，视频画面倒置等情况，上传的彩铃名称及内容会于<b>30分钟</b>内完成审核，审核通过后方可设置生效。审核结果可通过微信服务号“咪咕视宣号-订购服务-商户中心-宣发视频”查看。<span>（注：目前暂不支持制作设
置新闻、健康、教育类视频彩铃；财经、司法类需前往微信服务号“咪咕视宣号-客服咨询”，联系人工客服上传资质，审核通过后方可制作设置。）</span>
      <br>7．使用该业务权益设置“挂机短信”和“彩印”，内容不能有涉及宗教、违法、违规、色情、反动、敏感、不文明用语，提交的内容会于<b>30分钟</b>内完成审核，审核通过后方可设置生效。审核结果可通过微信服务号<span>“咪咕视宣号-订购服务-商户中心-挂机短信/彩印”</span>查看。
      <br>8．退订该业务时，既不关联退订同步开通的视频彩铃功能，也不关联退订使用彩印权益时根据提示开通的企业彩印-主被叫彩印体验版；退订视频彩铃功能/企业彩印-主被叫彩印体验版时，不关联退订该业务。但退订视频彩铃功能后，不能使用“个性化视频彩铃”业务权益；退订企业彩印-主被叫彩印体验版后，不能使用“挂机短信”及“彩印”业务权益。
      <br>9．如需退订，可通过<b>所属省份10086热线、当地中国移动营业厅、中国移动App</b>进行退订。
      <br>10．办理发起后，平台会通过短信进行验证码、办理结果通知、客服信息等相关的告知，在发起办理时，即视为您同意接收短信。
      <br>11．业务平台客服电话：<a href="tel:4006163810">400-616-3810</a>（人工服务时间9:00-21:00）。
    </div>
    <!--20260324 <div class="rules-container">
      1．“咪咕音乐视宣号标准版”目前仅支持<b>中国移动</b>用户（不含港澳台）订购，资费<b>30元/月</b>，通过<b>话费</b>按月收取，<b>订购立即生效</b>；退订立即失效，退订的次月起不再收费。
      <br>2．订购该业务，可享专区页面使用模板或上传短视频制作店铺专属视频彩铃、彩印(网内2000条/月)、挂机短信(50条/月)等权益。<span>（注：①专区页面可通过微信服务号“咪咕视宣号-订购服务-商户中心”、微信公众号“铃音多多-酷美视宣-热门圈子彩铃”进入。②目前暂不支持新闻、健康、教育类视频彩铃设置；财经、司法类请进入微信服务号“咪咕视宣号-客服咨询”联系人工客服，上传相关资质并审核通过后制作和设置视频彩铃。）</span>
      <br>3．订购该业务时，为具备业务生效所需的功能支持，将为您<b>同步开通</b>0元的视频彩铃功能，如已开通则不会重复开通。订购立即生效，可单独退订；如不退订，将保持0元按月生效；退订立即失效（部分省份退订次月生效，具体以您所在省份实际情况为准）。
      <br>4．资费有效期3年（36个自然月），如双方在有效期届满前无异议，有效期自动续展，每次续展3年；有效期内变更/退订/销户/携转，无需承担相应的违约责任。
      <br>5．如需退订，可登录<b>“中国移动APP-我的-已订业务”</b>或短信发送<b>0000</b>至<b>10086</b>根据提示操作退订。
      <br>6．退订该业务时，不关联退订视频彩铃功能。退订视频彩铃功能时，不关联退订该业务，但设置的店铺视频彩铃将不能再播放。
      <br>7．办理发起后，平台会通过短信进行验证码、办理结果通知、客服信息等相关的告知，在发起办理时，即视为您同意接收短信。
      <br>8．制作的店铺专属视频彩铃时长需在<b>7-48</b>秒以内，彩铃名称及内容不能有涉及宗教、违法、违规、色情、反动、敏感、不文明用语、危害公共安全、不清晰、有噪音、无声音或某段无声音，视频画面倒置等情况，<b>上传的彩铃名称及内容需审核通过后方可设置生效</b>。审核结果可通过微信服务号<span>“咪咕视宣号-订购服务-商户中心”</span>查看。
      <br>9．业务平台客服电话：<a href="tel:4006163810">400-616-3810</a>（人工服务时间9:00-21:00）。
    </div> -->

    <!-- 设置提示弹框 -->
    <div v-if="showPop" @touchmove.prevent @mousewheel.prevent>
      <!-- <div > -->
      <div class="rw-mask"></div>
      <div class="rw-mask-sim" style="z-index: 999">
        <div
          style="
            width: 100%;
            background: rgb(255, 255, 255);
            border-radius: 2.56vw;
            color: rgb(0, 0, 0);
            text-align: center;
          "
        >
          <div style="overflow-y: auto; padding: 12vw">
            <h1 id="resultId">{{ resTitle }}</h1>
            <h2 v-if="orderSuccess">您已成功办理：“{{ product.productName }}”</h2>
            <p>{{ resMsg }}</p>
            <!-- <p>
              资费：19.9元/月，通过话费扣取，开通立即生效，费用按月扣取，不按天进行折算；退订立即失效，退订的次月起不再扣费。
            </p> -->
            <p v-if="orderSuccess">
              立即前往
              <a
                href="https://y.migu.cn/app/v5/p/ai-charging/index.html?appId=b60f46486fac1f7a33fb551b6aa3970c&schannel=014025D&projectId=AI_JS_AIQWMC&releaseId=75955346/entry"
              >
                https://y.migu.cn/app/v5/p/ai-charging
              </a>
              登录设置
            </p>
          </div>
          <div style="text-align: center">
            <button @click="showPop = false">确认</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 业务说明弹框 -->
    <div v-if="showProductRule">
      <div class="rw-mask" @touchmove.stop.prevent></div>
      <div class="rw-mask-sim" style="z-index: 999">
        <div
          style="
            width: 100%;
            background: rgb(255, 255, 255);
            height: 70vh;
            border-radius: 2.56vw;
            color: rgb(0, 0, 0);
          "
        >
          <div style="height: calc(100% - 50px); overflow-y: auto; padding: 2.56vw">
            <p>
              1．“咪咕音乐视宣号标准版”目前仅支持<b>中国移动</b>用户（不含港澳台）订购，资费<b>30元/月</b>，通过<b>话费</b>收取，<b>订购立即生效，退订立即失效</b>，退订的次月起不再收费。
              <br>2．该业务可享专区页面使用模板或上传短视频制作店铺专属视频彩铃、彩印(网内2000条/月)、挂机短信(50条/月)等权益。<span>（注：专区页面可通过微信服务号“咪咕视宣号-订购服务-商户中心”、微信公众号“铃音多多-酷美视宣-热门圈子彩铃”进入。）</span>
              <!-- <br>3．订购该业务时，为具备业务生效所需的功能支持，将为您<b>同步开通</b>0元的视频彩铃功能，如已开通则不会重复开通。同步开通的视频彩铃功能，开通立即生效，退订立即失效（部分省份退订次月生效，具体以所属省份实际规定为准）；如不退订，资费将保持0元/月。 -->
              <br>3．截至2026年12月31日24:00，通过此页面订购该业务的用户，在业务保持订购期间，可每月领取1张50元充电电费抵用券。进入“咪咕音乐App-我的-全部（页面中部四个方块图标）-权益中心”，输入订购业务手机号码和验证码即可进行领取，领取有效期为当月有效，领取时若已退订咪咕视宣号标准版，则无法领取。领取成功后，2小时内到账对应手机号码的特来电账号，使用有效期为30天，从到账当天开始计算。可通过“特来电App-我的或特来电小程序-我的”查看和使用。
              <br>4．资费有效期3年（36个自然月），如双方在有效期届满前无异议，有效期自动续展，每次续展3年；有效期内变更/退订/销户/携转，无需承担相应的违约责任。
              <br>5．订购该业务后，进入<span>微信服务号“咪咕视宣号-订购服务-商户中心”，</span>用订购业务手机号码登录后使用业务权益。使用“挂机短信”和“彩印”权益时，需根据提示开通0元的“企业彩印-主被叫彩印体验版”，如已开通则不会重复开通；开通立即生效，退订立即失效；如不退订，资费将保持不变。<span>（注：①部分省份退订次月生效，</span>具体以所属省份实际规定为准。<span>②浙江地区用户暂不支持挂机短信、彩印服务）。</span>
              <br>6．使用该业务权益制作的店铺专属视频彩铃时长需在<b>7-48秒</b>以内，彩铃名称及内容不能有涉及宗教、违法、违规、色情、反动、敏感、不文明用语、危害公共安全、不清晰、有噪音、无声音或某段无声音，视频画面倒置等情况，上传的彩铃名称及内容会于<b>30分钟</b>内完成审核，审核通过后方可设置生效。审核结果可通过微信服务号“咪咕视宣号-订购服务-商户中心-宣发视频”查看。<span>（注：目前暂不支持制作设
        置新闻、健康、教育类视频彩铃；财经、司法类需前往微信服务号“咪咕视宣号-客服咨询”，联系人工客服上传资质，审核通过后方可制作设置。）</span>
              <br>7．使用该业务权益设置“挂机短信”和“彩印”，内容不能有涉及宗教、违法、违规、色情、反动、敏感、不文明用语，提交的内容会于<b>30分钟</b>内完成审核，审核通过后方可设置生效。审核结果可通过微信服务号<span>“咪咕视宣号-订购服务-商户中心-挂机短信/彩印”</span>查看。
              <br>8．退订该业务时，既不关联退订同步开通的视频彩铃功能，也不关联退订使用彩印权益时根据提示开通的企业彩印-主被叫彩印体验版；退订视频彩铃功能/企业彩印-主被叫彩印体验版时，不关联退订该业务。但退订视频彩铃功能后，不能使用“个性化视频彩铃”业务权益；退订企业彩印-主被叫彩印体验版后，不能使用“挂机短信”及“彩印”业务权益。
              <br>9．如需退订，可通过<b>所属省份10086热线、当地中国移动营业厅、中国移动App</b>进行退订。
              <br>10．办理发起后，平台会通过短信进行验证码、办理结果通知、客服信息等相关的告知，在发起办理时，即视为您同意接收短信。
              <br>11．业务平台客服电话：<a href="tel:4006163810">400-616-3810</a>（人工服务时间9:00-21:00）。
            </p>
          </div>
        </div>
        <div style="text-align: center">
          <button @click="showProductRule = false">确认</button>
        </div>
      </div>
    </div>

    <!-- 活动规则弹框 -->
    <div v-if="showYdRule">
      <div class="rw-mask" @touchmove.stop.prevent></div>
      <div class="rw-mask-sim" style="z-index: 999">
        <div
          style="
            width: 100%;
            background: rgb(255, 255, 255);
            height: 70vh;
            border-radius: 2.56vw;
            color: rgb(0, 0, 0);
          "
        >
          <div style="height: calc(100% - 50px); overflow-y: auto; padding: 2.56vw">
            <h1><strong>音视频作品承诺书</strong></h1>
            <p>
              <!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;甲方业务协议解约按类型分为“直接解约”和“有条件解约”两大场景。 -->
              中国移动：
              <br /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本单位已知悉贵公司（包括中国移动通信集团公司及其各地子公司、分公司和下属关联公司）作为网络服务提供者所提供服务的内容，
              本单位作为服务对象，将在贵公司上传相关音视频内容，包括通过贵公司平台软件技术将素材合成音视频内容，（以下简称“作品”），
              向主呼叫本单位特定话机的对象展示该作品,使用范围为视频彩铃产品及贵公司官方自媒体账号运营，为了规范本单位在贵公司平台上传作品的行为、目的之合法性，本单位在此郑重承诺：
              <br /><br />1、对上传的作品及作品内容的相关资料具有合法的来源和权利，并保证上传的内容健康，不违反任何法律法规。
              <br /><br />2、对上传的作品保证不侵犯任何其他权利人的合法权益，若因上传的作品产生了版权或其他纠纷，使贵公司、贵公司的关联公司及贵公司合作的第三方陷入任何法律纠纷、刑事处罚、行政处罚、诉讼或仲裁等，均由本单位负责解决和承担相关费用（包括但不限于赔偿金、罚款、诉讼费、仲裁费、律师费、公证费、鉴定费、交通费等），同时因上述原因造成贵公司的全部损失（包括但不限于任何直接、间接、附带或衍生的损失）全部由本单位承担。本单位保证对所有上传的作品拥有版权或已获得版权人的充分授权，具备将作品上传至贵公司平台，通过贵公司平台软件技术将素材合成音视频内容，并通过贵公司平台设置为音视频彩铃作品，向主呼叫退订话机的对象展示该作品所需的一切权利；本单位同事保证所有上传作品的内容符合法律法规及贵公司制度要求，并在贵公司提出举证要求时，能迅速地提供授权作品的各类版权证明文件并保证上述证明文件的真实性、合法性，贵公司对版权证明文件的形式审核并不减免本单位的任何责任。
              <br /><br />3、同意接受贵公司随时对上传的作品进行审查，同意贵公司依据审查结果和国家相关法律法规、贵公司相关管理办法，采取包括但不仅限于下架相关作品、单方终止服务或终止合作业务等措施，并追究本单位的相应责任。
              <br /><br />4、本单位保证上传的作品的著作者信息、权利人信息、上次人信息等真实有效，并在发生相关责任纠纷时及时提交上述信息或通过上述信息联系到本单位；
              <br /><br />5、本单位已充分阅读《中华人民共和国信息网络传播权保护条例》，并依足该条例履行自己的责任；
              <br /><br />6、本单位保证，若上传作品属于商业广告，将按贵公司要求提供发布网络广告所必须的法律文件或法定资料（包括但不限于：营业执照、广告主的主体资格、广告图文的全书和发行证明等，以及法律法规规定和贵公司要求提供的其他资料），同时保证广告所连接的网站或提供的产品、服务的相关信息等是真实的、合法的和正当的，并非以不正当竞争手段获取，且不存在对广告中涉及的产品或服务等各项和内容引人误解的虚假宣传。贵公司对相关文件的审核行为并不减免本单位的任何责任。
              <br /><br />7、本单位充分了解国家法律法规对广告有严格的规定，如果因本单位上传作品中的广告用语、广告设计等内容不符合法律规范的规定，导致贵公司因发布本单位广告被有关政府部门批评或者处罚的，贵公司有权立即下架相关作品、单方终止服务或终止合作业务等措施，并追究本单位的相应责任。
              <br /><br />8、本单位保证，自觉遵守法律法规、社会主义制度、国家利益、公民合法权益、社会公告秩序、道德风尚和信息真实性等要求。本音视频作品承诺书所做出之保证和责任承担承诺，均属不可撤销之承诺。
            </p>
          </div>
        </div>
        <div style="text-align: center">
          <button @click="showYdRule = false">确认</button>
        </div>
      </div>
    </div>

    <!-- 隐私协议弹框 -->
    <div v-if="showYinSiRule">
      <div class="rw-mask"></div>
      <div class="rw-mask-sim" style="z-index: 999">
        <div
          style="
            width: 100%;
            background: rgb(255, 255, 255);
            height: 75vh;
            border-radius: 2.56vw;
            color: rgb(0, 0, 0);
          "
        >
          <div style="height: calc(100% - 50px); overflow-y: auto; padding: 0px 2.56vw">
            <h2>中国移动视宣号用户服务协议</h2>
            <p>
              <strong>重要提示</strong>
              <br />欢迎使用咪咕音乐有限公司（以下简称“咪咕音乐”）视宣号（以下简称“视宣号”）服务，为了保障您的权益，请在使用视宣号服务之前，详细阅读此服务协议（以下简称“本协议”）所有内容，本协议中与您重大利益相关的条款将以粗体、下划线等形式着重标注，在您开始使用视宣号服务之前，请您务必认真阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款，以及开通或使用某项服务的单项协议(如有
              )，并选择接受或不接受。
              <br />如果您未满18周岁，请在监护人的陪同下阅读本协议，并特别注意未成年人使用条款。
              <br />如果您对本协议或咪咕音乐视宣号服务有意见或建议，可与咪咕音乐客服联系，咪咕音乐会给予您必要的帮助。您对视宣号服务的购买和/或使用行为即视为您已阅读并充分理解本协议各项条款并同意接受本协议的约束。本协议由您与咪咕音乐视宣号服务提供方共同缔结，具有合同效力。
              <br /><strong>第一条 服务协议的接受</strong> <br />1.1
              本协议内容包括协议正文、《咪咕音乐用户服务协议》，《咪咕隐私权政策》、《和彩印业务用户服务协议》及咪咕音乐将来可能发布采并取合理途径通知的协议或规则。所有规则均为本协议不可分割的组成部分，与协议正文具有同等法律效力，本协议正文与前述规则存在冲突的，以本协议正文为准。除另行明确声明外，您使用视宣号服务均受本协议约束。
              <br />1.2
              咪咕音乐将根据业务发展需要酌情修订本协议及相关服务条款，并以咪咕音乐平台公告的形式进行更新。经修订的条款在平台公布之日起7日后，即产生效力。如您不同意相关修订，您可以选择停止使用视宣号服务。如您继续使用视宣号服务，则将视为您已接受经修订的条款，当您与本协议发生争议时，应以更新后的服务协议条款为准。
              <br /><strong>第二条 签约主体</strong> <br />2.1
              本协议由您与咪咕音乐有限公司及咪咕文化现存或新设的其他运营主体共同缔结，对双方均具有约束力。
              <br />2.2
              “用户”是指享受咪咕音乐提供的视宣号服务的个人或单一实体，在本协议中亦会称为“您”。
              <br /><strong>第三条 订购视宣号</strong> <br />3.1
              视宣号：指咪咕音乐为您提供的网络增值服务，您在订购视宣号后可以依本协议享有一定的权益服务或参加活动，具体服务内容以咪咕音乐视宣号业务规则为准。视宣号的所有权和运营权，以及视宣号制度和活动的制订权均归咪咕音乐所有，咪咕音乐在法律规定的范围内拥有解释权。
              <br />3.2
              咪咕音乐视宣号可在咪咕音乐视宣号H5/小程序内使用相关权益和服务，包括但不限于音视频彩铃制作、挂机短信、移动彩印、来电数据分析报告、咪咕音乐公播音乐中单个或多个服务，具体内容以页面中的描述为准。您理解并同意，咪咕音乐为不同订购业务类型提供不同的服务及权益，具体以视宣号的页面说明或视宣号实际提供的服务为准。若您未开通权益中必备的功能，如视频彩铃功能（设置视频彩铃必备条件），将同步为您开通，具体收费以实际扣费为准。
              <br />3.3
              您可以在订购界面通过咪咕音乐视宣号认可的支付方式完成支付来开通视宣号服务。您在开通服务时，应仔细核对开通手机号、开通服务类型与时长等具体信息。如因您个人原因造成充错手机号、开通错服务时长，咪咕音乐不予退还已收取的费用。
              <br />3.4
              开通视宣号后可享受视宣号多项权益和服务，有效日期以服务开通的时间算起，有效期内不可重复开通。具体日期您可以登录咪咕音乐视宣号商户中心页面查询。
              <br />3.5
              咪咕音乐可根据业务发展变化及时调整视宣号权益类别。您理解和接受咪咕音乐对视宣号服务进行调整可能会对您已享有或正在享有的权益造成影响，若您不同意咪咕音乐的调整，应立即停止使用视宣号服务。您的继续使用视为同意咪咕音乐的调整，并按照调整后的约定执行。
              <br />3.6
              您理解并同意，您在使用咪咕音乐视宣号的过程中，将可能看到以各种方式投放的商业性广告或其他类型的商业信息。您理解并同意，咪咕音乐将以以下合理方式为您发送各类通知：
              <br />（1）公示的文案； <br />（2）H5的页面banner；
              <br />（3）根据您预留联系方式发送的手机短信、电子邮件、12530电话语音外呼、函件等；
              <br />（4）合理的其他通知方式。 3.7
              <br />视宣号服务是咪咕音乐提供的收费服务，您须在按照视宣号的收费标准支付相应费用后方可使用。此外，您可能也可以通过参与活动等方式享有、使用视宣号。咪咕音乐可能会根据本服务的整体规划，对视宣号相关权益细则、收费标准、方式等进行修改和变更，前述修改、变更，咪咕音乐将在相应服务页面进行展示。咪咕音乐会根据实际状况，对不同阶段订购的视宣号给予不同的优惠，具体优惠政策以咪咕音乐在相关服务页面公示的信息为准。您在此理解并同意因参加活动或订购产品不同，视宣号将享受不同资费或福利赠送。
              <br />3.8
              订购移动彩印服务，获得使用该业务提供的信息浏览、按照我们规则要求自定义屏幕显示内容、管理及推送服务，具体服务内容如下：
              <br />（1）防诈骗来电号码提示服务及境外来电识别提醒类型业务；
              <br />（2）通话时，向非业务用户投递您或系统预设的屏显信息；
              <br />（3）浏览、创建、审核、管理该业务功能；
              <br />（4）因使用功能、服务产生的短信通知。
              <br />来电号码提示服务的识别结果依据来自于用户标记数据、互联网公开数据等渠道，其主观判断性可能影响号码库的精准度，且诈骗骚扰号码复杂多变，其识别结果仅用于向您提供可能的号码身份提示。我们不保证该提示内容的完全准确性亦不保证我们能够识别每一个来电号码的真实身份信息，用户仍需自行辨别接收来电信息的真实性、准确性、合法性及安全性，并注意保护个人的人身财产安全。如存在因号码漏提醒、误提醒致使用户产生经济损失及不利影响，由用户自行承担。如您订购我们的业务后未自行设置自定义的彩印时，本公司将为您提供系统内容展示服务，系统内容包括但不限于社会公益、城市形象、热点事件、移动服务、诈骗风险提示等。您订购的该业务与用户的订购时的手机号码绑定，该订购权益不可在不同手机号码之间转让。
              <br />3.9
              订购挂机短信服务，获得使用该业务提供的信息浏览、按照我们规则要求自定义挂机短信内容、管理及推送服务，具体服务内容如下：
              <br />（1）挂机时，向非业务用户发送您或者系统预设的挂机短信；
              <br />（2）浏览、创建、审核、管理该业务功能；
              <br />（3）因使用功能、服务产生的短信通知。
              <br />挂机短信内容来自于您自己设定，您对短信内容承担责任，我们不保证您的挂机短信内容对其他用户造成的骚扰、诈骗和违法行为，如存在因挂机短信内容误提醒致使用户产生经济损失及不利影响，由您自行承担。
              <br /><strong>第四条 视宣号内容版权合法性保证</strong> <br />4.1
              用户可在视宣号指定版块上传和制作作品等内容，其形式包括但不限于文字、图片、音频、视频等（以下简称“用户上传作品”）。用户上传作品可供其他用户在使用咪咕产品进行创作、发布、设置相关内容时使用。用户上传作品的著作权及其他权利及责任由上传用户自行负责。
              <br />4.2
              用户承诺：对用户上传作品拥有完整的著作权或已获得了著作权人的相应授权，其上传行为不侵犯他人著作权或其他合法权益。否则，咪咕公司将主动或根据用户或第三方投诉删除、下架或屏蔽相应用户上传的作品，无须通知上传用户。用户应承担其侵权行为导致的全部责任并赔偿因此给咪咕公司造成的一切损失（包括但不限于赔偿金、罚款、罚金、律师费、诉讼费、执行费、公告费等）。
              <br />4.3 用户承诺：用户上传作品不得含有以下内容：
              <br />（1）反对宪法确定的基本原则的；
              <br />（2）颠覆国家政权，推翻社会主义制度，煽动分裂国家，危害国家统一、主权和领土完整的；
              <br />（3）泄露国家秘密、危害国家安全或者损害国家荣誉和利益的；
              <br />（4）煽动民族仇恨、民族歧视，破坏民族团结，或者侵害民族风俗、习惯的；
              <br />（5）煽动地域歧视、地域仇恨的；
              <br />（6）宣扬恐怖主义、极端主义、邪教或封建迷信的；
              <br />（7）编造、传播谣言、虚假信息，扰乱经济秩序和社会秩序，破坏社会稳定的；
              <br />（8）教唆犯罪或者散布、传播暴力、凶杀、淫秽、色情、赌博、恐怖活动的；
              <br />（9）危害网络安全、利用网络从事危害国家安全、荣誉和利益的；
              <br />（10）侮辱或者诽谤他人，侵害他人名誉、隐私、知识产权等其他合法权益的；
              <br />（11）对他人进行暴力恐吓、威胁、实施人肉搜索的；
              <br />（12）散布污言秽语、损害社会公序良俗的；
              <br />（13）散布商业广告、或类似的商业招揽信息、过度营销信息及垃圾信息的；
              <br />（14）侵害未成年人合法权益或损害未成年人身心健康的；
              <br />（15）包含恐怖、暴力血腥、高危险性、危害表演者自身或他人身心健康内容的；
              <br />（16）危害社会公德，损害民族优秀文化传统的；
              <br />（17）有违背公序良俗的着装、发型、语言、动作，以低俗或不宜面向公众公开讨论的内容制造话题的；
              <br />（18）有关法律、行政法规和国家规定禁止的其他内容。
              <br />用户制作、上传、传播的内容需遵守《网络音视频信息服务管理规定》及相关法律法规规定，不得利用基于深度学习、虚拟现实等的新技术新应用制作、发布、传播虚假新闻信息。用户在发布或传播利用基于深度学习、虚拟现实等的新技术新应用制作的非真实音视频信息时，应当以显著方式予以标识。
              用户上传作品中含有上述内容的，咪咕公司有权依据自己的独立判断采取直接删除、下架或屏蔽相应作品，禁用上传用户账号部分功能，注销账号等方式处理，并向有关部门报告。此外，用户应承担其违反上述规定的行为导致的全部责任并赔偿因此给咪咕公司造成的一切损失（包括但不限于赔偿金、罚款、罚金、律师费、诉讼费、执行费、公告费等）。
              <br />4.4
              除特别签订协议或者咪咕公司特别许可外，用户利用咪咕产品制作、上传、发布、传播的视频等内容不得含有广告信息。否则，咪咕公司有权依据自己的独立判断采取直接删除、下架或屏蔽相应内容，禁用上传用户账号部分功能，注销账号等方式处理，并向有关部门报告。此外，用户应承担其行为导致的全部责任并赔偿因此给咪咕公司造成的一切损失（包括但不限于赔偿金、罚款、罚金、律师费、诉讼费、执行费、公告费等）。
              <br /><strong>第五条 视宣号作品授权</strong> <br />5.1
              用户授权咪咕公司对用户上传作品（包括作品本身及作品中的人物形象、图片等素材）行使如下权利：修改、复制、编辑出版、改编、翻译、汇编、表演和展览等现行法律规定和将来法律赋予的著作权权利，以及授权第三方使用上传作品的权利；通过有线或无线网络向用户的计算机终端、移动通讯终端（包括但不限于便携式通讯设备如手机和智能平板电脑等）、手持数字影音播放设备、电视接收设备（模拟信号接收设备、数字信号接收设备、数字电视、IPTV、带互联网接入功能的播放设备等）等提供信息的下载、点播、数据传输、移动视频业务（包括但不限于SMS、MMS、WAP、IVR、Streaming、3G、4G、5G、手机视频、音视频彩铃等无线服务）、及其相关的宣传和推广等服务的权利；以咪咕公司的名义提起诉讼，由咪咕公司委派的或其指定的适当人士为代理人，对侵犯用户上传作品著作权的一切侵权行为采取法律措施（包括但不限于调查、搜集证据，申请办理公证事宜，发送律师函、警告函，诉讼，申请财产保全、证据保全、诉前禁令、强制执行，收取和解费、赔偿款、退费、补偿款、强制执行费用等）的权利。如无特殊约定，上述授权为在全球范围内的、免费的、长期有效的普通授权。
              <br />5.2
              为提高用户内容曝光量及发布效率，用户同意授权咪咕公司将用户在某一咪咕产品上所发布的全部内容均以用户的账号自动同步发布至所有咪咕产品。用户在某一咪咕产品上发布、修改、删除内容的操作，均会同步到所有咪咕产品。
              <br />5.3
              咪咕公司根据上述授权进行创作或委托他人创作，产生的新作品的著作权及其他一切合法权益由咪咕公司享有。
              <br />5.4
              用户保证咪咕公司行使上述授权时无须再向用户或任何第三人征得任何形式的许可或支付任何费用。如咪咕公司因上述权利的行使侵犯他人著作权或其他权益，用户应承担全部责任并赔偿因此给咪咕公司造成的一切损失（包括但不限于赔偿金、罚款、罚金、律师费、诉讼费、执行费、公告费等）。
              <br /><strong>第六条 视宣号使用规则</strong> <br />6.1
              您确认：您是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织，有能力对您使用视宣号服务的一切行为独立承担责任。若您不具备前述主体资格，咪咕音乐在依据法律规定或本协议约定要求您承担责任时，有权向您的监护人或其他责任方追偿。若您是自然人，应向咪咕音乐提供真实姓名、电子邮箱、
              <br />6.2
              您应妥善保存有关账号、密码，并对该账号进行的所有活动和行为负责，禁止赠与、借用、租用、转让或售卖该账号。您应自行负责妥善保管、使用、维护您在咪咕音乐申请取得的账号、账号信息及账号密码。非咪咕音乐原因致使您账号密码泄漏以及因您保管、使用、维护不当造成损失的，咪咕音乐无须承担与此有关的任何责任。
              <br />6.3
              如您实施了下列行为之一，咪咕音乐有权在不通知您的情况下，终止提供视宣号服务，并有权限制、冻结或终止与该服务相关联的咪咕音乐账号使用。咪咕音乐无须给予任何补偿和退费，由此产生的责任由您自行独立承担。因此给咪咕音乐或第三方造成损失的，您应负责全额赔偿：
              <br />（1）以营利为目的为自己或他人获得视宣号服务；
              <br />（2）将视宣号账号以出租、出借、出售等任何形式提供给第三方使用；
              <br />（3）将通过视宣号服务获得的任何内容用于个人学习、研究或欣赏之外的用途；
              <br />（4）盗用他人咪咕音乐视宣号账号进行注册或使用；
              <br />（5）以任何机器人软件、蜘蛛软件、爬虫软件、刷屏软件或其它非正规方式获得视宣号服务；
              <br />（6）通过不正当手段或以违反诚实信用原则的行为获得视宣号服务。
              <br />6.4
              如发生下列任何一种情形，咪咕音乐有权根据实际情况，在不通知您的情况下中断或终止向您提供的一项或多项或全部服务，由此产生的损失由您承担，咪咕音乐无需给与任何补偿和退费。若因此给咪咕音乐或第三方造成损失的，您应负责全额赔偿：
              <br />（1）您提供的个人资料不真实或与注册时信息不一致又未能提供合理证明；
              <br />（2）经国家行政或司法机关的生效法律文书确认您存在违法或侵权行为，或者咪咕音乐根据自身的判断，认为您的行为涉嫌违反《咪咕音乐用户服务协议》、《咪咕隐私权政策》、《和彩印业务用户服务协议》本协议内容或咪咕音乐不时公布的使用规则等内容，或涉嫌违反法律法规的规定的；
              <br />（3）您的行为干扰了咪咕音乐视宣号任何部分或功能的正常运行；
              <br />（4）您未经咪咕音乐允许，利用咪咕音乐开展未经咪咕音乐同意的行为，包括但不限于对通过咪咕音乐获得的信息进行商业化活动，如附加广告、商业内容或链接等；
              <br />（5）您的个人信息、发布内容等违反国家法律法规规定，有悖社会道德伦理、公序良俗、侵犯他人合法权益、政治色彩强烈，引起任何争议，或违反本协议、咪咕音乐平台公示的要求的；
              <br />（6）您利用咪咕音乐进行任何违法行为的。 <br />6.5
              您理解并同意，咪咕音乐向您提供的服务，可能包含咪咕音乐经合法权利人授权而向您提供的相关服务，因此，由于该权利人对咪咕音乐授权时间、范围、限制等的约束，所以，咪咕音乐会对开通相关服务用户所在的地区以及用户具体使用服务的时间、地域范围、终端设备等做一定限制，可能会导致您在一定的地区或时间或终端设备等情况下无法获得相关服务，包括但不限于：目前视宣号相关服务仅限您在中国大陆地区（不含香港、澳门、台湾等地区）范围内开通并使用相关服务，如果您在中国大陆地区之外或者使用的是非中国大陆地区之网络/设备等，则无法使用/获得相关服务等。对于因为前述原因或其他第三方原因造成您无法享有相关服务的，咪咕音乐无需承担任何责任。
              <br /><strong>第七条 连续包月</strong>
              <br />如您需使用咪咕音乐视宣号连续包月服务，则需同意本规则。您理解并同意：
              <br />7.1
              本服务是在您已开通视宣号服务的前提下，为您提供的自动续费服务。如您开通本服务，则视为您授权咪咕音乐在您的视宣号即将到期时，从您的第三方支付账户、通信账户（以下统称“账户”）余额中代扣下一个计费周期包月费。一旦扣款成功，咪咕音乐将为您开通下一个计费周期的视宣号权益服务。因上述账户中可扣款余额不足导致的续费失败，由您自行承担。
              <br />7.2 您可通过下述方式中止或终止本服务： <br />7.2.1
              中国移动话费支付自动续费用户退订方法如下： <br />（1）当省10086取消；
              <br />（2）营业厅取消； （3）拨打1253088人工台取消。 <br />7.2.2
              支付宝及微信自动续费用户退订方法如下：
              进入“支付宝-我的-设置-支付设置-免密支付/自动扣款”取消自动扣款。进入“微信-
              我-服务-钱包-支付设置-免密支付/自动扣款”选择需要关闭的项目点击关闭扣费服务。在取消自动代扣后，则遵循业务规则在业务有效期到期时自动退订。
              <br /><strong>第八条 未成年人使用条款</strong> <br />8.1
              若您未满18周岁，则为未成年人，应在监护人监护、指导下并获得法定监护人同意的情况下，认真阅读本协议后，方可使用视宣号服务。若您未取得监护人的同意，监护人可以通过咪咕音乐视宣号公示渠道通知咪咕音乐处理相关账号，咪咕音乐有权对相关账号的功能、使用进行限制，包括但不限于浏览、发布信息、互动交流等功能。
              <br />8.2
              咪咕音乐重视对未成年人个人信息的保护，未成年人用户在使用视宣号服务时应注意以下事项，提高安全意识，加强自我保护：
              <br />（1）填写个人资料时，加强个人保护意识，并应在取得法定监护人的同意以及在其指导下正确使用咪咕产品及相关服务，以免不良分子对个人生活造成骚扰；
              <br />（2）在监护人或老师的指导下，学习正确使用网络，认清网络世界与现实世界的区别，避免沉迷于网络，影响日常的学习生活。
              <br />（3）青少年用户必须遵守《全国青少年网络文明公约》：
              <br />①要善于上网学习，不浏览不良信息； ②要诚实友好交流，不侮辱欺诈他人；
              <br />③要增强自护意识，不随意约会网友； ④要维护网络安全，不破坏网络秩序；
              <br />⑤要有益身心健康，不沉溺虚拟时空。 <br />8.3
              监护人应指导子女上网应该注意的安全问题，防患于未然。
              <br />（1）如您的被监护人使用咪咕产品及相关服务的，您作为其法定监护人应指导并监督被监护人的注册和使用行为，如您的被监护人申请注册咪咕产品账号，咪咕音乐将有权认为其已取得您的同意。
              <br />（2）您的被监护人在使用咪咕产品及相关服务时可能使用收费服务功能。您作为法定监护人，请保管好您的支付设备、支付账户及支付密码等，以避免被监护人在未取得您同意的情况下通过您的咪咕账号使用收费服务功能。
              <br /><strong>第九条 责任声明</strong> <br />9.1
              如果您行使本协议规定的权利而购买/接受咪咕音乐以外的第三方商户提供的商品或服务，如因此发生纠纷的，您应向销售/提供该商品或服务的第三方商户主张权利，与咪咕音乐无关。
              <br />9.2
              您须对您自身及您所邀请的宾客在参加咪咕音乐组织的活动或使用由咪咕音乐提供的各项优惠及增值服务时的实施的一切行为承担全部法律责任。
              <br />9.3
              咪咕音乐不对您因第三方的行为或不作为造成的损失、不可抗力原因造成的损失承担任何责任，包括但不限于支付服务、网络接入服务、电信部门的通讯线路故障、通讯技术问题、网络、电脑故障、系统不稳定性、任意第三方的侵权行为等。
              <br />9.4
              您理解并同意，在使用视宣号服务的过程中，可能会遇到不可抗力等风险因素，使该服务发生中断。如出现上述情况，咪咕音乐承诺将尽快与相关单位配合进行修复，但不承担由此对您造成的任何损失且不退还视宣号费用。
              <br /><strong>第十条 其他约定</strong> <br />10.1
              服务中止、中断及终止：咪咕音乐根据自身商业决策、政府行为、不可抗力等原因可能会选择中止、中断及终止视宣号服务。如有此等情形发生，咪咕音乐会采取公告的形式通知您，但不承担由此对您造成的任何损失且不退还视宣号费用。
              <br />10.2
              法律与争议解决：本协议适用中华人民共和国的法律，并且排除一切冲突法规定的适用。如出现纠纷，您和咪咕音乐一致同意将纠纷交由被告所在地人民法院管辖。
              <br />10.3
              咪咕音乐不行使、未能及时行使或者未充分行使本协议或者按照法律规定所享有的权利，不应被视为放弃该权利，也不影响咪咕音乐在将来行使该权利。
              <br />10.4 如果您对本协议内容有任何疑问，请发致电至我们的客服：电话1253088。
            </p>
          </div>
          <div style="text-align: center">
            <button @click="showYinSiRule = false">确认</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系客服弹框 -->
    <div v-if="showKefu">
      <div class="rw-mask"></div>
      <div class="rw-mask-sim-bottom" style="z-index: 999">
        <div style="text-align: center; margin-top: 20px">
          <h2>联系客服</h2>
          <div
            style="width: 40%; margin-right: 5%; margin-left: 30%"
            @click="callPhone()"
          >
            <img src="../assets/images/phone.png" style="width: 50px; height: 50px" />
            <div
              class="customer-phone"
              id="customer_phone"
              style="margin-top: 2.56vw; font-size: 3.85vw"
            >
              400-616-3810
            </div>
            <div style="font-size: 2.85vw; color: grey">服务时间：09:00~18:00</div>
          </div>
          <div style="text-align: center">
            <button @click="showKefu = false">取消</button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="submit-float" v-if="isSticky">
      <img
        src="../assets/images/update-btn.png"
        alt=""
        style="width: 100%; height: 100%"
        @click="onBuy"
      />
    </div> -->
  </div>
</template>

<script>
// import VideoPlayer from "@/components/VideoPlayer.vue";
// import axios from "axios";
import { Tab, Tabs } from "vant";
import encryptionMixin from "../assets/js/encryptionMixin";
import CryptoJS from "crypto-js";
export default {
  name: "mgMusicKMgd",
  components: {
    // VideoPlayer,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  data() {
    return {
      /* for GdpTracker - start */
      userId: "",
      generalProps: {
        global_merchantsId_var: "0000000005320300001", // 传归属的专业公司ID（传全网渠道统一编码(19位的)）
        global_merchants_var: "咪咕音乐", // 传归属的专业公司名称（咪咕公司、在线公司等）
        global_apiId_var: "SDK",
        global_apiName_var: "办理SDK",
      },
      bussinessProcessingData: {
        businessType_var: "存量",
        goodsId_var: "698039047105951781", // 业务办理时所属的商品ID或者业务ID
        goodsName_var: "咪咕音乐视宣号标准版", //业务办理时商品名称。
        goodsType_var: "新业务", //业务办理时商品类型，与ordertype_var对应。若不清楚可咨询业务接口人
        apiId_var: "SDK", // 调用接口id；如果是通过SDK办理的，该字段传【SDK】
        apiName_var: "办理SDK", // 调用接口名称；如果是通过SDK办理的，该字段传【办理SDK】
        merchantsId_var: "002129B", // 商品所属商户id或者渠道号
        merchants_var: "成都盛川科技有限责任公司", // 商品所属商户名称或者渠道名称
        merchantsIdCity_var: "广州", //商户ID归属地市，枚举值：省统、广州、中山、云浮……
        phoneNumber_var: "", //输入电话号码,传AES加密后的手机号
        processType_var: "", // 业务办理时的每个办理步骤。（页面浏览、输入电话号码(点击输入框时触发)、立即办理、前往办理(拉起统一支付页面时触发)、获取短信验证码、输入短信验证码、提交订单、办理成功、办理失败、支付成功、支付失败等）
        errorMessage_var: "", // 业务办理失败时的失败原因明细。（如：网络问题、业务互斥……）
        channelId_var: "002129B", // 下单渠道编码，没有则不传
        operatorId_var: "", // 下单工号，没有则不传
        payType_var: "", // 业务办理支付时的支付方式名称。（支付宝、微信、话费、……）
        merchantsOrder_var: "", // 自建的订单号
        orderNumber_var: "", // 接口返回的订单号
        ordertype_var: "新业务订单", // 业务办理支付完成时所属订单类型名称。与goodsType_var对应，是什么商品类型就是什么类型订单
      },
      /* for GdpTracker - end */
      activeTab: 0, // 当前激活的Tab索引
      preVideoState: {
        showFullscreenVideo: false,
        isVideoPlaying: false,
      },
      agree: false,
      showVailCode: false,
      btnVailCode: false,
      timeVailCode: 60,
      timerVailCode: null,
      mobile: "",
      code: "",
      pid: "",
      isSticky: false,
      showYdRule: false, // 活动规则
      showProductRule: false, // 业务说明
      showYinSiRule: false, // 隐私协议
      show2ndConfirm: false, // 二次确认弹框
      showPop: false, // 提示弹框
      xieyiPop: false, // 协议提示弹框
      showKefu: false, // 联系客服
      showTuiding: false, // 退订弹框
      orderSuccess: false, // 订购成功
      channelCode: "002129B", //mg视宣号渠道号
      serviceId: "698039047105951781", // 包月包业务ID
      functionId: "600923018000000006", // 主叫视频彩铃功能ID
      token: "",
      bizInfoMon: "",
    };
  },
  computed: {},
  mixins: [encryptionMixin],
  methods: {
    // 模拟手机号加密函数
    encryptPhoneNumber(phone) {
      console.log("PhoneNumber: " + phone.toString());
      // 这里应该是实际的AES加密逻辑
      try {
        // 将密钥转换为WordArray
        const key = CryptoJS.enc.Utf8.parse("9e5702ead4d643fd");

        // ECB模式不需要IV
        const encrypted = CryptoJS.AES.encrypt(phone.toString(), key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        console.log("encryptedNumber: " + encrypted.toString());
        // 返回Base64格式的加密结果
        return encrypted.toString();
      } catch (error) {
        console.error("AES加密失败:", error);
        return null;
      }
    },
    handleScroll() {
      const scrollTop = this.$refs.container.scrollTop;
      // console.log('🚀 ~ file: Home.vue:400 ~ handleScroll ~ scrollTop:', scrollTop)
      this.isSticky = scrollTop > 550;
    },
    scrollToBottom() {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth", // 平滑滚动
      });
    },
    redirectToMiguDownload() {
      // 跳转到咪咕下载页面
      window.location.href = "https://music.migu.cn/v3/app/h5";
    },
    playVideo() {
      this.preVideoState.showFullscreenVideo = true;
      this.$nextTick(() => {
        this.$refs.fullscreenVideo.play();
        this.preVideoState.isVideoPlaying = true;
      });
    },
    toggleVideoPlay() {
      const video = this.$refs.fullscreenVideo;
      if (this.preVideoState.isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      this.preVideoState.isVideoPlaying = !this.preVideoState.isVideoPlaying;
    },
    exitFullscreen() {
      this.$refs.fullscreenVideo.pause();
      this.preVideoState.showFullscreenVideo = false;
      this.preVideoState.isVideoPlaying = false;
    },
    autoAgree() {
      this.agree = true;
      this.$store.commit("saveAgree", true);
    },
    isMobile(val) {
      var reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
      if (!reg.test(val)) {
        return false;
      }
      return true;
    },
    gdpInput() {
      this.bussinessProcessingData.processType_var = "输入电话号码";
      console.log("track" + JSON.stringify(this.bussinessProcessingData.processType_var));
      window.gdp(
        "track",
        "professional_merchants_bussinessProcessing",
        this.bussinessProcessingData
      );
    },
    mobileInput(e) {
      console.log("e", e.target.value);
      if (
        e.target.value.length == 11 &&
        this.isMobile(e.target.value) &&
        (!this.showVailCode || this.timeVailCode == 60)
      ) {
        this.showVailCode = true;
        this.autoAgree();
        this.checkAndOrder();
        console.log("this.mobile", this.mobile);
      }
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
      // this.show = false;
      clearTimeout(this.timerVailCode);
      this.timeVailCode = 60;
      this.btnVailCode = false;
      this.show2ndConfirm = false;
      this.showKefu = false;
    },
    callPhone() {
      window.location.href = "tel:4006163810";
    },
    // 获取token
    async getToken() {
      this.mLoading(true);
      // GdpTracker - setUserAttributes页面涉及登录则需在登录时调用，若无登录则无需调用
      window.gdp("setUserAttributes", {
        operators_var: "移动", // 赋值运营商名称（移动、联通、电信）。
        prov_var: "广东", // 赋值省份名称。
        city_var: "广州", // 赋值地市名称。
      });
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
          // GdpTracker
          this.bussinessProcessingData.processType_var = "办理失败";
          this.bussinessProcessingData.errorMessage_var = response.result.resMsg;
          window.gdp(
            "track",
            "professional_merchants_bussinessProcessing",
            this.bussinessProcessingData
          );
          return false;
        }
      } catch (err) {
        this.mToast(err.message);
        // GdpTracker
        this.bussinessProcessingData.processType_var = "办理失败";
        this.bussinessProcessingData.errorMessage_var = err.message;
        window.gdp(
          "track",
          "professional_merchants_bussinessProcessing",
          this.bussinessProcessingData
        );
        console.error("Request failed:", err.message);
      } finally {
        this.mLoading(false);
      }
    },
    // 预校验
    async queryPreCheck(token) {
      this.mLoading(true);
      try {
        let reqData = this.getReqData({
          channelCode: this.channelCode,
          token: token,
        });
        const response = await this.$http.post("/migu/P2216", reqData);
        if (response.success) {
          console.log("queryPreCheck: " + response.result.resMsg);
          return "1";
        } else {
          console.error("[queryPreCheck] Invalid response structure", response);
          var errMessage = "";
          if ((response.result && response.result.resMsg)) {
            errMessage = response.result.resMsg
          } else {
            errMessage = response.message
          }
          this.mToast(errMessage);
          // GdpTracker
          this.bussinessProcessingData.processType_var = "办理失败";
          this.bussinessProcessingData.errorMessage_var = errMessage;
          window.gdp(
            "track",
            "professional_merchants_bussinessProcessing",
            this.bussinessProcessingData
          );
          return false;
        }
      } catch (err) {
        this.mToast(err.message);
        // GdpTracker
        this.bussinessProcessingData.processType_var = "办理失败";
        this.bussinessProcessingData.errorMessage_var = err.message;
        window.gdp(
          "track",
          "professional_merchants_bussinessProcessing",
          this.bussinessProcessingData
        );
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
    // 点击订购事件
    async checkAndOrder() {
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

      this.userId = this.encryptPhoneNumber(this.mobile);
      // GdpTracker
      this.bussinessProcessingData.phoneNumber_var = this.userId;
      this.bussinessProcessingData.processType_var = '前往办理';
      window.gdp('track',"professional_merchants_bussinessProcessing", this.bussinessProcessingData);
      // GdpTracker setUserId
      window.gdp("setUserId", this.userId); // 此处填写AES加密后的用户手机号（AES加密前：13512345678，加密后：/NTeZ0q9bkZ1eHN8d9TLaA==），调用时机请在init后，send前调用。

      //勾选协议
      if (!this.agree) {
        // this.mToast("请仔细阅读协议，并同意协议内容");
        if (!this.xieyiPop) {
          this.xieyiPop = true;
          return false;
        } else {
          this.agree = true;
          this.xieyiPop = false;
        }
      }

      try {
        // 1. 先获取token
        this.token = await this.getToken();
        if (!this.token) {
          return;
        }
        // 2. 预校验
        const preCheck = await this.queryPreCheck(this.token);
        console.log("preCheck" + preCheck)
        if (preCheck === "1") {
          // 3. 查询订购包月状态
          const orderStatus = await this.queryOrder(this.token);
          if (!orderStatus) {
            return;
          } else if (orderStatus === "0") {
            //0已订购 1未订购
            this.mToast("您已办理该业务！");
          } else {
            // 4. 未订购(无包月)，开通包月业务
            this.orderBY();
          }
        }
      } catch (err) {
        this.mToast("checkAndOrder流程出错:", err.message);
      }
    },
    async orderBY() {
      try {
        // 先执行queryStrategy包月包策略查询
        await this.miguQueryStrategy(this.token);
        // queryStrategy完成后执行miguOrder
        this.miguOrder(this.token);
      } catch (error) {
        console.error("执行顺序出错:", error);
      }
    },
    // 开通视彩号包月
    miguOrder(token) {
      if (!this.bizInfoMon.cpId) {
        console.log("获取bizInfoMon失败");
        return;
      }
      const data = {
        youCallbackName: "window.orderBackFun",
        channelCode: this.channelCode,
        token: token,
        serviceId: this.serviceId,
        cpId: this.bizInfoMon.cpId,
        bizCode: this.bizInfoMon.bizCode,
        cpparam: this.bizInfoMon.cpparam,
        salePrice: this.bizInfoMon.salePrice,
        name: "miguBJYHOrder",
        excode: "",
        extendAttr:"",  // 不传/传空：建立新商户；传圈子ID：将该用户加入成为圈子ID的成员
        defSeq: "",
      };

      // GdpTracker
      // this.bussinessProcessingData.processType_var = "立即办理";
      // window.gdp(
      //   "track",
      //   "professional_merchants_bussinessProcessing",
      //   this.bussinessProcessingData
      // );

      console.log("miguBJYHOrder: " + JSON.stringify(data));
      window.miguBJYHOrder(data);
    },
    onSetClick() {
      if (!this.orderSuccess) {
        this.$refs.phoneNum.focus();
        this.mToast("请先登录");
        return false;
      }
      this.checkAndOrder();
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
    // 包月包策略查询
    miguQueryStrategy(token) {
      return new Promise((resolve, reject) => {
        var data = {
          youCallbackName: "window.queryStrategyBackFun",
          channelCode: this.channelCode,
          token: token,
          serviceId: this.serviceId, // 包月包业务ID
          count: "1",
          type: "14",
        };

        // console.log("miguQueryStrategy:" + JSON.stringify(data));

        // 保存原始回调函数
        const originalCallback = window.queryStrategyBackFun;

        // 重写回调函数
        window.queryStrategyBackFun = (result) => {
          console.log(result.resCode);
          if ("" + result.resCode === "000000") {
            if (result.bizInfoMon) {
              this.bizInfoMon = result.bizInfoMon;
              resolve(); // 成功时resolve
            } else {
              reject(new Error("bizInfoMon未返回"));
            }
          } else {
            reject(new Error("包月包策略查询失败: " + result.resMsg));
          }

          // 恢复原始回调函数
          window.queryStrategyBackFun = originalCallback;
        };

        window.queryStrategyBYB(data);
      });
    },

    showRes(resTitle, resMsg) {
      console.log("showRes called with:", resTitle); // Debugging statement
      this.showPop = true;
      this.resTitle = resTitle;
      this.resMsg = resMsg;
      console.log("showPop set to:", this.showPop); // Debugging statement
    },
    async sendRightsSMS(mobile) {
      this.mLoading(true);
      try {
        this.$http.post(
          "/migu/smsOrderSuccess",
          this.getReqData({
            phone: mobile,
            productNo: "P202511001",  // 视宣号标准版
          })
        );
        // this.smsData = response.data; // 存储接口返回的数据
      } catch (err) {
        // this.error = err.message || '请求失败'; // 捕获错误
        console.log(err.message);
      } finally {
        this.mLoading(false);
      }
    },
    fetchData() {
      // this.channelCode = this.$route.query.channelCode;
      // this.serviceId = this.$route.query.serviceId;
      window.openMiGuInit(this.channelCode,'window.initBackFun','paramdialog1','','','common2');
      // window.openMiGuInit(this.channelCode, "window.orderBackFun");
    },
    initBackFun(result) {
      console.log(JSON.stringify(result));
      if (result.resultCode !== "0000") {
        this.mToast("初始化错误" + JSON.stringify(result));
        return;
      }
    },
    orderBackFun(result) {
      // console.log(JSON.stringify(result));
      console.log(result.resCode);
      if ("" + result.resCode === "000000") {
        this.sendRightsSMS(this.mobile); // 发送权益短信
        // GdpTracker
        this.bussinessProcessingData.processType_var = "办理成功";
        window.gdp(
          "track",
          "professional_merchants_bussinessProcessing",
          this.bussinessProcessingData
        );

        localStorage.setItem("channelCode", this.channelCode);
        localStorage.setItem("token", this.token);
        this.$router.push({
          // 接口返回成功，跳转到 Success.vue
          path: "/success",
          query: { from: "mgMusicKMgd" },
        });
      }
      else {
        clearTimeout(this.timerVailCode);
        this.timeVailCode = 60;
        this.btnVailCode = false;
        this.showRes("订购失败", JSON.stringify(result.resMsg));
        // GdpTracker
        this.bussinessProcessingData.processType_var = "办理失败";
        this.bussinessProcessingData.errorMessage_var = result.resMsg;
        window.gdp(
          "track",
          "professional_merchants_bussinessProcessing",
          this.bussinessProcessingData
        );
      }

      this.resetpage();
    },
    cancelBackFun(result) {
      console.log(result.resCode);
      if ("" + result.resCode === "000000") {
        this.mToast("退订成功", true);
      } else {
        this.mToast("退订失败: " + JSON.stringify(result.resMsg));
      }
    },
    queryStrategyBackFun(result) {
      console.log(result.resCode);
      if ("" + result.resCode === "000000") {
        if (result.bizInfoMon) {
          this.bizInfoMon = result.bizInfoMon;
        }
      } else {
        console.log("包月包策略查询失败.");
      }
    },
    // GdpTracker Init
    async initGdp() {
      try {
        // 等待GDP组件就绪
        await window.gdp("init", "8d2279a5e2f18b7c", "9d59ac736f01c688", {
          host: "collect.gmcc.net", // 数据发送地址
          compress: true, // 开启数据压缩模式
          debug: true, // 开启测试模式，控制台可看到数据，生产环境请勿添加此参数。
          hashtag: true, //开启页面URL混淆采集
          scheme: "https", //http页面加此参数
        });
        // 全局变量采集
        await window.gdp("setGeneralProps", this.generalProps);
        // 页面访问码，页面访问发生时采集
        window.gdp("track", "professional_merchants_pageView", {
          pageName_var: "咪咕音乐视宣号标准版", // 页面访问时当前页面名称，传具体的页面名称
          merchantsId_var: "002129B", // 商品所属商户id
          merchants_var: "成都盛川科技有限责任公司", // 商品所属商户名称
          merchantsIdCity_var: "广州", //商户ID归属地市，枚举值：省统、广州、中山、云浮……
        });
        // 业务流程码 - 页面浏览
        this.bussinessProcessingData.processType_var = "页面浏览";
        window.gdp(
          "track",
          "professional_merchants_bussinessProcessing",
          this.bussinessProcessingData
        );
      } catch (error) {
        console.error("GdpTracker初始化失败:", error);
      }
    },
  },

  created() {
    this.agree = this.$store.getters.getAgree;
  },
  mounted() {
    this.fetchData();
    window.initBackFun = this.initBackFun;
    window.orderBackFun = this.orderBackFun;
    window.cancelBackFun = this.cancelBackFun;
    window.queryStrategyBackFun = this.queryStrategyBackFun;
    this.initGdp();
  },
};
</script>
<style scoped>
@import "./../assets/css/main.css";
</style>
