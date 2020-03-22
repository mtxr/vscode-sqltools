import React, { useState, useEffect } from 'react';
import ResultsTable from './ResultsTable';
import { Drawer, List, ListSubheader, ListItem, ListItemText, Button } from '@material-ui/core';
import Syntax from '../../components/Syntax';
import { NSDatabase } from '@sqltools/types';
import Loading from '../../components/Loading';

interface QueryResultProps {
  result: NSDatabase.IResult;
  loading: boolean;
  onCurrentPageChange?: (args: { queryType: string; queryParams: any; page: number; pageSize: number }) => void;
}

const QueryResult = ({ result = ({} as NSDatabase.IResult), loading, onCurrentPageChange }: QueryResultProps) => {
  const { cols = [], error, query, messages = [], results = [], connId, pageSize = 50, page, total, queryParams, queryType } = result;
  const [showMessages, setShowMessages] = useState(error ? true : null);
  if(cols.length === 0) cols.push('');
  const columns = cols.map(title => ({ name: title, title }));
  const showPagination = !results || Math.max(total || 0, results.length) > pageSize;
  console.log('HERE')
  useEffect(() => {
    if(showMessages === null &&  results.length === 0 && messages.length > 0) {
      setShowMessages(true);
    }
  })
  return (
    <div className="result">
      <ResultsTable
        columns={columns}
        rows={results || []}
        query={query}
        connId={connId}
        columnNames={cols}
        page={page}
        total={total}
        showPagination={showPagination}
        pageSize={showPagination ? pageSize : 0}
        error={error}
        onCurrentPageChange={page => onCurrentPageChange({ queryParams, queryType, page, pageSize })}
        openDrawerButton={
          <Button
            onClick={() => setShowMessages(!showMessages)}
            className={'action-button' + (showMessages ? 'active' : '')}
          >
            Query Details
          </Button>
        }
      />
      <Drawer open={showMessages || false} onClose={() => setShowMessages(false)} anchor="right" id="messages-drawer" className={error ? 'width-75pct' : undefined }>
        <List dense component="ul" subheader={<ListSubheader>Query</ListSubheader>}>
          <ListItem component="li" className={'query ' + (error ? 'error' : '')}>
            <Syntax code={query} language="sql" strong />
          </ListItem>
        </List>
        <List dense component="ul" subheader={<ListSubheader>Messages</ListSubheader>}>
          {(messages.length > 0 ? messages : ['No messages to show.']).map((m, i) => (
            <ListItem component="li" className={'message ' + (error ? 'error' : '')} key={i}>
              <ListItemText primary={m} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {loading && <Loading active />}
    </div>
  );
};

export default QueryResult;