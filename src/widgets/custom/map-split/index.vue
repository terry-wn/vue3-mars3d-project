<template>
  <mars-dialog :show="isShow" :draggable="false" top="60">
    <a-space>
      <mars-button @click="destroyMap">关闭卷帘</mars-button>
    </a-space>
    <div class="left-text">左侧：微软影像 </div>
    <div class="right-text">右侧：天地图电子 </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
// 启用map.ts生命周期
useLifecycle(mapWork)

const isShow = ref<boolean>(true)

// 销毁地图
const destroyMap = () => {
  isShow.value = false
  mapWork.destroyControl()
}
</script>
<style lang="less" scoped>
.left-text,
.right-text {
  position: absolute;
  right: 120px;
  top: 18px;
  width: 150px;
  height: 32px;
  line-height: 32px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, .3);
  font-size: 14px;
  color: #fff;
  text-align: center;
  pointer-events: none;
}
.left-text {
  right: 290px;
}
.right-text {
  width: 160px;
}
</style>
