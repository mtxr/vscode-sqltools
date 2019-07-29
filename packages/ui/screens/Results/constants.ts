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
  ClearFiltersOption = 'Clear All Filters',
  CopyCellOption = 'Copy {contextAction}',
  CopyRowOption = 'Copy Row Value',
  SaveCSVOption = 'Save Results As Csv',
  SaveJSONOption = 'Save Results As Json',
  OpenEditorWithValueOption = 'Open Editor With {contextAction}',
  OpenEditorWithRowOption = 'Open Editor With Row',
  Divider = 'sep',
}