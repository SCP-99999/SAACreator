<script setup>
import { ref, onMounted } from "vue";
import { mousePosition } from "../../composables/useMousePosition.js";
import PicManager from "@/components/Controller/PicManager.vue";
import { Howl } from "howler";

const props = defineProps({
  draggable: Boolean
});

const picManagerVisible = ref(false);
const picManagerType = ref("");
const picManagerTargetId = ref("");
const picManagerResizable = ref(false);
let zIndexCounter = 10;

const playClickSound = () => {
  new Howl({
    src: ["/sfx/click_province_01.wav"],
    volume: 0.8,
  }).play();
};

const handlePicClick = (event) => {
  const distance = Math.sqrt(
    Math.pow(mousePosition.up.x - mousePosition.down.x, 2) +
    Math.pow(mousePosition.up.y - mousePosition.down.y, 2)
  );

  if (distance > 5) return;

  const target = event.target;
  if (target.dataset.modifiable === "true") {
    playClickSound();
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

const handleMouseDown = (e) => {
  const target = e.target.closest(".draggable");
  if (target) {
    if (document.activeElement && document.activeElement.contentEditable === "true") {
      document.activeElement.blur();
    }
    prioritizeWindow(e);
  }
};

onMounted(() => {
  document.addEventListener("click", handlePicClick);
  const windowElement = document.getElementById("altleaderwindow");
  if (windowElement) {
    windowElement.addEventListener("mousedown", handleMouseDown);
  }
});
</script>

<template>
  <div class="draggable resizable" id="altleaderwindow"
       :draggable="props.draggable"
       style="
         position: absolute; 
         z-index: 4; 
         width: 160px;    
         height: 240px;   
         background-color: transparent;
       ">
    
    <!-- 1. 外层边框底图 -->
    <img src="/template/altleader_frame.png" 
         style="
           position: absolute; 
           top: 0; 
           left: 0; 
           width: 100%; 
           height: 100%; 
           pointer-events: none; 
           z-index: 1;" 
    />

    <!-- 2. 职位文字 -->
    <div style="position: absolute; top: 5%; left: 0; width: 100%; text-align: center; z-index: 2;">
      <!-- 底层黑边 -->
      <p class="text" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          color: transparent;
          -webkit-text-stroke: 3px #000000;
          font-family: Bombard, FZWH;
          font-size: 16px;
          margin: 0;
          pointer-events: none;
        ">
        副总统
      </p>
      <!-- 上层白字 -->
      <p contenteditable="true"
         @focus="playClickSound"
         style="
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 16px;
          margin: 0;
          outline: none;
        ">
        副总统
      </p>
    </div>

    <!-- 3. ✅ 底层背景层（Leader_Background.png 相框底纹） -->
    <!-- 放在头像层的下面，作为填充 -->
    <div style="
        position: absolute;
        top: 38px;        
        left: 15px;       
        width: 130px;     
        height: 160px;    
        z-index: 0;
      ">
      <img src="/template/Leader_Background.png" 
           style="
             position: absolute;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             object-fit: cover;
           " />
    </div>

    <!-- 4. ✅ 独立头像层（盖在背景层之上，支持点击替换） -->
    <div style="
        position: absolute;
        top: 38px;        
        left: 15px;       
        width: 130px;     
        height: 165px;    
        z-index: 0;
      ">
      <img id="altleaderpic" class="pic" 
           src="\public\template\Leader_Background.png"
           style="
             width: 100%; 
             height: 100%; 
             object-fit: cover; 
           " 
           data-modifiable="true" 
           data-type="altleader"
           data-resizable="false" 
           data-target-id="altleaderpic" />
    </div>

    <!-- 5. 姓名文字 -->
    <div style="position: absolute; bottom: 8%; left: 0; width: 100%; text-align: center; z-index: 2;">
      <!-- 底层黑边 -->
      <p class="text" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          color: transparent;
          -webkit-text-stroke: 3px #000000;
          font-family: Bombard, FZWH;
          font-size: 16px;
          margin: 0;
          pointer-events: none;
        ">
        人名
      </p>
      <!-- 上层白字 -->
      <p contenteditable="true"
         @focus="playClickSound"
         style="
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 16px;
          margin: 0;
          outline: none;
        ">
        人名
      </p>
    </div>

  </div>
</template>