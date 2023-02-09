const StyleDictionary = require('style-dictionary');

let baseFontSize;
const fluidFontValues = {};
const fluidSpaceValues = {};

/*
  Tokens provide two types of spacing values, static and fluid.
  Based on the token type, return a static size in pixels
  or a fluid clamp CSS function as the token value.
*/
StyleDictionary.registerTransform({
    name: 'custom/space/value',
    type: 'value',
    matcher: (token) => token.type === 'spacing',
    transformer: (token) => {
        if (token.attributes.item === 'Fluid') {
            const size = token.path[token.path.length - 2];
            const data = fluidSpaceValues[size];

            return `clamp(${token.value}rem, calc(${data.clamp}rem + ${data.vw}vw), ${data.max}rem)`;
        }

        return token.value === 0 ? 0 : `${token.value}px`;
    },
});

/*
  Tokens provide two types of font size values, static and fluid.
  Based on the token type, return a static size in pixels
  or a fluid clamp CSS function as the token value.
*/
StyleDictionary.registerTransform({
    name: 'custom/font/size/value',
    type: 'value',
    matcher: (token) => token.type === 'fontSizes',
    transformer: (token) => {
        if (token.name.toLowerCase().includes('fluid')) {
            const size = token.path[token.path.length - 2];
            const data = fluidFontValues[size];
            return `clamp(${token.value / baseFontSize}rem, calc(${
                data.clamp
            }rem + ${data.vw}vw), ${data.max}rem)`;
        } else {
            return `${Number(token.value) / baseFontSize}rem`;
        }
    },
});

/*
  Nested design tokens in Figma require a unique name, so token-name-static
  is used. Transform tokens to remove '-static' to align with our design token patterns.

  Figma: space-200-static
  Return: space-200
*/
StyleDictionary.registerTransform({
    name: 'custom/name/static',
    type: 'name',
    matcher: (token) => token.name.toLowerCase().includes('static'),
    transformer: (token) => {
        return token.name?.replace('-static', '').replace('Static', '');
    },
});

/*
  Figma uses percentage values for its line heights. Transform percentage values
  into CSS relative numeric values.

  Figma: 150%
  Return: 1.5
*/
StyleDictionary.registerTransform({
    name: 'custom/lineHeight',
    type: 'value',
    matcher: (token) => token.type === 'lineHeights',
    transformer: (token) => {
        const value = Number(token.value?.toString().replace('%', ''));
        return value * 0.01;
    },
});

/*
  Figma uses simple number values for spacing and sizes. Transform those
  numbers by appending the 'px' unit to values that aren't percentages or 0.

  Figma: 24, 50%, 0
  Return: 24px, 50%, 0
*/
StyleDictionary.registerTransform({
    name: 'custom/value/px',
    type: 'value',
    matcher: (token) => ['borderRadius'].includes(token.type),
    transformer: (token) => {
        const isPercentValue = token.value?.toString().includes('%');
        const isZeroValue = token.value === 0;
        return isPercentValue || isZeroValue ? token.value : `${token.value}px`;
    },
});

/*
  Register a custom transform to iterate over fluid properties
  and assign their values to the appropriate object. The file generated
  is temporary and is ignored by git.
*/
StyleDictionary.registerTransform({
    name: 'custom/fluid/data',
    type: 'value',
    matcher: (token) => token.type === 'other',
    transformer: (token) => {
        if (token.path.includes('Base') && token.path.includes('Font')) {
            baseFontSize = token.value;
        } else {
            const base = token.path.includes('Space')
                ? fluidSpaceValues
                : fluidFontValues;

            base[token.path[token.path.length - 2]] = {
                ...base[token.path[token.path.length - 2]],
                [token.path[token.path.length - 1].toLowerCase()]: token.value,
            };
        }

        return token.value;
    },
});

const fluidDataTransforms = [
    'attribute/cti',
    'name/cti/kebab',
    'custom/fluid/data',
];
const moaxeTransforms = [
    'custom/name/static',
    'custom/space/value',
    'custom/lineHeight',
    'custom/value/px',
    'custom/font/size/value',
];
const styleTransforms = ['attribute/cti', 'name/cti/kebab', ...moaxeTransforms];

StyleDictionary.registerTransformGroup({
    name: 'fluid/data',
    transforms: fluidDataTransforms,
});
StyleDictionary.registerTransformGroup({
    name: 'css/scss',
    transforms: styleTransforms,
});

module.exports = {
    source: ['dist/moaxe.tokens.json'],
    platforms: {
        less: {
            transformGroup: 'fluid/data',
            buildPath: 'tmp/',
            files: [
                {
                    destination: 'other.css',
                    format: 'css/variables',
                    filter: (token) => token.type === 'other',
                },
            ],
        },
        css: {
            transformGroup: 'css/scss',
            prefix: 'mx',
            buildPath: 'dist/css/',
            files: [
                {
                    destination: 'moaxe-tokens.css',
                    format: 'css/variables',
                    filter: (token) => token.type !== 'other',
                },
            ],
        },
        scss: {
            transformGroup: 'css/scss',
            prefix: 'mx',
            buildPath: 'dist/css/',
            files: [
                {
                    destination: '_moaxe-tokens.scss',
                    format: 'scss/variables',
                    filter: (token) => token.type !== 'other',
                },
            ],
        },
    },
};
