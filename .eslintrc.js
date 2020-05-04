// http://eslint.org/docs/user-guide/configuring

module.exports = {
    env: {
        es6: true,
        amd: true,
        node: true,
        browser: true
    },
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            "jsx": true,
            "modules": true,
            "experimentalObjectRestSpread": true
        }
    },
    rules: {
        'generator-star-spacing': 0,
        'arrow-parens': 0,
        'prefer-const': 2,
        'no-trailing-spaces': 'error',
        'no-debugger': 0,
        'no-extra-semi': 'error',
        semi: [2, "always"],
        'no-var': 'error',
        quotes: [
            2,
            'single'
        ]
    }
}
