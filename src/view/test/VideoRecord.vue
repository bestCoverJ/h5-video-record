<template>
  <div class="video-record">
    <div class="video-record-wrapper">
      <video
        v-show="!isRecordOver"
        ref="video"
        playsinline
        style="height: 100%; width: 100%"
        muted
        :style="{ borderColor: isRecord ? '#d81e06' : 'black' }"
      ></video>
      <video
        v-show="!isRecord && isRecordOver"
        ref="playVideo"
        style="height: 100%"
        autoplay
        playsinline
        controls
        :style="{ borderColor: '#CDD0D6' }"
      ></video>
    </div>
    <div class="record-bar">
      <div
        class="record-button record"
        @click="toRecord"
        :style="{
          backgroundColor: '#e6e8eb',
        }"
      >
        <img
          class="record-button-icon"
          :src="isRecord ? StopIcon : CameraIcon"
        />
      </div>
      <div
        v-show="!isRecord && isRecordOver"
        class="record-button right"
        @click="successRecord"
        :style="{
          backgroundColor: '#e6e8eb',
        }"
      >
        <img class="record-button-icon" :src="RightIcon" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CameraIcon from '@/assets/camera.png'
import StopIcon from '@/assets/stop.png'
import RightIcon from '@/assets/right.png'
const video = ref(null)
const localStream = ref(null)
const mediaRecorder = ref(null)
const playVideo = ref(null)
const isRecord = ref(false)
const recordBlob = ref(null)
const isRecordOver = ref(false)

onMounted(() => {
  handleRecord()
})
const handleRecord = () => {
  const mediaConstraints = {
    audio: true, // don't forget audio!
    video: {
      facingMode: {
        exact: 'environment',
      },
    }, // don't forget video!
  }
  if (navigator?.mediaDevices?.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(success)
      .catch(error)
  } else if (navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia(mediaConstraints).then(success).catch(error)
  } else if (navigator.mozGetUserMedia) {
    navigator.mozGetUserMedia(mediaConstraints).then(success).catch(error)
  } else if (navigator.getUserMedia) {
    navigator.getUserMedia(mediaConstraints).then(success).catch(error)
  }
}
const success = (stream) => {
  if ('srcObject' in video.value) {
    try {
      video.value.srcObject = stream
    } catch (err) {
      if (err.name != 'TypeError') {
        throw err
      }
      // Even if they do, they may only support MediaStream
      video.value.src = URL.createObjectURL(stream)
    }
  } else {
    const CompatibleURL = window.URL || window.webkitURL
    video.value.src = CompatibleURL.createObjectURL(stream)
  }

  //兼容webkit内核浏览器
  // var CompatibleURL = window.URL || window.webkitURL
  //将视频流设置为video元素的源

  // video.value.src = CompatibleURL.createObjectURL(stream) // 此处的代码将会报错  解决的办法是将video的srcObject属性指向stream即可

  //播放视频
  video.value.play()
  localStream.value = stream
  RecordInit()
}

const error = (e) => {
  console.error('media error', e.name, e.message)
  alert('你的浏览器不支持访问用户媒体设备')
}

const videoOption = {
  audioBitsPerSecond: 64000,
  videoBitsPerSecond: 2500000,
  mimeType: 'video/webm',
}
const RecordInit = () => {
  mediaRecorder.value = new MediaRecorder(localStream.value, videoOption)
  mediaRecorder.value.ondataavailable = (e) => {
    const blob = new Blob([e.data], { type: 'video/webm' })
    recordBlob.value = blob
  }
  mediaRecorder.value.onstop = () => {
    const CompatibleURL = window.URL || window.webkitURL
    playVideo.value.src = CompatibleURL.createObjectURL(recordBlob.value)
  }
}
const toRecord = () => {
  if (isRecord.value) {
    stopRecordVideo()
  } else {
    startRecordVideo()
  }
}
const startRecordVideo = () => {
  mediaRecorder.value.start()
  isRecord.value = true
  isRecordOver.value = false
}
const stopRecordVideo = () => {
  mediaRecorder.value.stop()
  isRecord.value = false
  isRecordOver.value = true
}
const successRecord = () => {
  const downloadLink = document.createElement('a')
  downloadLink.href = playVideo.value.src
  downloadLink.download = `${new Date().getTime()}.webm`
  downloadLink.click()
}
</script>

<style lang="scss">
.video-record {
  height: 100vh;
  background-color: black;
  padding: 5vh 1vw;
  .video-record-wrapper {
    height: 70vh;
    width: calc(100vw - 2vw);
    video {
      border: 1px solid;
    }
  }
  .record-bar {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    // width: 100%;
    .record-button {
      &.record {
        padding: 1rem;
        height: 4rem;
        width: 4rem;
      }
      &.right {
        padding: 8px;
        height: 3rem;
        width: 3rem;
        position: absolute;
        right: 2rem;
      }

      border-radius: 999px;

      display: flex;
      align-items: center;
      justify-content: center;
      .record-button-icon {
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>
