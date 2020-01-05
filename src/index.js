import "./style/index.scss";

import Processor from "./Processor";
import Game from "./Game";

const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");
const canvas4 = document.getElementById("canvas4");
const canvas5 = document.getElementById("canvas5");

const sizeRange = document.getElementById("sizeRange");
const sizeNumber = document.getElementById("sizeNumber");

const colorsRange = document.getElementById("colorsRange");
const colorsNumber = document.getElementById("colorsNumber");

const pointRange = document.getElementById("pointRange");
const pointNumber = document.getElementById("pointNumber");

const palette = document.getElementById("palette");

const computerBtn = document.getElementById("computerBtn");
const loadBtn = document.getElementById("loadBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");

const processor = new Processor(canvas1, canvas2, canvas3, canvas4);
processor.src = "./assets/images/image5.jpg";
processor.size = sizeRange.value;
processor.colors = colorsRange.value;

const game = new Game(canvas5);
game.size = pointRange.value;

function buildPaletteItem(p, i) {
  const d = document.createElement("div");
  d.className = `palette palette${i}`;
  d.setAttribute("value", i);
  d.style.background = p;
  d.innerHTML = i;
  palette.appendChild(d);
  d.addEventListener("click", () => {
    game.selection = i;
  });
}

function build(data) {
  palette.innerHTML = "";

  buildPaletteItem("#ffffff", -1);

  data.palette.forEach((p, i) => buildPaletteItem(p, i));
}

sizeRange.addEventListener("change", () => {
  processor.size = sizeRange.value;
});

sizeNumber.addEventListener("change", () => {
  processor.size = sizeNumber.value;
});

colorsRange.addEventListener("change", () => {
  processor.colors = colorsRange.value;
});

colorsNumber.addEventListener("change", () => {
  processor.colors = colorsNumber.value;
});

pointRange.addEventListener("change", () => {
  game.size = pointRange.value;
});

pointNumber.addEventListener("change", () => {
  game.size = pointNumber.value;
});

computerBtn.addEventListener("change", () => {
  if (computerBtn.files && computerBtn.files[0]) {
    processor.src = URL.createObjectURL(computerBtn.files[0]);
  }
});

loadBtn.addEventListener("click", () => {
  const data = processor.export();

  build(data);

  game.import(data);
});

exportBtn.addEventListener("click", () => {
  const data = game.export();

  console.log("data", data);

  localStorage.setItem("data", JSON.stringify(data));
});

importBtn.addEventListener("click", () => {
  const data = JSON.parse(localStorage.getItem("data"));

  build(data);

  game.import(data);
});
