import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let mapSplit

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 34.213866, lng: 108.956499, alt: 832, heading: 22, pitch: -35 }
  },
  control: {
    baseLayerPicker: false // 是否显示图层选择控件
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  createControl()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  destroyControl()
  map = null
}

export function createControl() {
  if (mapSplit) {
    return
  }
  map.basemap = null
  mapSplit = new mars3d.control.MapSplit({
    leftLayer: [
      { name: "微软影像", type: "bing", layer: "Aerial" }
    ],
    rightLayer: [
      { name: "天地图电子", type: "tdt", layer: "vec_d" },
      { name: "天地图注记", type: "tdt", layer: "vec_z" }
    ]
  })
  map.addControl(mapSplit)

  mapSplit.on(mars3d.EventType.mouseMove, function (event) {
    console.log("拖动了mapSplit控件", event)
  })
}

export function destroyControl() {
  if (mapSplit) {
    map.removeControl(mapSplit)
    mapSplit = null
    map.basemap = "微软影像"
  }
}
