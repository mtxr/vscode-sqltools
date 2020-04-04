export const initialState = {
  filters: [],
  contextMenu: {
    row: null,
    rowKey: null,
    column: null,
    options: [],
    position: {},
  },
  columnExtensions: null,
};

export type TableState = typeof initialState;