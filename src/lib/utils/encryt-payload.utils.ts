import forge from "node-forge";

export const encryptPayload = (sensitiveData: string, publicKey: string) => {
  const extractedKey = publicKey
    .replace(/-----BEGIN PUBLIC KEY-----\n?/, "")
    .replace(/\n?-----END PUBLIC KEY-----/, "")
    .replace(/\r?\n/g, "");
  const publicKeyPem = `-----BEGIN PUBLIC KEY-----
  ${extractedKey}
  -----END PUBLIC KEY-----`;
  const dataString = JSON.stringify(sensitiveData);
  try {
    const rsa = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = rsa.encrypt(dataString, "RSAES-PKCS1-V1_5");
    const encryptedBase64 = forge.util.encode64(encrypted);
    return encryptedBase64;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
