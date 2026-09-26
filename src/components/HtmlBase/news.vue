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
  const windowElement = document.getElementById("newswindow");
  windowElement.addEventListener("mousedown", prioritizeWindow);
});
</script>

<template>
  <div class="draggable" id="newswindow">
    <div class="news-content">
      <!-- 背景图（可替换，通过报头区域点击触发） -->
      <img id="newsbg" class="pic" src="/template/news/event_news_bg.png"
        style="position: relative; width: 480px; height: 595px;" 
        data-modifiable="true" 
        data-type="newsbg"
        data-resizable="false" 
        data-target-id="newsbg" />

      <!-- 新闻配图层 -->
      <img id="newspic" class="pic" src="/preset/GER_german_civil_war.png"
        style="
          position: absolute;
          top: 160px;
          left: 15px;
          width: 145px;
          height: 400px;
        " 
        data-modifiable="true" 
        data-type="news"
        data-resizable="false" 
        data-target-id="newspic" />

      <!-- ================= 排版精调区 ================= -->
      
      <!-- 标题 -->
      <div style="
          position: absolute;
          display: flex;
          left: 40px;
          top: 150px;
          justify-content: center;
          align-items: center;
          inline-size: 400px;
        ">
        <p id="newstitle" class="text" contenteditable="true" style="
            position: absolute;
            color: #000000;
            text-align: center;
            font-family: 'Microsoft YaHei', sans-serif;
            font-size: 20px;
            width: 100%;
            outline: none;
          ">
          德国内战
        </p>
      </div>

      <!-- 正文 -->
      <span id="newsbody" class="text" contenteditable="true"
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
        ">在阿道夫·希特勒去世后，德国旋即陷入混乱。尽管元首指定了合法的继任者，但德国国内的强大派系已经开始拿起武器，互相对抗，打算将国家引导向自己的期望。国家已被分裂，整支整支的驻军无视来自日耳曼尼亚的命令，并倒向他们选择的继任者。虽然局势的严重程度尚不清楚，但据估计，德国要么正在面临要么已经经历了中央权威的彻底崩溃。<br /><br />
        虽然还不大清楚德国东部领地的命运将会如何，但日耳曼尼亚与她的殖民领之间突然断绝了联系，这已经引发了这些地区是否也会自行寻找出路的猜测。然而，有一点毫无疑问，这个欧洲巨人的崩溃已经使整个欧陆陷入分崩离析之中。</span>

      <!-- 底部按钮 -->
      <button id="newsbutton" class="button text" contenteditable="true" style="
          position: absolute;
          top: 500px;
          left: 125px;
          transition: 0.2s;
          background: url(&quot;/template/news/event_option_entry.png&quot;) no-repeat;
          border: none;
          width: 352px;
          height: 52px;
          font-family: 'Microsoft YaHei', sans-serif;
          font-size: 16px;
          color: #000000;
        ">
        帝国的终结。
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
  transform: scale(0.85);
  transform-origin: top left;
}
</style>