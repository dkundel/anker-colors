const { promisify } = require('util');
const tc = require('tinycolor2');
const colorNamer = require('color-namer');
const dot = require('dot');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

const mkdir = promisify(mkdirp);
const writeFile = promisify(fs.writeFile);

const colorJson = require('../src/colors.json');

function generateImageUrl(rgbColor, pixel) {
  const sanitizedColor = rgbColor.replace('#', '');
  return `http://via.placeholder.com/${pixel}/${sanitizedColor}/${sanitizedColor}`;
}

function generateShades(rgbColor) {
  const color = tc(rgbColor);
  const gradients = color
    .monochromatic(5)
    .sort((a, b) => a.getLuminance() - b.getLuminance())
    .map(c => `#${c.toHex()}`);
  return {
    100: gradients[0],
    300: gradients[1],
    500: gradients[2],
    700: gradients[3],
    900: gradients[4]
  };
}

function addAdditionalColors(primaryRgbColor, colorConfig) {
  const stepSize = 20;
  const { h, s, l } = tc(primaryRgbColor).toHsl();
  const newColors = Array.from({
    length: Math.floor(360 / stepSize)
  }).map((_, idx) => {
    const newHue = (h + stepSize * idx) % 360;
    return tc({ h: newHue, s, l }).toHex();
  });

  const advancedConfig = { ...colorConfig };
  for (let color of newColors) {
    const { basic } = colorNamer(color);
    const { name: colorName } = basic[0];
    if (advancedConfig[colorName] === undefined) {
      advancedConfig[colorName] = `#${color}`;
    }
  }

  return advancedConfig;
}

function addShades(colorConfig) {
  const shades = {};

  for (let color of Object.keys(colorConfig)) {
    if (colorConfig[color][0] !== '#') {
      continue;
    }

    shades[color] = generateShades(colorConfig[color]);
  }

  return { ...colorConfig, shades };
}

function addColorsList(colorConfig) {
  const colors = Object.keys(colorConfig).filter(
    key => colorConfig[key][0] === '#'
  );
  return { ...colorConfig, colors };
}

async function generate() {
  const primaryColor = colorJson[colorJson.primary];
  const colorConfig = addColorsList(
    addShades(addAdditionalColors(primaryColor, colorJson))
  );

  const dots = dot.process({
    path: path.resolve(__dirname, '../src/templates')
  });

  const tmpFolder = path.resolve(__dirname, '../tmp');
  await mkdir(tmpFolder);

  const interfaceFilePath = path.resolve(tmpFolder, 'interfaces.ts');
  const interfaces = dots.interfaces(colorConfig);
  await writeFile(interfaceFilePath, interfaces, 'utf8');

  const tsFilePath = path.resolve(tmpFolder, 'index.ts');
  const ts = dots.typescript(colorConfig);
  await writeFile(tsFilePath, ts, 'utf8');
}

generate().catch(err => console.error(err));
