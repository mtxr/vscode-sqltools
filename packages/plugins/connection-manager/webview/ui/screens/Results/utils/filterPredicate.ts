import { IntegratedFiltering } from '@devexpress/dx-react-grid';
export const filterPredicate: typeof IntegratedFiltering['defaultPredicate'] = (value, filter, row) => {
  if (filter.operation !== 'regex') {
    return IntegratedFiltering.defaultPredicate(value, filter, row);
  }
  try {
    return `${value}`.search((filter as any).regex || filter.value) !== -1;
  }
  catch (error) {
    return false;
  }
};
