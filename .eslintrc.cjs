module.exports = {
    'root': true,
    'parser': '@typescript-eslint/parser',
    'plugins': [
        '@typescript-eslint',
        'spellcheck'
    ],
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'complexity': [
            'error',
            10
        ],
        'max-params': [
            'error',
            6
        ],
        'require-jsdoc': [
            'error',
            {
                'require': {
                    'FunctionDeclaration': true,
                    'MethodDefinition': true,
                    'ClassDeclaration': true,
                    'ArrowFunctionExpression': false,
                    'FunctionExpression': false
                }
            }
        ],
        'valid-jsdoc': [
            'error',
            {
                'requireReturn': false
            }
        ],
        'no-console': [
        	'error',
        	{ allow: ['warn', 'error'] }
        ],
        'curly': [
            2,
            'multi-line'
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                'selector': 'interface',
                'prefix': ['I'],
                'format': ['StrictPascalCase']
            }
        ],
        'spellcheck/spell-checker': [
            'warn',
            {
                'skipWords': [
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
                    'gwei',
                    'decrypt',
                    'ecsign',
                    'decrypted',
                    'decrypting',
                    'Pkcs7',
                    'Pkcs',
                    'Utf8',
                    'passphrase',
                    'Ipfs',
                    'userIDs',
                    'ecc',
                    'Ds',
                    'ethereum',
                    'hdwallet',
                    'hd',
                    'localhost',
                    'fs',
                    'nock',
                    'Za',
                    'undef',
                    'globals',
                    'Uint',
                    'keypair',
                    'txt',
                    'Misformed',
                    'dotenv'
                ],
                'skipIfMatch': [
                    '.+\.txt',
                    '^[a-f0-9]{64}$/gi${salt}.txt',
                    '^0x[a-fA-F0-9]{40}$',
                    '^[0-9a-f]{5,999}$',
                    '^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$',
                    '.*\${salt}.txt',
                    '([a-zA-Z]+([0-9]+[a-zA-Z]+)+)'
                ]
            }
        ]
    }
};	