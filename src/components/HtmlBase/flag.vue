<script setup>
import { ref } from "vue";
import { state } from "@/utils/state.js";

const props = defineProps({
  draggable: Boolean
});

// ✅ 旗帜框缩放比例
const flagScale = 0.69;

const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0, ox: 0, oy: 0 });
const mousedownPos = ref({ x: 0, y: 0 });

const handleMouseDown = (e) => {
  mousedownPos.value = { x: e.clientX, y: e.clientY };

  // 只有 draggable 开启时才能拖动
  if (!props.draggable) {
    document.addEventListener("mouseup", handleMouseUp);
    return;
  }

  isDragging.value = true;
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
    ox: state.windows.flag.x,
    oy: state.windows.flag.y,
  };
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;
  const dx = e.clientX - dragStart.value.x;
  const dy = e.clientY - dragStart.value.y;
  state.windows.flag.x = dragStart.value.ox + dx;
  state.windows.flag.y = dragStart.value.oy + dy;
};

const handleMouseUp = (e) => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);

  const dx = e.clientX - mousedownPos.value.x;
  const dy = e.clientY - mousedownPos.value.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= 5) {
    state.picManagerType = "flag";
    state.picManagerTargetId = "flagpic";
    state.picManagerResizable = false;
    state.picManagerVisible = true;
  }
};
</script>

<template>
  <div 
    class="resizable" 
    id="flagwindow"
    :style="{
      position: 'absolute',
      zIndex: state.windows.flag.zIndex,
      left: state.windows.flag.x + 'px',
      top: state.windows.flag.y + 'px',
      background: 'transparent',
      display: 'inline-block',
      transform: `scale(${flagScale})`,
      transformOrigin: 'top left',
      userSelect: 'none',
    }"
    @mousedown="handleMouseDown"
  >
    <img src="/template/flag_frame.png" 
         style="display: block; position: relative; z-index: 1; pointer-events: none;" 
    />
    
    <div style="
        position: absolute;
        top: 15px;
        left: 12px;
        right: 10px;
        bottom: 10px;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;
      "
    >
      <img id="flagpic" class="pic" 
           :src="state.flagImageSrcCropped"
           style="
             position: absolute;
             width: 475px;
             height: 310px;
             objectFit: cover;
           "
           data-modifiable="true" 
           data-type="flag"
           data-resizable="false" 
           data-target-id="flagpic" 
      />
    </div>
  </div>
</template>