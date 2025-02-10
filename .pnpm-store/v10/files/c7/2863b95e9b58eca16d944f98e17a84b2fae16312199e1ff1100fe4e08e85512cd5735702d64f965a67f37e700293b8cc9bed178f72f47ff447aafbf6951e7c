import { Data } from '../interface';
import Adjust from './adjust';
export default class Jitter extends Adjust {
    process(groupDataArray: Data[][]): Data[][];
    /**
     * 当前数据分组（index）中，按照维度 dim 进行 jitter 调整
     * @param dim
     * @param values
     * @param dataArray
     */
    protected adjustDim(dim: string, values: number[], dataArray: Data[]): void;
    private getAdjustOffset;
    private adjustGroup;
}
