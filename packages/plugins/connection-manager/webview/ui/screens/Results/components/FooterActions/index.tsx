import React, { useMemo, useCallback } from 'react';
import styles from './styles.m.scss';
import Button from '../../../../components/Button';
import useContextAction, { openMessagesConsole } from '../../../Results/hooks/useContextAction';
import useCurrentResult from '../../hooks/useCurrentResult';
import useResultsContext from '../../hooks/useResultsContext';
import sendMessage from '../../../../lib/messages';
import { UIAction } from '../../actions';

const escapeSQLValue = (value: any): string => {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return String(value);
  const strVal = String(value).replace(/'/g, "''");
  return `'${strVal}'`;
};

const FooterActions = () => {
  const { openResults, reRunQuery, exportResults } = useContextAction();
  const { result } = useCurrentResult();
  const { results: rows = [], isEditable = false, resultId, tableName, primaryKeys, connId, requestId } = result || {};
  const { edits, setEdits, setEditingCell, saving, setSaving, setToast } = useResultsContext();

  const pendingEditsCount = useMemo(() => {
    if (!resultId || !edits[resultId]) return 0;
    let count = 0;
    const rowIndexes = Object.keys(edits[resultId]);
    for (const r of rowIndexes) {
      count += Object.keys(edits[resultId][r] || {}).length;
    }
    return count;
  }, [edits, resultId]);

  const handleDiscard = useCallback(() => {
    setEdits(prev => {
      const next = { ...prev };
      delete next[resultId];
      return next;
    });
    setEditingCell(null);
  }, [resultId, setEdits, setEditingCell]);

  const handleSave = useCallback(() => {
    if (pendingEditsCount === 0 || !resultId) return;
    
    const resultEdits = edits[resultId];
    const rowIndexes = Object.keys(resultEdits).map(Number);
    
    const serializedEdits = rowIndexes.map(rIndex => {
      const originalRow = rows[rIndex];
      const modifiedValues = resultEdits[rIndex];
      
      const keys: Record<string, any> = {};
      const pkeys = primaryKeys || [];
      
      pkeys.forEach(pk => {
        keys[pk] = originalRow[pk];
      });
      
      return {
        keys,
        original: originalRow,
        modified: modifiedValues
      };
    });

    setSaving(true);
    sendMessage(UIAction.CALL, {
      command: `${process.env.EXT_NAMESPACE}.updateRows`,
      args: [{
        connId,
        tableName,
        primaryKeys,
        edits: serializedEdits,
        resultId,
        requestId
      }]
    });
  }, [pendingEditsCount, resultId, edits, rows, primaryKeys, connId, setSaving, requestId]);

  const sqlScript = useMemo(() => {
    if (!resultId || !edits[resultId] || !tableName) return '';
    
    const isMySQL = connId?.toLowerCase().includes('mysql') || result?.connId?.toLowerCase().includes('mysql');
    const quoteChar = isMySQL ? '`' : '"';
    
    const resultEdits = edits[resultId];
    const rowIndexes = Object.keys(resultEdits).map(Number);
    const pkeys = primaryKeys || [];
    
    const queries = rowIndexes.map(rIndex => {
      const originalRow = rows[rIndex];
      const modifiedValues = resultEdits[rIndex];
      
      const setParts = Object.keys(modifiedValues).map(col => {
        return `${quoteChar}${col}${quoteChar} = ${escapeSQLValue(modifiedValues[col])}`;
      });
      
      const whereParts = pkeys.map(pk => {
        return `${quoteChar}${pk}${quoteChar} = ${escapeSQLValue(originalRow[pk])}`;
      });
      
      return `UPDATE ${quoteChar}${tableName}${quoteChar} SET ${setParts.join(', ')} WHERE ${whereParts.join(' AND ')};`;
    });
    
    return queries.join('\n');
  }, [edits, resultId, tableName, primaryKeys, rows, connId, result]);

  const fallbackCopyText = useCallback((text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setToast({ message: 'SQL Script copied to clipboard!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to copy SQL script.', type: 'error' });
    }
    document.body.removeChild(textArea);
  }, [setToast]);

  const handleCopyScript = useCallback(() => {
    if (!sqlScript) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(sqlScript)
        .then(() => {
          setToast({ message: 'SQL Script copied to clipboard!', type: 'success' });
        })
        .catch(() => {
          fallbackCopyText(sqlScript);
        });
    } else {
      fallbackCopyText(sqlScript);
    }
  }, [sqlScript, setToast, fallbackCopyText]);

  return (
    <>
      <div className={styles.left}>
        <Button onClick={openMessagesConsole}>Console</Button>
        <Button onClick={reRunQuery}>Re-Run Query TEST</Button>
        <Button onClick={exportResults}>Export</Button>
        <Button onClick={openResults}>Open</Button>
        
        {isEditable && (
          <>
            <Button
              onClick={handleSave}
              disabled={pendingEditsCount === 0 || saving}
            >
              Save Changes
            </Button>
            <Button
              onClick={handleDiscard}
              disabled={pendingEditsCount === 0 || saving}
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleCopyScript}
              disabled={pendingEditsCount === 0 || saving}
              title="COPY SQL SCRIPT"
              className={styles.copyBtn}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </Button>
            {pendingEditsCount > 0 && (
              <span className={styles.pendingText}>
                {pendingEditsCount} pending edit(s)
              </span>
            )}
            {saving && <div className={styles.spinner} />}
          </>
        )}
      </div>
    </>
  );
};

export default FooterActions;
