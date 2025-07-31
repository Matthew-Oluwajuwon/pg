import CryptoJS from "crypto-js";

const STORAGE_KEY = "appStorage";
const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_KEY; // Store securely (e.g., in env)

type AppStorage = Record<string, string>; // Each value is encrypted

class SecureStorageUtil {
  private getRawStorage(): AppStorage {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) return {};

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_SECRET);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error("Decryption failed:" + error);
    }
  }

  private saveRawStorage(data: AppStorage): void {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        ENCRYPTION_SECRET,
      ).toString();
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      throw new Error("Encryption failed:" + error);
    }
  }

  setItem<T>(key: string, value: T): void {
    const storage = this.getRawStorage();
    const stringValue = JSON.stringify(value);
    storage[key] = CryptoJS.AES.encrypt(
      stringValue,
      ENCRYPTION_SECRET,
    ).toString();
    this.saveRawStorage(storage);
  }

  getItem<T>(key: string): T | null {
    const storage = this.getRawStorage();
    const encrypted = storage[key];
    if (!encrypted) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_SECRET);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      throw new Error("Failed to decrypt item:" + key + error);
    }
  }

  removeItem(key: string): void {
    const storage = this.getRawStorage();
    delete storage[key];
    this.saveRawStorage(storage);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  hasItem(key: string): boolean {
    const storage = this.getRawStorage();
    return key in storage;
  }
}

export const storageHelper = new SecureStorageUtil();
