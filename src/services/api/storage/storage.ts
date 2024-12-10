/**
 * Storage Service
 *
 * Handles data persistence and caching with AsyncStorage.
 * Provides encrypted storage for sensitive data and implements
 * proper error handling and type safety.
 *
 * @packageDocumentation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { logError } from '../utils/analytics';
import { encryptData, decryptData } from '../utils/security';

/**
 * Storage item metadata
 */
interface StorageItem<T> {
  value: T;
  timestamp: number;
  encrypted: boolean;
}

/**
 * Storage service class
 */
class StorageService {
  private static instance: StorageService;
  private readonly EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {}

  /**
   * Gets singleton instance
   */
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Stores data with optional encryption
   */
  public async setItem<T>(
    key: string,
    value: T,
    encrypt: boolean = false,
  ): Promise<void> {
    try {
      const item: StorageItem<T> = {
        value: encrypt ? await encryptData(value) : value,
        timestamp: Date.now(),
        encrypted: encrypt,
      };

      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      logError('Storage.setItem failed:', error);
      throw error;
    }
  }

  /**
   * Retrieves stored data
   */
  public async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;

      const item: StorageItem<T> = JSON.parse(data);

      if (this.isExpired(item.timestamp)) {
        await this.removeItem(key);
        return null;
      }

      if (item.encrypted) {
        item.value = await decryptData(item.value);
      }

      return item.value;
    } catch (error) {
      logError('Storage.getItem failed:', error);
      throw error;
    }
  }

  /**
   * Removes stored item
   */
  public async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      logError('Storage.removeItem failed:', error);
      throw error;
    }
  }

  /**
   * Clears all stored data
   */
  public async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      logError('Storage.clear failed:', error);
      throw error;
    }
  }

  /**
   * Gets all storage keys
   */
  public async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      logError('Storage.getAllKeys failed:', error);
      throw error;
    }
  }

  /**
   * Checks if data is expired
   */
  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.EXPIRY_TIME;
  }

  /**
   * Multi-get operation
   */
  public async multiGet<T>(keys: string[]): Promise<Map<string, T>> {
    try {
      const items = await AsyncStorage.multiGet(keys);
      const result = new Map<string, T>();

      for (const [key, value] of items) {
        if (value) {
          const item: StorageItem<T> = JSON.parse(value);

          if (!this.isExpired(item.timestamp)) {
            result.set(
              key,
              item.encrypted ? await decryptData(item.value) : item.value,
            );
          } else {
            await this.removeItem(key);
          }
        }
      }

      return result;
    } catch (error) {
      logError('Storage.multiGet failed:', error);
      throw error;
    }
  }
}

export const storage = StorageService.getInstance();
