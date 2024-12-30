import { createTheme } from '@material-ui/core/styles';

export const MuiTabHeight = '36px';
export const defaultColors = {
  backgroundColor: 'var(--vscode-editor-background)',
  color: 'var(--vscode-editor-foreground)'
}

const theme = createTheme({
  palette: {
    background: {
      default: defaultColors.backgroundColor,
      paper: defaultColors.backgroundColor,
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        borderCollapse: 'collapse',
        ...defaultColors,
      },
      elevation0: {
        zIndex: 0,
      },
      rounded: {
        borderRadius: '1px',
      },
    },
    MuiTable: {
      root: {
        borderCollapse: 'collapse !important' as any,
        ...defaultColors,
      },
    },
    MuiMenu: {
      paper: {
        backgroundColor: 'var(--vscode-menu-background)',
        color: 'var(--vscode-menu-foreground)',
      },
    },
    MuiMenuItem: {
      root: {
        minHeight: 'auto',
      },
      gutters: {
        padding: '4px 24px',
        '&:hover': {
          background: 'var(--vscode-menu-selectionBackground)',
          color: 'var(--vscode-menu-selectionForeground)',
        },
      },
    },
    MuiList: {
      padding: {
        padding: '4px 0px',
      },
    },
    MuiListItem: {
      root: {
        flexDirection: 'row',
        alignItems: 'center',
        '&$selected': {
          background: 'var(--vscode-menu-selectionBackground)',
          color: 'var(--vscode-menu-selectionForeground)',
        },
        '&:hover': {
          background: 'var(--vscode-menu-selectionBackground)',
          color: 'var(--vscode-menu-selectionForeground)',
        },
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: 'var(--vscode-menu-separatorBackground)',
        margin: '4px 0',
        opacity: '0.4',
      },
    },

    MuiListItemIcon: {
      root: {
        color: 'inherit',
      },
    },
    MuiListItemText: {
      root: {
        margin: 0,
      },
    },
    MuiTab: {
      root: {
        minHeight: MuiTabHeight,
      },
      textColorPrimary: {
        color: 'var(--vscode-tab-inactiveForeground)',
        background: 'var(--vscode-tab-inactiveBackground)',
        '&$selected': {
          color: 'var(--vscode-tab-activeForeground)',
          background: 'var(--vscode-tab-activeBackground)',
        },
      },
    },
    MuiTabs: {
      root: {
        minHeight: MuiTabHeight,
        background: 'var(--vscode-tab-inactiveBackground)',
      },
      indicator: {
        backgroundColor: 'var(--vscode-tab-activeModifiedBorder)',
      },
    },
    MuiTableCell: {
      root: {
        padding: 'var(--sqltool-table-cell-padding, 2px 4px) !important',
        fontWeight: 'normal',
        fontSize: 'inherit',
      },
      body: {
        color: 'inherit',
        border: '1px solid var(--vscode-input-border)',
        '&.syntax': {
          fontFamily: 'var(--vscode-editor-font-family, var(--font-family))',
          height: '300px',
          overflow: 'auto',
        },
      },
      head: {
        fontWeight: 'bold',
        color: 'inherit',
        border: '1px solid var(--vscode-input-border)',
        background: 'var(--vscode-panelSectionHeader-background)',
        borderBottom: 'none',
      },
    },
    MuiInput: {
      root: {
        margin: '0 !important',
      },
      underline: {
        '&:before': {
          display: 'none',
        },
        '&:after': {
          display: 'none',
        },
      },
    },
    MuiIconButton: {
      root: {
        color: 'inherit',
        padding: '0 4px',
      },
      label: {
        color: 'inherit',
      },
    },
    MuiInputBase: {
      input: {
        color: 'var(--vscode-input-foreground)',
        height: '1em',
        padding: '4px',
      },
    },
    MuiTableSortLabel: {
      root: {
        color: 'inherit !important',
      },
      icon: {
        color: 'inherit !important',
      },
    },
  },
});


export default theme;