<template>
  <mars-dialog :draggable="false" customClass="base-pannel" right="10" top="10">
    <template v-for="(item, i) in data" :key="i">
      <div v-if="item.widget && !item.children" class="toolbar-item" @click="showWidget(item.widget)">
        <mars-icon :icon="item.icon" width="18"></mars-icon>
        <span class="title">{{ item.name }}</span>
      </div>
      <mars-dropdown-menu v-if="item.children && !item.widget" trigger="hover" placement="bottomRight">
        <div class="toolbar-item">
          <mars-icon :icon="item.icon" width="18"></mars-icon>
          <span class="title">{{ item.name }}</span>
          <mars-icon icon="down" width="18"></mars-icon>
        </div>
        <template #overlay>
          <a-menu @click="clickMenu">
            <a-menu-item v-for="child in item.children" :key="child.widget" :title="child.name">
              <mars-icon :icon="child.icon" width="18"></mars-icon>
              <span>{{ child.name }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </mars-dropdown-menu>
    </template>
  </mars-dialog>
</template>

<script setup lang="ts">

import { useWidget } from "@mars/common/store/widget"

const { activate } = useWidget()

const data = [
  { name: "底图", icon: "international", widget: "manage-basemap" },
  { name: "图层", icon: "layers", widget: "manage-layers" },
  {
    name: "工具",
    icon: "tool",
    children: [
      { name: "图上量算", icon: "ruler", widget: "map-measure" },
      { name: "空间分析", icon: "analysis", widget: "map-analysis" },
      { name: "坐标定位", icon: "local", widget: "map-location" },
      { name: "图上标绘", icon: "hand-painted-plate", widget: "map-plotting" },
      // { name: "飞行漫游", icon: "take-off", widget: "map-roam" },
      // { name: "路线导航", icon: "connection", widget: "map-navigation" },
      { name: "卷帘对比", icon: "switch-contrast", widget: "map-split" },
      { name: "分屏对比", icon: "full-screen-play", widget: "map-compare" }
    ]
  }
]

const showWidget = (widget: string) => {
  activate(widget)
}

const clickMenu = ({ key }: any) => {
  showWidget(key)
}
</script>

<style lang="less">
.base-pannel {
  padding: 0 !important;
  background-image: none !important;
  border: 1px solid;
  border: none;
  border-radius: 2px !important;
  background-color: var(--mars-bg-base);
  height: 40px;
  .toolbar-item {
    display: inline-block;
    padding: 6px 12px;
    height: 100%;
    color: var(--mars-text-color);
    font-size: 15px;
    cursor: pointer;
    &:hover {
      background-color: var(--mars-select-bg);
    }
  }
  .mars-icon {
    margin-right: 5px;
    color: var(--mars-text-color);
  }
}
</style>
