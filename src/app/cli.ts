import readline from "node:readline";

import colors from "colors";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = [
  {
    key: "1",
    description: "Read from JSON",
    action: () => {
      console.log("Selected Option 1");
      // Add your logic for Option 1 here
    },
  },
  {
    key: "2",
    description: "Read from CSV",
    action: () => {
      console.log("Selected Option 2");
      // Add your logic for Option 2 here
    },
  },
  {
    key: "0",
    description: "Quit",
    action: () => {
      console.clear();
      console.log(colors.red("Exiting..."));
      rl.close();
    },
  },
];

(() => {
  console.clear();

  console.log(
    colors.bold(colors.green("--- Backend Crocs Stream Challenge ---\n"))
  );

  options.forEach((op) => {
    console.log(colors.cyan(`${op.key} - ${op.description}`));
  });

  rl.question(colors.yellow(`\nChoose the location source: `), (answer) => {
    const selectedOption = options.find(
      (option) => option.key === answer.toLowerCase()
    );

    if (selectedOption) {
      selectedOption.action();
    } else {
      console.clear();
      console.log(colors.red("Invalid option. Please try again."));
    }

    rl.close();
  });
})();
