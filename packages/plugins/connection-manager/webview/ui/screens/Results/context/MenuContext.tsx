import React, { useCallback, useState } from 'react';
import Menu from '../../../components/Menu';

export interface IMenuContextState {
  data?: { [key: string]: any };
  options: ({ value: string; label: string } | string)[];
  position: {
    x: number;
    y: number;
  };
  anchorEl: HTMLElement & EventTarget;
}

type IMenuContext = IMenuContextState & {
  // openMenu: (e: React.MouseEvent<HTMLElement>) => void;
  // closeMenu: () => void;
};
export const MenuContext = React.createContext<IMenuContext>(
  {} as IMenuContext
);

const initialState: IMenuContextState = {
  data: {},
  options: [],
  position: {
    x: null,
    y: null,
  },
  anchorEl: null,
};
export const MenuProvider = ({
  children,
  width = 300,
  getOptions,
  onSelect: onSelectProp,
  onOpen,
}: IMenuProviderProps) => {
  const [state, setState] = useState<IMenuContextState>(initialState);
  const { data, options, position, anchorEl } = state;

  // Keep refs to the latest callbacks so openMenu/onSelect never close over
  // stale versions.  Without this, openMenu is created once (when selection
  // is empty) and never sees updated onOpen/getOptions even after selection
  // changes - causing the first right-click to always use the stale closure.
  const getOptionsRef = React.useRef(getOptions);
  const onOpenRef = React.useRef(onOpen);
  const onSelectRef = React.useRef(onSelectProp);
  React.useEffect(() => { getOptionsRef.current = getOptions; }, [getOptions]);
  React.useEffect(() => { onOpenRef.current = onOpen; }, [onOpen]);
  React.useEffect(() => { onSelectRef.current = onSelectProp; }, [onSelectProp]);

  const openMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const options =
        typeof getOptionsRef.current === 'function'
          ? getOptionsRef.current((e.target as any).dataset || {}, e)
          : [];
      if (!options || options.length === 0) return;
      onOpenRef.current && onOpenRef.current((e.target as any).dataset || {});
      setState({
        data: (e.target as any).dataset || {},
        options,
        anchorEl: e.currentTarget,
        position: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    },
    [state.anchorEl]
  );

  const closeMenu = useCallback(() => {
    setState(initialState);
  }, []);

  const onSelect = useCallback(
    (choice: string) => {
      closeMenu();
      onSelectRef.current && onSelectRef.current(choice, data || {});
    },
    [data, closeMenu]
  );
  return (
    <MenuContext.Provider
      value={{
        data,
        options,
        position,
        anchorEl,
      }}
    >
      {React.cloneElement(children, { onContextMenu: openMenu })}
      <Menu
        anchorEl={anchorEl}
        width={width}
        onClose={closeMenu}
        position={position}
        onSelect={onSelect}
        options={options}
      />
    </MenuContext.Provider>
  );
};

interface IMenuProviderProps {
  children: React.ReactElement<any>;
  width?: number;
  onSelect?: (choice: string, data?: IMenuContextState['data']) => void;
  onOpen?: (data: IMenuContextState['data']) => void;
  getOptions?: (
    data: IMenuContextState['data'],
    e: React.MouseEvent<HTMLElement>
  ) => IMenuContextState['options'];
}
