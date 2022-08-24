module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
      "@typescript-eslint",
      "spellcheck"
    ],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "complexity": [
          "error",
          10
        ],
        "max-params": [
          "error",
          6
        ],
        "require-jsdoc": [
          "error",
          {
            "require": {
              "FunctionDeclaration": true,
              "MethodDefinition": true,
              "ClassDeclaration": true,
              "ArrowFunctionExpression": false,
              "FunctionExpression": false
            }
          }
        ],
        "valid-jsdoc": [
          "error",
          {
            "requireReturn": false
          }
        ],
        "no-console": [
        	"error",
        	{ allow: ["warn", "error"] }
        ],
        "curly": [
          2,
          "multi-line"
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          {
            "selector": "interface",
            "prefix": ["I"],
            "format": ["StrictPascalCase"]
          }
        ],
        "spellcheck/spell-checker": [
          "warn",
          {
            "skipWords": [
              'dict',
              'axios',
              'utils',
              'eth',
              'Ascii',
              'abi',
              'cid',
              'sigV',
              'sigR',
              'sigS',
              'sig',
              'gwei'
            ],
          }
        ]
    }
}	