import type { TransferKey } from '../interface';
export default function useSelection<T extends {
    key: TransferKey;
}>(leftDataSource: T[], rightDataSource: T[], selectedKeys?: TransferKey[]): [
    sourceSelectedKeys: TransferKey[],
    targetSelectedKeys: TransferKey[],
    setSourceSelectedKeys: (srcKeys: TransferKey[]) => void,
    setTargetSelectedKeys: (srcKeys: TransferKey[]) => void
];
