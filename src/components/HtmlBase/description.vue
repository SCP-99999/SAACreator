<script setup>
import { onMounted, nextTick, inject } from "vue";

let zIndexCounter = 10;

// ✅ 注入所有数据
const currentFlag = inject('currentFlag', '/preset/GER.png');
const textLinesTop = inject('textLinesTop');
const descBodyText = inject('descBodyText');
// ✨ 新增：注入外号
const leaderNickname = inject('leaderNickname', '');

const prioritizeWindow = (event) => {
  const target = event.target.closest(".draggable");
  if (target) {
    zIndexCounter++;
    target.style.zIndex = zIndexCounter;
  }
};

const adjustContainerSize = async () => {
  await nextTick(); 
  const container = document.getElementById("descwindow");
  const content = document.getElementById("desc");

  if (container && content) {
    const contentRect = content.getBoundingClientRect();
    container.style.width = contentRect.width + 2 + "px"; 
    container.style.height = contentRect.height + 2 + "px"; 
  }
};

onMounted(async () => {
  const windowElement = document.getElementById("descwindow");
  windowElement.addEventListener("mousedown", prioritizeWindow);
  await nextTick();
  setTimeout(adjustContainerSize, 0);
});

onMounted(() => {
  const content = document.getElementById("desc");
  if (content) {
    const observer = new MutationObserver(() => {
      setTimeout(adjustContainerSize, 50);
    });
    observer.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
});
</script>

<template>
  <div class="draggable resizable" id="descwindow"
    style="position: absolute; z-index: 4; display: inline-block; background-color: transparent; border: none;">
    
    <img src="/template/frame.png" 
         style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; display: block; object-fit: fill;">

    <div id="desc" class="text" style="
      position: relative;
      display: inline-block;
      z-index: 1;
      font-family: Aldrich, FZRui;
      font-size: 13px;
      line-height: 16px;
      background-color: transparent;
      width: 305px;
      padding: 12px 15px; 
      min-height: min-content;
      color: #c2ac89;
      white-space: pre-wrap;
      outline: none;
      pointer-events: none;
    ">
      <!-- 第一行：领袖名字（黄色，支持 HTML） -->
      <span style="color: #cccc00" v-html="textLinesTop[2]"></span><br />
      
      <!-- 第二行：小旗帜 + 国名（黄色）+ 的领导人（灰色，国名支持 HTML） -->
      <img :src="currentFlag" style="height: 14px; width: auto; vertical-align: middle; display: inline-block; margin-right: 4px;" />
      <span style="color: #ffcc00;" v-html="textLinesTop[0]"></span>
      <span style="color: #c6c6c8;">的领导人</span>
      <br />

      <!-- 第三行：空行（如果外号存在） -->
      <br v-if="leaderNickname" />

      <!-- 第四行：外号（黄色，如果为空则整行不渲染，支持 HTML） -->
      <span v-if="leaderNickname" style="color: #cccc00;" v-html="leaderNickname"></span>
      <br v-if="leaderNickname" />

      <!-- 第五行：分隔线 -->
      --------------<br />
      
      <!-- 第六行及以后：人物介绍正文（已经使用了 v-html，保持原样） -->
      <span v-html="descBodyText" style="white-space: pre-wrap;"></span>
    </div>
  </div>
</template>