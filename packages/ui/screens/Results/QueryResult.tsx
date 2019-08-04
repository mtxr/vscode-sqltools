import React, { useState } from 'react';
import ResultsTable from './ResultsTable';
import { Drawer, List, ListSubheader, ListItem, ListItemText, Button } from '@material-ui/core';
import Syntax from '../../components/Syntax';

interface QueryResultProps {
  connId: string;
  messages: string[];
  cols: string[];
  results: any[];
  error?: boolean;
  query?: string;
  pageSize: number;
}
export default ({ cols, error, query, messages, results = [], connId, pageSize }: QueryResultProps) => {
  const [showMessagess, setShowMessages] = useState(false);
  cols = !cols || cols.length === 0 ? [''] : cols;
  const columns = cols.map(title => ({ name: title, title }));

  return (
    <div className="result">
      <ResultsTable
        columns={columns}
        rows={results || []}
        query={query}
        connId={connId}
        columnNames={cols}
        pageSize={pageSize}
        error={error}
        openDrawerButton={
          <Button
            onClick={() => setShowMessages(!showMessagess)}
            className={'action-button' + (showMessagess ? 'active' : '')}
          >
            Query Details
          </Button>
        }
      />
      <Drawer open={showMessagess} onClose={() => setShowMessages(false)} anchor="right" id="messages-drawer" className={error ? 'width-75pct' : undefined }>
        <List dense component="ul" subheader={<ListSubheader>Query</ListSubheader>}>
          <ListItem component="li" className={'message ' + (error ? 'error' : '')}>
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
