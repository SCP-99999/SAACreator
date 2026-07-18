import { reactive, watch } from 'vue';
import { saveData } from "@/utils/onload.js";

export const state = reactive({
  // 用于存放主窗口和独立旗帜框共享的图片链接
  globalFlagUrl: null,
  chartData: {
    labels: [
      "秘传纳粹主义",
      "极端民族主义",
      "国家社会主义",
      "法西斯主义",
      "专制主义",
      "家长制民主",
      "保守主义",
      "自由保守主义",
      "自由主义",
      "进步主义",
      "社会主义",
      "共产主义",
    ],
    datasets: [
      {
        data: [0, 5.6, 30.6, 41.7, 11.1, 8.3, 2.1, 0, 0, 2, 1.4, 0],
        backgroundColor: [
          "#341950",
          "#232323",
          "#503200",
          "#843200",
          "#4b4b4b",
          "#828282",
          "#000087",
          "#273195",
          "#4e61a3",
          "#a91b4f",
          "#9b0000",
          "#6e0000",
        ],
        borderWidth: 0,
        spacing: 0,
      },
    ],
    options: {
      rotation: 90,
    },
  },
  
  windows: {
    main: {
      name: "主窗口",
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      zIndex: 1,
      visible: true,
      active: false,
    },
    description: {
      name: "人物介绍",
      x: 6,
      y: 250,
      w: 320,
      h: 400,
      zIndex: 1,
      visible: true,
      active: false,
    },
    news: {
      name: "新闻",
      x: -30,
      y: 200,
      w: 1,
      h: 1,
      zIndex: 1,
      visible: false,
      active: false,
    },
    superevent: {
      name: "超事件",
      x: 475,
      y: 240,
      w: 1,
      h: 1,
      zIndex: 1,
      visible: true,
      active: false,
    },
    event: {
      name: "事件",
      x: 1410,
      y: 0,
      w: 1,
      h: 1,
      zIndex: 1,
      visible: false,
      active: false,
    },
    flag: {
      name: "旗帜框",
      x: 700,      // 初始 X 坐标，出来后在屏幕中间偏右
      y: 0,      // 初始 Y 坐标
      w: 290,      // 底图初始宽度 (估计值，可以微调)
      h: 150,      // 底图初始高度
      minW: 150,    // 👈 锁死最小宽度，防止缩成一条线
      maxW: 600,    // 👈 锁死最大宽度，防止撑破屏幕
      minH: 100,    // 👈 锁死最小高度
      maxH: 400,    // 👈 锁死最大高度
      zIndex: 1,
      visible: true,
      active: false,
    },
    altLeader: {
      name: "副领导人",
      x: 540,      // 初始横向位置
      y: 0,       // 初始纵向位置
      w: 200,       // 初始宽度
      h: 280,       // 初始高度
      zIndex: 1,
      visible: true,
      active: false,
    },
  }
});

// ✅ 完美合一的防抖监听器（保障“改了立即生效，不需刷新”）
let saveTimer = null;
watch(state, () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveData();
  }, 500); 
}, { deep: true });