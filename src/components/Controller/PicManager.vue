<template>
    <Dialog v-model:visible="dialogVisible"
        :style="{ width: '70%', maxWidth: '90%', fontFamily: 'Aldrich, FZRui', opacity: 0.9 }"
        :header="'图片管理 - ' + type" class="pic-manager-dialog" :closable="true" @hide="handleClose" @show="handleShow">
        <div class="pic-manager-container">
            <div v-if="!type" class="no-type-message">请先点击要修改的图片</div>
            <template v-else>
                <TabView>
                    <TabPanel header="内置图片">
                        <div class="search-container">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="searchQuery" placeholder="搜索图片...（空格分割关键词）" class="search-input"
                                    size="small" />
                            </span>
                        </div>
                        <DataTable v-model:selection="selectedVanillaPic" :value="filteredVanillaPics"
                            :scrollable="true" scrollHeight="flex" class="p-datatable-sm compact-table"
                            :rowClass="rowClass" @row-click="onVanillaRowClick" :paginator="true" :rows="10"
                            :rowsPerPageOptions="[10, 20, 50, 100]"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown "
                            currentPageReportTemplate="显示 {first} 到 {last} 条，共 {totalRecords} 条" size="small" rowHover>
                            <Column headerStyle="width: 4rem" field="preview" header="预览">
                                <template #body="slotProps">
                                    <img :src="getVanillaPicUrl(slotProps.data)" alt="预览" style="
                                        max-width: 32px;
                                        max-height: 32px;
                                        object-fit: contain;
                                    " />
                                </template>
                            </Column>
                            <Column field="filename" header="文件名">
                                <template #body="slotProps">
                                    <span :title="slotProps.data.filename">{{ slotProps.data.filename }}</span>
                                </template>
                            </Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="自定义图片">
                        <div class="search-container">
                            <div class="left-controls">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="searchQuery" placeholder="搜索图片...（空格分割关键词）" class="search-input"
                                        size="small" />
                                </span>
                            </div>
                            <div v-if="resizable" class="scale-control">
                                <span class="scale-label">图片缩放：</span>
                                <InputText v-model="scaleInput" class="scale-input" @input="handleScaleChange"
                                    @keyup.enter="handleScaleChange" @blur="handleScaleChange" size="small" />
                                <span class="scale-label">倍</span>
                            </div>
                        </div>
                        <div class="table-container">
                            <DataTable v-model:selection="selectedCustomPic" :value="filteredCustomPics"
                                :scrollable="true" scrollHeight="flex" class="p-datatable-sm compact-table"
                                :rowClass="rowClass" @row-click="onCustomRowClick" :paginator="true" :rows="10"
                                :rowsPerPageOptions="[10, 20, 50, 100]"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown "
                                currentPageReportTemplate="显示 {first} 到 {last} 条，共 {totalRecords} 条" size="small"
                                rowHover>
                                <Column selectionMode="multiple" headerStyle="width: 2rem"></Column>
                                <Column headerStyle="width: 4rem" field="preview" header="预览">
                                    <template #body="slotProps">
                                        <img :src="slotProps.data.url" alt="预览" style="
                                            max-width: 32px;
                                            max-height: 32px;
                                            object-fit: contain;
                                        " />
                                    </template>
                                </Column>
                                <Column field="filename" header="文件名">
                                    <template #body="slotProps">
                                        <span :title="slotProps.data.filename">{{ slotProps.data.filename }}</span>
                                    </template>
                                </Column>
                                <Column field="uploadTime" header="上传时间">
                                    <template #body="slotProps">
                                        {{ formatDate(slotProps.data.uploadTime) }}
                                    </template>
                                </Column>
                                <Column field="size" header="大小">
                                    <template #body="slotProps">
                                        {{ formatFileSize(slotProps.data.size) }}
                                    </template>
                                </Column>
                            </DataTable>
                            <div class="action-buttons">
                                <FileUpload mode="basic" :auto="true" accept="image/*" @select="onFileSelect"
                                    :chooseLabel="'上传图片'" multiple="multiple" />
                                <Button icon="pi pi-pencil" label="重命名" @click="showRenameDialog" :disabled="!selectedCustomPic || selectedCustomPic.length !== 1
                                    " size="small" />
                                <Button icon="pi pi-trash" label="删除" @click="removePic" :disabled="!selectedCustomPic || selectedCustomPic.length === 0
                                    " severity="danger" size="small" />
                            </div>
                        </div>
                        <div v-if="filteredCustomPics.length === 0" class="empty-message">
                            暂无自定义图片
                        </div>
                    </TabPanel>

                    <!-- ✅ 旗帜裁剪标签页 -->
                    <TabPanel v-if="type === 'flag'" header="旗帜裁剪">
                        <div style="display: flex; gap: 20px;">
                            <div 
                                ref="cropCanvasRef"
                                style="
                                    position: relative;
                                    width: 600px;
                                    height: 400px;
                                    background: #1a1a1a;
                                    border: 1px solid #444;
                                    border-radius: 4px;
                                    overflow: hidden;
                                    cursor: move;
                                    flex-shrink: 0;
                                "
                                @mousedown="onCropMouseDown"
                            >
                                <img 
                                    :src="cropImageSrc" 
                                    :style="{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '50%',
                                        width: cropImageDisplayW + 'px',
                                        height: cropImageDisplayH + 'px',
                                        transform: `translate(calc(-50% + ${cropOffsetX}px), calc(-50% + ${cropOffsetY}px))`,
                                        transformOrigin: 'center center',
                                        pointerEvents: 'none',
                                    }"
                                    @load="onCropImageLoad"
                                />

                                <!-- 裁剪框（比例 448:285 ≈ 1.572） -->
                                <div 
                                    style="
                                        position: absolute;
                                        left: 50%;
                                        top: 50%;
                                        transform: translate(-50%, -50%);
                                        width: 471px;
                                        height: 300px;
                                        border: 2px solid #7caaaa;
                                        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
                                        pointer-events: none;
                                        z-index: 2;
                                    "
                                >
                                    <template v-if="cropShowGrid">
                                        <div style="position: absolute; left: 33.33%; top: 0; width: 1px; height: 100%; background: rgba(124, 170, 170, 0.5);"></div>
                                        <div style="position: absolute; left: 66.66%; top: 0; width: 1px; height: 100%; background: rgba(124, 170, 170, 0.5);"></div>
                                        <div style="position: absolute; top: 33.33%; left: 0; height: 1px; width: 100%; background: rgba(124, 170, 170, 0.5);"></div>
                                        <div style="position: absolute; top: 66.66%; left: 0; height: 1px; width: 100%; background: rgba(124, 170, 170, 0.5);"></div>
                                    </template>
                                </div>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 12px; min-width: 220px; flex: 1;">
                                <div>
                                    <label style="display: block; font-size: 12px; color: #999; margin-bottom: 4px;">缩放比例 (scale)</label>
                                    <InputText v-model.number="cropScale" type="number" step="0.01" style="width: 100%;" size="small" />
                                </div>
                                <div>
                                    <label style="display: block; font-size: 12px; color: #999; margin-bottom: 4px;">横向偏移 (right)</label>
                                    <InputText v-model.number="cropOffsetX" type="number" style="width: 100%;" size="small" />
                                </div>
                                <div>
                                    <label style="display: block; font-size: 12px; color: #999; margin-bottom: 4px;">纵向偏移 (top)</label>
                                    <InputText v-model.number="cropOffsetY" type="number" style="width: 100%;" size="small" />
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                                    <input type="checkbox" v-model="cropShowGrid" id="gridToggle" style="cursor: pointer;" />
                                    <label for="gridToggle" style="font-size: 12px; color: #ccc; cursor: pointer;">启用九宫格辅助线</label>
                                </div>
                                <div style="display: flex; gap: 8px; margin-top: 8px;">
                                    <Button label="重置" @click="resetFlagCrop" size="small" severity="secondary" />
                                    <Button label="应用" @click="applyFlagCrop" size="small" />
                                </div>
                                <div style="font-size: 11px; color: #666; margin-top: 8px; line-height: 1.5;">
                                    提示：在画布上拖动图片调整位置，<br />
                                    用缩放比例控制大小，点击"应用"保存裁剪结果。
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </template>
        </div>
    </Dialog>
    <Dialog v-model:visible="renameDialogVisible" header="重命名图片" :modal="true"
        :style="{ width: '400px', fontFamily: 'Aldrich, FZRui' }">
        <div class="rename-container">
            <span class="p-float-label">
                <InputText v-model="newFilename" class="w-full" size="small" />
            </span>
        </div>
        <template #footer>
            <Button label="取消" icon="pi pi-times" @click="renameDialogVisible = false" class="p-button-text"
                size="small" />
            <Button label="确定" icon="pi pi-check" @click="renamePic" :disabled="!newFilename" size="small" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Dialog from "primevue/dialog";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import { useIndexedDB } from "@/composables/useIndexedDB";
import { formatDate, formatFileSize } from "@/utils/format";
import { saveData } from "@/utils/onload";
import { state } from "@/utils/state.js";
import { Howl } from "howler";

const props = defineProps({
    visible: { type: Boolean, default: false },
    type: { type: String, required: true },
    targetId: { type: String, required: true },
    resizable: { type: Boolean, default: false },
});

const emit = defineEmits(["update:visible", "update:pic"]);

const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit("update:visible", value),
});

const { addPic, deletePic, updatePic, getAllPics } = useIndexedDB();
const searchQuery = ref("");
const selectedVanillaPic = ref(null);
const selectedCustomPic = ref(null);
const uploadDialogVisible = ref(false);
const renameDialogVisible = ref(false);
const newFilename = ref("");
const vanillaPics = ref([]);
const customPics = ref([]);
const pictureScale = ref(1);
const scaleInput = ref("1.0");

// ✅ 旗帜裁剪状态
const cropCanvasRef = ref(null);
const cropImageSrc = ref("");
const cropOffsetX = ref(0);
const cropOffsetY = ref(0);
const cropScale = ref(1);
const cropShowGrid = ref(true);

// 图片原始尺寸
const cropImageNatW = ref(0);
const cropImageNatH = ref(0);

// 画布尺寸
const canvasW = 600;
const canvasH = 400;

// ✅ 裁剪框输出尺寸（原比例 448:285）
const cropFrameW = 448;
const cropFrameH = 285;

// 画布中的裁剪框尺寸
const cropBoxW = 471;
const cropBoxH = 300;

const cropImageDisplayW = computed(() => {
    if (!cropImageNatW.value || !cropImageNatH.value) return 0;
    const baseScale = Math.max(canvasW / cropImageNatW.value, canvasH / cropImageNatH.value);
    return cropImageNatW.value * baseScale * cropScale.value;
});

const cropImageDisplayH = computed(() => {
    if (!cropImageNatW.value || !cropImageNatH.value) return 0;
    const baseScale = Math.max(canvasW / cropImageNatW.value, canvasH / cropImageNatH.value);
    return cropImageNatH.value * baseScale * cropScale.value;
});

const initFlagCrop = () => {
    cropImageSrc.value = state.flagImageSrc;
    cropOffsetX.value = state.flagCrop.offsetX;
    cropOffsetY.value = state.flagCrop.offsetY;
    cropScale.value = state.flagCrop.scale;
    cropShowGrid.value = true;
};

const onCropImageLoad = (e) => {
    cropImageNatW.value = e.target.naturalWidth;
    cropImageNatH.value = e.target.naturalHeight;
};

const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0, ox: 0, oy: 0 });

const onCropMouseDown = (e) => {
    isDragging.value = true;
    dragStart.value = {
        x: e.clientX,
        y: e.clientY,
        ox: cropOffsetX.value,
        oy: cropOffsetY.value,
    };
    document.addEventListener("mousemove", onCropMouseMove);
    document.addEventListener("mouseup", onCropMouseUp);
};

const onCropMouseMove = (e) => {
    if (!isDragging.value) return;
    cropOffsetX.value = dragStart.value.ox + (e.clientX - dragStart.value.x);
    cropOffsetY.value = dragStart.value.oy + (e.clientY - dragStart.value.y);
};

const onCropMouseUp = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", onCropMouseMove);
    document.removeEventListener("mouseup", onCropMouseUp);
};

// ✅ 应用裁剪
const applyFlagCrop = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropFrameW;
        canvas.height = cropFrameH;
        const ctx = canvas.getContext("2d");

        const imgNatW = img.naturalWidth;
        const imgNatH = img.naturalHeight;
        
        const baseScale = Math.max(canvasW / imgNatW, canvasH / imgNatH);
        const displayScale = baseScale * cropScale.value;
        const displayW = imgNatW * displayScale;
        const displayH = imgNatH * displayScale;

        const displayX = (canvasW - displayW) / 2 + cropOffsetX.value;
        const displayY = (canvasH - displayH) / 2 + cropOffsetY.value;

        const cropBoxX = (canvasW - cropBoxW) / 2;
        const cropBoxY = (canvasH - cropBoxH) / 2;

        const imgInBoxX = displayX - cropBoxX;
        const imgInBoxY = displayY - cropBoxY;

        const outScale = cropFrameW / cropBoxW;

        ctx.drawImage(
            img,
            imgInBoxX * outScale,
            imgInBoxY * outScale,
            displayW * outScale,
            displayH * outScale
        );

        const base64 = canvas.toDataURL("image/png");
        state.flagImageSrcCropped = base64;
        state.flagCrop = {
            offsetX: cropOffsetX.value,
            offsetY: cropOffsetY.value,
            scale: cropScale.value,
        };
        saveData();
    };
    img.src = cropImageSrc.value;
};

const resetFlagCrop = () => {
    cropOffsetX.value = 0;
    cropOffsetY.value = 0;
    cropScale.value = 1;
    state.flagCrop = { offsetX: 0, offsetY: 0, scale: 1 };
    state.flagImageSrcCropped = state.flagImageSrc;
    cropImageSrc.value = state.flagImageSrc;
};

const loadVanillaPics = async () => {
    if (!props.type) return;
    try {
        const response = await fetch("/data/index.json");
        const data = await response.json();
        if (data && data[props.type]) {
            vanillaPics.value = data[props.type]
                .map((filename) => ({ filename }))
                .sort((a, b) => a.filename.localeCompare(b.filename));
        } else {
            vanillaPics.value = [];
        }
    } catch (error) {
        vanillaPics.value = [];
    }
};

const loadCustomPics = async () => {
    const pics = await getAllPics(props.type);
    customPics.value = pics.sort(
        (a, b) => new Date(b.uploadTime) - new Date(a.uploadTime),
    );
};

const filteredVanillaPics = computed(() => {
    if (!searchQuery.value) return vanillaPics.value;
    const keywords = searchQuery.value.toLowerCase().split(" ");
    return vanillaPics.value.filter((pic) =>
        keywords.every((keyword) => pic.filename.toLowerCase().includes(keyword)),
    );
});

const filteredCustomPics = computed(() => {
    if (!searchQuery.value) return customPics.value;
    const keywords = searchQuery.value.toLowerCase().split(" ");
    return customPics.value.filter((pic) =>
        keywords.every((keyword) => pic.filename.toLowerCase().includes(keyword)),
    );
});

const onVanillaRowClick = (event) => {
    const url = getVanillaPicUrl(event.data);
    emit("update:pic", {
        id: props.targetId,
        url: url,
        scale: props.resizable ? pictureScale.value : undefined,
    });
    if (props.type === "flag") {
        cropImageSrc.value = url;
        cropOffsetX.value = 0;
        cropOffsetY.value = 0;
        cropScale.value = 1;
        state.flagImageSrc = url;
        state.flagImageSrcCropped = url;
        state.flagCrop = { offsetX: 0, offsetY: 0, scale: 1 };
    }
    new Howl({ src: ["/sfx/click_default.wav"], volume: 1 }).play();
};

const onCustomRowClick = (event) => {
    emit("update:pic", {
        id: props.targetId,
        url: event.data.url,
        scale: props.resizable ? pictureScale.value : undefined,
    });
    if (props.type === "flag") {
        cropImageSrc.value = event.data.url;
        cropOffsetX.value = 0;
        cropOffsetY.value = 0;
        cropScale.value = 1;
        state.flagImageSrc = event.data.url;
        state.flagImageSrcCropped = event.data.url;
        state.flagCrop = { offsetX: 0, offsetY: 0, scale: 1 };
    }
    new Howl({ src: ["/sfx/click_default.wav"], volume: 1 }).play();
};

const showRenameDialog = () => {
    if (selectedCustomPic.value && selectedCustomPic.value.length === 1) {
        newFilename.value = selectedCustomPic.value[0].filename;
        renameDialogVisible.value = true;
    }
};

const onFileSelect = async (event) => {
    const files = event.files;
    if (!files || files.length === 0) return;

    const uploadPromises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const pic = {
                        type: props.type,
                        filename: file.name,
                        url: e.target.result,
                        uploadTime: new Date(),
                        size: file.size,
                    };
                    await addPic(pic);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
    });
    await Promise.all(uploadPromises);
    await loadCustomPics();
    uploadDialogVisible.value = false;
};

const renamePic = async () => {
    if (!selectedCustomPic.value || !newFilename.value) return;
    await updatePic({
        ...selectedCustomPic.value[0],
        filename: newFilename.value,
    });
    await loadCustomPics();
    renameDialogVisible.value = false;
};

const removePic = async () => {
    if (!selectedCustomPic.value || selectedCustomPic.value.length === 0) return;
    const deletePromises = selectedCustomPic.value.map((pic) =>
        deletePic(pic.id),
    );
    await Promise.all(deletePromises);
    await loadCustomPics();
    selectedCustomPic.value = null;
};

const getVanillaPicUrl = (pic) => {
    return `/data/${props.type}/${pic.filename}`;
};

const rowClass = (data) => {
    return { "cursor-pointer": true };
};

const handleClose = () => {
    new Howl({ src: ["/sfx/click_window_close.wav"], volume: 1 }).play();
    try {
        saveData();
    } catch (e) {
        console.warn("提示：关闭弹窗时保存数据遇到了小问题，但页面运行正常。");
    }
};

const handleShow = () => {
    new Howl({ src: ["/sfx/click_window_open.wav"], volume: 1 }).play();
};

const handleScaleChange = (event) => {
    const value = event.target?.value || scaleInput.value;
    if (value === "") {
        scaleInput.value = "";
        return;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
        scaleInput.value = pictureScale.value.toFixed(1);
        return;
    }
    if (num < 0) {
        pictureScale.value = 0.1;
        scaleInput.value = "0.1";
    } else {
        pictureScale.value = num;
        scaleInput.value = value;
    }

    emit("update:pic", {
        id: props.targetId,
        scale: pictureScale.value,
    });
};

watch(
    () => props.visible,
    (newVisible) => {
        if (newVisible && props.resizable) {
            const element = document.getElementById(props.targetId);
            if (element) {
                const scale =
                    element.style.scale ||
                    element.style.transform?.match(/scale\(([0-9.]+)\)/)?.[1] ||
                    1;
                pictureScale.value = parseFloat(scale);
                scaleInput.value = pictureScale.value.toFixed(1);
            }
        }
    },
);

watch(
    () => props.type,
    (newType) => {
        if (newType) {
            loadVanillaPics();
            loadCustomPics();
            if (newType === "flag") {
                initFlagCrop();
            }
        } else {
            vanillaPics.value = [];
            customPics.value = [];
        }
    },
);

onMounted(async () => {
    await loadVanillaPics();
    await loadCustomPics();
    if (props.type === "flag") {
        initFlagCrop();
    }
});
</script>

<style scoped>
.pic-manager-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.search-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
}

.left-controls {
    display: flex;
    flex: 1;
}

.scale-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
}

.table-container {
    display: flex;
    gap: 1rem;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: fit-content;
}

:deep(.p-datatable) {
    flex: 1;
    min-width: 0;

    .p-datatable-thead>tr>th {
        background: var(--surface-section);
        color: var(--text-color);
        font-weight: 600;
    }

    .p-datatable-tbody>tr {
        &:hover {
            background: var(--surface-hover);
        }
    }

    .p-paginator {
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: 0 0 6px 6px;
    }

    .p-paginator .p-paginator-pages .p-paginator-page {
        min-width: 2.5rem;
        height: 2.5rem;
    }

    .p-paginator .p-dropdown {
        margin-left: 0.5rem;
    }
}

:deep(.p-tabview) {
    .p-tabview-nav {
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
    }

    .p-tabview-panels {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
    }
}

.empty-message {
    text-align: center;
    color: var(--text-color-secondary);
    font-style: italic;
}

.no-type-message {
    text-align: center;
    color: var(--text-color-secondary);
    font-style: italic;
}

.scale-input {
    width: 80px;
    text-align: right;
}

.compact-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.25rem 0.5rem;
}

.compact-table :deep(.p-datatable-thead > tr > th) {
    padding: 0.25rem 0.5rem;
}
</style>