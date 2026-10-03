<script setup>
import { inject } from "vue";

const superTitle = inject('superTitle', '德国内战');
const superMotto = inject('superMotto', '因此，所有人都必须认识到这一点：\n与国家的存在相比，他的自我毫无意义。\n- 阿道夫·希特勒');
const superButtonText = inject('superButtonText', '风云已起');
</script>

<template>
  <div class="draggable" id="superwindow" style="
      position: absolute;
      z-index: 4;
      scale: 0.65;
      left: -70px;
      top: -150px;
    ">
    <img src="/template/super_frame.png" style="position: relative; z-index: 1" data-modifiable="true" data-type="super"
      data-resizable="false" data-target-id="superpic" />
      
    <div style="
        position: absolute;
        top: 105px;
        left: 35px;
        width: 950px;
        height: 715px;
      ">
      <img id="superpic" class="pic" src="/preset/german_civil_war.png"
        style="height: inherit; width: inherit; z-index: 0" />
    </div>

    <div style="
        position: absolute;
        display: flex;
        left: 230px;
        top: 19px;
        justify-content: center;
        align-items: center;
        inline-size: 570px;
        z-index: 5;
      ">
      <p style="
          position: relative;
          color: #c6c6c8;
          font-family: Aldrich, FZRui;
          font-size: 32px;
          text-align: center;
          margin: 0;
          pointer-events: none;
          paint-order: stroke;
          -webkit-text-stroke: 3px #000000;
          text-stroke: 6px #000000;
        " v-html="superTitle">
      </p>
    </div>

    <div style="position: absolute; top: 845px; left: 325px; z-index: 5;">
      <div style="
          position: relative;
          width: 340px;
          height: 36px;
          background: url(&quot;/template/spacebar.png&quot;) no-repeat;
          border: none;
          scale: 1.6;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 21px;
          text-align: center;
          line-height: 36px;
          pointer-events: none;
          paint-order: stroke;
          -webkit-text-stroke: 3px #000000;
          text-stroke: 6px #000000;
        " v-html="superButtonText">
      </div>
    </div>

    <div style="position: absolute; left: 60px; top: 557px; z-index: 5;">
      <p style="
          position: relative;
          width: 900px;
          text-align: right;
          color: #ffffff;
          font-family: Bombard, FZWH;
          font-size: 35px;
          white-space: pre-wrap;
          pointer-events: none;
          paint-order: stroke;
          -webkit-text-stroke: 3px #000000;
          text-stroke: 6px #000000;
        " v-html="superMotto">
      </p>
    </div>
  </div>
</template>