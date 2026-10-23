import React, { useState, useEffect, useRef } from 'react';
import { Table as MTable } from '@devexpress/dx-react-grid-material-ui';
import { CellValue } from './CellValue';
import style from './style.m.scss';
import useResultsContext from '../../hooks/useResultsContext';
import useCurrentResult from '../../hooks/useCurrentResult';

const boolOrNull = (v: any) => v === true || v === false || v === null;
export const isObjOrArray = (v: any) => typeof v === 'object' || Array.isArray(v);

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  border: 'none',
  background: 'var(--vscode-settings-textInputBackground, var(--vscode-editor-background))',
  color: 'var(--vscode-settings-textInputForeground, var(--vscode-editor-foreground))',
  outline: '1px solid var(--vscode-focusBorder)',
  padding: '4px 6px',
  boxSizing: 'border-box',
  fontFamily: 'var(--vscode-editor-font-family, monospace)',
  fontSize: 'inherit',
};

const parseValue = (val: string, originalVal: any) => {
  if (val.toUpperCase() === 'NULL') return null;
  if (originalVal === null) return val;
  if (typeof originalVal === 'number') {
    const num = Number(val);
    return isNaN(num) ? val : num;
  }
  if (typeof originalVal === 'boolean') {
    if (val.toLowerCase() === 'true' || val === '1') return true;
    if (val.toLowerCase() === 'false' || val === '0') return false;
    return val;
  }
  return val;
};

const TableCell = (props: MTable.DataCellProps & { className?: string }) => {
  const { editingCell, setEditingCell, edits, setEdits } = useResultsContext();
  const { result } = useCurrentResult();
  const resultId = result?.resultId;

  const rowIndex = Number(props.tableRow.rowId);
  const columnName = props.column.name;

  const originalValue = props.row[columnName];
  const editedValue = resultId && edits[resultId]?.[rowIndex]?.[columnName];
  const currentValue = editedValue !== undefined ? editedValue : originalValue;

  const isEditing = editingCell && editingCell.rowIndex === rowIndex && editingCell.columnName === columnName;

  const [localVal, setLocalVal] = useState(currentValue === null ? '' : String(currentValue));

  useEffect(() => {
    if (isEditing) {
      setLocalVal(currentValue === null ? '' : String(currentValue));
    }
  }, [isEditing, currentValue]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitEdit = () => {
    if (!resultId) return;
    const parsedVal = parseValue(localVal, originalValue);
    if (parsedVal !== originalValue) {
      setEdits(prev => {
        const resultEdits = prev[resultId] || {};
        const rowEdits = resultEdits[rowIndex] || {};
        return {
          ...prev,
          [resultId]: {
            ...resultEdits,
            [rowIndex]: {
              ...rowEdits,
              [columnName]: parsedVal
            }
          }
        };
      });
    } else {
      setEdits(prev => {
        const resultEdits = prev[resultId] || {};
        const rowEdits = { ...(resultEdits[rowIndex] || {}) };
        delete rowEdits[columnName];
        
        const nextResultEdits = { ...resultEdits };
        if (Object.keys(rowEdits).length === 0) {
          delete nextResultEdits[rowIndex];
        } else {
          nextResultEdits[rowIndex] = rowEdits;
        }
        
        const nextEdits = { ...prev };
        if (Object.keys(nextResultEdits).length === 0) {
          delete nextEdits[resultId];
        } else {
          nextEdits[resultId] = nextResultEdits;
        }
        return nextEdits;
      });
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingCell(null);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!result?.isEditable) return;
    e.stopPropagation();
    setEditingCell({ rowIndex, columnName });
  };

  const displayAsCode = isObjOrArray(currentValue);
  const classes = [style.tableCell];

  if (displayAsCode) {
    classes.push(style.tableCellSyntax);
  }
  if (boolOrNull(currentValue)) classes.push(style.centered);
  if (props.className) classes.push((props as any).className);
  if (editedValue !== undefined) {
    classes.push(style.cellDirty);
  }

  return (
    <MTable.Cell
      {...props}
      data-rowindex={rowIndex}
      data-colname={columnName}
      className={classes.join(' ')}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          style={inputStyle}
        />
      ) : (
        <CellValue value={currentValue} isCode={displayAsCode} />
      )}
    </MTable.Cell>
  );
};
export default TableCell;
