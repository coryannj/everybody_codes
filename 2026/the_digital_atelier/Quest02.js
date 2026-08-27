const fs = require("fs");
const input1 = fs.readFileSync(
  "../../inputs/everybody_codes/2026/the_digital_atelier/quest2_1.txt",
  { encoding: "utf8", flag: "r" },
);
const input2 = fs.readFileSync(
  "../../inputs/everybody_codes/2026/the_digital_atelier/quest2_2.txt",
  { encoding: "utf8", flag: "r" },
);
const input3 = fs.readFileSync(
  "../../inputs/everybody_codes/2026/the_digital_atelier/quest2_3.txt",
  { encoding: "utf8", flag: "r" },
);

const nextMove = (currPos, [x2, y2]) => {
  let [x1, y1] = currPos.split(",").map(Number);
  xMove = Math.floor((x2 - x1) / 2);
  yMove = Math.floor((y2 - y1) / 2);
  return [x1 + xMove, y1 + yMove].join(",");
};

const neighbours = ([x, y]) =>
  [
    [x - 1, y],
    [x + 1, y],
    [x, y + 1],
    [x, y - 1],
  ].map((x) => x.join(","));

const solve = (input, partNo) => {
  let lines = input.split(/[\r\n]/);
  let moves;

  if (partNo < 3) moves = lines.pop().split("=")[1].split("");

  let [start, ...beacons] = lines.map((x) =>
    x.split("=").map((y, yi) => (yi === 0 ? y : y.match(/\d+/g).map(Number))),
  );

  beacons = partNo < 3 ? Object.fromEntries(beacons) : beacons.map((x) => x[1]);
  currPos = start[1].join(",");

  let skySquares = new Set([currPos]);

  if (partNo < 3) {
    skySquares = moves.reduce((seen, b) => {
      currPos = nextMove(currPos, beacons[b]);
      seen.add(currPos);
      return seen;
    }, skySquares);
  } else {
    for (const square of skySquares.values()) {
      beacons.forEach((beacon) => {
        skySquares.add(nextMove(square, beacon));
      });
    }
  }

  return partNo === 1
    ? skySquares.size
    : new Set(
        [...skySquares].flatMap((x) => neighbours(x.split(",").map(Number))),
      ).difference(skySquares).size;
};

console.log(solve(input1, 1));
console.log(solve(input2, 2));
console.log(solve(input3, 3));
