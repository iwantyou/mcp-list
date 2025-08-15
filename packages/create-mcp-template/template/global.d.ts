declare namespace NodeJS {
    interface ProcessEnv {
      SSE_PATH?: string;
      PORT?: number;
      HOST?: string;
      LOGGER_NAME?: string;
    }
  }