const times = {};
const excludes = [];

const timeframe = (name, write = false, breakpoint = "", text = "") => {
  times[name] = write
    ? times[name] || new Date().getTime()
    : new Date().getTime();

  if (write && excludes.indexOf(name) === -1) {
    console.log(
      `${name +
        (breakpoint ? `[${breakpoint}]` : "")} time: ${new Date().getTime() -
        times[name]} ${text}`
    );
  }
};

export default timeframe;
