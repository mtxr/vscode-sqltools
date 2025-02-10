import View from '../view';
export type Layout = (view: View) => void;
/**
 * @ignore
 * G2 默认提供的 layout 函数
 * 内置布局函数处理的逻辑：
 *
 * 1. 如果 padding = 'auto'，那么自动根据组件的 direction 来计算 padding 数组
 * 2. 根据 padding 和 direction 去分配对应方向的 padding 数值
 * 3. 移动组件位置
 *
 * 前面 1，2 步骤在 view 中已经做掉了。对于组件响应式布局，可以尝试使用约束布局的方式去求解位置信息。
 * @param view
 */
export default function defaultLayout(view: View): void;
