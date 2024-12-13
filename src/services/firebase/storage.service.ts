/**
 * Firebase Storage Service
 *
 * Handles file uploads, downloads, and management with Firebase Storage.
 * Implements caching, error handling, and progress tracking.
 *
 * @packageDocumentation
 */

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import type { FileUploadProgress, StorageError } from '../../types';
import { logError } from '../../utils/analytics';

import { app } from './config';

/**
 * Storage service configuration
 */
interface StorageConfig {
  maxFileSize: number;
  allowedTypes: string[];
  cacheDuration: number;
}

/**
 * Storage service using singleton pattern
 */
class StorageService {
  private storage = getStorage(app);
  private static instance: StorageService;
  private cache: Map<string, { url: string; timestamp: number }> = new Map();

  private config: StorageConfig = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    cacheDuration: 60 * 60 * 1000, // 1 hour
  };

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
   * Uploads file to Firebase Storage
   * @throws {StorageError} When upload fails
   */
  public async uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: FileUploadProgress) => void,
  ): Promise<string> {
    try {
      // Validate file
      this.validateFile(file);

      // Create storage reference
      const storageRef = ref(this.storage, path);

      // Upload with progress tracking
      const uploadTask = uploadBytes(storageRef, file);

      if (onProgress) {
        uploadTask.on('state_changed', snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress({
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress,
          });
        });
      }

      await uploadTask;
      const url = await getDownloadURL(storageRef);

      // Cache the URL
      this.cache.set(path, {
        url,
        timestamp: Date.now(),
      });

      return url;
    } catch (error) {
      logError('File upload failed:', error);
      throw this.handleStorageError(error);
    }
  }

  /**
   * Gets download URL for file
   * @throws {StorageError} When retrieval fails
   */
  public async getFileUrl(path: string): Promise<string> {
    try {
      // Check cache first
      const cached = this.cache.get(path);
      if (cached && !this.isCacheExpired(cached.timestamp)) {
        return cached.url;
      }

      const storageRef = ref(this.storage, path);
      const url = await getDownloadURL(storageRef);

      // Update cache
      this.cache.set(path, {
        url,
        timestamp: Date.now(),
      });

      return url;
    } catch (error) {
      logError('File URL retrieval failed:', error);
      throw this.handleStorageError(error);
    }
  }

  /**
   * Deletes file from storage
   * @throws {StorageError} When deletion fails
   */
  public async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
      this.cache.delete(path);
    } catch (error) {
      logError('File deletion failed:', error);
      throw this.handleStorageError(error);
    }
  }

  /**
   * Validates file before upload
   */
  private validateFile(file: File): void {
    if (file.size > this.config.maxFileSize) {
      throw new Error(
        `File size exceeds ${this.config.maxFileSize / 1024 / 1024}MB limit`,
      );
    }

    if (!this.config.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }
  }

  /**
   * Checks if cached URL is expired
   */
  private isCacheExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.config.cacheDuration;
  }

  /**
   * Handles storage errors
   */
  private handleStorageError(error: unknown): StorageError {
    const storageError = new Error('Storage operation failed');
    storageError.name = 'StorageError';
    storageError.cause = error;
    return storageError;
  }

  /**
   * Clears expired cache entries
   */
  public clearExpiredCache(): void {
    const now = Date.now();
    for (const [path, { timestamp }] of this.cache.entries()) {
      if (this.isCacheExpired(timestamp)) {
        this.cache.delete(path);
      }
    }
  }
}

export const storageService = StorageService.getInstance();
