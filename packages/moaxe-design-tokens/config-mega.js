const StyleDictionary = require('style-dictionary');

let baseFontSize;
const fluidFontValues = {};
const fluidSpaceValues = {};

// Convert pascalCase strings to kebab-case
const pascalToKebab = (str) => {
    if (typeof str === 'string') {
        return str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase();
    }
};

/*
  Utility function used to flatten an object's keys
  into dot notation strings and assign the relevant
  CSS variable reference as the value.
*/
const flatten = ({ obj = {}, res = {} }) => {
    Object.entries(obj).forEach(([key, value]) => {
        /*
            If the value object has a 'path' key, it's a low-level raw token.
            Otherwise, the value is a higher-level, parent object
        */
        if (value.path) {
            /*
                Remove the first part of the path, to prevent duplicating the theme category
                ❌ space: { 'space.base': ... }
                ✅ space: { 'base': ... }
            */
            const [category, ...tokenPath] = value.path;

            // Filter out empty strings and/or 'static' labels from Figma Tokens
            const cleanPath = tokenPath
                .filter(Boolean)
                .filter((p) => p !== 'Static');
            const cssCategory = pascalToKebab(category);
            const cssProperty = pascalToKebab(cleanPath.join('-'));

            if (cleanPath.length === 3) {
                res[cleanPath[0].toLowerCase()][cleanPath[1].toLowerCase()] = {
                    ...res[cleanPath[0].toLowerCase()][
                        cleanPath[1].toLowerCase()
                    ],
                    [cleanPath[2].toLowerCase()]: `var(--mx-${cssCategory}-${cssProperty})`,
                };
            } else if (cleanPath.length === 2) {
                res[cleanPath[0].toLowerCase()] = {
                    ...res[cleanPath[0].toLowerCase()],
                    [cleanPath[1].toLowerCase()]: `var(--mx-${cssCategory}-${cssProperty})`,
                };
            } else {
                res[
                    cleanPath[0].toLowerCase()
                ] = `var(--mx-${cssCategory}-${cssProperty})`;
            }
        } else {
            flatten({ obj: value, res });
        }
    });

    return res;
};

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
        if (token.attributes.type === 'Fluid') {
            const size = token.path[token.path.length - 1];
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
            const size = token.path[token.path.length - 1];
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
        console.log({ path: token.path });
        if (token.path.includes('Base') && token.path.includes('font')) {
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
const jsTransforms = ['attribute/cti', 'name/cti/camel', ...moaxeTransforms];

StyleDictionary.registerTransformGroup({
    name: 'fluid/data',
    transforms: fluidDataTransforms,
});
StyleDictionary.registerTransformGroup({
    name: 'css/scss',
    transforms: styleTransforms,
});
StyleDictionary.registerTransformGroup({
    name: 'js/ts',
    transforms: jsTransforms,
});

module.exports = {
    source: ['dist/moaxe.tokens.json'],
    format: {
        'theme-js': function ({ dictionary, file }) {
            const { fileHeader } = StyleDictionary.formatHelpers;
            const categories = Object.keys(dictionary.tokens);
            const theme = {};

            categories.forEach((cat) => {
                if (theme[cat]) return;
                theme[cat] = flatten({ obj: dictionary.tokens[cat] });
            });

            return (
                fileHeader({ file }) +
                'export * from "./tokens";' +
                '\n\n' +
                `export const theme = ${JSON.stringify(theme, null, 2)};`
            );
        },
    },
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
        js: {
            transformGroup: 'js/ts',
            prefix: 'mx',
            buildPath: 'dist/js/',
            files: [
                {
                    destination: 'tokens.js',
                    format: 'javascript/es6',
                    filter: (token) => token.type !== 'other',
                },
            ],
        },
        theme: {
            transformGroup: 'js/ts',
            buildPath: 'dist/js/',
            files: [
                {
                    destination: 'index.js',
                    format: 'theme-js',
                    filter: (token) => token.type !== 'other',
                },
            ],
        },
    },
};
