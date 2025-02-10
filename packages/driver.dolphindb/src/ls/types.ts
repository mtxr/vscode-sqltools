import type { DdbOptions } from 'dolphindb'

// dolphindb自定义链接配置接口
export interface DdbConfig extends DdbOptions
{
    ip: string
    port: number
}



