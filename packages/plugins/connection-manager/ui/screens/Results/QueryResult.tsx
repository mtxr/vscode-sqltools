import React, { useState, useEffect } from 'react';
import ResultsTable from './ResultsTable';
import { Drawer, List, ListSubheader, ListItem, ListItemText, Button } from '@material-ui/core';
import Syntax from '../../components/Syntax';
import { NSDatabase } from '@sqltools/types';
import Loading from '../../components/Loading';

const QueryResults = ({ cols = [], error, query, messages = [], results = [], connId, pageSize = 50, page, total, loading }: NSDatabase.IResult & { loading: boolean }) => {
  const [showMessages, setShowMessages] = useState(error ? true : null);
  cols = !cols || cols.length === 0 ? [''] : cols;
  const columns = cols.map(title => ({ name: title, title }));
  const showPagination = !results || Math.max(total || 0, results.length) > pageSize;
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
        page={page || 0}
        total={total}
        showPagination={showPagination}
        pageSize={showPagination ? pageSize : 0}
        error={error}
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

export default QueryResults;