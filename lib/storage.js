import { getStorage, ref, getDownloadURL } from "firebase/storage";
import app from './firebase'; 

const storage = getStorage(app);

/**
 * Pobiera URL pliku z Firebase Storage
 * @param {string} path - Ścieżka do pliku (np. 'global/logo.png')
 * @returns {Promise<string|null>} URL do pliku lub null
 */
export const getStorageUrl = async (path) => {
  if (!path) {
    console.error("Path is undefined or empty in getStorageUrl");
    return null;
  }
  
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error(`Error getting storage URL for path: ${path}`, error);
    
    if (error.code === 'storage/object-not-found') {
      console.warn(`File not found at path: ${path}`);
    }
    return null;
  }
}; 