type Logger = {
  log: string;
};
export const loggerInfo = (logger: Logger) => {
  console.info(logger.log);
};
