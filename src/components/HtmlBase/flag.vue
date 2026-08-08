<script setup>
import { ref, onMounted } from "vue";
import { mousePosition } from "../../composables/useMousePosition.js";

const props = defineProps({
  draggable: Boolean
});

const picManagerVisible = ref(false);
const picManagerType = ref("");
const picManagerTargetId = ref("");
const picManagerResizable = ref(false);
let zIndexCounter = 10;

const frameWidth = ref(360);
const frameHeight = ref(225);

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

const onFlagImageLoad = (e) => {
  const img = e.target;
  const ratio = img.naturalWidth / img.naturalHeight;
  const baseHeight = 225;
  frameWidth.value = Math.round(baseHeight * ratio);
  frameHeight.value = baseHeight;
};

onMounted(() => {
  document.addEventListener("click", handlePicClick);
});
</script>

<template>
  <div class="resizable" id="flagwindow"
       :style="{
         position: 'absolute', 
         zIndex: 4, 
         width: frameWidth + 'px',
         height: frameHeight + 'px',
         backgroundColor: 'transparent'
       }"
  >
    <img src="/template/flag_frame.png" 
         style="
           position: absolute; 
           top: 0; 
           left: 7px; 
           width: 97%; 
           height: 100%; 
           pointer-events: none; 
           z-index: 1;
         " 
    />
    
    <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px; 
        box-sizing: border-box;
        z-index: 0;
      "
    >
      <img id="flagpic" class="pic" 
           src="/preset/GER.png"
           @load="onFlagImageLoad"
           style="
             width: 100%; 
             height: 100%; 
             object-fit: contain;
           " 
           data-modifiable="true" 
           data-type="flag"
           data-resizable="false" 
           data-target-id="flagpic" 
      />
    </div>

  </div>
</template>