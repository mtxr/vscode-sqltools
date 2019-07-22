import React, { ReactNode, useState } from 'react';
import ResultsTable from './ResultsTable';
import ErrorIcon from '@sqltools/ui/components/ErrorIcon';
import { Drawer, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import InfoIcon from '@material-ui/icons/Info';

interface QueryResultProps {
  connId: string;
  messages: string[];
  cols: string[];
  results: any[];
  error?: boolean;
  query?: string;
}
export default ({ cols, error, query, messages, results = [], connId }: QueryResultProps) => {
  const [showMessagess, setShowMessages ] = useState(false);
  cols = !cols || cols.length === 0 ? [''] : cols;
  const columns = cols.map(title => ({ name: title, title }));

  const table: string | ReactNode = error ? (
    <div
      style={{
        flexGrow: 1,
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div>
        <ErrorIcon />
      </div>
      <div>Query with errors. Please, check the error below.</div>
    </div>
  ) : (
    <ResultsTable columns={columns} rows={results || []} query={query} connId={connId} columnNames={cols} />
  );

  return (
    <div className="result">
      {table}
      <Drawer open={showMessagess} onClose={() => setShowMessages(false)} anchor="right" className="messages-drawer">
        <List dense component="ul" subheader={<ListSubheader>Messages</ListSubheader>}>
          {(messages.length > 0 ? messages : ['No messages to show.']).map((m, i) => (
            <ListItem component="li" className={'message ' + (error ? 'error' : '')} key={i}>
              <ListItemText primary={m} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Fab size="small" style={{ position: 'absolute', bottom: 30, right: 30 }} onClick={() => setShowMessages(!showMessagess)}>
        <InfoIcon />
      </Fab>
    </div>
  );
};
