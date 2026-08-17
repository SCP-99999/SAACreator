import { saveData } from "./onload.js";
import { state } from "./state.js";
import _ from 'lodash';
import { Howl } from "howler";

export function Edittext(el) {
  if (el.dataset.editing) return;
  new Howl({
    src: ["/sfx/click_province_01.wav"],
    volume: 1,
  }).play();
  el.dataset.editing = "true";
  const originalHTML = el.innerHTML;
  const editable = el.cloneNode(true);
  editable.textContent = el.innerHTML.replace(/<br\s*\/?>/gi, "\n");
  editable.setAttribute("contenteditable", true);
  el.style.display = "none";
  el.parentNode.insertBefore(editable, el);
  editable.focus();
  editable.addEventListener("input", () => {
    if (editable.textContent.trim()) {
      el.innerHTML = editable.innerHTML.replace(/<div><br><\/div>/g, "<br/>").replace(/\n/g, "<br/>").replace(/&nbsp;/g, "<br/>").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
  });
  editable.addEventListener("blur", () => {
    if (!editable.innerHTML.trim()) {
      el.innerHTML = editable.innerHTML = originalHTML;
    }
    el.style.display = "";
    delete el.dataset.editing;
    editable.remove();
    saveData();
  });
}

export function GetData() {
  const data = {
    // 原有的 DOM 数据
    textElements: [],
    imageElements: [],

    // 原有的图表/窗口数据（添加安全检查）
    pieChartData: state.chartData ? JSON.parse(JSON.stringify(state.chartData)) : null,
    windows: state.windows ? JSON.parse(JSON.stringify(state.windows)) : null,
    
    // 已删除的窗口数据不再保存
    // spiritPictures: state.spiritPictures ? JSON.parse(JSON.stringify(state.spiritPictures)) : null,

    // ✅ 保存侧边栏修改的所有文本数据（添加安全检查）
    textLinesTop: state.textLinesTop || null,
    textLines: state.textLines || null,
    focusText: state.focusText || null,
    altLeaderTitle: state.altLeaderTitle || null,
    altLeaderName: state.altLeaderName || null,
    descBodyText: state.descBodyText || null,
    leaderName: state.leaderName || null,
    // spiritTexts: state.spiritTexts || null,
  };

  // 保存文本元素
  document.querySelectorAll(":root .text").forEach((element) => {
    if (element && element.id) {
      data.textElements.push({
        id: element.id,
        text: element.innerHTML,
      });
    }
  });

  // 保存图片元素
  document.querySelectorAll(":root .pic").forEach((element) => {
    if (element && element.id) {
      data.imageElements.push({
        id: element.id,
        src: element.src,
        scale: element.style.scale,
      });
    }
  });

  return data;
}

export function SetData(data) {
  if (!data) {
    console.warn("SetData: 数据为空");
    return;
  }

  // 恢复 DOM 内联文本
  if (data.textElements && Array.isArray(data.textElements)) {
    data.textElements.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        element.innerHTML = item.text;
      }
    });
  }

  // 恢复图片
  if (data.imageElements && Array.isArray(data.imageElements)) {
    data.imageElements.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        element.src = item.src;
        element.style.scale = item.scale || 1;
      }
    });
  }

  // 已删除的窗口数据不再恢复
  // if (data.spiritPictures) {
  //   state.spiritPictures = data.spiritPictures;
  // }

  // 恢复图表数据
  if (data.pieChartData) {
    state.chartData = data.pieChartData;
  }

  // 恢复窗口布局
  if (data.windows) {
    state.windows = _.merge({}, state.windows || {}, data.windows);
  }

  // ✅ 恢复侧边栏修改的所有文本数据
  if (data.textLinesTop) state.textLinesTop = data.textLinesTop;
  if (data.textLines) state.textLines = data.textLines;
  if (data.focusText) state.focusText = data.focusText;
  if (data.altLeaderTitle) state.altLeaderTitle = data.altLeaderTitle;
  if (data.altLeaderName) state.altLeaderName = data.altLeaderName;
  if (data.descBodyText) state.descBodyText = data.descBodyText;
  if (data.leaderName) state.leaderName = data.leaderName;
  // if (data.spiritTexts) state.spiritTexts = data.spiritTexts;
}