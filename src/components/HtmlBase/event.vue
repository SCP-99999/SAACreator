<script setup>
import { ref, onMounted, computed, nextTick, inject } from "vue";

const eventTitle = inject('eventTitle', '内战打响！');
const eventBody = inject('eventBody', '');
const eventButtonText = inject('eventButtonText', '血色将至。');

const eventBodyRef = ref(null);
const tileCount = ref(3);
const tileHeight = 111;

const calculateTileCount = () => {
    nextTick(() => {
        if (eventBodyRef.value) {
            if (eventBodyRef.value.dataset.editing === "true") return;
            const computedStyle = window.getComputedStyle(eventBodyRef.value);
            const contentHeight = parseFloat(computedStyle.height.replace('px', ''));
            if (!isNaN(contentHeight) && contentHeight > 0) {
                const requiredTiles = Math.ceil(contentHeight / tileHeight);
                tileCount.value = Math.max(0, requiredTiles);
            }
        }
    });
};

const tileIndices = computed(() => {
    return Array.from({ length: tileCount.value }, (_, i) => i);
});

onMounted(() => {
    calculateTileCount();
    if (eventBodyRef.value) {
        const observer = new MutationObserver(() => {
            calculateTileCount();
        });
        observer.observe(eventBodyRef.value, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }
});
</script>

<template>
    <div class="draggable" id="eventwindow" style="position: absolute; z-index: 4">
        <img src="/template/news/event_report_top_win.png" style="position: relative; display: block;" />

        <img v-for="index in tileIndices" :key="index" src="/template/news/event_report_tileable_midsection.png"
            style="position: relative; display: block; width: 100%;" />

        <img src="/template/news/event_report_bottom_win.png" style="position: relative; display: block;" />

        <div :style="{
            position: 'absolute',
            top: `${295 + tileCount * tileHeight}px`,
            left: '97px',
            zIndex: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }">
            <img id="eventpic" class="pic" src="/preset/Reich_Germany_report_event_GER_riot.png" data-modifiable="true"
                data-type="event" data-resizable="true" data-initial-scale="1"
                :style="{ position: 'absolute', scale: 1 }" data-target-id="eventpic" />
        </div>

        <button id="eventbutton" class="button text" :style="{
            position: 'absolute',
            top: `${318 + tileCount * tileHeight}px`,
            left: '218px',
            transition: '0.2s',
            scale: '1.03',
            background: 'url(/template/news/event_event_option_entry.png) no-repeat', border: 'none', width: '355px',
            height: '52px', fontFamily: 'OldTypeNr, FZRui', fontSize: '16px', color: '#000000'
        }">
            {{ eventButtonText }}
        </button>

        <div style="
          position: absolute;
          display: flex;
          left: 40px;
          top: 210px;
          justify-content: center;
          align-items: center;
          inline-size: 500px;
        ">
            <p id="eventtitle" class="text" style="
            position: absolute;
            color: #000000;
            text-align: center;
            font-family: OldTypeNr, FZRui;
            font-size: 30px;
          ">{{ eventTitle }}</p>
        </div>

        <span ref="eventBodyRef" id="eventbody" class="text"
            style="
              font-family: OldTypeNr, FZRui;
              position: absolute;
              left: 60px;
              top: 250px;
              color: #000000;
              inline-size: 460px;
              text-align: left;
              font-size: 15px;
              white-space: pre-line;
            ">{{ eventBody }}</span>
    </div>
</template>
<style scoped></style>