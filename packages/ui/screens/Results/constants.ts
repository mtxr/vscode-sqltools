export const availableFilterOperations = [
  'contains',
  'equal',
  'notEqual',
  'startsWith',
  'endsWith',
  'greaterThan',
  'greaterThanOrEqual',
  'lessThan',
  'lessThanOrEqual',
  'regex',
];

export enum MenuActions {
  FilterByValueOption = 'Filter by \'{value}\'',
  ReRunQueryOption = 'Re-run this query',
  ClearFiltersOption = 'Clear all filters',
  CopyCellOption = 'Copy Cell value',
  CopyRowOption = 'Copy Row value',
  SaveCSVOption = 'Save results as CSV',
  SaveJSONOption = 'Save results as JSON',
  OpenEditorWithValueOption = 'Open editor with \'{value}\'',
  OpenEditorWithRowOption = 'Open editor with row',
  Divider = 'sep',
}