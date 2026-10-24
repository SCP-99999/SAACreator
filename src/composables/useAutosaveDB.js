import { useDB } from "./useDB";

const STORE_NAME = "autosave";

export function useAutosaveDB() {
  const { db, initDB } = useDB();

  // ✅ 自动保存：手动塞入主键 id，内容转为纯字符串
  const setAutoSave = async (data) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.put({
        id: "autosave_data", 
        content: JSON.stringify(data)
      });

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  };

  // ✅ 读取自动保存
  const getAutoSave = async () => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("autosave_data");

      request.onsuccess = () => {
        if (request.result && request.result.content) {
          try {
            resolve(JSON.parse(request.result.content));
          } catch (e) {
            console.error("解析自动保存数据失败", e);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      request.onerror = (e) => reject(e.target.error);
    });
  };

  // ✅ 清除自动保存
  const clearAutoSave = async () => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete("autosave_data");

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  };

  return {
    setAutoSave,
    getAutoSave,
    clearAutoSave,
  };
}