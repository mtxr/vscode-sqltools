import { filterPredicate } from '../../utils/filterPredicate';
import get from 'lodash/get';
const generateColumnExtensions = (colNames, rows) => colNames.map(columnName => ({
  columnName,
  predicate: filterPredicate,
  width: Math.min(Math.max(20, JSON.stringify(get(rows, [0, columnName], '')).length - 2, JSON.stringify(get(rows, [1, columnName], '')).length - 2, JSON.stringify(get(rows, [2, columnName], '')).length - 2, JSON.stringify(get(rows, [3, columnName], '')).length - 2, JSON.stringify(get(rows, [4, columnName], '')).length - 2) * 7.5, 600)
}));
export default generateColumnExtensions;