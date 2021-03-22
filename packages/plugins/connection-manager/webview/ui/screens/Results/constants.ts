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
  FilterByValueOption = 'Filter By {contextAction}',
  ReRunQueryOption = 'Re-Run This Query',
  ClearSelection = 'Clear Selection',
  ClearFiltersOption = 'Clear All Filters',
  CopyCellOption = 'Copy {contextAction}',
  CopyRowOption = 'Copy Selected JSON Row(s)',
  SaveCSVOption = 'Save Results as CSV',
  SaveJSONOption = 'Save Results as JSON',
  OpenEditorWithValueOption = 'Open Editor With {contextAction}',
  OpenEditorWithRowOption = 'Open Editor With Selected JSON Row(s)',
  Divider = 'sep',
}