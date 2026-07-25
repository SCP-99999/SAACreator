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
  const windowElement = document.getElementById("flagwindow");
  if (windowElement) {
    windowElement.addEventListener("mousedown", prioritizeWindow);
  }
});
</script>

<template>
  <!-- 
    外层容器：永远锁死宽度，永远锁死宽高比！
    aspect-ratio 确保无论怎么缩放，外壳绝对不变形。
  -->
  <div class="draggable resizable" id="flagwindow"
       :draggable="props.draggable"
       style="
         position: absolute; 
         z-index: 4; 
         width: 360px; 
         aspect-ratio: 360 / 225; /* ⭐ 原版比例，严丝合缝！ */
         background-color: transparent;
       ">
    
    <!-- 
      底图：填满整个固定外壳，无论怎么缩放都不变形 
    -->
    <img src="/template/flag_frame.png" 
         style="
           position: absolute; 
           top: 0; 
           left: 0; 
           width: 100%; 
           height: 100%; 
           pointer-events: none; 
           z-index: 1;" 
    />
    
    <!-- 
      旗帜层：依靠 Flexbox 在固定外壳的壳子里居中，
      并且使用 `object-fit: contain` 保持旗帜真实比例不变形。
    -->
    <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px; /* ⭐ 如果发现边框遮住了旗子，调大或调小这里 */
        box-sizing: border-box;
        z-index: 0;
      ">
      
      <img id="flagpic" class="pic" 
           src="/preset/GER.png"
           @update:pic="(newUrl) => { 
              window.dispatchEvent(new CustomEvent('flagChanged', { detail: newUrl }));
           }"
           style="
             width: 100%; 
             height: 100%; 
             object-fit: contain; /* ⭐ 保持旗帜比例，填满内框！ */
           " 
           data-modifiable="true" 
           data-type="flag"
           data-resizable="false" 
           data-target-id="flagpic" />
    </div>

  </div>
</template>