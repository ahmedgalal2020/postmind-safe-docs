/**
 * Client-side AES-GCM 256 encryption utilities
 * All files are encrypted in the browser before upload
 */

export interface EncryptedFile {
  ciphertext: ArrayBuffer;
  iv: Uint8Array;
  filename: string;
  size: number;
}

/**
 * Generate a random encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a file using AES-GCM 256
 */
export async function encryptFile(
  file: File,
  key: CryptoKey
): Promise<EncryptedFile> {
  // Generate random IV for this file
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Read file as ArrayBuffer
  const fileBuffer = await file.arrayBuffer();
  
  // Encrypt
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    fileBuffer
  );
  
  return {
    ciphertext,
    iv,
    filename: file.name,
    size: file.size,
  };
}

/**
 * Decrypt a file using AES-GCM 256
 */
export async function decryptFile(
  ciphertext: ArrayBuffer,
  iv: Uint8Array,
  key: CryptoKey
): Promise<ArrayBuffer> {
  return await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv),
    },
    key,
    ciphertext
  );
}

/**
 * Export key to store (as base64)
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/**
 * Import key from storage
 */
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    'raw',
    keyData.buffer,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Get or create encryption key from localStorage
 */
export async function getOrCreateKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem('postmind_encryption_key');
  if (stored) {
    return await importKey(stored);
  }
  
  const key = await generateKey();
  const exported = await exportKey(key);
  localStorage.setItem('postmind_encryption_key', exported);
  return key;
}
