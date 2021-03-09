const rgb2hex = (r, g, b) =>
  `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

const hex2rgb = (hex) => {
  let color = hex;

  if (color.charAt(0) === "#") {
    color = color.substr(1);
  }
  if (color.length === 3) {
    color =
      color.substr(0, 1) +
      color.substr(0, 1) +
      color.substr(1, 2) +
      color.substr(1, 2) +
      color.substr(2, 3) +
      color.substr(2, 3);
  }
  let r = `${color.charAt(0)}${color.charAt(1)}`;
  let g = `${color.charAt(2)}${color.charAt(3)}`;
  let b = `${color.charAt(4)}${color.charAt(5)}`;
  r = parseInt(r, 16);
  g = parseInt(g, 16);
  b = parseInt(b, 16);

  return { r, g, b };
};

const rgb2grayscale = (r, g, b) => r * 0.3 + g * 0.59 + b * 0.11;

const hex2grayscale = (hex) => {
  const color = hex2rgb(hex);

  const grayscale = parseInt(rgb2grayscale(color.r, color.g, color.b), 10);

  return rgb2hex(grayscale, grayscale, grayscale);
};

export { rgb2hex, hex2rgb, rgb2grayscale, hex2grayscale };
