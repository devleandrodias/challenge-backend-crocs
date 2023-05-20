type Logger = {
  log: string;
  type: "success" | "warning" | "error" | "info";
};

import colors from "colors";

export const loggerInfo = ({ type, log }: Logger) => {
  switch (type) {
    case "success":
      console.info(colors.green(log));
      break;
    case "error":
      console.info(colors.red(log));
      break;
    case "warning":
      console.info(colors.yellow(log));
      break;
    case "info":
      console.info(colors.cyan(log));
      break;
    default:
      console.info(colors.white(log));
      break;
  }
};
