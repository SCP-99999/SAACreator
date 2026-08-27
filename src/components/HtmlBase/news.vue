<script setup>
import { ref, onMounted } from "vue";
import { mousePosition } from "../../composables/useMousePosition.js";

// ================= 开发者调整区 =================
const newsWidth = ref(560);   // 调整整个 news 的宽度（px）
const newsHeight = ref(500);  // 调整整个 news 的高度（px）
const newsTop = ref(50);       // 调整整个 news 的顶部位置（px）
const newsLeft = ref(45);      // 调整整个 news 的左侧位置（px）
const newsScale = ref(1.0);  // 调整整个 news 的缩放比例（1 = 100%）
// ==============================================

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
  <!-- 
    对齐参考：报纸文字排版优化
    开发者可以通过调整 newsWidth、newsHeight、newsTop、newsLeft、newsScale 来控制整个 news 组件
  -->
  <div class="draggable" id="newswindow" 
    :style="{
      position: 'absolute', 
      zIndex: 4, 
      width: newsWidth + 'px', 
      height: newsHeight + 'px',
      top: newsTop + 'px',
      left: newsLeft + 'px',
      overflow: 'hidden'
    }">
    <div :style="{
      width: '600px',
      height: '600px',
      transform: 'scale(' + (newsWidth / 600 * newsScale) + ', ' + (newsHeight / 600 * newsScale) + ')',
      transformOrigin: 'top left',
      position: 'absolute',
      top: '0',
      left: '0'
    }">
      <img src="/template/news/event_news_bg.png" style="position: relative" />
      
      <!-- 新闻配图层 -->
      <img id="newspic" class="pic" src="/preset/GER_german_civil_war.png"
        style="
          position: absolute;
          top: 135px;
          left: 15px;
          width: 145px;
          height: 420px;
        " 
        data-modifiable="true" 
        data-type="news"
        data-resizable="false" 
        data-target-id="newspic" />

      <!-- ================= 排版精调区 ================= -->
      
      <!-- 标题：加大了字号，稍微加粗，更加醒目 -->
      <div style="
          position: absolute;
          display: flex;
          left: 50px;
          top: 116px;
          justify-content: center;
          align-items: center;
          inline-size: 400px;
        ">
        <p id="newstitle" class="text" contenteditable="true" :style="{
            position: 'absolute',
            color: '#000000',
            textAlign: 'center',
            fontFamily: 'Microsoft YaHei, sans-serif',
            fontSize: '17px',
            width: '100%',
            outline: 'none',
            transform: 'scale(' + (600 / newsWidth / newsScale) + ', ' + (600 / newsHeight / newsScale) + ')',
            transformOrigin: 'center'
          }">
          德国内战
        </p>
      </div>

      <!-- 正文：调整了左边距和上边距，行距更加宽松（line-height: 1.7） -->
      <span id="newsbody" class="text" contenteditable="true"
        :style="{
          fontFamily: 'Microsoft YaHei, sans-serif',
          position: 'absolute',
          left: '170px',
          top: '130px',
          color: '#000000',
          inlineSize: '265px',
          textAlign: 'left',
          fontSize: '12px',
          lineHeight: '1.5',
          whiteSpace: 'pre-line',
          outline: 'none',
          transform: 'scale(' + (600 / newsWidth / newsScale) + ', ' + (600 / newsHeight / newsScale) + ')',
          transformOrigin: 'top left'
        }">在阿道夫·希特勒去世后，德国旋即陷入混乱。尽管元首指定了合法的继任者，但德国国内的强大派系已经开始拿起武器，互相对抗，打算将国家引导向自己的期望。国家已被分裂，整支整支的驻军无视来自日耳曼尼亚的命令，并倒向他们选择的继任者。虽然局势的严重程度尚不清楚，但据估计，德国要么正在面临要么已经经历了中央权威的彻底崩溃。<br /><br />
        虽然还不大清楚德国东部领地的命运将会如何，但日耳曼尼亚与她的殖民领之间突然断绝了联系，这已经引发了这些地区是否也会自行寻找出路的猜测。然而，有一点毫无疑问，这个欧洲巨人的崩溃已经使整个欧陆陷入分崩离析之中。</span>

      <!-- 底部按钮：常规大小 -->
      <button id="newsbutton" class="button text" contenteditable="true" style="
          position: absolute;
          top: 500px;
          left: 123px;
          transition: 0.2s;
          background: url(&quot;/template/news/event_option_entry.png&quot;) no-repeat;
          border: none;
          width: 352px;
          height: 52px;
          font-family: 'Microsoft YaHei', sans-serif;
          font-size: 16px;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
        <span :style="{
          display: 'inline-block',
          transform: 'scale(' + (600 / newsWidth / newsScale) + ', ' + (600 / newsHeight / newsScale) + ')',
          transformOrigin: 'center'
        }">帝国的终结。</span>
      </button>
    </div>
  </div>
</template>