import { fdelete, fmkdir, fwrite, ramdisk, set_inspect_options } from 'xshell'
import { Git } from 'xshell/git.js'
import { Bundler } from 'xshell/builder.js'
import type { Item } from 'xshell/i18n/index.js'


import { tm_language, tm_language_python } from 'dolphindb/language.js'


import package_json from './package.json' with { type: 'json' }


set_inspect_options()

export const fpd_root = import.meta.dirname.fpd

const fpd_ramdisk_root = 'T:/2/ddb/ext/' as const

export const fpd_out = `${ ramdisk ? fpd_ramdisk_root : fpd_root }out/`

// const fpd_out_dataview = `${fpd_out}dataview/`


export let builder = {
    dataview: null as Bundler,
    
    cjs: null as Bundler,
    
    
    async build (production: boolean) {
        console.log('项目根目录:', fpd_root)
        
        console.log(`开始构建${production ? '生产' : '开发'}模式的插件`)
        
        await fdelete(fpd_out)
        
        await Promise.all([
            this.build_package_json(),
            
            // build tm language
            fwrite(`${fpd_out}dolphindb.tmLanguage.json`, tm_language),
            fwrite(`${fpd_out}dolphindb-python.tmLanguage.json`, tm_language_python),
            
            
            (this.cjs = new Bundler(
                'extension',
                'nodejs',
                fpd_root,
                fpd_out,
                ramdisk ? `${fpd_ramdisk_root}webpack/` : undefined,
                {
                    'extension.cjs': './src/extension.ts',
                    
                    // sqltools: 打包 sqltools 独立的 language client 被 sqltools language server 加载
                    'ls/plugin.cjs': './src/ls/plugin.ts',
                },
                {
                    production,
                    license: production,
                    commonjs2: true,
                    single_chunk: false,
                    globals: {
                        FPD_ROOT: fpd_root.quote(),
                        // EXTENSION_VERSION: `${info.version} (${info.time} ${info.hash})`.quote(),
                    },
                    resolve_alias: {
                        '@i18n': `${fpd_root}i18n`,
                    },
                    assets: {
                        productions: [
                            'README.md', 'icons/',
                            
                            // sqltools: 复制所需的资源
                            // '',
                            
                            ... ['zh', 'en'].map(language => 
                                ({ src: `node_modules/dolphindb/docs.${language}.json`, out: `docs.${language}.json` })),
                                
                            // 'dolphindb.language-configuration.json',
                            // 'dolphindb-python.language-configuration.json'
                        ],
                    },
                    externals: {
                        vscode: 'commonjs2 vscode'
                    },
                }
            )).build_all()
        ])
    },
    
    
    async run () {
        await Promise.all([
            this.cjs.build()
        ])
    },
    
    
    async close () {
        await Promise.all([
            this.cjs.close()
        ])
    },
    
    
    async build_package_json () {
        const { name, type, version, engines, scripts, dependencies, devDependencies } = package_json
        
        let dict: {
            zh: Record<string, string>
            en: Record<string, string>
        } = {
            zh: { },
            en: { }
        }
        
        
        function make (id: string, zh: string, en: string) {
            let { zh: _zh, en: _en } = dict
            _zh[id] = zh
            _en[id] = en
            return id.surround('%')
        }
        
        
        const package_json_ = {
            name,
            displayName: 'SQLTools DolphinDB',
            
            type,
            
            description: 'DolphinDB Driver For SQLTools for Visual Studio Code',
            
            version,
            
            main: './extension.cjs',
            
            icon: 'icons/logo.png',
            
            engines,
            
            scripts,
            
            // 防止 vsce 检测 dependencies 对应的 node_modules 在 ./out/ 下是否安装
            devDependencies: {
                ... dependencies,
                ... devDependencies,
                
                // 在本地使用最新的 vscode api 而不修改 engines 中的硬性条件（绕过 vsce 检测）
                '@types/vscode': '^1.68.0'
            },
            
            publisher: 'dolphindb',
            
            categories: ['Programming Languages', 'Other', 'Linters'],
            keywords: ['dolphindb', 'DolphinDB', 'DataBase', 'database', 'Time Series', 'timeseries', 'Programing Language'],
            homepage: 'https://github.com/dolphindb/vscode-extension/',
            bugs: {
                url: 'https://github.com/dolphindb/vscode-extension/issues'
            },
            repository: {
                type: 'git',
                url: 'https://github.com/dolphindb/vscode-extension.git'
            },
            
            activationEvents: [
                'onStartupFinished',
                
                // 'onView:dolphindb.env',
                // 'onCommand:dolphindb.addServer',
            ],
        }
        
        
        await Promise.all([
            fwrite(`${fpd_out}package.json`, package_json_),
            
            // 保存 make 函数暂存到 dict 的词条到 nls 文件
            ...(['zh', 'en'] as const).map(async language => {
                await fwrite(
                    `${fpd_out}package.nls${ language === 'zh' ? '.zh' : '' }.json`,
                    dict[language]
                )
            })
        ])
    },
}


interface VSCodeConfiguration {
    title: string
    order?: number
    properties: Record<string, Schema>
}

interface Schema {
    /** 内部使用 */
    name?: string
    
    type: 'boolean' | 'number' | 'string' | 'object' | 'array' | 'null' | ('boolean' | 'number' | 'string' | 'object' | 'array' | 'null')[]
    default?: any
    
    items?: Schema
    
    properties?: Record<string, Schema>
    
    required?: string[]
    
    minimum?: number
    maximum?: number
    
    /** restricting string length */
    maxLength?: number
    minLength?: number
    
    /** regexp pattern */
    pattern?: string
    patternErrorMessage?: string
    patternProperties?: object
    
    format?: 'date' | 'time' | 'ipv4' | 'email' | 'uri'
    
    maxItems?: number
    minItems?: number
    
    description?: string | Item
    markdownDescription?: string | Item
    
    editPresentation?: 'multilineText'
    
    additionalProperties?: false | Record<string, 'boolean' | 'number' | 'string' | 'object' | 'array'>
    
    order?: number
    
    enum?: string[]
    enumDescriptions?: string[]
}
