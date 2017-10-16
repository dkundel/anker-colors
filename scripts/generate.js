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

dot.templateSettings.strip = false;

function generateImageUrl(hexColor, pixel) {
  pixel = pixel || 50;
  const sanitizedColor = hexColor.replace('#', '');
  return `http://via.placeholder.com/${pixel}/${sanitizedColor}/${sanitizedColor}`;
}

function generateMonochromatic(hexColor) {
  const numberOfResults = 5;
  let { h, s, l } = tc(hexColor).toHsl();

  const stepSize = 1 / (numberOfResults + 2);
  const middle = Math.floor(numberOfResults / 2);
  let result = Array.from({ length: numberOfResults }).map((_, idx) => {
    const newL = (l + stepSize * (idx - middle) + 1) % 1;
    return tc({ h, s, l: newL });
  });

  return result;
}

function generateShades(hexColor) {
  const gradients = generateMonochromatic(hexColor)
    .filter(c => c.toHexString() !== hexColor)
    .sort((a, b) => b.getLuminance() - a.getLuminance())
    .map(c => c.toHexString());

  return {
    100: gradients[0],
    300: gradients[1],
    500: hexColor,
    700: gradients[2],
    900: gradients[3]
  };
}

function addAdditionalColors(primaryHexColor, colorConfig) {
  const stepSize = 20;
  const { h, s, l } = tc(primaryHexColor).toHsl();
  const newColors = Array.from({
    length: Math.floor(360 / stepSize)
  }).map((_, idx) => {
    const newHue = (h + stepSize * idx) % 360;
    return tc({ h: newHue, s, l }).toHex();
  });

  const advancedConfig = { ...colorConfig };
  for (let color of newColors) {
    const { html } = colorNamer(color);
    const { name: colorName } = html[0];
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

function getColorInfo(name, colorConfig) {
  const hex = colorConfig[name];
  const color = tc(hex);
  const hsl = `${color.toHslString()}`;
  const rgb = `${color.toRgbString()}`;
  const img = generateImageUrl(hex, 50);
  const imgLong = generateImageUrl(hex, 125);
  const shades = Object.keys(colorConfig.shades[name]).map(num => {
    const hexColor = colorConfig.shades[name][num];
    return generateImageUrl(hexColor, 25);
  });
  return { hsl, rgb, name, hex, img, shades, imgLong };
}

function getColorsForReadme(colorConfig) {
  const colors = colorConfig.colors.map(name =>
    getColorInfo(name, colorConfig)
  );

  return { colors };
}

async function generate() {
  const primaryColor = colorJson[colorJson.primary];
  const colorConfig = addColorsList(
    addShades(addAdditionalColors(primaryColor, colorJson))
  );

  const dots = dot.process({
    path: path.resolve(__dirname, '../src/templates'),
    strip: false
  });

  const tmpFolder = path.resolve(__dirname, '../tmp');
  await mkdir(tmpFolder);

  const interfaceFilePath = path.resolve(tmpFolder, 'interfaces.ts');
  const interfaces = dots.interfaces(colorConfig);
  await writeFile(interfaceFilePath, interfaces, 'utf8');

  const tsFilePath = path.resolve(tmpFolder, 'index.ts');
  const ts = dots.typescript(colorConfig);
  await writeFile(tsFilePath, ts, 'utf8');

  const readmeFilePath = path.resolve(__dirname, '..', 'README.md');
  const colorsReadme = getColorsForReadme(colorConfig);
  const readme = dots.readme(colorsReadme);
  await writeFile(readmeFilePath, readme, 'utf8');
}

generate().catch(err => console.error(err));
