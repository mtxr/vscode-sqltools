import * as React from 'react';
import type { BaseOptionType, DefaultOptionType, FieldNames, CascaderProps as RcCascaderProps } from 'rc-cascader';
import type { SelectCommonPlacement } from '../_util/motion';
import type { InputStatus } from '../_util/statusUtils';
import type { Variant } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import CascaderPanel from './Panel';
export type { BaseOptionType, DefaultOptionType };
export type FieldNamesType = FieldNames;
export type FilledFieldNamesType = Required<FieldNamesType>;
declare const SHOW_CHILD: "SHOW_CHILD", SHOW_PARENT: "SHOW_PARENT";
export interface CascaderProps<OptionType extends DefaultOptionType = DefaultOptionType, ValueField extends keyof OptionType = keyof OptionType, Multiple extends boolean = boolean> extends Omit<RcCascaderProps<OptionType, ValueField, Multiple>, 'checkable'> {
    multiple?: Multiple;
    size?: SizeType;
    /**
     * @deprecated `showArrow` is deprecated which will be removed in next major version. It will be a
     *   default behavior, you can hide it by setting `suffixIcon` to null.
     */
    showArrow?: boolean;
    disabled?: boolean;
    /** @deprecated Use `variant` instead. */
    bordered?: boolean;
    placement?: SelectCommonPlacement;
    suffixIcon?: React.ReactNode;
    options?: OptionType[];
    status?: InputStatus;
    autoClearSearchValue?: boolean;
    rootClassName?: string;
    popupClassName?: string;
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName?: string;
    /**
     * @since 5.13.0
     * @default "outlined"
     */
    variant?: Variant;
}
export type CascaderAutoProps<OptionType extends DefaultOptionType = DefaultOptionType, ValueField extends keyof OptionType = keyof OptionType> = (CascaderProps<OptionType, ValueField> & {
    multiple?: false;
}) | (CascaderProps<OptionType, ValueField, true> & {
    multiple: true;
});
export interface CascaderRef {
    focus: () => void;
    blur: () => void;
}
declare const Cascader: (<OptionType extends DefaultOptionType = DefaultOptionType, ValueField extends keyof OptionType = keyof OptionType>(props: React.PropsWithChildren<CascaderAutoProps<OptionType, ValueField>> & React.RefAttributes<CascaderRef>) => React.ReactElement) & {
    displayName: string;
    SHOW_PARENT: typeof SHOW_PARENT;
    SHOW_CHILD: typeof SHOW_CHILD;
    Panel: typeof CascaderPanel;
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};
declare const PurePanel: (props: import("../_util/type").AnyObject) => React.JSX.Element;
export default Cascader;
