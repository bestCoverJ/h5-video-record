<template>
  <div class="text-index-page">
    <h1>录制预览</h1>
    <video ref="video" autoplay style="width: 480px; height: 320px" playsinline defaultMuted></video>
    <a href="https://www.webrtc-experiment.com/msr/video-recorder.html"
      >to demo page</a
    >
    <el-button @click="toRecord">录制</el-button>
    <el-divider />
    <h1>录制视频</h1>
    <video></video>
  </div>
</template>

<script setup>
import MediaStreamRecorder from 'msr'
import { onMounted, ref } from 'vue'

const video = ref(null)
const blobUrl = ref(null)
const isRecord = ref(false)

onMounted(() => {
  handleRecord()
})

const toRecord = () => {
  isRecord.value = true
  handleRecord()
}

const handleRecord = () => {
  const mediaConstraints = {
    audio: true, // don't forget audio!
    video: {
      facingMode: {
        exact: 'environment',
      },
    }, // don't forget video!
  }
  console.log(navigator)
  if (navigator?.mediaDevices?.getUserMedia) {
    console.log(1)
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(success1)
      .catch(error)
  } else if (navigator.webkitGetUserMedia) {
    console.log(2)
    navigator.webkitGetUserMedia(mediaConstraints).then(success1).catch(error)
  } else if (navigator.mozGetUserMedia) {
    console.log(3)
    navigator.mozGetUserMedia(mediaConstraints).then(success1).catch(error)
  } else if (navigator.getUserMedia) {
    console.log(4)
    navigator.getUserMedia(mediaConstraints).then(success1).catch(error)
  }
}

const success = (stream) => {
  var mediaRecorder = new MediaStreamRecorder(stream)
  mediaRecorder.mimeType = 'video/webm'
  mediaRecorder.ondataavailable = function (blob) {
    // POST/PUT "Blob" using FormData/XHR2
    var blobURL = URL.createObjectURL(blob)
    blobUrl.value = blobURL
    // document.write('<a href="' + blobURL + '">' + blobURL + '</a>')
    video.value.srcObject = stream
    // video.value.src = blobURL
    video.value.play()
  }
  mediaRecorder.start(3000)
  // var CompatibleURL = window.URL || window.webkitURL;
  // video.value.srcObject = stream
  // video.value.src = CompatibleURL.createObjectURL(stream);
  // video.value.play();
}
const success1 = (stream) => {
  if ('srcObject' in video.value) {
    console.log(1);
    try {
      video.value.srcObject = stream
      console.log(1.1);
    } catch (err) {
      if (err.name != 'TypeError') {
        throw err
      }
      // Even if they do, they may only support MediaStream
      video.value.src = URL.createObjectURL(stream)
      console.log(1.2);
    }
  } else {
    console.log(2);
    video.value.src = URL.createObjectURL(stream)
  }

  //兼容webkit内核浏览器
  // var CompatibleURL = window.URL || window.webkitURL
  //将视频流设置为video元素的源

  // video.value.src = CompatibleURL.createObjectURL(stream) // 此处的代码将会报错  解决的办法是将video的srcObject属性指向stream即可

  //播放视频
  video.value.play()
  if (isRecord.value) {
    handleRecordVideo(stream)
  }
}

const handleRecordVideo = (stream) => {
  const videoOption = {
    audioBitsPerSecond : 64000,
    videoBitsPerSecond : 1000000,
    mimeType : 'video/mp4'
  }
  const mediaRecorder = new MediaRecorder(stream, videoOption)
}
const error = (e) => {
  console.error('media error', e.name, e.message)
  alert('你的浏览器不支持访问用户媒体设备')
}
</script>
<style scoped lang="scss"></style>
