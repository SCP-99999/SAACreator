<script setup>
import { ref, onMounted, inject } from "vue"; // ✅ 引入 inject
import { mousePosition } from "../../composables/useMousePosition.js";

const picManagerVisible = ref(false);
const picManagerType = ref("");
const picManagerTargetId = ref("");
const picManagerResizable = ref(false);
let zIndexCounter = 10;

// ✅ 注入侧边栏数据，文字全部由这里接管
const superTitle = inject('superTitle', '德国内战');
const superMotto = inject('superMotto', '因此，所有人都必须认识到这一点：\n与国家的存在相比，他的自我毫无意义。\n- 阿道夫·希特勒');
const superButtonText = inject('superButtonText', '风云已起');

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

const prioritizeWindow = (event) => {
  const target = event.target.closest(".draggable");
  if (target) { zIndexCounter++; target.style.zIndex = zIndexCounter; }
};

onMounted(() => {
  document.addEventListener("click", handlePicClick);
  const windowElement = document.getElementById("superwindow");
  windowElement.addEventListener("mousedown", prioritizeWindow);
});
</script>

<template>
  <div class="draggable" id="superwindow" style="
      position: absolute;
      z-index: 4;
      scale: 0.55;
      left: -235px;
      top: -200px;
    ">
    <img src="/template/super_frame.png" style="position: relative; z-index: 1" data-modifiable="true" data-type="super"
      data-resizable="false" data-target-id="superpic" />
      
    <div style="
        position: absolute;
        top: 105px;
        left: 35px;
        width: 950px;
        height: 715px;
      ">
      <img id="superpic" class="pic" src="/preset/german_civil_war.png"
        style="height: inherit; width: inherit; z-index: 0" />
    </div>

    <!-- ===================================================== -->
    <!-- ⭐ 标题：纯物理叠层黑边，侧边栏控制文字              -->
    <!-- ===================================================== -->
    <div style="
        position: absolute;
        display: flex;
        left: 230px;
        top: 19px;
        justify-content: center;
        align-items: center;
        inline-size: 570px;
        z-index: 5;
      ">
      <!-- 底层黑边 (绝对不被点到) -->
      <p style="
          position: absolute;
          color: transparent;
          -webkit-text-stroke: 3px #000000;
          font-family: Aldrich, FZRui;
          font-size: 32px;
          text-align: center;
          margin: 0;
          pointer-events: none;
        " v-html="superTitle">
      </p>
      <!-- 上层白字 -->
      <p style="
          position: relative;
          color: #c6c6c8;
          font-family: Aldrich, FZRui;
          font-size: 32px;
          text-align: center;
          margin: 0;
          pointer-events: none;
        " v-html="superTitle">
      </p>
    </div>

    <!-- ===================================================== -->
    <!-- ⭐ 按钮：纯物理叠层黑边，侧边栏控制文字              -->
    <!-- ===================================================== -->
    <div style="position: absolute; top: 845px; left: 325px; z-index: 5;">
      <!-- 底层黑边 -->
      <div style="
          position: absolute;
          width: 340px;
          height: 36px;
          background: url(&quot;/template/spacebar.png&quot;) no-repeat;
          border: none;
          scale: 1.6;
          color: transparent;
          -webkit-text-stroke: 3px #000000;
          font-family: Bombard, FZWH;
          font-size: 21px;
          text-align: center;
          line-height: 36px;
          pointer-events: none;
        " v-html="superButtonText">
      </div>
      <!-- 上层白字 -->
      <div style="
          position: relative;
          width: 340px;
          height: 36px;
          background: url(&quot;/template/spacebar.png&quot;) no-repeat;
          border: none;
          scale: 1.6;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 21px;
          text-align: center;
          line-height: 36px;
          pointer-events: none;
        " v-html="superButtonText">
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- ⭐ 名言：纯物理叠层黑边，侧边栏控制文字              -->
    <!-- ===================================================== -->
    <div style="position: absolute; left: 60px; top: 557px; z-index: 5;">
      <!-- 底层黑边 -->
      <p style="
          position: absolute;
          width: 900px;
          text-align: right;
          color: transparent;
          -webkit-text-stroke: 3px #000000;
          font-family: Bombard, FZWH;
          font-size: 35px;
          white-space: pre-wrap;
          pointer-events: none;
        " v-html="superMotto">
      </p>
      <!-- 上层白字 -->
      <p style="
          position: relative;
          width: 900px;
          text-align: right;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 35px;
          white-space: pre-wrap;
          pointer-events: none;
        " v-html="superMotto">
      </p>
    </div>
  </div>
</template>