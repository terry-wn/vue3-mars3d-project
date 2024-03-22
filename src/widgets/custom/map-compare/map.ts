import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let mapSplit

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

function getMapOptions() {
  const mapOptions = map.getOptions()
  mapOptions.control.baseLayerPicker = true // basemaps底图切换按钮
  mapOptions.control.sceneModePicker = false
  return mapOptions
}

export function createControl() {
  if (mapSplit) {
    destroyControl()
    map = null
    return
  }

  // 修改已有地图为50%
  const mapOld = document.getElementById("centerDiv")
  mapOld.style.width = "50%"

  // 获取原来地图的参数
  const mapOptions = getMapOptions()

  // 用于双屏同图层，不同配置展示
  for (let i = 0, len = mapOptions.layers.length; i < len; i++) {
    const item = mapOptions.layers[i]
    if (item.compare) {
      for (const key in item.compare) {
        item[key] = item.compare[key] // 存在compare属性时
      }
    }
  }
  // console.log("分屏地图配置", mars3d.Util.clone(mapOptions))
  mapSplit = new mars3d.control.MapCompare({
    ...mapOptions,
    parentContainer: document.body
  })
  map.addControl(mapSplit)

  // 修改对比地图
  mapSplit.mapEx.basemap = "天地图电子"
}

export function destroyControl() {
  if (mapSplit) {
    map.removeControl(mapSplit)
    mapSplit = null
    const mapOld = document.getElementById("centerDiv")
    mapOld.style.width = "100%"
  }
}
