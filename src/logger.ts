export interface ILogger {
  error(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
}

export default {
  info(...meta: any[]) {
    console.info(...meta);
  },
  warn(...meta: any[]) {
    console.warn(...meta);
  },
  error(...meta: any[]) {
    console.error(...meta);
  }
} as ILogger;
