// https://codepen.io/techslides/pen/zowLd // zoom & pan

import timeframe from "./timeframe";

import { hex2grayscale } from "./utils";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this._selection = -1;
    this._colored = false;

    this.pixels = [];
    this.width = 0;
    this.height = 0;
    this.palette = [];
    this.palette2 = [];
    this.unblock = [];

    canvas.addEventListener("mousedown", (e) => this._mouseDown(e), false);
    canvas.addEventListener("mouseup", (e) => this._mouseUp(e), false);
    canvas.addEventListener("mousemove", (e) => this._mouseMove(e), false);

    canvas.addEventListener("dblclick", (e) => this._dblClick(e), false);

    canvas.addEventListener(
      "DOMMouseScroll",
      (e) => this._mouseWheel(e),
      false
    );
    canvas.addEventListener("mousewheel", (e) => this._mouseWheel(e), false);
  }

  indexByPosition(x, y) {
    const i = Math.floor(y / this.size);
    const j = Math.floor(x / this.size);

    return this.width * i + j;
  }

  positionByIndex(i) {
    const x = (i % this.width) * this.size;
    const y = Math.floor(i / this.width) * this.size;

    return { x, y };
  }

  _mouseDown(e) {
    if (this._selection === -1) return;

    this.mousedown = true;

    const x = e.offsetX || e.pageX - this.canvas.offsetLeft;
    const y = e.offsetY || e.pageY - this.canvas.offsetTop;

    this.selectByPosition(x, y);
  }

  _mouseUp() {
    this.mousedown = false;
  }

  _mouseMove(e) {
    if (!this.mousedown) {
      return;
    }

    const x = e.offsetX || e.pageX - this.canvas.offsetLeft;
    const y = e.offsetY || e.pageY - this.canvas.offsetTop;

    this.selectByPosition(x, y);
  }

  _dblClick() {
    this._colored = !this._colored;

    this.update();
  }

  _mouseWheel(e) {
    const x = e.offsetX || e.pageX - this.canvas.offsetLeft;
    const y = e.offsetY || e.pageY - this.canvas.offsetTop;

    const hasPixel = this.hasPixelByPosition(x, y);

    if (!hasPixel) {
      const detail = e.detail ? -e.detail : 0;
      const delta = e.wheelDelta ? e.wheelDelta / 40 : detail;

      if (delta) {
        // this.zoom(delta);
      }
    }

    return e.preventDefault() && false;
  }

  zoom(delta) {
    this.size = Math.max(4, this.size + (delta > 0 ? 1 : -1));
  }

  hasPixelByIndex(index) {
    return this.pixels[index] !== -1;
  }

  hasPixelByPosition(x, y) {
    return this.hasPixelByIndex(this.indexByPosition(x, y));
  }

  selectByPosition(x, y) {
    const index = this.indexByPosition(x, y);

    this.selectByIndex(index);
  }

  selectByIndex(index) {
    const pixel = this.pixels[index];

    if (this._selection === pixel) {
      this.unblock[index] = true;

      this.draw(index);

      console.log(
        "blocks",
        this.countBlocksByIndex(pixel),
        "unblocks",
        this.countUnblocksByIndex(pixel)
      );
    }
  }

  countBlocksByPalette(palette) {
    const index = this.palette.indexOf(palette);

    let count = 0;

    for (let i = 0, n = this.pixels.length; i < n; i += 1) {
      const pixel = this.pixels[i];

      count += pixel === index ? 1 : 0;
    }

    return count;
  }

  countBlocksByIndex(index) {
    return this.countBlocksByPalette(this.palette[index]);
  }

  countUnblocksByPalette(palette) {
    const index = this.palette.indexOf(palette);

    let count = 0;

    for (let i = 0, n = this.pixels.length; i < n; i += 1) {
      const pixel = this.pixels[i];

      if (pixel === index) {
        count += this.unblock[i] ? 1 : 0;
      }
    }

    return count;
  }

  countUnblocksByIndex(index) {
    return this.countUnblocksByPalette(this.palette[index]);
  }

  import(data) {
    this._selection = -1;

    this.pixels = data.pixels;
    this.width = data.width;
    this.height = data.height;
    this.palette = data.palette;
    this.palette2 = data.palette.map((c) => hex2grayscale(c));
    this.unblock = data.unblock || [];

    this.update();
  }

  export() {
    return {
      pixels: this.pixels,
      width: this.width,
      height: this.height,
      palette: this.palette,
      unblock: this.unblock,
    };
  }

  get size() {
    return this._size;
  }

  set size(value) {
    this._size = value - 0;
    this.update();
  }

  get selection() {
    return this._selection;
  }

  set selection(value) {
    this._selection = value;
    this.update();
  }

  t1(x, y, text) {
    this.ctx.font = `${this.size - 4}px Arial`;
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, x + this.size / 2, y + this.size / 2 + 1);
  }

  d1(x, y, w, h) {
    this.ctx.moveTo(x, y - h / 2);
    this.ctx.lineTo(x + w / 2, y - h / 4);
    this.ctx.lineTo(x + w / 2, y + h / 4);
    this.ctx.lineTo(x, y + h / 2);
    this.ctx.lineTo(x - w / 2, y + h / 4);
    this.ctx.lineTo(x - w / 2, y - h / 4);
    this.ctx.lineTo(x, y - h / 2);
  }

  d2(x, y, radius) {
    this.ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
  }

  d3(x, y, size) {
    this.ctx.rect(x, y, size, size);
  }

  update() {
    timeframe("game");

    this.canvas.width = this.width * this.size;
    this.canvas.height = this.height * this.size;

    timeframe("game", true, "tick1");

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    timeframe("game", true, "tick2");

    for (let i = 0, n = this.pixels.length; i < n; i += 1) {
      this.draw(i);
    }

    timeframe("game", true, "tick3");
  }

  draw(i) {
    const pixel = this.pixels[i];

    if (pixel === -1) return;

    const { x, y } = this.positionByIndex(i);

    const p = this.palette[pixel];
    const p2 = this.palette2[pixel];

    const selected = !!this.unblock[i];

    if (this._colored) {
      this.ctx.fillStyle = p;
    } else if (this._selection === -1) {
      this.ctx.fillStyle = selected ? p : p2;
    } else if (this.pixels[i] === this._selection) {
      this.ctx.fillStyle = selected ? p : "#ff0000";
    } else {
      this.ctx.fillStyle = selected ? p : p2;
    }

    this.ctx.beginPath();
    // this.d1(x, y, this.size, this.size); // DRAW what you want
    // this.d2(x, y, this.size / 2); // DRAW what you want
    this.d3(x, y, this.size); // DRAW what you want
    this.ctx.fill();

    if (this.pixels[i] === this._selection && !selected && !this._colored) {
      this.t1(x, y, pixel);
    }
  }
}

export default Game;
