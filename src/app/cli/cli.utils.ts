import colors from "colors";
import readline from "node:readline";

import { MenuOptions } from "../../shared/types/MenuOptions";

export function showMenuTitle(title: string): void {
  console.log(colors.bold(colors.green(title)));
}

export function createMenuOptions(options: MenuOptions[]): void {
  options.forEach((op) => {
    console.log(colors.bold(`${op.key} - ${op.description}`));
  });
}

export function getMenuOptions(
  menuOptions: MenuOptions[],
  rl: readline.Interface
): Promise<string> {
  return new Promise((resolve) => {
    rl.question(colors.yellow(`\nSelect an option: `), (answer) => {
      const selectedOption = menuOptions.find(
        (option) => option.key === answer
      );

      if (selectedOption) {
        resolve(selectedOption.value);
      }

      resolve("invalid");
    });
  });
}

export function verifyOptionIsValid(option: string): boolean {
  console.clear();

  if (option === "exit") {
    console.log(colors.red("Exiting..."));
    return false;
  }

  if (option === "invalid") {
    console.log(colors.red("Invalid option. Please try again..."));
    return false;
  }

  return true;
}
