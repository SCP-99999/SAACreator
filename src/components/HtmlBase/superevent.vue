<script setup>
import { ref, onMounted } from "vue";
import { mousePosition } from "../../composables/useMousePosition.js";

const picManagerVisible = ref(false);
const picManagerType = ref("");
const picManagerTargetId = ref("");
const picManagerResizable = ref(false);
let zIndexCounter = 10;

const handlePicClick = (event) => {
  const distance = Math.sqrt(
    Math.pow(mousePosition.up.x - mousePosition.down.x, 2) +
    Math.pow(mousePosition.up.y - mousePosition.down.y, 2)
  );

  if (distance > 5) {
    return;
  }

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
  if (target) {
    zIndexCounter++;
    target.style.zIndex = zIndexCounter;
  }
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
    <!-- ⭐ 标题：单标签 + 2px 四周硬偏移克隆，绝不重影     -->
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
      <p id="supertitle" class="text" contenteditable="true" style="
          position: relative;
          color: #c6c6c8;
          font-family: Aldrich, FZRui;
          font-size: 32px;
          text-align: center;
          margin: 0;
          text-shadow: 
            -2px -2px 0 #000000,
             2px -2px 0 #000000,
            -2px  2px 0 #000000,
             2px  2px 0 #000000;
        ">
        德国内战
      </p>
    </div>

    <!-- ===================================================== -->
    <!-- ⭐ 按钮：单标签 + 2px 四周硬偏移克隆                -->
    <!-- ===================================================== -->
    <div style="position: absolute; top: 845px; left: 325px; z-index: 5;">
      <button id="superbutton" class="button text" contenteditable="true" style="
          position: relative;
          width: 359px;
          height: 36px;
          background: url(&quot;/template/spacebar.png&quot;) no-repeat;
          border: none;
          scale: 1.6;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 21px;
          text-shadow: 
            -2px -2px 0 #000000,
             2px -2px 0 #000000,
            -2px  2px 0 #000000,
             2px  2px 0 #000000;
        ">
        风云已起
      </button>
    </div>

    <!-- ===================================================== -->
    <!-- ⭐ 名言：终极单标签大法，无惧任何回车换行！         -->
    <!-- ===================================================== -->
    <div style="position: absolute; left: 70px; top: 555px; z-index: 5;">
      <p id="supermotto" class="text" contenteditable="true" style="
          position: relative;
          width: 900px;
          text-align: right;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 35px;
          white-space: pre-wrap;
          text-shadow: 
            -2px -2px 0 #000000,
             2px -2px 0 #000000,
            -2px  2px 0 #000000,
             2px  2px 0 #000000;
        ">
      因此，所有人都必须认识到这一点：<br />与国家的存在相比，他的自我毫无意义。
      <br />
      - 阿道夫·希特勒
</p>
    </div>

  </div>
</template>