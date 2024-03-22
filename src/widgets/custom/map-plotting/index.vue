<template>
  <mars-dialog title="空间分析" width="336" top="60">
    <div class="f-mb">
      <a-space>
        <mars-button class="btn" @click="markPoint">标记点</mars-button>
        <mars-button class="btn" @click="markPolyline">标记线</mars-button>
        <mars-button class="btn" @click="markPolygon">标记面</mars-button>
        <mars-button class="btn" @click="markCircle">标记圆</mars-button>
      </a-space>
    </div>
    <div class="f-mb">
      <a-space class="control">
        <mars-button class="control_btn" @click="clear">清除</mars-button>
      </a-space>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { nextTick, ref, reactive } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
// 启用map.ts生命周期
useLifecycle(mapWork)

// 可视域
const markPoint = () => {
  mapWork.markPoint()
}

// 方量分析
const markPolyline = () => {
  mapWork.markPolyline()
}

// 高度差
const markPolygon = () => {
  mapWork.markPolygon()
}

// 方位角
const markCircle = () => {
  mapWork.markCircle()
}

const clear = () => {
  mapWork.removeAll()
}
</script>
<style lang="less" scoped>
.mars-button {
  padding: 0px;
  line-height: 32px;
}
.f-mb {
  width: 304px;
  &:last-child {
    margin-bottom: 0;
  }
}
.btn,
.control_btn {
  width: 70px;
}
.control {
  display: flex;
  justify-content: flex-end;
  .control_btn {
    background-color: #ff7875 !important;
    margin-left: auto;
  }
}
</style>
