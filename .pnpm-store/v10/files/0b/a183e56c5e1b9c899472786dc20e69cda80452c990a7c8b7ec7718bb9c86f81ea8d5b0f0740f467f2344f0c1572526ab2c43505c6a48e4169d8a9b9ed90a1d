import Attribute, { AttributeConstructor } from './attributes/base';

interface AttributeMapType {
  [key: string]: any;
}

// 所有的 attribute map
const ATTRIBUTE_MAP: AttributeMapType = {};

/**
 * 通过类型获得 Attribute 类
 * @param type
 */
const getAttribute = (type: string) => {
  return ATTRIBUTE_MAP[type.toLowerCase()];
};

const registerAttribute = (type: string, ctor: AttributeConstructor) => {
  // 注册的时候，需要校验 type 重名，不区分大小写
  if (getAttribute(type)) {
    throw new Error(`Attribute type '${type}' existed.`);
  }
  // 存储到 map 中
  ATTRIBUTE_MAP[type.toLowerCase()] = ctor;
};

export { getAttribute, registerAttribute, Attribute };
export * from './interface';
