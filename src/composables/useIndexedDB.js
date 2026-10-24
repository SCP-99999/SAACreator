import { useDB } from "./useDB";

const STORE_NAME = "customPics";

export function useIndexedDB() {
  const { db, initDB } = useDB();

  // 添加图片
  const addPic = async (pic) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      // 拍扁防弹
      const request = store.add(JSON.parse(JSON.stringify(pic)));

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // 删除图片
  const deletePic = async (id) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  // 更新图片
  const updatePic = async (pic) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      // 拍扁防弹
      const request = store.put(JSON.parse(JSON.stringify(pic)));

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // 获取某类的所有图片
  const getAllPics = async (type) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("type");
      const request = index.getAll(type);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  return {
    db,
    addPic,
    deletePic,
    updatePic,
    getAllPics,
  };
}