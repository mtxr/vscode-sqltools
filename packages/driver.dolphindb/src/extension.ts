import { type IDriverAlias, type IDriverExtensionApi, type IExtension } from '@sqltools/types'
import { type ExtensionContext, extensions } from 'vscode'

import { t } from '@i18n/index.ts'

import { dolphindbDriver } from './ls/driver.ts'

export const driver_aliases: IDriverAlias[] = [
    { displayName: 'DolphinDB', value: 'dolphindb' },
]


export const extension_id = 'dolphindb.dolphindb-vscode'

export const extension_name = 'DolphinDB SQLTools Driver'


export async function activate (ctx: ExtensionContext): Promise<IDriverExtensionApi> {
    const sqltools = extensions.getExtension<IExtension>('mtxr.sqltools')
    if (!sqltools) 
        throw new Error(t('SQLTools 插件未安装'))
    
    await sqltools.activate()
    
    sqltools.exports.registerPlugin({
        extensionId: extension_id,
        name: extension_name,
        type: 'driver',
        async register (extension) {
            const map = extension.resourcesMap()
            
            map.set(`driver/${driver_aliases[0].value}/icons`, {
                active: ctx.asAbsolutePath('icons/active.png'),
                default: ctx.asAbsolutePath('icons/default.png'),
                inactive: ctx.asAbsolutePath('icons/inactive.png')
            })
            
            driver_aliases.forEach(({ value }) => {
                map.set(`driver/${value}/extension-id`, extension_id)
                map.set(`driver/${value}/connection-schema`, ctx.asAbsolutePath('../connection.schema.json'))
                map.set(`driver/${value}/ui-schema`, ctx.asAbsolutePath('../ui.schema.json'))
            })
            
            await extension.client.sendRequest('ls/RegisterPlugin', { path: ctx.asAbsolutePath('ls/plugin.cjs') })
        }
    })
    return {
        driverName: extension_name,
        
        driverAliases: driver_aliases,
        
        parseBeforeSaveConnection: ({ connInfo: info }) => {
            // This hook is called before saving the connection using the assistant
            // so you can do any transformations before saving it to disk.active
            // EG: relative file path transformation, string manipulation etc
            // Below is the exmaple for SQLite, where we save the DB path relative to workspace
            // and later we transform it back to absolute before editing
            // if (path.isAbsolute(connInfo.database)) {
            //   const databaseUri = Uri.file(connInfo.database);
            //   const dbWorkspace = workspace.getWorkspaceFolder(databaseUri);
            //   if (dbWorkspace) {
            //     connInfo.database = `\$\{workspaceFolder:${dbWorkspace.name}\}/${workspace.asRelativePath(connInfo.database, false)}`;
            //   }
            // }
            
            console.log('ddb.sqltools.parseBeforeSaveConnection:', info)
            return info
        },
        
        parseBeforeEditConnection: ({ connInfo: info }) => {
            // This hook is called before editing the connection using the assistant
            // so you can do any transformations before editing it.
            // EG: absolute file path transformation, string manipulation etc
            // Below is the exmaple for SQLite, where we use relative path to save,
            // but we transform to asolute before editing
            // if (!path.isAbsolute(connInfo.database) && /\$\{workspaceFolder:(.+)}/g.test(connInfo.database)) {
            //   const workspaceName = connInfo.database.match(/\$\{workspaceFolder:(.+)}/)[1];
            //   const dbWorkspace = workspace.workspaceFolders.find(w => w.name === workspaceName);
            //   if (dbWorkspace)
            //     connInfo.database = path.resolve(dbWorkspace.uri.fsPath, connInfo.database.replace(/\$\{workspaceFolder:(.+)}/g, './'));
            // }
            
            console.log('ddb.sqltools.parseBeforeEditConnection:', info)
            
            return info
        }
    }
}
