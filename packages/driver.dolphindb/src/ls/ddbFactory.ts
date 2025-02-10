import { DDB } from 'dolphindb'

import type { DdbConfig } from './types.ts' 


export async function createDDBClient (configOptions: DdbConfig): Promise<DDB> {
    const urladdress = `ws://${configOptions.ip}:${configOptions.port}` 
    const ddb = new DDB(urladdress,
        { 
            autologin: configOptions.autologin,
            username: configOptions.username,
            password: configOptions.password, 
            verbose: true
        }
    )
    await ddb.connect() 
    return Promise.resolve(ddb) 
}
