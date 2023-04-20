import vue from 'rollup-plugin-vue'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default [
    {
        input: 'src/index.js',
        output: [
            {
                format: 'esm',
                file: 'dist/datatable.mjs'
            },
            {
                format: 'cjs',
                file: 'dist/datatable.js'
            }
        ],
        plugins: [
            vue(), peerDepsExternal()
        ]
    }
]
