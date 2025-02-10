"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var event_1 = require("../util/event");
var matrix_1 = require("../util/matrix");
var util_2 = require("../util/util");
var component_1 = require("./component");
var STATUS_UPDATE = 'update_status';
var COPY_PROPERTIES = ['visible', 'tip', 'delegateObject']; // 更新对象时需要复制的属性
var COPY_PROPERTIES_EXCLUDES = ['container', 'group', 'shapesMap', 'isRegister', 'isUpdating', 'destroyed']; // 更新子组件时排除的属性
var GroupComponent = /** @class */ (function (_super) {
    tslib_1.__extends(GroupComponent, _super);
    function GroupComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupComponent.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return tslib_1.__assign(tslib_1.__assign({}, cfg), { container: null, 
            /**
             * @private
             * 缓存图形的 Map
             */
            shapesMap: {}, group: null, capture: true, 
            /**
             * @private 组件或者图形是否允许注册
             * @type {false}
             */
            isRegister: false, 
            /**
             * @private 是否正在更新
             * @type {false}
             */
            isUpdating: false, 
            /**
             * @private
             * 是否初始状态，一旦 render，update 后，这个状态就变成 false, clear 后恢复
             */
            isInit: true });
    };
    GroupComponent.prototype.remove = function () {
        this.clear();
        var group = this.get('group');
        group.remove();
    };
    GroupComponent.prototype.clear = function () {
        var group = this.get('group');
        group.clear();
        this.set('shapesMap', {});
        this.clearOffScreenCache();
        this.set('isInit', true);
    };
    GroupComponent.prototype.getChildComponentById = function (id) {
        var group = this.getElementById(id);
        var inst = group && group.get('component');
        return inst;
    };
    GroupComponent.prototype.getElementById = function (id) {
        return this.get('shapesMap')[id];
    };
    GroupComponent.prototype.getElementByLocalId = function (localId) {
        var id = this.getElementId(localId);
        return this.getElementById(id);
    };
    GroupComponent.prototype.getElementsByName = function (name) {
        var rst = [];
        util_1.each(this.get('shapesMap'), function (elem) {
            if (elem.get('name') === name) {
                rst.push(elem);
            }
        });
        return rst;
    };
    GroupComponent.prototype.getContainer = function () {
        return this.get('container');
    };
    GroupComponent.prototype.updateInner = function (cfg) {
        // this.updateInner();
        // this.set('isUpdating', false);
        this.offScreenRender();
        if (this.get('updateAutoRender')) {
            this.render();
        }
    };
    GroupComponent.prototype.render = function () {
        var offScreenGroup = this.get('offScreenGroup');
        if (!offScreenGroup) {
            offScreenGroup = this.offScreenRender();
        }
        var group = this.get('group');
        this.updateElements(offScreenGroup, group);
        this.deleteElements();
        this.applyOffset();
        if (!this.get('eventInitted')) {
            this.initEvent();
            this.set('eventInitted', true);
        }
        this.set('isInit', false);
    };
    GroupComponent.prototype.show = function () {
        var group = this.get('group');
        group.show();
        this.set('visible', true);
    };
    GroupComponent.prototype.hide = function () {
        var group = this.get('group');
        group.hide();
        this.set('visible', false);
    };
    GroupComponent.prototype.setCapture = function (capture) {
        var group = this.get('group');
        group.set('capture', capture);
        this.set('capture', capture);
    };
    GroupComponent.prototype.destroy = function () {
        this.removeEvent();
        this.remove();
        _super.prototype.destroy.call(this);
    };
    GroupComponent.prototype.getBBox = function () {
        return this.get('group').getCanvasBBox();
    };
    GroupComponent.prototype.getLayoutBBox = function () {
        var group = this.get('group');
        // 防止被 clear 了，offScreenBBox 不存在
        var bbox = this.getInnerLayoutBBox();
        var matrix = group.getTotalMatrix();
        if (matrix) {
            bbox = matrix_1.applyMatrix2BBox(matrix, bbox);
        }
        return bbox; // 默认返回 getBBox，不同的组件内部单独实现
    };
    // 复写 on, off, emit 透传到 group
    GroupComponent.prototype.on = function (evt, callback, once) {
        var group = this.get('group');
        group.on(evt, callback, once);
        return this;
    };
    GroupComponent.prototype.off = function (evt, callback) {
        var group = this.get('group');
        group && group.off(evt, callback);
        return this;
    };
    GroupComponent.prototype.emit = function (eventName, eventObject) {
        var group = this.get('group');
        group.emit(eventName, eventObject);
    };
    GroupComponent.prototype.init = function () {
        _super.prototype.init.call(this);
        if (!this.get('group')) {
            this.initGroup();
        }
        this.offScreenRender(); // 绘制离屏 group
    };
    // 获取组件内部布局占的包围盒
    GroupComponent.prototype.getInnerLayoutBBox = function () {
        return this.get('offScreenBBox') || this.get('group').getBBox();
    };
    // 抛出委托对象
    GroupComponent.prototype.delegateEmit = function (eventName, eventObject) {
        var group = this.get('group');
        eventObject.target = group;
        group.emit(eventName, eventObject);
        event_1.propagationDelegate(group, eventName, eventObject);
    };
    // 创建离屏的 group ,不添加在 canvas 中
    GroupComponent.prototype.createOffScreenGroup = function () {
        var group = this.get('group');
        var GroupClass = group.getGroupBase(); // 获取分组的构造函数
        var newGroup = new GroupClass({
            delegateObject: this.getDelegateObject(),
        });
        return newGroup;
    };
    // 应用 offset
    GroupComponent.prototype.applyOffset = function () {
        var offsetX = this.get('offsetX');
        var offsetY = this.get('offsetY');
        this.moveElementTo(this.get('group'), {
            x: offsetX,
            y: offsetY,
        });
    };
    GroupComponent.prototype.initGroup = function () {
        var container = this.get('container');
        this.set('group', container.addGroup({
            id: this.get('id'),
            name: this.get('name'),
            capture: this.get('capture'),
            visible: this.get('visible'),
            isComponent: true,
            component: this,
            delegateObject: this.getDelegateObject(),
        }));
    };
    // 离屏渲染
    GroupComponent.prototype.offScreenRender = function () {
        this.clearOffScreenCache();
        var offScreenGroup = this.createOffScreenGroup();
        this.renderInner(offScreenGroup);
        this.set('offScreenGroup', offScreenGroup);
        // 包含包围盒的 bbox
        this.set('offScreenBBox', util_2.getBBoxWithClip(offScreenGroup));
        return offScreenGroup;
    };
    /**
     * @protected
     * 在组件上添加分组，主要解决 isReigeter 的问题
     * @param {IGroup} parent 父元素
     * @param {object} cfg    分组的配置项
     */
    GroupComponent.prototype.addGroup = function (parent, cfg) {
        this.appendDelegateObject(parent, cfg);
        var group = parent.addGroup(cfg);
        if (this.get('isRegister')) {
            this.registerElement(group);
        }
        return group;
    };
    /**
     * @protected
     * 在组件上添加图形，主要解决 isReigeter 的问题
     * @param {IGroup} parent 父元素
     * @param {object} cfg    分组的配置项
     */
    GroupComponent.prototype.addShape = function (parent, cfg) {
        this.appendDelegateObject(parent, cfg);
        var shape = parent.addShape(cfg);
        if (this.get('isRegister')) {
            this.registerElement(shape);
        }
        return shape;
    };
    /**
     * 在组件上添加子组件
     *
     * @param parent 父元素
     * @param cfg 子组件配置项
     */
    GroupComponent.prototype.addComponent = function (parent, cfg) {
        var id = cfg.id, Ctor = cfg.component, restCfg = tslib_1.__rest(cfg, ["id", "component"]);
        // @ts-ignore
        var inst = new Ctor(tslib_1.__assign(tslib_1.__assign({}, restCfg), { id: id, container: parent, updateAutoRender: this.get('updateAutoRender') }));
        inst.init();
        inst.render();
        if (this.get('isRegister')) {
            this.registerElement(inst.get('group'));
        }
        return inst;
    };
    GroupComponent.prototype.initEvent = function () { };
    GroupComponent.prototype.removeEvent = function () {
        var group = this.get('group');
        group.off();
    };
    GroupComponent.prototype.getElementId = function (localId) {
        var id = this.get('id'); // 组件的 Id
        var name = this.get('name'); // 组件的名称
        return id + "-" + name + "-" + localId;
    };
    GroupComponent.prototype.registerElement = function (element) {
        var id = element.get('id');
        this.get('shapesMap')[id] = element;
    };
    GroupComponent.prototype.unregisterElement = function (element) {
        var id = element.get('id');
        delete this.get('shapesMap')[id];
    };
    // 移动元素
    GroupComponent.prototype.moveElementTo = function (element, point) {
        var matrix = matrix_1.getMatrixByTranslate(point);
        element.attr('matrix', matrix);
    };
    /**
     * 图形元素新出现时的动画，默认图形从透明度 0 到当前透明度
     * @protected
     * @param {string} elmentName 图形元素名称
     * @param {IElement} newElement  新的图形元素
     * @param {object} animateCfg 动画的配置项
     */
    GroupComponent.prototype.addAnimation = function (elmentName, newElement, animateCfg) {
        // 缓存透明度
        var originOpacity = newElement.attr('opacity');
        if (util_1.isNil(originOpacity)) {
            originOpacity = 1;
        }
        newElement.attr('opacity', 0);
        newElement.animate({ opacity: originOpacity }, animateCfg);
    };
    /**
     * 图形元素新出现时的动画，默认图形从透明度 0 到当前透明度
     * @protected
     * @param {string} elmentName 图形元素名称
     * @param {IElement} originElement 要删除的图形元素
     * @param {object} animateCfg 动画的配置项
     */
    GroupComponent.prototype.removeAnimation = function (elementName, originElement, animateCfg) {
        originElement.animate({ opacity: 0 }, animateCfg);
    };
    /**
     * 图形元素的更新动画
     * @param {string} elmentName 图形元素名称
     * @param {IElement} originElement 现有的图形元素
     * @param {object} newAttrs  新的图形元素
     * @param {object} animateCfg 动画的配置项
     */
    GroupComponent.prototype.updateAnimation = function (elementName, originElement, newAttrs, animateCfg) {
        originElement.animate(newAttrs, animateCfg);
    };
    // 更新组件的图形
    GroupComponent.prototype.updateElements = function (newGroup, originGroup) {
        var _this = this;
        var animate = this.get('animate');
        var animateOption = this.get('animateOption');
        var children = newGroup.getChildren().slice(0); // 创建一个新数组，防止添加到 originGroup 时， children 变动
        var preElement; // 前面已经匹配到的图形元素，用于
        util_1.each(children, function (element) {
            var elementId = element.get('id');
            var originElement = _this.getElementById(elementId);
            var elementName = element.get('name');
            if (originElement) {
                if (element.get('isComponent')) {
                    // 嵌套子组件更新
                    var childComponent = element.get('component');
                    var origChildComponent = originElement.get('component');
                    var newCfg = util_1.pick(childComponent.cfg, util_1.difference(util_1.keys(childComponent.cfg), COPY_PROPERTIES_EXCLUDES));
                    origChildComponent.update(newCfg);
                    originElement.set(STATUS_UPDATE, 'update');
                }
                else {
                    var replaceAttrs = _this.getReplaceAttrs(originElement, element);
                    // 更新
                    if (animate && animateOption.update) {
                        // 没有动画
                        _this.updateAnimation(elementName, originElement, replaceAttrs, animateOption.update);
                    }
                    else {
                        // originElement.attrs = replaceAttrs; // 直接替换
                        originElement.attr(replaceAttrs);
                    }
                    // 如果是分组，则继续执行
                    if (element.isGroup()) {
                        _this.updateElements(element, originElement);
                    }
                    // 复制属性
                    util_1.each(COPY_PROPERTIES, function (name) {
                        originElement.set(name, element.get(name));
                    });
                    util_2.updateClip(originElement, element);
                    preElement = originElement;
                    // 执行完更新后设置状态位为更新
                    originElement.set(STATUS_UPDATE, 'update');
                }
            }
            else {
                // 没有对应的图形，则插入当前图形
                originGroup.add(element); // 应该在 group 加个 insertAt 的方法
                var siblings = originGroup.getChildren(); // 兄弟节点
                siblings.splice(siblings.length - 1, 1); // 先从数组中移除，然后放到合适的位置
                if (preElement) {
                    // 前面已经有更新的图形或者插入的图形，则在这个图形后面插入
                    var index = siblings.indexOf(preElement);
                    siblings.splice(index + 1, 0, element); // 在已经更新的图形元素后面插入
                }
                else {
                    siblings.unshift(element);
                }
                _this.registerElement(element); // 注册节点
                element.set(STATUS_UPDATE, 'add'); // 执行完更新后设置状态位为添加
                if (element.get('isComponent')) {
                    // 直接新增子组件container属性，实例不变
                    var childComponent = element.get('component');
                    childComponent.set('container', originGroup);
                }
                else if (element.isGroup()) {
                    // 如果元素是新增加的元素，则遍历注册所有的子节点
                    _this.registerNewGroup(element);
                }
                preElement = element;
                if (animate) {
                    var animateCfg = _this.get('isInit') ? animateOption.appear : animateOption.enter;
                    if (animateCfg) {
                        _this.addAnimation(elementName, element, animateCfg);
                    }
                }
            }
        });
    };
    GroupComponent.prototype.clearUpdateStatus = function (group) {
        var children = group.getChildren();
        util_1.each(children, function (el) {
            el.set(STATUS_UPDATE, null); // 清理掉更新状态
        });
    };
    // 清理离屏缓存
    GroupComponent.prototype.clearOffScreenCache = function () {
        var offScreenGroup = this.get('offScreenGroup');
        if (offScreenGroup) {
            // 销毁原先的离线 Group
            offScreenGroup.destroy();
        }
        this.set('offScreenGroup', null);
        this.set('offScreenBBox', null);
    };
    // private updateInner() {
    //   const group = this.get('group');
    //   const newGroup = this.createOffScreenGroup();
    //   this.renderInner(newGroup);
    //   this.applyOffset();
    //   this.updateElements(newGroup, group);
    //   this.deleteElements();
    //   newGroup.destroy(); // 销毁虚拟分组
    // }
    // 获取发生委托时的对象，在事件中抛出
    GroupComponent.prototype.getDelegateObject = function () {
        var _a;
        var name = this.get('name');
        var delegateObject = (_a = {},
            _a[name] = this,
            _a.component = this,
            _a);
        return delegateObject;
    };
    // 附加委托信息，用于事件
    GroupComponent.prototype.appendDelegateObject = function (parent, cfg) {
        var parentObject = parent.get('delegateObject');
        if (!cfg.delegateObject) {
            cfg.delegateObject = {};
        }
        util_1.mix(cfg.delegateObject, parentObject); // 将父元素上的委托信息复制到自身
    };
    // 获取需要替换的属性，如果原先图形元素存在，而新图形不存在，则设置 undefined
    GroupComponent.prototype.getReplaceAttrs = function (originElement, newElement) {
        var originAttrs = originElement.attr();
        var newAttrs = newElement.attr();
        util_1.each(originAttrs, function (v, k) {
            if (newAttrs[k] === undefined) {
                newAttrs[k] = undefined;
            }
        });
        return newAttrs;
    };
    GroupComponent.prototype.registerNewGroup = function (group) {
        var _this = this;
        var children = group.getChildren();
        util_1.each(children, function (element) {
            _this.registerElement(element); // 注册节点
            element.set(STATUS_UPDATE, 'add'); // 执行完更新后设置状态位为添加
            if (element.isGroup()) {
                _this.registerNewGroup(element);
            }
        });
    };
    // 移除多余的元素
    GroupComponent.prototype.deleteElements = function () {
        var _this = this;
        var shapesMap = this.get('shapesMap');
        var deleteArray = [];
        // 遍历获取需要删除的图形元素
        util_1.each(shapesMap, function (element, id) {
            if (!element.get(STATUS_UPDATE) || element.destroyed) {
                deleteArray.push([id, element]);
            }
            else {
                element.set(STATUS_UPDATE, null); // 清理掉更新状态
            }
        });
        var animate = this.get('animate');
        var animateOption = this.get('animateOption');
        // 删除图形元素
        util_1.each(deleteArray, function (item) {
            var id = item[0], element = item[1];
            if (!element.destroyed) {
                var elementName = element.get('name');
                if (animate && animateOption.leave) {
                    // 需要动画结束时移除图形
                    var callbackAnimCfg = util_1.mix({
                        callback: function () {
                            _this.removeElement(element);
                        },
                    }, animateOption.leave);
                    _this.removeAnimation(elementName, element, callbackAnimCfg);
                }
                else {
                    _this.removeElement(element);
                }
            }
            delete shapesMap[id]; // 从缓存中移除
        });
    };
    GroupComponent.prototype.removeElement = function (element) {
        if (element.get('isGroup')) {
            var component = element.get('component');
            if (component) {
                component.destroy();
            }
        }
        element.remove();
    };
    return GroupComponent;
}(component_1.default));
exports.default = GroupComponent;
//# sourceMappingURL=group-component.js.map