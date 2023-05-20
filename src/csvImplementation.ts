import fs from "node:fs";

import { parse } from "csv-parse";

(() => {
  const filePath =
    "/home/devleandrodias/Personal/challenge-backend-crocs/src/data/IPs.csv";

  fs.createReadStream(filePath)
    .pipe(parse())
    .on("data", (row) => {
      const [ip, latitude, longitude, country, state, city] = row;
      console.log({ ip, latitude, longitude, country, state, city });
    })
    .on("end", () => {
      console.log("Location data loaded.");
    });
})();
