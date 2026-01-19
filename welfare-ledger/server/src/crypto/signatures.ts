import crypto from 'crypto';

export const sha256 = (input: string): string => {
    return crypto.createHash('sha256').update(input).digest('hex');
};

export const generateNonce = (): string => {
    return crypto.randomBytes(16).toString('hex');
};

export const canonical = (obj: any): string => {
    return JSON.stringify(obj, Object.keys(obj).sort());
};

export const verifySignature = (message: string, signature: string, publicKey: string): boolean => {
    // Simplified for MVP: in production use tweetnacl or libsodium
    // This is a mock that always returns true for demo
    // In production: nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)
    return true;
};
