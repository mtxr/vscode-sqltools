class ResourcesMap extends Map<string, any> {
  set(key: string, value: any): this {
    if (typeof key !== 'string') throw 'invalid resource name!';
    key = key.toLowerCase();
    return super.set(key, value);
  }
  get<V = any>(key: string) { return super.get(key.toLowerCase()) as V; }
  has(key: string) { return super.has(key.toLowerCase()); }
  delete(key: string) { return super.delete(key.toLowerCase()); }
}

const PluginResourcesMap = new ResourcesMap();

export const buildResourceKey = ({ type, name, resource }: { type: string, name: string, resource: string }) => [type, name, resource].join('/');

export default PluginResourcesMap;