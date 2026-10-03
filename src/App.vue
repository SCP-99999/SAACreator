<script setup>
import { ref, onMounted, provide } from "vue";
import DraggableResizableVue from "vue-draggable-resizable";
import MainWindow from "./components/HtmlBase/mainwindow.vue";
import Description from "./components/HtmlBase/description.vue";
import News from "./components/HtmlBase/news.vue";
import Superevent from "./components/HtmlBase/superevent.vue";
import Event from "./components/HtmlBase/event.vue";
import Generic from "./components/Controller/Generic.vue";
import PicManager from "@/components/Controller/PicManager.vue";
import { initApp } from "./utils/onload.js";
import { mousePosition } from "./composables/useMousePosition.js";
import { state } from "@/utils/state.js";
import { Howl } from "howler";
import { usePresetDB } from "@/composables/usePresetDB";
const { clearAutoSave } = usePresetDB();

import Flag from "./components/HtmlBase/Flag.vue";
import AltLeader from "./components/HtmlBase/AltLeader.vue";

// ============================================================
//  全局数据仓库
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

const eventTitle = ref("内战打响！");
const eventBody = ref("多年以来，虽然国内各派系之间的紧张局势一直在加剧，但谁都没有想到，元首尸骨未寒，暴力冲突就爆发了。当然，人人都能看见，政客们躲回了自己的老巢，军队分发了装备并封锁了道路，警察则拿起了他们手头上最强大的武器，用路障封锁了他们的警察局，但谁能想到，将要降临的是一场彻底的内战呢？\n\n然而，不管人们想没想到，战争就这样发生了。部队在日耳曼尼亚倾注了全部注意力，确保首都处于军方的控制之下，不过在其他地方，追求着德意志祖国无上权柄的觊觎者们已经武装起来，战斗一触即发。施佩尔、海德里希、鲍曼、戈林，没有人知道谁会获得最终胜利，不过这个国家的所有民众都知道，他们未来的日子一片黑暗。\n\n德国正在崩溃，城市街头陷入无政府状态，饕餮列强们争论着如何行动。英国和日本都在寻找从这场混乱中渔利的最佳时机，伊比利亚与意大利迅速开始军事化，趁着这混乱将自身的彩响力撒播出去。表面上对祖国忠心耿耿的专员辖区们也陷入了争吵，领导人们争论着该支持谁，或者是否是时候乘机开始将自己的领地与故乡拉开距离、划清界线。");
const eventButtonText = ref("血色将至。");

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
provide('eventTitle', eventTitle);
provide('eventBody', eventBody);
provide('eventButtonText', eventButtonText);

// ============================================================
//  ✅ 全局图片点击监听
// ============================================================
const handleGlobalPicClick = (event) => {
  const distance = Math.sqrt(
    Math.pow(mousePosition.up.x - mousePosition.down.x, 2) +
    Math.pow(mousePosition.up.y - mousePosition.down.y, 2)
  );
  if (distance > 5) return;

  let target = event.target;
  while (target && target !== document) {
    if (target.dataset && target.dataset.modifiable === "true") {
      break;
    }
    target = target.parentElement;
  }

  if (!target || target === document) return;

  state.picManagerType = target.dataset.type;
  state.picManagerTargetId = target.dataset.targetId;
  state.picManagerResizable = target.dataset.resizable === "true";
  state.picManagerVisible = true;
};

// ✅ 全局图片更新处理
const updatePicture = ({ id, url, scale }) => {
  const element = document.getElementById(id);
  if (element) {
    if (url) element.src = url;
    if (scale !== undefined) element.style.scale = scale;
  }
  if (id === "flagpic" && url) {
    state.flagImageSrc = url;
  }
};

// ============================================================
//  侧边栏逻辑
// ============================================================
const sidebarVisible = ref(false);
const showAnnouncement = ref(false);

const openSidebar = () => {
  sidebarVisible.value = true;
};

const closeSidebar = () => {
  sidebarVisible.value = false;
};

const showAnnouncementMessage = () => {
  showAnnouncement.value = true;
  setTimeout(() => {
    showAnnouncement.value = false;
  }, 5000);
};

// ============================================================
//  核心逻辑
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

  document.addEventListener("click", handleGlobalPicClick);

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

  setTimeout(() => {
    showAnnouncementMessage();
  }, 1000);
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
    
    <Transition name="window-fade">
      <DraggableResizableVue v-if="state.windows.main.visible" v-model:active="state.windows.main.active"
        :z="state.windows.main.zIndex" @activated="bringToFront('main')" class="window" :draggable="false"
        :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
        <MainWindow />
      </DraggableResizableVue>
    </Transition>

    <Transition name="window-fade">
      <DraggableResizableVue v-if="state.windows.description.visible" v-model:x="state.windows.description.x"
        v-model:y="state.windows.description.y" v-model:w="state.windows.description.w"
        v-model:h="state.windows.description.h" v-model:active="state.windows.description.active"
        :z="state.windows.description.zIndex" @activated="bringToFront('description')" class="window"
        :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
        <Description />
      </DraggableResizableVue>
    </Transition>

    <Transition name="window-fade">
      <DraggableResizableVue v-if="state.windows.news.visible" v-model:x="state.windows.news.x"
        v-model:y="state.windows.news.y" v-model:w="state.windows.news.w" v-model:h="state.windows.news.h"
        v-model:active="state.windows.news.active" :z="state.windows.news.zIndex" @activated="bringToFront('news')"
        class="window" :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
        <News />
      </DraggableResizableVue>
    </Transition>

    <Transition name="window-fade">
      <DraggableResizableVue v-if="state.windows.superevent.visible" v-model:x="state.windows.superevent.x"
        v-model:y="state.windows.superevent.y" v-model:w="state.windows.superevent.w"
        v-model:h="state.windows.superevent.h" v-model:active="state.windows.superevent.active"
        :z="state.windows.superevent.zIndex" @activated="bringToFront('superevent')" class="window" :draggable="draggable">
        <Superevent />
      </DraggableResizableVue>
    </Transition>

    <Transition name="window-fade">
      <Flag v-if="state.windows.flag.visible" :draggable="draggable" />
    </Transition>

    <Transition name="window-fade">
      <DraggableResizableVue v-if="state.windows.event.visible" v-model:x="state.windows.event.x"
        v-model:y="state.windows.event.y" v-model:w="state.windows.event.w" v-model:h="state.windows.event.h"
        v-model:active="state.windows.event.active" :z="state.windows.event.zIndex" @activated="bringToFront('event')"
        class="window" :draggable="draggable" :drag-cancel="'.pic, .text, [contenteditable=\'true\']'">
        <Event />
      </DraggableResizableVue>
    </Transition>

    <Transition name="window-fade">
      <DraggableResizableVue v-if="state.windows.altLeader.visible" 
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
    </Transition>

    <Dialog v-model:visible="settingsVisible" :style="{ minHeight: '60%', fontFamily: 'Aldrich, FZRui' }" header="控制面板"
      id="control-panel" @hide="handleClose" @show="handleShow">
      <Generic :windows="state.windows" v-model:draggable="draggable" />
    </Dialog>

    <PicManager 
      v-model:visible="state.picManagerVisible" 
      :type="state.picManagerType" 
      :targetId="state.picManagerTargetId"
      :resizable="state.picManagerResizable" 
      @update:pic="updatePicture" 
    />

    <Transition name="announcement">
      <div v-if="showAnnouncement" style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100000;
        background: rgba(0, 0, 0, 0.85);
        color: #ffcc00;
        padding: 15px 25px;
        border-radius: 8px;
        border: 1px solid #7caaaa;
        font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;
        font-size: 14px;
        text-align: center;
        pointer-events: none;
        box-shadow: 0 4px 15px rgba(0,0,0,0.6);
        animation: fadeInOut 5s ease-in-out;
      ">
        将鼠标靠近右侧边缘以显示侧边栏
      </div>
    </Transition>

    <div 
      @mouseenter="openSidebar"
      style="
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 300px;
        z-index: 99998;
        pointer-events: auto;
      "
    ></div>

    <Transition name="sidebar-slide">
      <div 
        v-if="sidebarVisible"
        style="
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 99999;
          background: rgba(0, 0, 0, 0.92);
          padding: 20px;
          border-radius: 12px 0 0 12px;
          border: 1px solid #7caaaa;
          border-right: none;
          width: 380px;
          max-height: 85vh;
          overflow-y: auto;
          overflow-x: hidden;
          color: #e0e0e0;
          box-shadow: 0 8px 25px rgba(0,0,0,0.8);
          font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;
          pointer-events: auto;
        "
      >
        <p style="margin-bottom: 15px; font-weight: bold; text-align: center; color: #ffcc00; border-bottom: 1px solid #333; padding-bottom: 10px;">文字同步修改</p>

        <div>
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
            <label style="display: block; font-size: 12px; color: #999; margin-bottom: 6px;">人物介绍正文</label>
            <textarea v-model="descBodyText" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; min-height: 150px; resize: vertical; font-size: 13px; line-height: 1.5; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></textarea>
          </div>

          <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
            <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">超事件标题</label><input v-model="superTitle" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
            <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">按钮</label><input v-model="superButtonText" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
            <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">名言</label><textarea v-model="superMotto" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; min-height: 80px; resize: vertical; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></textarea></div>
          </div>

          <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #333;">
            <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">事件标题</label><input v-model="eventTitle" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
            <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">事件正文</label><textarea v-model="eventBody" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; min-height: 150px; resize: vertical; font-size: 13px; line-height: 1.5; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></textarea></div>
            <div style="margin-bottom: 8px;"><label style="display: block; font-size: 12px; color: #999;">事件按钮</label><input v-model="eventButtonText" style="width: 100%; background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;"></div>
          </div>
        </div>

        <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #333; text-align: center;">
          <button 
            @click="closeSidebar"
            style="
              width: 100%;
              background: transparent;
              color: #999;
              border: 1px solid #666;
              border-radius: 4px;
              padding: 8px;
              font-size: 14px;
              font-family: 'FZRuiZHJW', 'Aldrich', sans-serif;
              transition: all 0.2s;
            "
          >
            关闭
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.window { position: absolute; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 4px; }
::-webkit-scrollbar-thumb { background: #7caaaa; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #5f8a8a; }

.window-fade-enter-active,
.window-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.window-fade-enter-from { opacity: 0; transform: scale(0.95); }
.window-fade-leave-to { opacity: 0; transform: scale(0.95); }

.sidebar-slide-enter-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.sidebar-slide-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.sidebar-slide-enter-from { transform: translateY(-50%) translateX(100%); }
.sidebar-slide-leave-to { transform: translateY(-50%) translateX(100%); }

.announcement-enter-active,
.announcement-leave-active { transition: opacity 0.5s ease; }
.announcement-enter-from,
.announcement-leave-to { opacity: 0; }

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  10% { opacity: 1; transform: translateX(-50%) translateY(0); }
  80% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}
</style>