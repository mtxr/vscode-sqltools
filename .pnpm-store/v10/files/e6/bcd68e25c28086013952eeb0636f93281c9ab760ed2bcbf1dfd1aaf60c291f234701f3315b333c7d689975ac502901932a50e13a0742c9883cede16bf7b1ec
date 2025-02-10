import { RegisterShape, RegisterShapeFactory, Shape, ShapeFactory } from '../../interface';
/**
 * 注册 ShapeFactory。
 * @param factoryName  ShapeFactory 名称，对应 Geometry 几何标记名称。
 * @param cfg 注册 ShapeFactory 需要覆写定义的属性。
 * @returns 返回 ShapeFactory 对象。
 */
export declare function registerShapeFactory(factoryName: string, cfg: RegisterShapeFactory): ShapeFactory;
/**
 * 注册 Shape。
 * @param factoryName 对应的 ShapeFactory 名称。
 * @param shapeType 注册的 shape 名称。
 * @param cfg 注册 Shape 需要覆写定义的属性。
 * @returns shape 返回注册的 shape 对象。
 */
export declare function registerShape(factoryName: string, shapeType: string, cfg: RegisterShape): Shape;
/**
 * 获取 factoryName 对应的 shapeFactory
 * @param factoryName
 * @returns shape factory
 */
export declare function getShapeFactory(factoryName: string): ShapeFactory;
