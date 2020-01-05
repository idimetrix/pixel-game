import timeframe from "./timeframe";

import { rgb2grayscale, rgb2hex } from "./utils";

import RgbQuant from "./rgbquant";

class Processor {
  constructor(canvas1, canvas2, canvas3, canvas4) {
    this.canvas1 = canvas1;
    this.canvas1Ctx = canvas1.getContext("2d");

    this.canvas2 = canvas2;
    this.canvas2Ctx = canvas2.getContext("2d");

    this.canvas3 = canvas3;
    this.canvas3Ctx = canvas3.getContext("2d");

    this.canvas4 = canvas4;
    this.canvas4Ctx = canvas4.getContext("2d");
  }

  get src() {
    return this._src;
  }

  set src(_src) {
    this._src = _src;
    this.update();
  }

  get size() {
    return this._size;
  }

  set size(value) {
    this._size = value;
    this.update();
  }

  get colors() {
    return this._colors;
  }

  set colors(_colors) {
    this._colors = _colors;
    this.update();
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  export() {
    const pixels = [];

    const arr = this.canvas2Ctx.getImageData(0, 0, this.width, this.height)
      .data;

    const palette = this.palette();

    for (let i = 0, n = arr.length; i < n; i += 4) {
      const pixel = rgb2hex(arr[i], arr[i + 1], arr[i + 2]);

      pixels.push(palette.indexOf(pixel));
    }

    return {
      pixels,
      palette,
      width: this.width,
      height: this.height
    };
  }

  palette() {
    const arr = this.quant.palette(true).map(p => rgb2hex(p[0], p[1], p[2]));

    const index = arr.indexOf("#ffffff");
    if (index !== -1) {
      arr.splice(index, 1);
    }

    return arr;
  }

  update() {
    this.image = this.image || new Image();

    this.quant = new RgbQuant({
      colors: this.colors
    });

    this.image.onload = () => {
      timeframe("update");

      const hRatio = this.size / this.image.width;
      const vRatio = this.size / this.image.height;

      const ratio = Math.min(hRatio, vRatio);

      this._width = parseInt(this.image.width * ratio, 10);
      this._height = parseInt(this.image.height * ratio, 10);

      this.canvas1.width = this._width;
      this.canvas2.width = this._width;
      this.canvas3.width = this._width;

      this.canvas1.height = this._height;
      this.canvas2.height = this._height;
      this.canvas3.height = this._height;

      this.canvas1Ctx.drawImage(
        this.image,
        0,
        0,
        this.image.width,
        this.image.height,
        0,
        0,
        this._width,
        this._height
      );

      timeframe(
        "update",
        true,
        "step1",
        `HERE WE RESIZE IMAGE: w ${this._width} h ${this._height} colors ${this.colors}`
      );

      this.quant.sample(this.canvas1);

      timeframe("update", true, "step2", "HERE WE INIT RGB QUANT");

      const buffer = this.quant.reduce(this.canvas1);

      timeframe("update", true, "step3", "HERE WE REDUCE RGB QUANT");

      const imageDataPreviewer = this.canvas2Ctx.createImageData(
        this._width,
        this._height
      );
      imageDataPreviewer.data.set(buffer);
      this.canvas2Ctx.putImageData(imageDataPreviewer, 0, 0);

      timeframe("update", true, "step4", "HERE WE DRAW REDUCED IMAGE");

      const data = this.canvas3Ctx.createImageData(this._width, this._height);
      data.data.set(buffer);

      const pixels = data.data;
      for (let i = 0, n = pixels.length; i < n; i += 4) {
        const gs = rgb2grayscale(pixels[i], pixels[i + 1], pixels[i + 2]);

        pixels[i] = gs;
        pixels[i + 1] = gs;
        pixels[i + 2] = gs;
      }

      this.canvas3Ctx.putImageData(data, 0, 0);

      timeframe("update", true, "step5", "HERE WE DRAW MONOCHROME IMAGE");
    };

    this.image.src = this.src;
  }
}

export default Processor;
