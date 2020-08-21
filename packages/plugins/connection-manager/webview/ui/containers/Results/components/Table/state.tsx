export const initialState = {
  filters: [],
  contextMenu: {
    row: null,
    column: null,
    options: [],
    position: {
      x: null,
      y: null,
    },
    anchorEl: null
  },
  selection: [],
  columnExtensions: null,
};

export type TableState = typeof initialState;