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

// eslint-disable-next-line
export { DdbDriverPlugin, DdbDriverPlugin as default }
