<script setup>
import { inject, ref, onMounted, onBeforeUnmount } from "vue";
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
let picManagerOpenTime = 0;

const altLeaderTitle = inject('altLeaderTitle');
const altLeaderName = inject('altLeaderName');

const playClickSound = () => {
  new Howl({
    src: ["/sfx/click_province_01.wav"],
    volume: 0.8,
  }).play();
};

const handlePicClick = (event) => {
  // 防止重复触发
  const now = Date.now();
  if (now - picManagerOpenTime < 300) return;
  
  const distance = Math.sqrt(
    Math.pow(mousePosition.up.x - mousePosition.down.x, 2) +
    Math.pow(mousePosition.up.y - mousePosition.down.y, 2)
  );

  if (distance > 5) return;

  const target = event.currentTarget;
  if (target && target.dataset.modifiable === "true") {
    event.stopPropagation();
    event.preventDefault();
    
    playClickSound();
    picManagerType.value = target.dataset.type;
    picManagerTargetId.value = target.dataset.targetId;
    picManagerResizable.value = target.dataset.resizable === "true";
    picManagerVisible.value = true;
    picManagerOpenTime = now;
  }
};

// 处理图片更新
const handlePicUpdate = (updateData) => {
  if (updateData.id === "altleaderpic") {
    const img = document.getElementById("altleaderpic");
    if (img && updateData.url) {
      img.src = updateData.url;
      // 添加图片切换动画
      img.style.transition = 'opacity 0.3s ease';
      img.style.opacity = '0';
      setTimeout(() => {
        img.style.opacity = '1';
      }, 50);
    }
  }
};

const prioritizeWindow = (event) => {
  const target = event.target.closest(".draggable");
  if (target) {
    zIndexCounter++;
    target.style.zIndex = zIndexCounter;
  }
};
</script>

<template>
  <Transition name="altleader-fade">
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
            paint-order: stroke;
            -webkit-text-stroke: 3px #000000;
            text-stroke: 3px #000000;
          " v-html="altLeaderTitle">
        </p>
      </div>

      <div style="
          position: absolute;
          top: 34px;        
          left: 16px;       
          width: 128px;     
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
          top: 34px;        
          left: 16px;       
          width: 128px;     
          height: 160px;    
          z-index: 0;
        ">
        <img id="altleaderpic" class="pic" 
             src="/template/Leader_Background.png"
             style="
               width: 100%; 
               height: 100%; 
               object-fit: cover;
               transition: opacity 0.3s ease;
             " 
             data-modifiable="true" 
             data-type="leader"
             data-resizable="false" 
             data-target-id="altleaderpic"
             @click.stop="handlePicClick" />
      </div>

      <div style="position: absolute; bottom: 8%; left: 0; width: 100%; text-align: center; z-index: 2;">
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
            paint-order: stroke;
            -webkit-text-stroke: 3px #000000;
            text-stroke: 3px #000000;
          " v-html="altLeaderName">
        </p>
      </div>

      <!-- 悬浮拖拽手柄区域 -->
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

      <!-- 图片管理器 -->
      <PicManager
        v-if="picManagerVisible"
        :visible="picManagerVisible"
        :type="picManagerType"
        :target-id="picManagerTargetId"
        :resizable="picManagerResizable"
        @update:visible="picManagerVisible = $event"
        @update:pic="handlePicUpdate"
      />
    </div>
  </Transition>
</template>

<style scoped>
/* AltLeader 淡入淡出动画 */
.altleader-fade-enter-active,
.altleader-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.altleader-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.altleader-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>