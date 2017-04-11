interface StorageInterface {
  storagePath: string;
  encoding: string;
  serializeContent(): Buffer;
  save(): StorageInterface;
  readFile(): StorageInterface;
  writeFile(): StorageInterface;
}

export default StorageInterface;
