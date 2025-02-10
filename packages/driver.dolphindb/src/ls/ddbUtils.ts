export function scalarToVector (scalar: any): any[] {
    return [[scalar]]
}

export function arrayToMatrix (arr: any[], cols: number): any[][] {
    const padding = cols - (arr.length % cols)
    
    if (padding < cols) 
        arr = arr.concat(Array(padding).fill(''))
    
    return Array.from({ length: arr.length / cols }, (_, i) =>
        arr.slice(i * cols, i * cols + cols)
    )
}
