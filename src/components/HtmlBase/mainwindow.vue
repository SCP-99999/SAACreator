<script setup>
import Pie from "./piechart.vue";
import ChartEditor from "../Controller/ChartEditor.vue";
import { ref, onMounted } from "vue";
import PicManager from "@/components/Controller/PicManager.vue";
import { mousePosition } from "../../composables/useMousePosition.js";
import { state } from "@/utils/state.js";
import { Howl } from 'howler';

const editorVisible = ref(false);
const picManagerVisible = ref(false);
const picManagerType = ref("");
const picManagerTargetId = ref("");
const picManagerResizable = ref(false);

const textLinesTop = ref(["大日耳曼国", "团结协定", "国会紧急委员会"]);
const textLines = ref(["纳粹党", "国家社会主义", "无选举"]);
const focusText = ref("未知国策");

const updatePicture = ({ id, url, scale }) => {
  const element = document.getElementById(id);
  if (element) {
    element.src = url ? url : element.src;
    if (scale !== undefined) {
      element.style.scale = scale;
    }
  }
};

const handlePicClick = (event) => {
  const distance = Math.sqrt(
    Math.pow(mousePosition.up.x - mousePosition.down.x, 2) +
    Math.pow(mousePosition.up.y - mousePosition.down.y, 2)
  );

  if (distance > 5) return;

  const target = event.target;
  if (target.dataset.modifiable === "true") {
    picManagerType.value = target.dataset.type;
    picManagerTargetId.value = target.dataset.targetId;
    picManagerResizable.value = target.dataset.resizable === "true";
    picManagerVisible.value = true;
  }
};

onMounted(() => {
  document.addEventListener("click", handlePicClick);

  let lastFlagSrc = '/preset/GER.png';
  setInterval(() => {
    const flagWindowImg = document.querySelector('#flagwindow #flagpic');
    const mainFlag = document.getElementById('master-flag');
    if (flagWindowImg && mainFlag) {
      const currentSrc = flagWindowImg.src;
      if (currentSrc !== lastFlagSrc) {
        lastFlagSrc = currentSrc;
        mainFlag.src = currentSrc;
      }
    }
  }, 200);
});

const handleClose = () => {
  new Howl({ src: ["/sfx/click_window_close.wav"], volume: 1 }).play();
};

const handleShow = () => {
  new Howl({ src: ["/sfx/click_window_open.wav"], volume: 1 }).play();
};
</script>

<template>
  <div id="main-container" style="position: absolute; z-index: 8; user-select: none">
    
    <!-- ================= 左侧 ================= -->
    <div>
      <img id="leader-overlay" src="/template/diplo_leader_frame.png" data-modifiable="true" data-type="leader" data-resizable="false" style="position: relative; z-index: 2; top: 0px" data-target-id="leaderpic" />
      
      <div style="position: absolute; top: 12px; left: 12px; height: 62px; width: 106px; z-index: 0;">
        <img id="flag-overlay" src="/template/flag_overlay.png" data-modifiable="true" data-type="flag" data-resizable="false" data-target-id="flagpic" :style="{ position: 'absolute', top: '0', left: '0', height: 'inherit', width: 'inherit', scale: 1.3, zIndex: 2 }" />
        <img id="master-flag" class="pic" 
             src="/preset/GER.png"
             style="position: absolute; top: 0; left: 0; height: inherit; width: inherit;" />
      </div>
      
      <div style="position: absolute; top: 75px; left: 7px; height: 160px; width: 120px; z-index: 1;">
        <img id="leaderpic" class="pic" src="/preset/Portrait_GER_Reichstag_Emergency_Council.png" style="position: absolute; top: 0; left: 0; height: inherit; width: inherit;" />
      </div>
      <div style="position: absolute; top: 79px; left: 7px; height: 160px; width: 120px; z-index: 0;">
        <img src="/template/Leader_Background.png" style="position: absolute; top: -4px; left: 0; height: inherit; width: inherit;" />
      </div>
    </div>

    <!-- ================= 右侧 ================= -->
    <div>
      <img src="/template/diplo_upper_win_bg.png" style="position: absolute; z-index: 2; left: 125px; top: 4px" />
      
      <div style="position: absolute; top: 42px; left: 177px; z-index: 3; display: flex; justify-content: center; align-items: center;">
        <img id="ideologypic" class="pic" src="/preset/national_socialism_group.png" data-modifiable="true" data-type="ideology" data-resizable="true" data-initial-scale="1" :style="{ position: 'absolute', scale: 1 }" data-target-id="ideologypic" />
      </div>
      <div style="position: absolute; top: 43px; left: 485px; z-index: 3; display: flex; justify-content: center; align-items: center;">
        <img id="factionpic" class="pic" src="/preset/Leader-Einheitspakt.png" data-modifiable="true" data-type="faction" data-resizable="true" data-initial-scale="0.8" :style="{ position: 'absolute', scale: 0.8 }" data-target-id="factionpic" />
      </div>
      
      <div style="position: absolute; top: 202px; left: 179px; z-index: 5; display: flex; justify-content: center; align-items: center;">
        <img id="focuspic" class="pic" src="/preset/goal_unknown.png" data-modifiable="true" data-type="focus" data-resizable="true" data-initial-scale="0.9" :style="{ position: 'absolute', scale: 0.9 }" data-target-id="focuspic" />
      </div>

      <!-- 饼图 -->
      <div style="position: absolute; top: 68px; left: 129px; width: 100px; height: 100px; z-index: 1; pointer-events: none;">
        <Pie class="piechart" style="position: absolute; top: 4px; left: 0px; width: 100px; height: 100px; background: none; scale: 0.6; z-index: 1;" v-model="state.chartData" />
      </div>
      <img src="/template/pol_piechart_overlay_63x63.png" style="position: absolute; top: 68px; left: 129px; width: 63px; height: 63px; scale: 1.0; z-index: 5;" @click="editorVisible = true" />

      <!-- =================================================================== -->
      <!-- 👑 最终物理免疫版：彻底屏蔽浏览器的穿透选中！                     -->
      <!-- =================================================================== -->
      
      <!-- 顶部文字：国名、阵营、领导人 -->
      <div style="
          z-index: 3; 
          position: absolute; 
          left: 215px; 
          top: 25px; 
          font-family: Bombard, FZWH; 
          font-size: 14px; 
        ">
        <!-- 1. 国名 -->
        <div style="position: relative; width: max-content; height: 20px;">
          <!-- 底层：纯透明黑边（绝对不能被点到） -->
          <p class="text" style="
              position: absolute; top: -8px; left: 0; width: max-content;
              color: transparent; -webkit-text-stroke: 3px #000000;
              pointer-events: none; margin: 0; z-index: 0;
            ">{{ textLinesTop[0] }}</p>
          <!-- 上层：实际点击和显示层，永远盖在最上面！ -->
          <p id="country" class="text" contenteditable="true" style="
              position: relative; top: -8px; left: 0; width: max-content;
              color: #ffffff; margin: 0; outline: none; z-index: 2;
            "
            @input="(e) => textLinesTop[0] = e.target.innerText"
          >{{ textLinesTop[0] }}</p>
        </div>

        <!-- 2. 阵营 -->
        <div style="position: relative; width: max-content; height: 20px;">
          <p class="text" style="
              position: absolute; top: -10px; left: 0; width: max-content;
              color: transparent; -webkit-text-stroke: 3px #000000;
              pointer-events: none; margin: 0; z-index: 0;
            ">{{ textLinesTop[1] }}</p>
          <p id="factiontext" class="text" contenteditable="true" style="
              position: relative; top: -10px; left: 0; width: max-content;
              color: #ffffff; margin: 0; outline: none; z-index: 2;
            "
            @input="(e) => textLinesTop[1] = e.target.innerText"
          >{{ textLinesTop[1] }}</p>
        </div>

        <!-- 3. 领导人 -->
        <div style="position: relative; width: max-content; height: 20px;">
          <p class="text" style="
              position: absolute; top: -12px; left: 0; width: max-content;
              color: transparent; -webkit-text-stroke: 3px #000000;
              pointer-events: none; margin: 0; z-index: 0;
            ">{{ textLinesTop[2] }}</p>
          <p id="leader" class="text" contenteditable="true" style="
              position: relative; top: -12px; left: 0; width: max-content;
              color: #ffffff; margin: 0; outline: none; z-index: 2;
            "
            @input="(e) => textLinesTop[2] = e.target.innerText"
          >{{ textLinesTop[2] }}</p>
        </div>
      </div>

      <!-- 下部文字：党派、意识形态、选举、未知国策 -->
      <div style="
          position: absolute;
          top: 95px;
          left: 238px;
          font-family: Aldrich, FZRui;
          font-size: 17px;
          z-index: 3;
          vertical-align: middle;
        ">
        <div style="position: relative; display: inline-block;">
          
          <!-- 1. 党派 -->
          <div style="position: relative; width: max-content; height: 24px;">
            <p id="party_bg" class="text" style="
                position: absolute; top: 0; left: 0; width: max-content;
                color: transparent; -webkit-text-stroke: 3px #000000;
                pointer-events: none; margin: 0; z-index: 0;
              ">{{ textLines[0] }}</p>
            <p id="party" class="text" contenteditable="true" style="
                position: relative; top: 0; left: 0; width: max-content;
                color: #c6c6c8; margin: 0; outline: none; z-index: 2;
              "
              @input="(e) => textLines[0] = e.target.innerText"
            >{{ textLines[0] }}</p>
          </div>
          
          <!-- 2. 意识形态 -->
          <div style="position: relative; width: max-content; height: 24px;">
            <p id="ideologytext_bg" class="text" style="
                position: absolute; top: 0; left: 0; width: max-content;
                color: transparent; -webkit-text-stroke: 3px #000000;
                pointer-events: none; margin: 0; z-index: 0;
              ">{{ textLines[1] }}</p>
            <p id="ideologytext" class="text" contenteditable="true" style="
                position: relative; top: 0; left: 0; width: max-content;
                color: #c6c6c8; margin: 0; outline: none; z-index: 2;
              "
              @input="(e) => textLines[1] = e.target.innerText"
            >{{ textLines[1] }}</p>
          </div>
          
          <!-- 3. 选举 -->
          <div style="position: relative; width: max-content; height: 24px;">
            <p id="election_bg" class="text" style="
                position: absolute; top: 0; left: 0; width: max-content;
                color: transparent; -webkit-text-stroke: 3px #000000;
                pointer-events: none; margin: 0; z-index: 0;
              ">{{ textLines[2] }}</p>
            <p id="election" class="text" contenteditable="true" style="
                position: relative; top: 0; left: 0; width: max-content;
                color: #c6c6c8; margin: 0; outline: none; z-index: 2;
              "
              @input="(e) => textLines[2] = e.target.innerText"
            >{{ textLines[2] }}</p>
          </div>
          
        </div>
        
        <!-- 4. 未知国策 -->
        <div style="position: absolute; width: 260px; display: flex; left: 0; top: 94px; justify-content: center; align-items: center;">
          <div style="position: relative; width: max-content;">
            <p id="focustext_bg" class="text" style="
                position: absolute; top: 0; left: 0; width: max-content;
                color: transparent; -webkit-text-stroke: 3px #000000; text-align: center;
                pointer-events: none; margin: 0; z-index: 0;
              ">{{ focusText }}</p>
            <p id="focustext" class="text" contenteditable="true" style="
                position: relative; top: 0; left: 0; width: max-content;
                color: #c6c6c8; text-align: center; margin: 0; outline: none; z-index: 2;
              "
              @input="(e) => focusText = e.target.innerText"
            >{{ focusText }}</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
  
  <!-- 弹窗 -->
  <Dialog v-model:visible="editorVisible" header="饼图编辑"
    :style="{ width: '600px', fontFamily: 'Aldrich, FZRui', opacity: 0.9 }"
    @hide="handleClose" @show="handleShow">
    <ChartEditor v-model="state.chartData" />
  </Dialog>
  <PicManager v-model:visible="picManagerVisible" :type="picManagerType" :targetId="picManagerTargetId"
    :resizable="picManagerResizable" @update:pic="updatePicture" />
</template>