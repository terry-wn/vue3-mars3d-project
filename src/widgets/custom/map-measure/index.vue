<template>
  <mars-dialog title="图上量算" width="336" top="60">
    <div class="f-mb">
      <a-space>
        <mars-button class="btn" @click="measureLength">空间距离</mars-button>
        <mars-button class="btn" @click="measureArea">水平面积</mars-button>
        <mars-button class="btn" @click="measureAngle">方位角</mars-button>
        <mars-button class="btn" @click="measureHeight">高度差</mars-button>
      </a-space>
    </div>
    <div class="f-mb">
      <a-space>
        <mars-button class="btn" @click="measureSurfaceLength">贴地距离</mars-button>
        <mars-button class="btn" @click="measureSurfaceeArea">贴地面积</mars-button>
        <mars-button class="btn" @click="measureSection">剖面分析</mars-button>
        <mars-button class="btn" @click="measureTriangleHeight">三角测量</mars-button>
      </a-space>
    </div>
    <div class="f-mb">
      <a-space class="control">
        <mars-button class="control_btn" @click="clear">清除</mars-button>
      </a-space>
    </div>
    <!-- ecahrt图表 -->
    <mars-dialog title="剖面分析" v-model:visible="isShow" :closeButton="false" left="70" right="240" bottom="40">
      <div class="echatsView">
        <div id="echartsView1" style="width: 100%; height: 100%"></div>
      </div>
    </mars-dialog>
  </mars-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as echarts from "echarts"
import * as mapWork from "./map"

// 启用map.ts生命周期
useLifecycle(mapWork)

const isShow = ref<boolean>(false)

let myChart1: echarts.ECharts

onMounted(() => {
  nextTick(() => {
    myChart1 = echarts.init(document.getElementById("echartsView1")!)
    // 图表自适应
    window.onresize = function () {
      myChart1.resize()
    }
  })
})

mapWork.eventTarget.on("measureEnd", function (event: any) {
  isShow.value = true
  nextTick(() => {
    setEchartsData(event)
  })
})

mapWork.eventTarget.on("measureClick", function (event: any) {
  if (event.value) {
    nextTick(() => {
      setEchartsData(event.value)
    })
  }
})

function setEchartsData(data: any) {
  if (data == null || data.arrPoint == null) {
    return
  }
  const arrPoint = data.arrPoint
  let inhtml = ""

  const option = {
    grid: {
      left: 10,
      right: 40,
      bottom: 10,
      top: 40,
      containLabel: true
    },
    dataZoom: [
      {
        type: "inside",
        throttle: 50
      }
    ],
    tooltip: {
      trigger: "axis",
      // position: function (point, params, dom, rect, size) {
      //    return [10, 20];
      // },
      formatter: (params: any) => {
        if (params.length === 0) {
          mapWork.hideTipMarker()
          return inhtml
        }

        const hbgd = params[0].value // 海拔高度
        const point = arrPoint[params[0].dataIndex] // 所在经纬度
        const result = mapWork.calculation(params[0])

        inhtml = `当前位置<br />
                      距起点：${result.len}<br />
                      海拔：<span style='color:${params[0].color};'>${result.hbgdStr}</span><br />
                      经度：${point.lng}<br />
                      纬度：${point.lat}`

        mapWork.showTipMarker(point, hbgd, inhtml)

        return inhtml
      }
    },
    xAxis: [
      {
        name: "行程",
        type: "category",
        nameTextStyle: { color: "rgb(255, 70, 131)" },
        boundaryGap: false,
        axisLine: {
          show: true
        },
        axisLabel: {
          show: true,
          formatter: "{value} 米",
          color: "#fff"
        },
        data: data.arrLen
      }
    ],
    yAxis: [
      {
        name: "高程",
        nameTextStyle: { color: "rgb(255, 70, 131)" },
        type: "value",
        min: getMinZ(arrPoint),
        axisLabel: {
          formatter: "{value} 米",
          color: "#fff"
        }
      }
    ],
    series: [
      {
        name: "高程值",
        type: "line",
        smooth: true,
        symbol: "none",
        sampling: "average",
        itemStyle: {
          color: "rgb(255, 70, 131)"
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(255, 158, 68)"
            },
            {
              offset: 1,
              color: "rgb(255, 70, 131)"
            }
          ])
        },
        data: data.arrHB
      }
    ]
  }

  myChart1.setOption(option)
  myChart1.resize()
}

function getMinZ(arr: any) {
  let minz = "dataMin"
  if (arr == null || arr.length === 0) {
    return minz
  }

  minz = arr[0].alt
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].alt < minz) {
      minz = arr[i].alt
    }
  }
  return minz
}

// 空间距离
const measureLength = () => {
  mapWork.measureLength()
}
// 水平面积
const measureArea = () => {
  mapWork.measureArea()
}

// 高度差
const measureHeight = () => {
  mapWork.measureHeight()
}

// 坐标测量
const measurePoint = () => {
  mapWork.measurePoint()
}

// 贴地距离
const measureSurfaceLength = () => {
  mapWork.measureSurfaceLength()
}

// 贴地面积
const measureSurfaceeArea = () => {
  mapWork.measureSurfaceeArea()
}

// 三角测量
const measureTriangleHeight = () => {
  mapWork.measureTriangleHeight()
}
// 方位角
const measureAngle = () => {
  mapWork.measureAngle()
}

// 剖面分析
const measureSection = () => {
  mapWork.measureSection()
}

const clear = () => {
  isShow.value = false
  mapWork.removeAll()
  myChart1.clear()
}
</script>
<style lang="less" scoped>
.echatsView {
  width: 100%;
  height: 240px;
}
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
