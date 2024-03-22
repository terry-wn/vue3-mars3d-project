import * as mars3d from "mars3d"
import { $alert as globalAlert } from "@mars/components/mars-ui/index"
import {
  Home,
  Local,
  PreviewOpen,
  AppSwitch,
  Forbid,
  Cube,
  MultiTriangular,
  Shovel,
  Close,
  MapDistance,
  Ruler,
  Texture,
  AutoHeightOne,
  Compass,
  DeleteKey,
  Mark,
  Label,
  Change,
  BringToFrontOne,
  Asterisk,
  Rectangle,
  Editor,
  Export,
  ClearFormat,
  Effects,
  LightRain,
  Snow,
  Fog,
  Halo,
  Brightness,
  DarkMode,
  Blackboard,
  HighLight,
  Config,
  LandSurveying,
  TwoTriangles,
  Sun,
  FlightAirflow,
  AddPicture,
  SwitchThemes,
  Agreement,
  TakeOff,
  KeyboardOne,
  RecentViewsSort,
  MoveInOne,
  ExclusiveGateway,
  CloseOne,
  LockOne,
  Box,
  MonitorOff,
  MapTwo,
  International,
  DatabaseForbid
} from "@icon-park/svg"

const Cesium = mars3d.Cesium

// 获取平台内置的右键菜单
export function getDefaultContextMenu(map) {
  const that = map.contextmenu
  return [
    {
      text: () => { return map.getLangText("_查看此处坐标") },
      icon: Local({ theme: "outline", fill: "#fff", size: "18" }),
      show: function (e) {
        return Cesium.defined(e.cartesian)
      },
      callback: function (e) {
        // 经纬度
        const mpt = mars3d.LngLatPoint.fromCartesian(e.cartesian)
        const inhtml = `经度:${mpt.lng}, 纬度:${mpt.lat}, 海拔:${mpt.alt}米`
        // const inhtml = `${mpt.lng}, ${mpt.lat}`
        globalAlert(inhtml, "位置信息")
      }
    },
    {
      text: () => {
        return map.getLangText("_查看当前视角")
      },
      icon: PreviewOpen({ theme: "outline", fill: "#fff", size: "18" }),
      callback: function (e) {
        const mpt = JSON.stringify(map.getCameraView())
        globalAlert(mpt, map.getLangText("_当前视角信息"))
      }
    },
    {
      text: () => {
        return map.getLangText("_图上量算")
      },
      icon: Ruler({ theme: "outline", fill: "#fff", size: "18" }),
      children: [
        {
          text: () => { return map.getLangText("_距离") },
          icon: MapDistance({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.distance()
          }
        },
        {
          text: () => { return map.getLangText("_面积") },
          icon: Texture({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.area()
          }
        },
        {
          text: () => { return map.getLangText("_角度") },
          icon: Compass({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.angle()
          }
        },
        {
          text: () => { return map.getLangText("_高度差") },
          icon: AutoHeightOne({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            if (!that.measure) {
              that.measure = new mars3d.thing.Measure()
              map.addThing(that.measure)
            }
            that.measure.heightTriangle()
          }
        },
        {
          text: () => { return map.getLangText("_删除测量") },
          icon: DeleteKey({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.measure && that.measure.hasMeasure
          },
          callback: function (e) {
            if (that.measure) {
              that.measure.clear()
            }
          }
        }
      ]
    },
    {
      text: () => {
        return map.getLangText("_图上标记")
      },
      icon: Mark({ theme: "outline", fill: "#fff", size: "18" }),
      children: [
        {
          text: () => { return map.getLangText("_标记点") },
          icon: Label({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
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
        },
        {
          text: () => { return map.getLangText("_标记线") },
          icon: Change({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
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
        },
        {
          text: () => { return map.getLangText("_标记面") },
          icon: BringToFrontOne({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
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
        },
        {
          text: () => { return map.getLangText("_标记圆") },
          icon: Asterisk({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
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
        },
        {
          text: () => { return map.getLangText("_允许编辑") },
          icon: Editor({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.graphicLayer.hasEdit
          },
          callback: function (e) {
            map.graphicLayer.hasEdit = true
          }
        },
        {
          text: () => { return map.getLangText("_禁止编辑") },
          icon: DatabaseForbid({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.graphicLayer.hasEdit
          },
          callback: function (e) {
            map.graphicLayer.hasEdit = false
          }
        },
        {
          text: () => { return map.getLangText("_导出GeoJSON") },
          icon: Export({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.graphicLayer.length > 0
          },
          callback: function (e) {
            mars3d.Util.downloadFile("图上标记.json", JSON.stringify(map.graphicLayer.toGeoJSON()))
          }
        },
        {
          text: () => { return map.getLangText("_清除所有标记") },
          icon: ClearFormat({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.graphicLayer.length > 0
          },
          callback: function (e) {
            map.graphicLayer.clear()
          }
        }
      ]
    },
    {
      text: () => {
        return map.getLangText("_特效效果")
      },
      icon: Effects({ theme: "outline", fill: "#fff", size: "18" }),
      children: [
        {
          text: () => { return map.getLangText("_开启下雨") },
          icon: LightRain({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.rainEffect
          },
          callback: function (e) {
            if (!that.rainEffect) {
              that.rainEffect = new mars3d.effect.RainEffect()
              map.addEffect(that.rainEffect)
            }
          }
        },
        {
          text: () => { return map.getLangText("_关闭下雨") },
          icon: Close({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.rainEffect
          },
          callback: function (e) {
            if (that.rainEffect) {
              map.removeEffect(that.rainEffect, true)
              delete that.rainEffect
            }
          }
        },
        {
          text: () => { return map.getLangText("_开启下雪") },
          icon: Snow({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.snowEffect
          },
          callback: function (e) {
            if (!that.snowEffect) {
              that.snowEffect = new mars3d.effect.SnowEffect()
              map.addEffect(that.snowEffect)
            }
          }
        },
        {
          text: () => { return map.getLangText("_关闭下雪") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.snowEffect
          },
          callback: function (e) {
            if (that.snowEffect) {
              map.removeEffect(that.snowEffect, true)
              delete that.snowEffect
            }
          }
        },

        {
          text: () => { return map.getLangText("_开启雾天气") },
          icon: Fog({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.fogEffect
          },
          callback: function (e) {
            if (!that.fogEffect) {
              const height = map.camera.positionCartographic.height * 2
              that.fogEffect = new mars3d.effect.FogEffect({
                fogByDistance: new Cesium.Cartesian4(0.1 * height, 0.1, height, 0.8)
              })
              map.addEffect(that.fogEffect)
            }
          }
        },
        {
          text: () => { return map.getLangText("_关闭雾天气") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.fogEffect
          },
          callback: function (e) {
            if (that.fogEffect) {
              map.removeEffect(that.fogEffect, true)
              delete that.fogEffect
            }
          }
        },

        {
          text: () => { return map.getLangText("_开启泛光") },
          icon: Halo({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.bloomEffect
          },
          callback: function (e) {
            if (!that.bloomEffect) {
              that.bloomEffect = new mars3d.effect.BloomEffect()
              map.addEffect(that.bloomEffect)
            }
          }
        },
        {
          text: () => { return map.getLangText("_关闭泛光") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.bloomEffect
          },
          callback: function (e) {
            if (that.bloomEffect) {
              map.removeEffect(that.bloomEffect, true)
              delete that.bloomEffect
            }
          }
        },

        {
          text: () => { return map.getLangText("_开启亮度") },
          icon: Brightness({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.brightnessEffect
          },
          callback: function (e) {
            if (!that.brightnessEffect) {
              that.brightnessEffect = new mars3d.effect.BrightnessEffect()
              map.addEffect(that.brightnessEffect)
            }
          }
        },
        {
          text: () => { return map.getLangText("_关闭亮度") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.brightnessEffect
          },
          callback: function (e) {
            if (that.brightnessEffect) {
              map.removeEffect(that.brightnessEffect, true)
              delete that.brightnessEffect
            }
          }
        },

        {
          text: () => { return map.getLangText("_开启夜视") },
          icon: DarkMode({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.nightVisionEffect
          },
          callback: function (e) {
            if (!that.nightVisionEffect) {
              that.nightVisionEffect = new mars3d.effect.NightVisionEffect()
              map.addEffect(that.nightVisionEffect)
            }
          }
        },
        {
          text: () => { return map.getLangText("_关闭夜视") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.nightVisionEffect
          },
          callback: function (e) {
            if (that.nightVisionEffect) {
              map.removeEffect(that.nightVisionEffect, true)
              delete that.nightVisionEffect
            }
          }
        },

        {
          text: () => { return map.getLangText("_开启黑白") },
          icon: Blackboard({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.blackAndWhiteEffect
          },
          callback: function (e) {
            if (!that.blackAndWhiteEffect) {
              that.blackAndWhiteEffect = new mars3d.effect.BlackAndWhiteEffect()
              map.addEffect(that.blackAndWhiteEffect)
            }
          }
        },
        {
          text: () => { return map.getLangText("_关闭黑白") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.blackAndWhiteEffect
          },
          callback: function (e) {
            if (that.blackAndWhiteEffect) {
              map.removeEffect(that.blackAndWhiteEffect, true)
              delete that.blackAndWhiteEffect
            }
          }
        },

        {
          text: () => { return map.getLangText("_开启拾取高亮") },
          icon: HighLight({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !that.outlineEffect
          },
          callback: function (e) {
            if (!that.outlineEffect) {
              that.outlineEffect = new mars3d.effect.OutlineEffect()
              map.addEffect(that.outlineEffect)
            }
          }
        },
        {
          text: () => { return map.getLangText("_关闭拾取高亮") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return that.outlineEffect
          },
          callback: function (e) {
            if (that.outlineEffect) {
              map.removeEffect(that.outlineEffect, true)
              delete that.outlineEffect
            }
          }
        }
      ]
    },
    {
      text: () => {
        return map.getLangText("_场景设置")
      },
      icon: Config({ theme: "outline", fill: "#fff", size: "18" }),
      children: [
        {
          text: () => { return map.getLangText("_开启深度监测") },
          icon: LandSurveying({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.scene.globe.depthTestAgainstTerrain
          },
          callback: function (e) {
            map.scene.globe.depthTestAgainstTerrain = true
          }
        },
        {
          text: () => { return map.getLangText("_关闭深度监测") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.scene.globe.depthTestAgainstTerrain
          },
          callback: function (e) {
            map.scene.globe.depthTestAgainstTerrain = false
          }
        },

        {
          text: () => { return map.getLangText("_显示星空背景") },
          icon: TwoTriangles({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.scene.skyBox.show
          },
          callback: function (e) {
            map.scene.skyBox.show = true // 天空盒
            map.scene.moon.show = true // 太阳
            map.scene.sun.show = true // 月亮
          }
        },
        {
          text: () => { return map.getLangText("_关闭星空背景") },
          icon: ExclusiveGateway({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.scene.skyBox.show
          },
          callback: function (e) {
            map.scene.skyBox.show = false // 天空盒
            map.scene.moon.show = false // 太阳
            map.scene.sun.show = false // 月亮
          }
        },
        {
          text: () => { return map.getLangText("_开启日照阴影") },
          icon: Sun({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.viewer.shadows
          },
          callback: function (e) {
            map.viewer.shadows = true
            map.viewer.terrainShadows = Cesium.ShadowMode.ENABLED
            map.scene.globe.enableLighting = true
          }
        },
        {
          text: () => { return map.getLangText("_关闭日照阴影") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.viewer.shadows
          },
          callback: function (e) {
            map.viewer.shadows = false
            map.viewer.terrainShadows = Cesium.ShadowMode.RECEIVE_ONLY
            map.scene.globe.enableLighting = false
          }
        },
        {
          text: () => { return map.getLangText("_开启大气渲染") },
          icon: FlightAirflow({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return !map.scene.skyAtmosphere.show
          },
          callback: function (e) {
            map.scene.skyAtmosphere.show = true
            map.scene.globe.showGroundAtmosphere = true
          }
        },
        {
          text: () => { return map.getLangText("_关闭大气渲染") },
          icon: CloseOne({ theme: "outline", fill: "#fff", size: "18" }),
          show: function (e) {
            return map.scene.skyAtmosphere.show
          },
          callback: function (e) {
            map.scene.skyAtmosphere.show = false
            map.scene.globe.showGroundAtmosphere = false
          }
        },

        {
          text: () => { return map.getLangText("_场景出图") },
          icon: AddPicture({ theme: "outline", fill: "#fff", size: "18" }),
          callback: function (e) {
            map.expImage()
          }
        }
      ]
    }
  ]
}
