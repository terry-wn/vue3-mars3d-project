
import * as mars3d from "mars3d"

const Cesium = mars3d.Cesium
let map: mars3d.Map // 地图对象

// 初始化当前业务
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map
}

// 释放当前业务
export function onUnmounted(): void {
  map = null
}

export function changeBaseMaps(id: string) {
  map.basemap = id
}

export function changeTerrain(value: boolean) {
  map.hasTerrain = value
}

export function getLayers() {
  return {
    baseMaps: map.getBasemaps(true),
    hasTerrain: map.hasTerrain
  }
}