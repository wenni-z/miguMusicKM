<template>
  <div class="video-player" @click="handleClick">
    <video
      ref="video"
      :src="videoSrc" 
      :poster="thumbnail"
      @loadeddata="handleLoaded"
      @error="handleError"
      class="video"
    ></video>
    <div v-if="isLoading" class="loading-indicator">
      <img src="@/assets/images/wait.gif" alt="">
    </div>
    <div v-if="showPlayButton" class="play-button" @click.stop="handlePlay">
    <!-- <div v-if="showPlayButton" class="play-button"> -->
      <img src="@/assets/images/play-btn.png" alt="">
    </div>
    <img v-if="showSettingsButton" class="set-btn" src="@/assets/images/set-btn.png" alt="" @click="handleSetClick">
  </div>
</template>
  
<script>
  export default {
    props: {
      videoSrc: {
        type: String,
        required: false,
      },
      thumbnail: {
        type: String,
        required: false,
      },
      showSettingsButton: {
        type: Boolean,
        default: true, // 默认显示设置按钮
      },
    },   
    data() {
      return {
        showPlayButton: true, // 控制播放按钮的显示
        isLoading: false,
      };
    },
    methods: {
      // playVideo() {
      //   const video = this.$refs.video;
      //   video.play(); // 播放视频
      //   this.showPlayButton = false; // 隐藏播放按钮
      // },
      handleClick() {
        if (this.isLoading) return;
        if (!this.videoSrc) return;
        this.togglePlay();
      },
      handlePlay() {
        if (this.isLoading) return;
        // console.log('this.videoSrc: ' + this.videoSrc)
        if (!this.videoSrc) {
          this.showPlayButton = false;
          this.isLoading = true;
          this.$emit('play-requested');
          return;
        }
        this.togglePlay();
      },
      togglePlay() {
        // console.log('isLoading: ' + this.isLoading)
        const video = this.$refs.video;
        if (video.paused) {
          this.isLoading = true;
          this.showPlayButton = false;
          video.play()
            .then(() => {
              this.isLoading = false;
            })
            .catch(e => {
              console.error('播放失败:', e);
              this.isLoading = false;
            });
        } else {
          video.pause(); // 暂停视频
          this.showPlayButton = true; // 显示播放按钮
        }
      },
      handleLoaded() {
        console.log('视频资源已加载');
      },
      handleError(e) {
        // 忽略空源的错误
        if (!this.videoSrc || this.videoSrc.trim() === '') return;
        
        console.error('视频加载错误:', {
          src: this.videoSrc,
          error: e.target.error
        });
        this.isLoading = false;
        this.showPlayButton = true;
        this.$emit('error', e);
      },
      handleSetClick(event) {
        event.stopPropagation(); // 阻止事件冒泡
        this.$emit('set-click'); // 触发设置按钮点击事件
      },
    },
    watch: {
      videoSrc(newVal) {
        if (newVal) {
          this.showPlayButton = true;
        }
      }
    },
  };
</script>

<style scoped>
.video-player {
  width: 100%;
  height: inherit;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video {
  width: 100%;
  height: inherit;
  object-fit: cover;
  border-radius: 3vw;
}

.video-player .loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 21.33vw;
  height: 21.33vw;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12.8vw;
  color: white;
  /* background-color: rgba(0, 0, 0, 0.5); */
  border-radius: 50%;
  width: 21.33vw;
  height: 21.33vw;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.play-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.set-btn {
  width: 80%;
  margin-top: 2vw;
}
</style>
