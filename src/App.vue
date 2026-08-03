<script setup>
import { ref, onMounted, provide } from "vue";
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

import Flag from "./components/HtmlBase/Flag.vue";
import AltLeader from "./components/HtmlBase/AltLeader.vue";

// ============================================================
//  🆕 定义全局共享数据（侧边栏改这里，主窗口同步变）
// ============================================================
const textLinesTop = ref(["大日耳曼国", "团结协定", "国会紧急委员会"]);
const textLines = ref(["纳粹党", "国家社会主义", "无选举"]);
const focusText = ref("未知国策");
const altLeaderTitle = ref("副总统");
const altLeaderName = ref("人名");

provide('textLinesTop', textLinesTop);
provide('textLines', textLines);
provide('focusText', focusText);
provide('altLeaderTitle', altLeaderTitle);
provide('altLeaderName', altLeaderName);

// 侧边栏显示开关
const sidebarVisible = ref(false);
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

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

    <!-- ================================================================ -->
    <!-- 🆕 侧边栏修改器（已增加最大高度与滚动条）                    -->
    <!-- ================================================================ -->
    <div style="position: fixed; right: 20px; top: 20px; z-index: 99999; display: flex; flex-direction: column; align-items: flex-end; pointer-events: auto;">
      <button @click="toggleSidebar" style="background: #7caaaa; color: #000; padding: 10px 20px; border-radius: 30px; font-weight: bold; border: 1px solid #5f8a8a; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
        🖊️ 编辑文字
      </button>

      <!-- ✅ 核心改动：加了 max-height 和 overflow-y: auto，支持纵向滚动 -->
      <div v-show="sidebarVisible" style="
          margin-top: 12px; 
          background: rgba(0, 0, 0, 0.92); 
          padding: 20px; 
          border-radius: 12px; 
          border: 1px solid #7caaaa; 
          width: 300px; 
          max-height: 80vh;          /* 设置最大高度，防止超出屏幕 */
          overflow-y: auto;          /* 内容超出时出现滚动条 */
          color: #e0e0e0; 
          font-family: 'FZRuiZHJW', sans-serif; 
          box-shadow: 0 8px 25px rgba(0,0,0,0.8);
        ">
        <p style="margin-bottom: 15px; font-weight: bold; text-align: center; color: #ffcc00; border-bottom: 1px solid #333; padding-bottom: 10px;">📝 文字同步修改</p>

        <!-- 第一组：国名、阵营、领袖 -->
        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">国名</label><input v-model="textLinesTop[0]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">阵营</label><input v-model="textLinesTop[1]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">领袖</label><input v-model="textLinesTop[2]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px;"></div>
        </div>

        <!-- 第二组：政党、意识形态、选举 -->
        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">政党</label><input v-model="textLines[0]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">意识形态</label><input v-model="textLines[1]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">选举</label><input v-model="textLines[2]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px;"></div>
        </div>

        <!-- 第三组：国策 -->
        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">国策</label><input v-model="focusText" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px;"></div>
        </div>

        <!-- 第四组：AltLeader 专用数据 -->
        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">副总统职位</label><input v-model="altLeaderTitle" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">副总统姓名</label><input v-model="altLeaderName" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px;"></div>
        </div>

        <div style="margin-top: 12px; text-align: right;">
          <button @click="toggleSidebar" style="background: transparent; border: 1px solid #666; color: #aaa; padding: 4px 12px; border-radius: 4px; cursor: pointer;">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.window {
  position: absolute;
}
/* 可选：自定义滚动条样式，让它看起来更酷 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #1a1a1a; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #7caaaa; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #5f8a8a; 
}
</style>