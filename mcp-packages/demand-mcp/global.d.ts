declare namespace NodeJS {
  interface ProcessEnv {
    ZHIHU_API_TOKEN?: string;
    ZHIHU_API_BASE_URL?: string;
    SSE_PATH?: string;
    PORT?: number;
    HOST?: string;
    LOGGER_NAME: string;
  }
}