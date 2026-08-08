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
//  📦 全局数据仓库
// ============================================================
const textLinesTop = ref(["大日耳曼国", "团结协定", "国会紧急委员会"]);
const textLines = ref(["纳粹党", "国家社会主义", "无选举"]);
const focusText = ref("未知国策");
const altLeaderTitle = ref("副总统");
const altLeaderName = ref("人名");
const currentFlag = ref("/preset/GER.png");
const leaderNickname = ref("");

const descBodyText = ref(
  "元首已不幸病故，举国震惊。毕竟，谁能想到这位不可战胜之人会这样死去呢？\n\n但国会对此早有准备。\n\n尽管元首早已点出他的继承者，但政府内部依然各执一词。改革派、保守派、强硬派、狂热派互相撕咬，和平有序进行权力交接的幌子顷刻间烟消云散。斗争的结果是，一群中间派、无名官僚和不受其他派系欢迎的国会议员们联合起来，遵循着三十年来为众人所忽视的宪法，宣布成立过渡行政机关，直至新任元首宣誓就职。\n\n元首之位的主要竞争者都对紧急委员会漠不关心，对他们而言，委员会充其量只是群坐冷板凳的家伙；若以冷眼观之，那么他们就是桀骜不驯的叛徒。唯一值得欣慰的是，他们的存在给日耳曼尼亚带来了一丝脆弱的稳定，防止这座城市陷入混乱，如此便可能会有一位更有能力的领导人出来重掌大局，希望如此。他们或许可以保住罗马不在烈火中化为废墟，却无法阻止帝国的其他部分被烈焰所吞噬。"
);

const superTitle = ref("德国内战");
const superMotto = ref("因此，所有人都必须认识到这一点：\n与国家的存在相比，他的自我毫无意义。\n- 阿道夫·希特勒");
const superButtonText = ref("风云已起");

// 注入所有数据
provide('textLinesTop', textLinesTop);
provide('textLines', textLines);
provide('focusText', focusText);
provide('altLeaderTitle', altLeaderTitle);
provide('altLeaderName', altLeaderName);
provide('currentFlag', currentFlag);
provide('descBodyText', descBodyText);
provide('leaderNickname', leaderNickname);
provide('superTitle', superTitle);
provide('superMotto', superMotto);
provide('superButtonText', superButtonText);

const sidebarVisible = ref(false);
const toggleSidebar = () => { sidebarVisible.value = !sidebarVisible.value; };

// ============================================================
//  🚀 核心逻辑
// ============================================================
onMounted(() => {
  document.addEventListener("mousedown", (e) => {
    mousePosition.down.x = e.clientX;
    mousePosition.down.y = e.clientY;
  });
  document.addEventListener("mouseup", (e) => {
    mousePosition.up.x = e.clientX;
    mousePosition.up.y = e.clientY;
  });

  setInterval(() => {
    const mainFlag = document.getElementById('master-flag');
    if (mainFlag && mainFlag.src !== currentFlag.value) {
      currentFlag.value = mainFlag.src;
    }
  }, 200);

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

function openSettings() { settingsVisible.value = true; }

const handleClose = () => { new Howl({ src: ["/sfx/click_window_close.wav"], volume: 1 }).play(); };
const handleShow = () => { new Howl({ src: ["/sfx/click_window_open.wav"], volume: 1 }).play(); };
</script>

<template>
  <div id="app-container" @click.self="openSettings" @touchstart.self="openSettings"
    style="width: 100vw; height: 100vh;">
    
    <!-- ===== 窗口容器略去 ===== -->
    <DraggableResizableVue v-show="state.windows.main.visible" v-model:active="state.windows.main.active"
      :z="state.windows.main.zIndex" @activated="bringToFront('main')" class="window" :draggable=false
      :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <MainWindow />
    </DraggableResizableVue>

    <DraggableResizableVue v-show="state.windows.description.visible" v-model:x="state.windows.description.x"
      v-model:y="state.windows.description.y" v-model:w="state.windows.description.w"
      v-model:h="state.windows.description.h" v-model:active="state.windows.description.active"
      :z="state.windows.description.zIndex" @activated="bringToFront('description')" class="window"
      :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <Description />
    </DraggableResizableVue>

    <DraggableResizableVue v-show="state.windows.news.visible" v-model:x="state.windows.news.x"
      v-model:y="state.windows.news.y" v-model:w="state.windows.news.w" v-model:h="state.windows.news.h"
      v-model:active="state.windows.news.active" :z="state.windows.news.zIndex" @activated="bringToFront('news')"
      class="window" :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <News />
    </DraggableResizableVue>

    <DraggableResizableVue v-show="state.windows.superevent.visible" v-model:x="state.windows.superevent.x"
      v-model:y="state.windows.superevent.y" v-model:w="state.windows.superevent.w"
      v-model:h="state.windows.superevent.h" v-model:active="state.windows.superevent.active"
      :z="state.windows.superevent.zIndex" @activated="bringToFront('superevent')" class="window" :draggable="draggable">
      <Superevent />
    </DraggableResizableVue>

    <DraggableResizableVue v-show="state.windows.flag.visible" v-model:x="state.windows.flag.x"
      v-model:y="state.windows.flag.y" v-model:w="state.windows.flag.w" v-model:h="state.windows.flag.h"
      v-model:active="state.windows.flag.active" :z="state.windows.flag.zIndex" @activated="bringToFront('flag')"
      class="window" :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <Flag :draggable="false" />
    </DraggableResizableVue>

    <DraggableResizableVue v-show="state.windows.event.visible" v-model:x="state.windows.event.x"
      v-model:y="state.windows.event.y" v-model:w="state.windows.event.w" v-model:h="state.windows.event.h"
      v-model:active="state.windows.event.active" :z="state.windows.event.zIndex" @activated="bringToFront('event')"
      class="window" :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
      <Event />
    </DraggableResizableVue>

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
      <AltLeader :draggable="false" />
    </DraggableResizableVue>

    <Dialog v-model:visible="settingsVisible" :style="{ minHeight: '60%', fontFamily: 'Aldrich, FZRui' }" header="控制面板"
      id="control-panel" @hide="handleClose" @show="handleShow">
      <Generic :windows="state.windows" v-model:draggable="draggable" />
    </Dialog>

    <!-- ================================================================ -->
    <!-- 🆕 侧边栏修改器（字体统一，无任何多余开关） -->
    <!-- ================================================================ -->
    <div style="position: fixed; right: 20px; top: 20px; z-index: 99999; display: flex; flex-direction: column; align-items: flex-end; pointer-events: auto;">
      <button @click="toggleSidebar" style="background: #7caaaa; color: #000; padding: 10px 20px; border-radius: 30px; font-weight: bold; border: 1px solid #5f8a8a; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;">
        🖊️ 编辑文字
      </button>

      <div v-show="sidebarVisible" style="
          margin-top: 12px; 
          background: rgba(0, 0, 0, 0.92); 
          padding: 20px; 
          border-radius: 12px; 
          border: 1px solid #7caaaa; 
          width: 380px; 
          max-height: 85vh;
          overflow-y: auto;
          color: #e0e0e0; 
          box-shadow: 0 8px 25px rgba(0,0,0,0.8);
          font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;
        ">
        <p style="margin-bottom: 15px; font-weight: bold; text-align: center; color: #ffcc00; border-bottom: 1px solid #333; padding-bottom: 10px;">📝 文字同步修改</p>

        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
          <label style="display: block; font-size: 12px; color: #999; margin-bottom: 6px;">📖 人物介绍正文</label>
          <textarea v-model="descBodyText" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; min-height: 150px; resize: vertical; font-size: 13px; line-height: 1.5; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></textarea>
        </div>

        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">领袖名称</label><input v-model="textLinesTop[2]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">外号</label><input v-model="leaderNickname" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">国名</label><input v-model="textLinesTop[0]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">阵营</label><input v-model="textLinesTop[1]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
        </div>

        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">政党</label><input v-model="textLines[0]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">意识形态</label><input v-model="textLines[1]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">选举情况</label><input v-model="textLines[2]" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">国策</label><input v-model="focusText" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
        </div>

        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">副职位</label><input v-model="altLeaderTitle" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">副姓名</label><input v-model="altLeaderName" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
        </div>

        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">超事件标题</label><input v-model="superTitle" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">按钮</label><input v-model="superButtonText" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">名言</label><textarea v-model="superMotto" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; min-height: 80px; resize: vertical; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></textarea></div>
        </div>

        <div style="margin-top: 12px; text-align: right;">
          <button @click="toggleSidebar" style="background: transparent; border: 1px solid #666; color: #aaa; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.window { position: absolute; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 4px; }
::-webkit-scrollbar-thumb { background: #7caaaa; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #5f8a8a; }
</style>