<script setup>
import { inject, ref, onMounted } from "vue";
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

const altLeaderTitle = inject('altLeaderTitle');
const altLeaderName = inject('altLeaderName');

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

onMounted(() => {
  document.addEventListener("click", handlePicClick);
});
</script>

<template>
  <div class="resizable" id="altleaderwindow"
       style="
         position: absolute; 
         z-index: 4; 
         width: 160px;    
         height: 240px;   
         background-color: transparent;
       ">
    
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

    <div style="position: absolute; top: 5%; left: 0; width: 100%; text-align: center; z-index: 2;">
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
        " v-html="altLeaderTitle">
      </p>
      <p style="
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 16px;
          margin: 0;
          pointer-events: none;
        " v-html="altLeaderTitle">
      </p>
    </div>

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

    <div style="
        position: absolute;
        top: 38px;        
        left: 15px;       
        width: 130px;     
        height: 165px;    
        z-index: 0;
      ">
      <img id="altleaderpic" class="pic" 
           src="/template/Leader_Background.png"
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

    <div style="position: absolute; bottom: 8%; left: 0; width: 100%; text-align: center; z-index: 2;">
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
        " v-html="altLeaderName">
      </p>
      <p style="
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 16px;
          margin: 0;
          pointer-events: none;
        " v-html="altLeaderName">
      </p>
    </div>

    <!-- ⭐ 悬浮拖拽手柄区域（默认透明，鼠标移上去才显示） -->
    <div v-if="props.draggable"
         class="drag-handle-area"
         style="
           position: absolute;
           bottom: 0px;
           left: 0px;
           width: 30px;
           height: 30px;
           cursor: grab;
           z-index: 10;
           border-radius: 4px;
           display: flex;
           justify-content: center;
           align-items: center;
           font-size: 16px;
           color: #fff;
           transition: background 0.2s, opacity 0.2s;
         "
    >

    </div>

  </div>
</template>