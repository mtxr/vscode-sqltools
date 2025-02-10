// 这个文件会被单独打包，被 sqltools language server 独立进程加载，所以不能 import ... from 'vscode' 导入 vscode 依赖，所以不能 import ./index.ts

import { type ILanguageServerPlugin, type IDriverAlias } from '@sqltools/types'

import { dolphindbDriver } from './driver.ts'

export const driver_aliases: IDriverAlias[] = [
    { displayName: 'DolphinDB', value: 'dolphindb' },
    { displayName: 'dolphindb', value: 'dolphindb' },
]


const DdbDriverPlugin: ILanguageServerPlugin = {
    register (server) {
        driver_aliases.forEach(({ value }) => {
            server.getContext().drivers.set(value, dolphindbDriver as any)
        })
    }
}

// DdbDriverPlugin 必须作为 default 导出
// eslint-disable-next-line
export { DdbDriverPlugin, DdbDriverPlugin as default }
