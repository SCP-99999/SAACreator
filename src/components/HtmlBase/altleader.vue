<script setup>
import { inject } from "vue";
import { state } from "@/utils/state.js";
import { Howl } from "howler";

const props = defineProps({
  draggable: Boolean
});

const altLeaderTitle = inject('altLeaderTitle');
const altLeaderName = inject('altLeaderName');

const playClickSound = () => {
  new Howl({
    src: ["/sfx/click_province_01.wav"],
    volume: 0.8,
  }).play();
};

const handlePicClick = (event) => {
  event.stopPropagation();
  playClickSound();

  // ✅ 直接触发全局的 PicManager
  state.picManagerType = "leader"; 
  state.picManagerTargetId = "altleaderpic";
  state.picManagerResizable = false;
  state.picManagerVisible = true;
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
            position: relative; top: 0; left: 0; width: 100%; text-align: center;
            color: #ffffff; font-family: Bombard, FZWH; font-size: 16px; margin: 0;
            pointer-events: none; paint-order: stroke; -webkit-text-stroke: 3px #000000; text-stroke: 3px #000000;
          " v-html="altLeaderTitle">
        </p>
      </div>

      <div style="position: absolute; top: 34px; left: 16px; width: 128px; height: 160px; z-index: 0;">
        <img src="/template/Leader_Background.png" 
             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" />
      </div>

      <div style="position: absolute; top: 34px; left: 16px; width: 128px; height: 160px; z-index: 0;">
        <!-- ✅ 绑定 state 中的 altLeaderImageSrc -->
        <img id="altleaderpic" class="pic" 
             :src="state.altLeaderImageSrc || '/template/Leader_Background.png'"
             style="
               width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;
             " 
             data-modifiable="true" 
             data-type="leader"
             data-resizable="false" 
             data-target-id="altleaderpic"
             @click.stop="handlePicClick" />
      </div>

      <div style="position: absolute; bottom: 8%; left: 0; width: 100%; text-align: center; z-index: 2;">
        <p style="
            position: relative; top: 0; left: 0; width: 100%; text-align: center;
            color: #ffffff; font-family: Bombard, FZWH; font-size: 16px; margin: 0;
            pointer-events: none; paint-order: stroke; -webkit-text-stroke: 3px #000000; text-stroke: 3px #000000;
          " v-html="altLeaderName">
        </p>
      </div>

      <div v-if="props.draggable"
           class="drag-handle-area"
           style="
             position: absolute; bottom: 0px; left: 0px; width: 30px; height: 30px;
             cursor: grab; z-index: 10; border-radius: 4px; display: flex; justify-content: center;
             align-items: center; font-size: 16px; color: #fff; transition: background 0.2s, opacity 0.2s;
           ">
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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