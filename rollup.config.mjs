import nodeResolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import bundleSize from 'rollup-plugin-bundle-size';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import path from 'path';
import replace from '@rollup/plugin-replace';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const outputFileName = 'clam';
const name = 'clam';
const defaultInput = './src/index.ts';
const extensions = ['.ts', '.tsx', '.js'];

const buildConfig = ({minifiedVersion = true, ...config }) => {
    const { file } = config.output;
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    const extArr = ext.split('.');
    extArr.shift();


    const build = ({ minified }) => ({
        input: defaultInput,
        ...config,
        output: {
            ...config.output,
            file: `${path.dirname(file)}/${basename}.${(minified ? ['min', ...extArr] : extArr).join('.')}`
        },
        plugins: [
            json(),
            typescript(),
            ...(config.plugins || []),
            minified && terser(),
            minified && bundleSize(),
        ]
    });

    const configs = [
        build({ minified: false }),
    ];

    if (minifiedVersion) {
        configs.push(build({ minified: true }));
    }

    return configs;
};

export default async () => {
    return [
        // browser ESM bundle for CDN
        ...buildConfig({
            input: defaultInput,
            output: {
                file: `dist/esm/${outputFileName}.mjs`,
                format: 'esm',
                exports: 'named'
            },
            plugins: [
                replace({
                    preventAssignment: true,
                    values: {
                        'process.env.NODE_ENV': 'production',
                        'process.env.NODE_DEBUG': false
                    }
                }),
                commonjs(),
                nodePolyfills(),
                nodeResolve({ preferBuiltins: false, browser: true }),
            ]
        }),

        // Browser UMD bundle for CDN
        // ...buildConfig({
        //     input: defaultInput,
        //     output: {
        //         file: `dist/${outputFileName}.js`,
        //         name,
        //         format: 'umd',
        //         exports: 'named',
        //     }
        // }),

        // Node.js commonjs bundle
        ...buildConfig({
            input: defaultInput,
            output: {
                file: `dist/node/${name}.cjs`,
                format: 'cjs',
                exports: 'named',
            },
            plugins: [
                autoExternal(),
                commonjs()
            ]
        })
    ];
};