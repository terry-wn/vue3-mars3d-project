import { Popover } from "ant-design-vue"
import { ColorPicker } from "vue-color-kit"
import MarsButton from "../mars-button/index.vue"
import { App, defineComponent, h, ref } from "vue"
import "./mars-color-picker.less"


const MarsColorPicker = defineComponent({
  name: "mars-color-picker",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: "rgba(255,255,255,1)"
    },
    hiddenAlpha: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:value", "change"],
  setup(props, context) {
    let pointColor = props.value || ""
    const visible = ref(false)
    let colorObject: any = null

    // console.log("传递过来的", props.hiddenAlpha)


    const changeColor = (color: any) => {
      pointColor = `rgba(${color.rgba.r},${color.rgba.g},${color.rgba.b},${color.rgba.a})`// color.hex
      colorObject = color
    }
    const cancel = () => {
      visible.value = false
      pointColor = props.value
    }
    const choose = () => {
      visible.value = false
      context.emit("update:value", pointColor)
      context.emit("change", colorObject)
    }

    const Buttons = [
      h(
        MarsButton,
        { size: "small", onClick: choose },
        {
          default: () => "确定"
        }
      ),
      h(
        MarsButton,
        { size: "small", class: "ml5", onClick: cancel },
        {
          default: () => "取消"
        }
      )
    ]

    const content = [
      h(ColorPicker, { suckerHide: true, color: pointColor, onChangeColor: changeColor } as any),
      h("div", { class: "f-tac" }, Buttons)
    ]

    return () =>
      h(
        Popover,
        {
          trigger: "click",
          placement: "right",
          overlayClassName: props.hiddenAlpha ? "overlayClassName" : "", // 打开的面板样式,隐藏透明度面板
          // overlayClassName: "overlayClassName", // 打开的面板样式,隐藏透明度面板
          open: visible.value,
          "onUpdate:visible": (v: boolean) => {
            visible.value = v
          },
          color: "rgba(32, 42, 68, 0.9)"
        },
        {
          default: () => h("div", { class: "marsColorView", style: { backgroundColor: props.value } }),
          content: () => h("div", null, content)
        }
      )
  }
})

export function install(app: App): App {
  app.component(MarsColorPicker.name, MarsColorPicker)
  return app
}
export default MarsColorPicker
