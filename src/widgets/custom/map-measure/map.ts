import * as mars3d from "mars3d"
import { $hideLoading, $showLoading } from "@mars/components/mars-ui/mars-loading"

export let map // mars3d.Map三维地图对象
let measure
const Cesium = mars3d.Cesium

export const eventTarget = new mars3d.BaseClass()
/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 修改编辑点样式，比如大小
  mars3d.DrawUtil.setAllEditPointStyle({ pixelSize: 14 })

  measure = new mars3d.thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20,
      background: false
    }
  })
  map.addThing(measure)

  measure.on(mars3d.EventType.start, function (e) {
    console.log("开始异步分析", e)
    $showLoading()
  })
  measure.on(mars3d.EventType.end, function (e) {
    console.log("完成异步分析", e)
    $hideLoading()
    if (e.graphic instanceof mars3d.graphic.SectionMeasure) {
      eventTarget.fire("measureEnd", e)
    }
  })
  measure.on(mars3d.EventType.click, function (e) {
    // console.log("单击了对象", e)
    hideTipMarker()
    if (e.graphic instanceof mars3d.graphic.SectionMeasure) {
      eventTarget.fire("measureClick", { value: e.graphic?.measured })
    }
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function onlyVertexPosition(val) {
  map.onlyVertexPosition = val
}

export function removeAll() {
  measure.clear()
  hideTipMarker()
}

// 空间距离
export function measureLength() {
  measure.distance({
    showAddText: true,
    label: {
      // 自定义显示label的graphic类型
      type: "div",
      updateText: function (text, graphic) {
        // updateText是必须，用于动态更新 text
        graphic.html = `<div class="marsGreenGradientPnl" >${text}</div>`
      },
      // 下面是graphic对应类型本身的参数
      html: `<div class="marsGreenGradientPnl" ></div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      // pointerEvents: false
    }
    // style: {
    //   color: "#ffff00",
    //   width: 3,
    //   clampToGround: false // 是否贴地
    // }
  })
}
// 贴地距离
export function measureSurfaceLength() {
  measure.distanceSurface({
    showAddText: true,
    exact: false // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    // unit: 'm', //支持传入指定计量单位
    // style: {
    //   color: '#ffff00',
    //   width: 3,
    //   clampToGround: true //是否贴地
    // }
  })
}
// 水平面积
export function measureArea() {
  measure.area({
      // style: {
      //   color: '#00fff2',
      //   opacity: 0.4,
      //   outline: true,
      //   outlineColor: '#fafa5a',
      //   outlineWidth: 1,
      //   clampToGround: false //贴地
      // }
    })
    .then(async (graphic) => {
      const oldPositions = graphic.positionsShow
      const rang = await mars3d.PolyUtil.getHeightRangeByDepth(oldPositions, map.scene)
      graphic.positions = mars3d.PointUtil.setPositionsHeight(oldPositions, rang.maxHeight)
    })
}
// 贴地面积
export function measureSurfaceeArea() {
  measure.areaSurface({
    style: {
      color: "#ffff00"
    },
    splitNum: 10, // step插值分割的个数
    exact: false // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
  })
}
// 高度差
export function measureHeight() {
  measure.height()
}
// 三角测量
export function measureTriangleHeight() {
  measure.heightTriangle()
}
// 方位角
export function measureAngle() {
  measure.angle()
}
// 坐标测量
export function measurePoint() {
  measure.point({
    // popup: function (point, graphic) {
    //   return `<div class="mars3d-template-title">位置信息</div>
    //   <div class="mars3d-template-content">
    //       <div><label>经度</label>${point.lng}</div>
    //       <div><label>纬度</label>${point.lat}</div>
    //       <div><label>海拔</label>${point.alt}米</div>
    //   </div>`
    // }
  })
}
// 剖面分析
export function measureSection() {
  measure.section({
    // maxPointNum:2,
    splitNum: 300, // 插值次数
    exact: false // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
  })
}

export function calculation(params) {
  const len = mars3d.MeasureUtil.formatDistance(Number(params.axisValue))
  const hbgdStr = mars3d.MeasureUtil.formatDistance(Number(params.value))

  return { len, hbgdStr }
}

let tipGraphic
/**
 *  echart图表中的图标
 *
 * @export
 * @param {Array} point 坐标点
 * @param {number} z 海拔高度
 * @param {html} inthtml html
 * @returns {void}
 */
export function showTipMarker(point, z, inthtml) {
  const _position_draw = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, z)

  if (!tipGraphic) {
    tipGraphic = new mars3d.graphic.BillboardEntity({
      name: "当前点",
      position: _position_draw,
      style: {
        image: "img/marker/mark-blue.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.2)
      }
    }).addTo(map.graphicLayer)
    tipGraphic._setPositionsToCallback()
  }
  tipGraphic._position_draw = _position_draw
  tipGraphic.bindPopup(inthtml).openPopup()
}

export function hideTipMarker() {
  if (!tipGraphic) {
    return
  }
  tipGraphic.remove(true)
  tipGraphic = null
}
