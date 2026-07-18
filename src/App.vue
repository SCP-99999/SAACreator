<script setup>
import { ref, onMounted } from "vue";
import DraggableResizableVue from "vue-draggable-resizable";
import MainWindow from "./components/HtmlBase/mainwindow.vue";
import Description from "./components/HtmlBase/description.vue";
import News from "./components/HtmlBase/news.vue";
import Superevent from "./components/HtmlBase/superevent.vue";
import Event from "./components/HtmlBase/event.vue";
import Generic from "./components/Controller/Generic.vue";
import { initApp } from "./utils/onload.js";
import { mousePosition } from "./composables/useMousePosition.js";
import { state } from "@/utils/state.js";
import { Howl } from "howler";
import { usePresetDB } from "@/composables/usePresetDB";
const { clearAutoSave } = usePresetDB();

// ========== 引入所有自定义组件 ==========
import Flag from "./components/HtmlBase/Flag.vue";
import AltLeader from "./components/HtmlBase/AltLeader.vue";

onMounted(() => {
  document.addEventListener("mousedown", (e) => {
    mousePosition.down.x = e.clientX;
    mousePosition.down.y = e.clientY;
  });
  document.addEventListener("mouseup", (e) => {
    mousePosition.up.x = e.clientX;
    mousePosition.up.y = e.clientY;
  });
  try {
    initApp();
  } catch (error) {
    localStorage.clear();
    clearAutoSave();
    location.reload();
  }
});

const settingsVisible = ref(false);
const draggable = ref(false);

let maxZIndex = ref(1);

function bringToFront(windowName) {
  maxZIndex.value++;
  state.windows[windowName].zIndex = maxZIndex.value;
}

function openSettings() {
  settingsVisible.value = true;
}

const handleClose = () => {
  new Howl({
    src: ["/sfx/click_window_close.wav"],
    volume: 1,
  }).play();
};

const handleShow = () => {
  new Howl({
    src: ["/sfx/click_window_open.wav"],
    volume: 1,
  }).play();
};
</script>

<template>
  <div id="app-container" @click.self="openSettings" @touchstart.self="openSettings"
    style="width: 100vw; height: 100vh;">
    
    <!-- ===== 主窗口 ===== -->
    <DraggableResizableVue v-show="state.windows.main.visible" v-model:active="state.windows.main.active"
      :z="state.windows.main.zIndex" @activated="bringToFront('main')" class="window" :draggable=false
      :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <MainWindow />
    </DraggableResizableVue>

    <!-- ===== 人物介绍 ===== -->
    <DraggableResizableVue v-show="state.windows.description.visible" v-model:x="state.windows.description.x"
      v-model:y="state.windows.description.y" v-model:w="state.windows.description.w"
      v-model:h="state.windows.description.h" v-model:active="state.windows.description.active"
      :z="state.windows.description.zIndex" @activated="bringToFront('description')" class="window"
      :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <Description />
    </DraggableResizableVue>

    <!-- ===== 新闻 ===== -->
    <DraggableResizableVue v-show="state.windows.news.visible" v-model:x="state.windows.news.x"
      v-model:y="state.windows.news.y" v-model:w="state.windows.news.w" v-model:h="state.windows.news.h"
      v-model:active="state.windows.news.active" :z="state.windows.news.zIndex" @activated="bringToFront('news')"
      class="window" :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <News />
    </DraggableResizableVue>

    <!-- ===== 超事件 ===== -->
    <DraggableResizableVue v-show="state.windows.superevent.visible" v-model:x="state.windows.superevent.x"
      v-model:y="state.windows.superevent.y" v-model:w="state.windows.superevent.w"
      v-model:h="state.windows.superevent.h" v-model:active="state.windows.superevent.active"
      :z="state.windows.superevent.zIndex" @activated="bringToFront('superevent')" class="window" :draggable="draggable"
      :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <Superevent />
    </DraggableResizableVue>

    <!-- ===== 旗帜框 ===== -->
    <DraggableResizableVue v-show="state.windows.flag.visible" v-model:x="state.windows.flag.x"
      v-model:y="state.windows.flag.y" v-model:w="state.windows.flag.w" v-model:h="state.windows.flag.h"
      v-model:active="state.windows.flag.active" :z="state.windows.flag.zIndex" @activated="bringToFront('flag')"
      class="window" :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <Flag :draggable="draggable" />
    </DraggableResizableVue>

    <!-- ===== 事件 ===== -->
    <DraggableResizableVue v-show="state.windows.event.visible" v-model:x="state.windows.event.x"
      v-model:y="state.windows.event.y" v-model:w="state.windows.event.w" v-model:h="state.windows.event.h"
      v-model:active="state.windows.event.active" :z="state.windows.event.zIndex" @activated="bringToFront('event')"
      class="window" :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <Event />
    </DraggableResizableVue>

    <!-- ===== 替代领导人 (AltLeader) ===== -->
    <DraggableResizableVue v-show="state.windows.altLeader.visible" 
      v-model:x="state.windows.altLeader.x"
      v-model:y="state.windows.altLeader.y" 
      v-model:w="state.windows.altLeader.w"
      v-model:h="state.windows.altLeader.h" 
      v-model:active="state.windows.altLeader.active"
      :z="state.windows.altLeader.zIndex" 
      @activated="bringToFront('altLeader')"
      class="window" 
      :draggable="draggable" 
      :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <AltLeader :draggable="draggable" />
    </DraggableResizableVue>

    <!-- ===== 控制面板 ===== -->
    <Dialog v-model:visible="settingsVisible" :style="{ minHeight: '60%', fontFamily: 'Aldrich, FZRui' }" header="控制面板"
      id="control-panel" @hide="handleClose" @show="handleShow">
      <Generic :windows="state.windows" v-model:draggable="draggable" />
    </Dialog>
  </div>
</template>

<style>
.window {
  position: absolute;
}
</style>