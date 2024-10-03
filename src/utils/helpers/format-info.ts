export const formatInfo = (info: any): string =>
  `${info.timestamp} ${info.level}: ${info.message}`;
