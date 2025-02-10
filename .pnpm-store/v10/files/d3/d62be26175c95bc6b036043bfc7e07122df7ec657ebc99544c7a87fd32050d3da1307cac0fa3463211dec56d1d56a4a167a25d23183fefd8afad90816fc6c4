import { Version1Options } from './types.js';
type V1State = {
    node?: Uint8Array;
    clockseq?: number;
    msecs?: number;
    nsecs?: number;
};
declare function v1(options?: Version1Options, buf?: undefined, offset?: number): string;
declare function v1(options: Version1Options | undefined, buf: Uint8Array, offset?: number): Uint8Array;
export declare function updateV1State(state: V1State, now: number, rnds: Uint8Array): V1State;
export default v1;
