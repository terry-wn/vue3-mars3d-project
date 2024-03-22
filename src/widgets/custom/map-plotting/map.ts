import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer

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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function removeAll() {
  graphicLayer.clear()
}

// 标记点
export function markPoint() {
  map.graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 12,
      color: "#3388ff"
    },
    success: function (graphic) {
      // console.log(JSON.stringify(graphic.coordinates))
    }
  })
}

// 标记线
export function markPolyline() {
  map.graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3
    },
    success: function (graphic) {
      // console.log(JSON.stringify(graphic.coordinates))
    }
  })
}

// 标记面
export function markPolygon() {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#29cf34",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2.0
    },
    success: function (graphic) {
      // console.log(JSON.stringify(graphic.coordinates))
    }
  })
}

// 标记圆
export function markCircle() {
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.6
    },
    success: function (graphic) {
      // console.log(JSON.stringify(graphic.coordinates))
    }
  })
}
