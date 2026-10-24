import { saveData } from "./onload.js";
import { state } from "./state.js";
import { Howl } from "howler";

export function Edittext(el) {
  if (el.dataset.editing) return;
  new Howl({ src: ["/sfx/click_province_01.wav"], volume: 1 }).play();
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
    // 基础数据
    pieChartData: state.chartData || null,
    windows: state.windows || null,
    spiritPictures: state.spiritPictures || null,

    // 文本数据
    textLinesTop: state.textLinesTop || null,
    textLines: state.textLines || null,
    focusText: state.focusText || null,
    leaderName: state.leaderName || null,
    leaderNickname: state.leaderNickname || null,
    altLeaderTitle: state.altLeaderTitle || null,
    altLeaderName: state.altLeaderName || null,
    descBodyText: state.descBodyText || null,
    superTitle: state.superTitle || null,
    superMotto: state.superMotto || null,
    superButtonText: state.superButtonText || null,
    eventTitle: state.eventTitle || null,
    eventBody: state.eventBody || null,
    eventButtonText: state.eventButtonText || null,
    newsTitle: state.newsTitle || null,
    newsBody: state.newsBody || null,
    newsButtonText: state.newsButtonText || null,

    // 图片数据
    flagImageSrc: state.flagImageSrc || null,
    flagImageSrcCropped: state.flagImageSrcCropped || null,
    flagCrop: state.flagCrop || null,
    pieChartCenterImage: state.pieChartCenterImage || null,
    altLeaderImageSrc: state.altLeaderImageSrc || null,

    // DOM 抓取（原版精髓）
    textElements: [],
    imageElements: [],
  };

  // 抓取 DOM
  document.querySelectorAll(":root .text").forEach((element) => {
    if (element && element.id) {
      data.textElements.push({ id: element.id, text: element.innerHTML });
    }
  });
  document.querySelectorAll(":root .pic").forEach((element) => {
    if (element && element.id) {
      data.imageElements.push({ id: element.id, src: element.src, scale: element.style.scale });
    }
  });

  // ✅ 核心修复：整体脱壳，消灭所有 Proxy！
  return JSON.parse(JSON.stringify(data));
}

export function SetData(data) {
  if (!data) return;

  if (data.textLinesTop) state.textLinesTop = data.textLinesTop;
  if (data.textLines) state.textLines = data.textLines;
  if (data.focusText) state.focusText = data.focusText;
  if (data.leaderName) state.leaderName = data.leaderName;
  if (data.leaderNickname) state.leaderNickname = data.leaderNickname;
  if (data.altLeaderTitle) state.altLeaderTitle = data.altLeaderTitle;
  if (data.altLeaderName) state.altLeaderName = data.altLeaderName;
  if (data.descBodyText) state.descBodyText = data.descBodyText;
  if (data.superTitle) state.superTitle = data.superTitle;
  if (data.superMotto) state.superMotto = data.superMotto;
  if (data.superButtonText) state.superButtonText = data.superButtonText;
  if (data.eventTitle) state.eventTitle = data.eventTitle;
  if (data.eventBody) state.eventBody = data.eventBody;
  if (data.eventButtonText) state.eventButtonText = data.eventButtonText;
  if (data.newsTitle) state.newsTitle = data.newsTitle;
  if (data.newsBody) state.newsBody = data.newsBody;
  if (data.newsButtonText) state.newsButtonText = data.newsButtonText;

  if (data.flagImageSrc) state.flagImageSrc = data.flagImageSrc;
  if (data.flagImageSrcCropped) state.flagImageSrcCropped = data.flagImageSrcCropped;
  if (data.flagCrop) state.flagCrop = data.flagCrop;
  if (data.pieChartCenterImage !== undefined) state.pieChartCenterImage = data.pieChartCenterImage;
  if (data.altLeaderImageSrc) state.altLeaderImageSrc = data.altLeaderImageSrc;

  if (data.spiritPictures) state.spiritPictures = data.spiritPictures;
  if (data.pieChartData) state.chartData = data.pieChartData;
  if (data.windows) {
    const validKeys = ["main", "description", "news", "superevent", "event", "flag", "altLeader"];
    for (const key of validKeys) {
      if (state.windows[key] && data.windows[key]) {
        Object.assign(state.windows[key], data.windows[key]);
      }
    }
  }

  // DOM 恢复
  setTimeout(() => {
    if (data.textElements) {
      data.textElements.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) element.innerHTML = item.text;
      });
    }
    if (data.imageElements) {
      data.imageElements.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          element.src = item.src;
          element.style.scale = item.scale || 1;
        }
      });
    }
  }, 50);
}