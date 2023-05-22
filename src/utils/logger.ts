import colors from "colors";

import { Logger } from "../shared/types/Logger";

export const loggerInfo = ({ type, log }: Logger) => {
  switch (type) {
    case "success":
      console.info(colors.green(log) + "\n");
      break;
    case "error":
      console.info(colors.red(log) + "\n");
      break;
    case "warning":
      console.info(colors.yellow(log) + "\n");
      break;
    case "info":
      console.info(colors.cyan(log) + "\n");
      break;
    default:
      console.info(colors.white(log) + "\n");
      break;
  }
};
