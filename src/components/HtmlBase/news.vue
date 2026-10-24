<script setup>
import { inject, onMounted } from "vue";

// ✅ 注入侧边栏数据
const newsTitle = inject('newsTitle', '德国内战');
const newsBody = inject('newsBody', '');
const newsButtonText = inject('newsButtonText', '帝国的终结。');

onMounted(() => {
  // 保留必要的挂载逻辑
});
</script>

<template>
  <div class="draggable" id="newswindow">
    <div class="news-content">
      <!-- 背景图 -->
      <img id="newsbg" class="pic" src="/template/news/event_news_bg.png"
        style="position: relative; width: 460px; height: 560px; top: 10px" 
        data-modifiable="true" 
        data-type="newsbg"
        data-resizable="false" 
        data-target-id="newsbg" />

      <!-- 新闻配图层 -->
      <img id="newspic" class="pic" src="/preset/GER_german_civil_war.png"
        style="
          position: absolute;
          top: 165px;
          left: 17px;
          width: 134px;
          height: 367px;
        " 
        data-modifiable="true" 
        data-type="news"
        data-resizable="false" 
        data-target-id="newspic" />

      <!-- ================= 排版精调区 ================= -->
      
      <!-- 标题（✅ 去掉了 contenteditable，加了 pointer-events: none） -->
      <div style="
          position: absolute;
          display: flex;
          left: 40px;
          top: 155px;
          justify-content: center;
          align-items: center;
          inline-size: 400px;
          pointer-events: none;
        ">
        <p id="newstitle" class="text" style="
            position: absolute;
            color: #000000;
            text-align: center;
            font-family: 'Microsoft YaHei', sans-serif;
            font-size: 20px;
            width: 100%;
            outline: none;
          ">
          {{ newsTitle }}
        </p>
      </div>

      <!-- 正文（✅ 去掉了 contenteditable，加了 pointer-events: none） -->
      <span id="newsbody" class="text"
        style="
          font-family: 'Microsoft YaHei', sans-serif;
          position: absolute;
          left: 170px;
          top: 170px;
          color: #000000;
          inline-size: 265px;
          text-align: left;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-line;
          outline: none;
          pointer-events: none;
        ">{{ newsBody }}</span>

      <!-- 底部按钮（✅ 去掉了 contenteditable，加了 pointer-events: none） -->
      <button id="newsbutton" class="button text" style="
          position: absolute;
          top: 480px;
          left: 105px;
          transition: 0.2s;
          background: url(&quot;/template/news/event_option_entry.png&quot;) no-repeat;
          border: none;
          width: 350px;
          height: 50px;
          font-family: 'Microsoft YaHei', sans-serif;
          font-size: 16px;
          color: #000000;
          pointer-events: none;
        ">
        {{ newsButtonText }}
      </button>
    </div>
  </div>
</template>

<style scoped>
#newswindow {
  position: absolute;
  z-index: 4;
  top: 50px;
  left: 45px;
  overflow: hidden;
}

.news-content {
  position: relative;
  width: 600px;
  height: 600px;
  transform: scale(0.9);
  transform-origin: top left;
}
</style>