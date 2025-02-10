import type { DdbOptions } from 'dolphindb'


export interface DdbConfig extends DdbOptions
{
    ip: string
    port: number
}



