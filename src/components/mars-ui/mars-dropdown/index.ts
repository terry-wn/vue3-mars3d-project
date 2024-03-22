import { Dropdown } from "ant-design-vue"
import { App, defineComponent, h } from "vue"
import "./dropdown.less"



const MarsDropdown = defineComponent({
  name: "mars-dropdown-menu",
  inheritAttrs: false,
  setup(props, context) {
    return () => h(Dropdown, { ...context.attrs, ...props, overlayClassName: "mars-dropdown-menu" }, context.slots)
  }
})

export function install(app: App): App {
  app.component(MarsDropdown.name, MarsDropdown)
  return app
}
export default MarsDropdown
