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
  const openMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const options =
        typeof getOptions === 'function'
          ? getOptions((e.target as any).dataset || {}, e)
          : [];
      if (!options || options.length === 0) return;
      onOpen && onOpen((e.target as any).dataset || {});
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
    [state, state.anchorEl]
  );

  const closeMenu = useCallback(() => {
    setState(initialState);
  }, [state, state.anchorEl]);

  const onSelect = useCallback(
    (choice: string) => {
      closeMenu();
      onSelectProp && onSelectProp(choice, data || {});
    },
    [state, state.anchorEl]
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
