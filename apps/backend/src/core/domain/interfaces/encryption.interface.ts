/**
 * Encryption service interface
 *
 * Abstracts symmetric encryption/decryption operations for sensitive data
 */
export interface EncryptionService {
    /**
     * Encrypt a plain text value
     *
     * @param plainText The value to encrypt
     *
     * @returns Encrypted string (containing IV + auth tag + ciphertext)
     */
    encrypt: (plainText: string) => string;

    /**
     * Decrypt an encrypted value back to plain text
     *
     * @param encryptedText The encrypted value to decrypt
     *
     * @returns Decrypted plain text
     */
    decrypt: (encryptedText: string) => string;
}
