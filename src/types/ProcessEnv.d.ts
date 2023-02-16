declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
    MONNIFY_KEY : string
    MONNIFY_CONTRACT_CODE: string
    MONNIFY_SECRET_KEY : string
  }
}
