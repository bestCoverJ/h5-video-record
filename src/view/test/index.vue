<template>
  <div class="text-index-page">
    <h1>录制预览</h1>
    当前状态：<span :style="{ color: isRecord ? 'red' : '#ccc' }">{{
      isRecord ? '正在拍摄' : '尚未开始拍摄'
    }}</span>
    <video
      ref="video"
      autoplay
      style="width: 480px; height: 320px"
      playsinline
      muted
    ></video>
    <!-- <a href="https://www.webrtc-experiment.com/msr/video-recorder.html"
      >to demo page</a
    > -->
    <el-button @click="toRecord">录制</el-button>
    <el-divider />
    <h1>录制视频</h1>
    <video ref="playVideo" style="width: 480px; height: 320px" controls></video>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const video = ref(null)
const localStream = ref(null)
const mediaRecorder = ref(null)
const playVideo = ref(null)
const isRecord = ref(false)
const isRecordOver = ref(false)
const recordBlob = ref(null)

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
const videoOption = {
  audioBitsPerSecond: 64000,
  videoBitsPerSecond: 1000000,
  mimeType: 'video/mp4',
}
const RecordInit = () => {
  mediaRecorder.value = new MediaRecorder(localStream.value, videoOption)
  mediaRecorder.value.ondataavailable = (e) => {
    const blob = new Blob([e.data], { type: 'video/mp4' })
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
const error = (e) => {
  console.error('media error', e.name, e.message)
  alert('你的浏览器不支持访问用户媒体设备')
}
</script>
<style scoped lang="scss"></style>
