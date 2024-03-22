<template>
  <mars-dialog title="空间分析" width="336" top="60">
    <div class="f-mb">
      <a-space>
        <mars-button class="btn" @click="viewShedAnalysis">可视域</mars-button>
        <mars-button class="btn" @click="squareAnalysis">方量分析</mars-button>
        <mars-button class="btn" @click="terrainClipAnalysis">地形开挖</mars-button>
        <mars-button class="btn" @click="shortestPathAnalysis">最短路径</mars-button>
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

const dataSource = ref([])
const rowKeys = ref<string[]>([])
mapWork.eventTarget.on("tableObject", function (event: any) {
  dataSource.value = []
  nextTick(() => {
    dataSource.value = event.table
    rowKeys.value = event.table.map((item: any) => item.key)
  })
})

// 可视域
const viewShedAnalysis = () => {
  mapWork.viewShedAnalysis()
}

// 方量分析
const squareAnalysis = () => {
  mapWork.squareAnalysis()
}

// 高度差
const terrainClipAnalysis = () => {
  resetEnabled()
  mapWork.terrainClipAnalysis()
}

// 方位角
const shortestPathAnalysis = () => {
  mapWork.shortestPathAnalysis()
}

const clear = () => {
  mapWork.removeAll()
}

const resetEnabled = () => {
  // 是否挖地
  mapWork.chkClippingPlanes(true)

  // 是否外切割
  mapWork.chkUnionClippingRegions(false)
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
