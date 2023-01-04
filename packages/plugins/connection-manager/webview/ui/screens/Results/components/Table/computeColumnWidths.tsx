import get from 'lodash/get';
import _ from 'lodash';
const computeColumnWidths = (colNames: string[], rows: object[]) => {
  const firstRows = rows.slice(0, 5);
  const values = colNames.map(columnName => {
    const maxCharacters = Math.max(...firstRows.map(row => JSON.stringify(get(row, [columnName], '')).length - 2));
    return Math.min(Math.max(20, maxCharacters) * 7.5, 600);
  });
  return _.zipObject(colNames, values);
}
export default computeColumnWidths;
