module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
      "@typescript-eslint",
    ],
    "extends": [
      "eslint:recommended",
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
          4
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
        ]
    }
}	