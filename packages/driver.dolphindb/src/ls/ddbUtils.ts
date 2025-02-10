export function scalarToVector (scalar: any): any[] {
    return [[scalar]]
}

export function arrayToMatrix (arr: any[], cols: number): any[][] {
    // 计算需要填充的空元素数量
    const padding = cols - (arr.length % cols)
    // 如果需要填充，则添加空元素到数组末尾
    if (padding < cols) 
        arr = arr.concat(Array(padding).fill(''))
    
    // 转换为矩阵
    return Array.from({ length: arr.length / cols }, (_, i) =>
        arr.slice(i * cols, i * cols + cols)
    )
}
