import React, { useState } from 'react';
import ResultsTable from './ResultsTable';
import { Drawer, List, ListSubheader, ListItem, ListItemText, Button } from '@material-ui/core';
import Syntax from '../../components/Syntax';
import { NSDatabase } from '@sqltools/types';

const QueryResults = ({ cols = [], error, query, messages = [], results = [], connId, pageSize = 50, page, total }: NSDatabase.IResult) => {
  const [showMessages, setShowMessages] = useState(!!(error || (results.length === 0 && messages.length > 0)));
  cols = !cols || cols.length === 0 ? [''] : cols;
  const columns = cols.map(title => ({ name: title, title }));
  const showPagination = !results || Math.max(total || 0, results.length) > pageSize;
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
      <Drawer open={showMessages} onClose={() => setShowMessages(false)} anchor="right" id="messages-drawer" className={error ? 'width-75pct' : undefined }>
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
    </div>
  );
};

export default QueryResults;