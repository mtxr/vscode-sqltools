export interface StorageInterface {
  storagePath: string;
  encoding: string;
  save(): this;
  read(): this;
  reset(): this;
}
