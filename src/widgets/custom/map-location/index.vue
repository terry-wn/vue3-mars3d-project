<template>
  <mars-dialog title="坐标拾取" width="336" top="60">
    <template #icon>
      <mars-icon icon="local" width="18" />
    </template>
    <div class="position-container">
      <a-form>
        <mars-gui ref="marsGuiRef" :options="options" :labelCol=5></mars-gui>
      </a-form>
      <div class="f-pt f-tac">
        <a-space>
          <mars-button @click="bindMourseClick">图上拾取</mars-button>
          <mars-button @click="submitCenter">坐标定位</mars-button>
        </a-space>
      </div>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map"
import type { GuiItem } from "@mars/components/mars-ui/mars-gui"

// 启用map.ts生命周期
useLifecycle(mapWork)

const marsGuiRef = ref()

onMounted(() => {
  const defaultPoitn = mapWork.defultPoint()
  marsUpdataPosition(defaultPoitn)
  marsPointTrans(defaultPoitn)
})
const options: GuiItem[] = [
  {
    type: "radio",
    field: "type",
    label: "类型",
    value: "1",
    data: [
      {
        label: "经纬度",
        value: "1"
      },
      {
        label: "度分秒",
        value: "2"
      }
    ]
  },
  {
    type: "input",
    field: "lng",
    label: "经度",
    value: "",
    show(data) {
      return data.type === "1"
    },
    change(value, data) {
      changeDmsGk(data)
    }
  },
  {
    type: "input",
    field: "lat",
    label: "纬度",
    value: "",
    show(data) {
      return data.type === "1"
    },
    change(value, data) {
      changeDmsGk(data)
    }
  },
  {
    type: "input",
    field: "alt",
    label: "高程",
    value: "",
    show(data) {
      return data.type === "1"
    },
    change(value, data) {
      changeDmsGk(data)
    }
  },
  {
    type: "inputGroup",
    field: "lngDMS",
    label: "经度",
    value: [0, 0, 0],
    units: ["度", "分", "秒"],
    show(data) {
      return data.type === "2"
    },
    change(value, data) {
      changeGk(data)
    }
  },
  {
    type: "inputGroup",
    field: "latDMS",
    label: "纬度",
    value: [0, 0, 0],
    units: ["度", "分", "秒"],
    show(data) {
      return data.type === "2"
    },
    change(value, data) {
      changeGk(data)
    }
  },
  {
    type: "input",
    field: "altDMS",
    label: "高程",
    value: "",
    show(data) {
      return data.type === "2"
    },
    change(value, data) {
      changeGk(data)
    }
  }
]

// 经纬度
const changeDmsGk = (data) => {
  marsPointTrans(data)
}

// 度分秒
const changeGk = (data) => {
  marsGuiRef.value.updateField(
    "lng",
    mapWork.marsDms2degree(
      mapWork.marsUtilFormtNum(data.lngDMS[0], 6),
      mapWork.marsUtilFormtNum(data.lngDMS[1], 6),
      mapWork.marsUtilFormtNum(data.lngDMS[2], 6)
    )
  )
  marsGuiRef.value.updateField(
    "lat",
    mapWork.marsDms2degree(
      mapWork.marsUtilFormtNum(data.latDMS[0], 6),
      mapWork.marsUtilFormtNum(data.latDMS[1], 6),
      mapWork.marsUtilFormtNum(data.latDMS[2], 6)
    )
  )
  marsGuiRef.value.updateField("alt", data.altDMS)
}

const bindMourseClick = () => {
  mapWork.bindMourseClick()
}

// 图上拾取的坐标
mapWork.eventTarget.on("clickMap", (event: any) => {
  const data = reactive({
    lng: event.point.lng,
    lat: event.point.lat,
    alt: event.point.alt
  })
  marsUpdataPosition(data)
  marsPointTrans(data)
  // 更新面板
  mapWork.updateMarker(false, data.lng, data.lat, data.alt)
})

// 度分秒转经纬度并更新
const marsUpdataPosition = (data) => {
  marsGuiRef.value.updateField("lng", mapWork.marsUtilFormtNum(data.lng, 6))
  marsGuiRef.value.updateField("lat", mapWork.marsUtilFormtNum(data.lat, 6))
  marsGuiRef.value.updateField("alt", mapWork.marsUtilFormtNum(data.alt, 6))
}

// 经纬度转度分秒并更新
const marsPointTrans = (data) => {
  const lngDMS = [mapWork.marsPointTrans(data.lng).degree, mapWork.marsPointTrans(data.lng).minute, mapWork.marsPointTrans(data.lng).second]
  const latDMS = [mapWork.marsPointTrans(data.lat).degree, mapWork.marsPointTrans(data.lat).minute, mapWork.marsPointTrans(data.lat).second]
  marsGuiRef.value.updateField("lngDMS", lngDMS)
  marsGuiRef.value.updateField("latDMS", latDMS)
  marsGuiRef.value.updateField("altDMS", mapWork.marsUtilFormtNum(data.alt, 6))
}

// 坐标定位
const submitCenter = () => {
  const data = marsGuiRef.value.getValues()
  mapWork.updateMarker(true, data.lng, data.lat, data.alt)
}
</script>
<style lang="less" scoped>
.position-container {
  padding-top: 10px;
  margin-right: 5px;
}
:deep(.mars-input) {
  max-width: 192px;
}
</style>
