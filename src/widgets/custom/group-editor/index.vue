<template>
  <mars-dialog title="属性编辑" width="315" customClass="dialog-nopadding" top="60" bottom="40" left="10" :minWidth="200">
    <div class="top-handle-bar">
      <a-space>
        <mars-icon icon="send" width="20" @click="flyToGraphic" title="飞行定位"></mars-icon>
        <!-- <mars-icon icon="delete" width="20" @click="deleteEntity" title="删除"></mars-icon> -->
        <!-- <mars-icon icon="save" width="20" @click="getGeoJson" title="导出geojson"></mars-icon> -->
      </a-space>
    </div>
    <div class="attr-editor-main">
      <mars-styles
        :style="style"
        :layerName="layerName"
        :customType="customType"
        :graphicType="graphicType"
        @styleChange="styleChange"
      />
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw } from "vue"
import _ from "lodash-es"
import MarsStyles from "./mars-styles.vue"
import * as mapWork from "./map"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import { useWidget } from "@mars/common/store/widget"

const { currentWidget } = useWidget()



const layerName = ref("")
const customType = ref("")
const graphicType = ref("")
const style = ref(null)

let graphic
let graphicLayer

// 启用map.ts生命周期
useLifecycle(mapWork)

onMounted(() => {
  graphic = currentWidget.data.graphic
  graphicLayer = currentWidget.data.graphicLayer
  updataLayer()
})

if (currentWidget) {
  currentWidget.onUpdate((e) => {
    graphic = e.data.graphic
    graphicLayer = e.data.graphicLayer
    updataLayer()
  })
}

// 监听到矢量数据发生变化
function updataLayer() {
  if (!graphic || !graphic.isAdded) {
    return
  }
  layerName.value = graphic?._layer?.name || graphic.name || ""
  graphicType.value = graphic.type
  customType.value = currentWidget.data.styleType || graphic.options.type
  // 处理雷达转速
  if (graphic.options?.scanPlane?.step) {
    graphic.style.step = graphic.options.scanPlane.step
  }
  // console.log("开始编辑style样式", graphic.style)
  style.value = _.cloneDeep(graphic.style)
}

function styleChange(style: any) {
  style = toRaw(style)
  console.log("修改了style样式", style)
  // 处理雷达转速大小
  if (style?.step) {
    graphic.options.scanPlane.step = style.step
    graphic.setOptions(graphic.options)
  }
  // 处理雷达是否暂停
  if (JSON.stringify(style).includes("pause")) {
    if (style.pause) {
      graphic.options.scanPlane.min = 0
      graphic.options.scanPlane.max = 0
    } else {
      graphic.options.scanPlane.min = 0
      graphic.options.scanPlane.max = 360
    }
    graphic.options.scanPlane.style.opacity = 0.2
    graphic.setOptions(graphic.options)
  }
  if (layerName.value.includes("风力发电机")) {
    const { data } = graphicLayer.options
    data.forEach(d => {
      const g = graphicLayer.getGraphicById(d.id)
      g.setStyle(style)
    })
  } else {
    graphic.setStyle(style)
  }
}

// *********************  删除定位保存文件方法  ******************* //
function getGeoJson() {
  const geojson = graphic.toGeoJSON() // 文件处理
  geojson.properties._layer = graphic._layer.name

  mapWork.downloadFile("标绘item.json", JSON.stringify(geojson))
}

function flyToGraphic() {
  graphic.flyTo() // 事件处理
}

function deleteEntity() {
  graphic.remove() // 删除
}
</script>
<style lang="less" scoped>
.top-handle-bar {
  border-bottom: 1px solid #cde1de;
  padding: 10px 12px;

  :deep(.mars-icon) {
    cursor: pointer;
  }
}

.attr-editor-main {
  height: calc(100% - 75px);
  overflow-y: auto;

  :deep(*) {
    font-size: 12px;
  }
}

:deep(.ant-tabs-nav) {
  margin: 0;
}

:deep(.ant-select),
:deep(.ant-input-number) {
  width: 100%;
}
</style>
