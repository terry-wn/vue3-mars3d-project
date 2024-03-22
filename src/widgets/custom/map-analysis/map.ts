import * as mars3d from "mars3d"
import * as turf from "@turf/turf"
import { $hideLoading, $showLoading } from "@mars/components/mars-ui/mars-loading"

export let map // mars3d.Map三维地图对象
let graphicLayer
let shortestPathLayer

let polygonZAM
let pointQD
let pointZD

let measure
let measureVolume

let terrainClip

export const eventTarget = new mars3d.BaseClass()
/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  shortestPathLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(shortestPathLayer)

  if (!measure) {
    addMeasure()
  }

  if (!terrainClip) {
    addTerrainClip()
  }
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function removeAll() {
  measureVolume = null
  measure.clear()
  clearInterResult()

  table = []
  terrainClip.clear()

  polygonZAM = null
  pointQD = null
  pointZD = null
  graphicLayer.clear()
  shortestPathLayer.clear()
}

function addMeasure() {
  measure = new mars3d.thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20
    }
  })
  map.addThing(measure)

  measure.on(mars3d.EventType.start, function (event) {
    console.log("开始分析", event)
    clearInterResult()
    $showLoading()
    // console.log("坐标为", JSON.stringify(mars3d.LngLatArray.toArray(event.positions)))
  })

  measure.on(mars3d.EventType.end, function (event) {
    console.log("分析完成", event)
    $hideLoading()
  })
}

function addTerrainClip() {
  terrainClip = new mars3d.thing.TerrainClip({
    diffHeight: 100, // 井的深度
    image: "img/textures/poly-stone.jpg",
    imageBottom: "img/textures/poly-soil.jpg",
    splitNum: 80 // 井边界插值数
  })
  map.addThing(terrainClip)
}

// 显示面的插值计算结果，方便比较分析
let interGraphicLayer
function clearInterResult() {
  if (!interGraphicLayer) {
    interGraphicLayer = new mars3d.layer.GraphicLayer()
    map.addLayer(interGraphicLayer)
  }
  interGraphicLayer.clear()
}

// 点选高度
function showHeightVal() {
  const baseHeight = measureVolume.height.toFixed(1)
  const minHeight = measureVolume.minHeight.toFixed(1)
  const maxHeight = getFixedNum(measureVolume.maxHeight)

  // 触发自定义事件 heightVal ，改变组件面板中的值
  eventTarget.fire("heightVal", { baseHeight, minHeight, maxHeight })
}

function getFixedNum(val) {
  return Math.ceil(val * 10) / 10
}

// 绘制起点
function startPoint() {
  if (pointQD) {
    pointQD.remove()
    pointQD = null
  }
  graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 10,
      color: "red",
      label: {
        text: "起点",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    },
    success: (graphic) => {
      pointQD = graphic
      endPoint()
    }
  })
}

// 绘制终点
function endPoint() {
  if (pointZD) {
    pointZD.remove()
    pointZD = null
  }
  graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 10,
      color: "red",
      label: {
        text: "终点",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    },
    success: (graphic) => {
      pointZD = graphic
      drawPolygon()
    }
  })
}

// 绘制障碍面
function drawPolygon() {
  if (polygonZAM) {
    polygonZAM.remove()
    polygonZAM = null
  }
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00ffff",
      opacity: 0.4,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff"
    },
    success: (graphic) => {
      polygonZAM = graphic
      shortestPath()
    }
  })
}

// 计算最短路径
function shortestPath() {
  if (!polygonZAM) {
    console.log("请绘制障碍面")
    return
  }
  if (!pointQD) {
    console.log("请绘制起点")
    return
  }
  if (!pointZD) {
    console.log("请绘制终点")
    return
  }

  shortestPathLayer.clear()

  const polygon = polygonZAM.toGeoJSON() // 障碍面
  const startPoint = pointQD.toGeoJSON() // 起点
  const endPoint = pointZD.toGeoJSON() // 终点

  const options = {
    obstacles: polygon
  }
  const path = turf.shortestPath(startPoint, endPoint, options)

  const positions = path.geometry.coordinates
  const polyonLine = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      color: " #55ff33"
    }
  })
  shortestPathLayer.addGraphic(polyonLine)
}

let table = []
// 区域表格添加一行记录
function addTableItem(item) {
  table.push({ key: item.id, name: "开挖区域" + item.id })
  eventTarget.fire("tableObject", { table })
}

// 是否挖地
export function chkClippingPlanes(val) {
  terrainClip.enabled = val
}

// 是否外切割
export function chkUnionClippingRegions(val) {
  terrainClip.clipOutSide = val
}

// 添加可视域
export function viewShedAnalysis() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "viewShed",
    style: {
      angle: 60,
      angle2: 45,
      distance: 80,
      heading: 44,
      pitch: -12,
      addHeight: 0.5 // 在坐标点增加的高度值，规避遮挡，效果更友好
    }
  })
}

// 方量分析
export function squareAnalysis() {
  // 手动绘制的方式分析
  measure
    .volume({
      splitNum: 6, // 面内插值次数，控制精度[注意精度越大，分析时间越长]
      // minHeight: 50 , //可以设置一个固定的最低高度
      exact: false // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    })
    .then((e) => {
      measureVolume = e
      showHeightVal()
    })
}

// 地形开挖
export function terrainClipAnalysis() {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log(JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 打印下边界

      const areaItem = terrainClip.addArea(positions)
      addTableItem(areaItem)
    }
  })
}

// 最短路径分析
export function shortestPathAnalysis() {
  startPoint()
}
