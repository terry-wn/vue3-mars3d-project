
import { defineAsyncComponent, markRaw } from "vue"
import { WidgetState } from "@mars/common/store/widget"
import { StoreOptions } from "vuex"

const store: StoreOptions<WidgetState> = {
  state: {
    widgets: [
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/query-poi/index.vue"))),
        name: "query-poi",
        autoDisable: true
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/map-toolbar/index.vue"))),
        name: "map-toolbar",
        autoDisable: true
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-basemap/index.vue"))),
        name: "manage-basemap",
        group: "manage"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-layers/index.vue"))),
        name: "manage-layers",
        group: "manage",
        disableOther: ["roamLine"]
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-layers/layer-tree.vue"))),
        name: "layer-tree"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-layers/layer-picture-heatmap.vue"))),
        name: "layer-picture-heatmap"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/basic/manage-layers/layer-picture-guihua.vue"))),
        name: "layer-picture-guihua"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/custom/map-location/index.vue"))),
        name: "map-location",
        group: "tools"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/custom/map-compare/index.vue"))),
        name: "map-compare",
        group: "tools"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/custom/map-split/index.vue"))),
        name: "map-split",
        group: "tools"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/custom/map-plotting/index.vue"))),
        name: "map-plotting",
        group: "tools"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/custom/map-measure/index.vue"))),
        name: "map-measure",
        group: "tools"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/custom/map-analysis/index.vue"))),
        name: "map-analysis",
        group: "tools"
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/custom/graphic-editor/index.vue"))),
        name: "graphic-editor",
        meta: {
          props: {
            position: {
              left: 80,
              top: 10,
              bottom: 50
            }
          }
        }
      },
      {
        component: markRaw(defineAsyncComponent(() => import("@mars/widgets/custom/group-editor/index.vue"))),
        name: "group-editor",
        meta: {
          props: {
            position: {
              left: 80,
              top: 10,
              bottom: 50
            }
          }
        }
      }
    ],
    openAtStart: ["query-poi", "map-toolbar"]
  }
}

export default store
