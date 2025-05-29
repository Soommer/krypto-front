export interface EncryptionRequest {
    plainText: string;
    algorithm: string;
    key: string;
  }
  
  export interface EncryptionResponse {
    cipherText: string;
    metrics: Metrics
  }
  interface Metrics {
    elapsedMilliseconds: number;
    memoryUsedBytes: number;
  }

  