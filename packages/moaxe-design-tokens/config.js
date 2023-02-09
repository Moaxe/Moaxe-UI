module.exports = {
    source: ['dist/moaxe.tokens.json'],
    platforms: {
        css: {
            transformGroup: 'css/scss',
            prefix: 'mx',
            buildPath: 'dist/css/',
            files: [
                {
                    destination: 'tokens.css',
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
                    destination: '_tokens.scss',
                    format: 'scss/variables',
                    filter: (token) => token.type !== 'other',
                },
            ],
        },
        js: {
            transformGroup: 'js',
            prefix: 'mx',
            buildPath: 'dist/js/',
            files: [
                {
                    destination: 'tokens.js',
                    format: 'javascript/module',
                    filter: (token) => token.type !== 'other',
                },
            ],
        },
        ts: {
            transformGroup: 'js',
            prefix: 'mx',
            buildPath: 'dist/js/',
            files: [
                {
                    destination: 'tokens.d.ts',
                    format: 'typescript/es6-declarations',
                    filter: (token) => token.type !== 'other',
                },
            ],
        },
    },
};
