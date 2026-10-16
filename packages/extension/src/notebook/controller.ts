import * as vscode from 'vscode';
import { NSDatabase } from '@sqltools/types';
import { EXT_NAMESPACE } from '@sqltools/util/constants';

interface ConnectionDetails {
  name?: string;
  driver?: string;
  [key: string]: any;
}

export class SQLNotebookController {
  readonly controllerId = 'sqltools-notebook-controller';
  readonly notebookType = 'sqltools-notebook';
  readonly label = 'SQLTools Notebook';
  readonly supportedLanguages = ['sql'];

  private readonly _controller: vscode.NotebookController;
  private _executionOrder = 0;
  // Store last used connection for setting new cell defaults
  private _lastUsedConnection: string | null = null;

  constructor() {
    this._controller = vscode.notebooks.createNotebookController(
      this.controllerId,
      this.notebookType,
      this.label
    );

    this._controller.supportedLanguages = this.supportedLanguages;
    this._controller.supportsExecutionOrder = true;
    this._controller.executeHandler = this._execute.bind(this);
    
    // Register selection command
    this._registerCommands();
    
    // Listen for notebook changes
    vscode.window.onDidChangeActiveNotebookEditor(this._onActiveNotebookChanged, this);
    
    // Listen for notebook document changes to set default connection for new cells
    vscode.workspace.onDidChangeNotebookDocument(this._onNotebookDocumentChanged, this);
    
    // Register message handler for export
    this._registerMessageHandler();
  }
  
  private _onActiveNotebookChanged(editor: vscode.NotebookEditor | undefined): void {
    if (!editor || editor.notebook.notebookType !== this.notebookType) {
      // Disable controller when no notebook is active
      this._controller.updateNotebookAffinity(editor?.notebook, vscode.NotebookControllerAffinity.Default);
      return;
    }
    
    if (this._lastUsedConnection) {
      // Enable controller when last connection is available
      this._controller.updateNotebookAffinity(editor.notebook, vscode.NotebookControllerAffinity.Preferred);
    } else {
      // Disable controller when no connection is selected
      this._controller.updateNotebookAffinity(editor.notebook, vscode.NotebookControllerAffinity.Default);
    }
  }

  private _onNotebookDocumentChanged(event: vscode.NotebookDocumentChangeEvent): void {
    // Only handle our notebook type
    if (event.notebook.notebookType !== this.notebookType) {
      return;
    }
    
    // Check for cell additions
    const cellChanges = event.contentChanges;
    for (const change of cellChanges) {
      // Process added cells
      if (change.addedCells && change.addedCells.length > 0) {
        for (const cell of change.addedCells) {
          // Set default connection for new cells
          this._setDefaultConnectionForNewCell(cell);
        }
      }
    }
  }

  // Helper method to get connection details
  private async _getConnectionDetails(connectionId: string): Promise<ConnectionDetails | null> {
    try {
      const connections = await vscode.commands.executeCommand<any[]>(
        `${EXT_NAMESPACE}.getConnections`,
        { connectedOnly: true }
      ) || [];
      
      const connection = connections.find(conn => {
        const id = typeof conn === 'string' ? conn : conn.id || conn.name;
        return id === connectionId;
      });
      
      if (!connection) return null;
      
      // Extract and return connection details
      return typeof connection === 'string' 
        ? { name: connection } 
        : connection;
    } catch (error) {
      console.error('Error fetching connection details:', error);
      return null;
    }
  }

  private _registerCommands() {
    // Register a command to list all available commands (for debugging)
    vscode.commands.registerCommand('sqltools.notebook.listCommands', async () => {
      try {
        // Get all registered commands that have sqltools in their name
        const allCommands = await vscode.commands.getCommands(true);
        const sqlCommands = allCommands.filter(cmd => cmd.includes('sqltools'));
        
        console.log('Available SQLTools commands:', sqlCommands);
        
        // Show commands in the output channel
        vscode.window.showInformationMessage(`Found ${sqlCommands.length} SQLTools commands.`);
        
        // Return the list for programmatic use
        return sqlCommands;
      } catch (error) {
        console.error('Error listing commands:', error);
        return [];
      }
    });

    // Register a command to select a connection for a specific cell
    vscode.commands.registerCommand('sqltools.notebook.selectCellConnection', async (cell: vscode.NotebookCell) => {
      if (!cell || cell.kind !== vscode.NotebookCellKind.Code || cell.document.languageId !== 'sql') {
        vscode.window.showErrorMessage('Not a valid SQL cell');
        return;
      }
      
      const connectionId = await this._selectConnection();
      if (connectionId) {
        // Store the connection for this cell in cell metadata
        this._setCellConnection(cell, connectionId);
        
        // Remember this as the last used connection
        this._lastUsedConnection = connectionId;
        
        // Show confirmation
        const connDetails = await this._getConnectionDetails(connectionId);
        const connectionName = connDetails?.name || connectionId;
        const driverName = connDetails?.driver ? ` (${connDetails.driver})` : '';
        vscode.window.showInformationMessage(`Cell will use connection: ${connectionName}${driverName}. Run the cell to see results.`);
        
        return connectionId;
      }
      return null;
    });

    // Register a command to clear the connection for a specific cell
    vscode.commands.registerCommand('sqltools.notebook.clearCellConnection', async (cell: vscode.NotebookCell) => {
      if (!cell || cell.kind !== vscode.NotebookCellKind.Code || cell.document.languageId !== 'sql') {
        vscode.window.showErrorMessage('Not a valid SQL cell');
        return;
      }
      
      // Clear the connection from this cell's metadata
      if (cell.metadata?.sqltools_connection) {
        const edit = new vscode.WorkspaceEdit();
        const cellMetadata = { ...cell.metadata };
        delete cellMetadata.sqltools_connection;
        
        const nbEdit = vscode.NotebookEdit.updateCellMetadata(cell.index, cellMetadata);
        edit.set(cell.notebook.uri, [nbEdit]);
        
        await vscode.workspace.applyEdit(edit);
        vscode.window.showInformationMessage('Cell connection cleared. You need to select a connection before running this cell.');
      } else {
        vscode.window.showInformationMessage('This cell has no specific connection set.');
      }
    });

    // Register a command to show SQL Notebook connection help
    vscode.commands.registerCommand('sqltools.notebook.showConnectionHelp', async () => {
      if (!vscode.window.activeNotebookEditor || vscode.window.activeNotebookEditor.notebook.notebookType !== this.notebookType) {
        vscode.window.showErrorMessage('No active SQL notebook found');
        return;
      }
      
      const helpContent = `## SQLTools Notebook Connection Commands

### Cell-Level Connections

| Command | Keybinding (Windows/Linux) | Keybinding (Mac) | Description |
| ------- | -------------------------- | ---------------- | ----------- |
| Select Cell Connection | Ctrl+K Ctrl+E | Cmd+K Cmd+E | Choose a specific connection for the current cell |
| Clear Cell Connection | Ctrl+K Ctrl+R | Cmd+K Cmd+R | Remove the cell-specific connection |

#### About Cell Connections

- Each cell can have its own database connection
- When you create a new cell, it will automatically use the last connection you selected
- The connection for each cell is displayed in the cell status bar
- You must select a connection for each cell before running it

You can also click on the connection indicator in the status bar to select a connection for the current cell.
`;
      
      const cell = new vscode.NotebookCellData(
        vscode.NotebookCellKind.Markup,
        helpContent,
        'markdown'
      );
      
      const edit = new vscode.WorkspaceEdit();
      const nbEdit = vscode.NotebookEdit.insertCells(0, [cell]);
      edit.set(vscode.window.activeNotebookEditor.notebook.uri, [nbEdit]);
      
      await vscode.workspace.applyEdit(edit);
      vscode.window.showInformationMessage('Connection help added to notebook');
    });

    // Register a command to export notebook results
    vscode.commands.registerCommand('sqltools.notebook.exportResults', async (cell: vscode.NotebookCell, format: 'csv' | 'json') => {
      if (!cell || !cell.outputs || cell.outputs.length === 0) {
        vscode.window.showWarningMessage('No results to export. Run the query first.');
        return;
      }
      
      try {
        // Get the table data from the cell's HTML output
        const htmlOutput = cell.outputs
          .flatMap(output => output.items)
          .find(item => item.mime === 'text/html');
          
        if (!htmlOutput) {
          vscode.window.showErrorMessage('No results table found in the output.');
          return;
        }
        
        // Parse the HTML content to extract table data
        const htmlContent = Buffer.from(htmlOutput.data).toString('utf8');
        const tableData = this._extractTableDataFromHtml(htmlContent);
        
        if (!tableData || tableData.rows.length === 0) {
          vscode.window.showErrorMessage('Could not extract data from the results.');
          return;
        }
        
        // Format the data according to the requested format
        let formattedContent = '';
        if (format === 'csv') {
          formattedContent = this._formatAsCsv(tableData);
        } else { // json
          formattedContent = this._formatAsJson(tableData);
        }
        
        // Show save dialog
        const filters = format === 'csv' 
          ? { 'CSV Files': ['csv'] }
          : { 'JSON Files': ['json'] };
        
        const uri = await vscode.window.showSaveDialog({
          filters,
          saveLabel: `Export as ${format.toUpperCase()}`,
          title: `Export Query Results as ${format.toUpperCase()}`
        });
        
        if (!uri) return; // User cancelled
        
        // Write the file
        await vscode.workspace.fs.writeFile(
          uri,
          new Uint8Array(Buffer.from(formattedContent))
        );
        
        // Show success message
        const openAction = 'Open File';
        const action = await vscode.window.showInformationMessage(
          `Results exported to ${uri.fsPath}`, 
          openAction
        );
        
        if (action === openAction) {
          await vscode.commands.executeCommand('vscode.open', uri);
        }
      } catch (error) {
        console.error('Error exporting results:', error);
        vscode.window.showErrorMessage(`Failed to export results: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    // Register a command to limit query results
    vscode.commands.registerCommand('sqltools.notebook.limitResults', async (cell: vscode.NotebookCell) => {
      const quickPickItems = [
        { label: 'No limit', description: 'Run query without a LIMIT clause', value: 0 },
        { label: 'LIMIT 10', description: 'Return a maximum of 10 rows', value: 10 },
        { label: 'LIMIT 50', description: 'Return a maximum of 50 rows', value: 50 },
        { label: 'LIMIT 100', description: 'Return a maximum of 100 rows', value: 100 },
        { label: 'LIMIT 1000', description: 'Return a maximum of 1000 rows', value: 1000 },
        { label: 'Custom...', description: 'Specify a custom limit', value: -1 }
      ];
      
      const selectedOption = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select a limit for query results',
        title: 'Limit Query Results'
      });
      
      if (!selectedOption) return; // User cancelled
      
      if (selectedOption.value === -1) {
        // Handle custom limit input
        const customLimit = await vscode.window.showInputBox({
          prompt: 'Enter a custom row limit',
          placeHolder: 'e.g., 500',
          validateInput: (value) => {
            const num = parseInt(value);
            return (!isNaN(num) && num > 0) ? null : 'Please enter a positive number';
          }
        });
        
        if (customLimit) {
          const limitValue = parseInt(customLimit);
          if (!isNaN(limitValue) && limitValue > 0) {
            // Store the limit in notebook metadata or cell metadata
            this._setNotebookCellLimit(cell, limitValue);
            vscode.window.showInformationMessage(`Query will run with LIMIT ${limitValue}. Run the cell to see results.`);
          }
        }
      } else {
        // Store the predefined limit
        this._setNotebookCellLimit(cell, selectedOption.value);
        if (selectedOption.value === 0) {
          vscode.window.showInformationMessage('Query will run without a LIMIT clause. Run the cell to see results.');
        } else {
          vscode.window.showInformationMessage(`Query will run with ${selectedOption.label}. Run the cell to see results.`);
        }
      }
    });
  }

  private async _execute(
    cells: vscode.NotebookCell[],
    notebook: vscode.NotebookDocument,
    _controller: vscode.NotebookController
  ): Promise<void> {
    for (let cell of cells) {
      // Only execute cells that have a connection specified
      const cellConnectionId = cell.metadata?.sqltools_connection as string;
      
      // If the cell doesn't have a connection, prompt to select one
      if (!cellConnectionId) {
        const selectedConnection = await this._selectConnection();
        if (selectedConnection) {
          // Set the connection for this cell
          this._setCellConnection(cell, selectedConnection);
          // Remember this as the last used connection
          this._lastUsedConnection = selectedConnection;
          // Execute with the newly selected connection
          await this._doExecution(cell, selectedConnection);
        } else {
          // No connection selected, show error in cell output
          const execution = this._controller.createNotebookCellExecution(cell);
          execution.executionOrder = ++this._executionOrder;
          execution.start(Date.now());
          execution.replaceOutput([
            new vscode.NotebookCellOutput([
              vscode.NotebookCellOutputItem.text('No connection selected. Please select a database connection for this cell.')
            ])
          ]);
          execution.end(false, Date.now());
        }
      } else {
        // Execute with the cell's connection
        await this._doExecution(cell, cellConnectionId);
      }
    }
  }

  private async _doExecution(cell: vscode.NotebookCell, connectionId: string): Promise<void> {
    if (cell.document.languageId !== 'sql') {
      return; // Only execute SQL cells
    }

    const execution = this._controller.createNotebookCellExecution(cell);
    execution.executionOrder = ++this._executionOrder;
    execution.start(Date.now());

    try {
      if (!connectionId) {
        execution.replaceOutput([
          new vscode.NotebookCellOutput([
            vscode.NotebookCellOutputItem.text('No connection selected. Please select a database connection first.')
          ])
        ]);
        execution.end(false, Date.now());
        return;
      }
      
      // Get connection details for display
      const connDetails = await this._getConnectionDetails(connectionId);
      const connectionName = connDetails?.name || connectionId;
      const driverName = connDetails?.driver ? ` (${connDetails.driver})` : '';
      
      // Get the original SQL query from the cell
      const originalQuery = cell.document.getText();
      
      // Check if we need to apply a LIMIT to this query
      const limitValue = cell.metadata?.sqltools_limit as number;
      const query = this._applyLimitToQuery(originalQuery, limitValue, connDetails?.driver);
      
      console.log(`SQLTools Notebook: Executing query with connection ID: ${connectionId}`);
      if (limitValue && query !== originalQuery) {
        console.log(`SQLTools Notebook: Applied LIMIT ${limitValue} to query`);
      }
      
      try {
        // Ensure connectionId is a string before passing it to executeQuery
        const connId = typeof connectionId === 'string' ? connectionId : String(connectionId);
        
        // We need to directly execute the query but prevent the default behavior of showing results in a new window
        const results = await vscode.commands.executeCommand<NSDatabase.IResult[]>(
          `${EXT_NAMESPACE}.executeQuery`, 
          query, 
          { 
            connNameOrId: connId, // Use the exact parameter name expected by connection manager
            showOutput: false,
            runInNotebook: true
          }
        );
        
        if (!results || results.length === 0) {
          console.log('SQLTools Notebook: No results returned from query');
          execution.replaceOutput([
            new vscode.NotebookCellOutput([
              vscode.NotebookCellOutputItem.text(`Query executed on ${connectionName}${driverName}. No results returned.`)
            ])
          ]);
          execution.end(true, Date.now());
          return;
        }

        console.log(`SQLTools Notebook: Query returned ${results.length} result sets`);
        
        // Process and display the results only in the notebook cell
        for (const result of results) {
          // Add connection info to the result for display
          const connectionInfo = `<div style="font-style: italic; margin-bottom: 8px;">${connectionName}${driverName}</div>`;
          
          // Convert the result to a renderable format
          const tableHtml = this._createHtmlTable(result);
          
          // Use appropriate success/error message based on result status
          const statusText = result.error 
            ? 'Query execution failed.' 
            : 'Query executed successfully.';
          
          execution.replaceOutput([
            new vscode.NotebookCellOutput([
              vscode.NotebookCellOutputItem.text(statusText),
              vscode.NotebookCellOutputItem.text(`${connectionInfo}${tableHtml}`, 'text/html')
            ])
          ]);
        }
      } catch (queryError) {
        console.error('SQLTools Notebook: Error executing query:', queryError);
        throw queryError; // Re-throw to be caught by the outer try/catch
      }
      
      execution.end(true, Date.now());
    } catch (error) {
      console.error('SQLTools Notebook: Execution error:', error);
      const errorMessage = error instanceof Error 
        ? `${error.message}\n${error.stack}` 
        : String(error);
        
      execution.replaceOutput([
        new vscode.NotebookCellOutput([
          vscode.NotebookCellOutputItem.error(error instanceof Error ? error : new Error(String(error))),
          vscode.NotebookCellOutputItem.text(`Error details: ${errorMessage}`, 'text/plain')
        ])
      ]);
      execution.end(false, Date.now());
    }
  }

  private _createHtmlTable(result: NSDatabase.IResult): string {
    if (!result.results || result.results.length === 0) {
      // Properly format messages from error objects
      const errorMessages = result.messages ? result.messages.map(msg => 
        typeof msg === 'string' ? msg : msg.message || JSON.stringify(msg)
      ).join(' ') : '';
      
      // Check if this is an error result and style accordingly
      if (result.error) {
        // Create error styled message with details if available
        let errorDetails = '';
        if (result.rawError) {
          const rawErrorStr = typeof result.rawError === 'string' 
            ? result.rawError 
            : result.rawError.message || JSON.stringify(result.rawError);
          errorDetails = `<div class="sql-error-details">${rawErrorStr}</div>`;
        }
        
        return `
          <div class="sql-error-container">
            <div class="sql-error-message">Error executing query: ${errorMessages}</div>
            ${errorDetails}
          </div>
        `;
      }
      
      return `<div>No data returned. ${errorMessages}</div>`;
    }

    const columns = result.cols || Object.keys(result.results[0]);
    const totalRows = result.results.length;
    
    let html = `
      <style>
        .sql-result-table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        .sql-result-table th, .sql-result-table td { 
          border: 1px solid var(--vscode-editor-lineHighlightBorder); 
          padding: 8px; 
          text-align: left; 
        }
        .sql-result-table th { 
          background-color: var(--vscode-editor-lineHighlightBackground); 
          font-weight: bold; 
          cursor: pointer;
          position: relative;
        }
        .sql-result-table th:hover {
          background-color: var(--vscode-list-hoverBackground);
        }
        .sql-sort-icon {
          padding-left: 5px;
          font-size: 0.8em;
        }
        .sql-result-table tr:nth-child(even) { 
          background-color: var(--vscode-editor-inactiveSelectionBackground); 
        }
        .sql-result-messages {
          margin-top: 10px;
          color: var(--vscode-editorInfo-foreground);
        }
        .sql-error-container {
          padding: 10px;
          border-left: 4px solid var(--vscode-editorError-foreground);
          background-color: var(--vscode-inputValidation-errorBackground);
          margin-bottom: 10px;
        }
        .sql-error-message {
          color: var(--vscode-editorError-foreground);
          font-weight: bold;
        }
        .sql-error-details {
          margin-top: 5px;
          font-family: var(--vscode-editor-font-family);
          white-space: pre-wrap;
          overflow-wrap: break-word;
        }
        .sql-result-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .sql-result-pagination {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .sql-result-pagination-info {
          margin-right: 10px;
        }
        .sql-result-page-size {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sql-result-dropdown {
          padding: 5px;
          border: 1px solid var(--vscode-dropdown-border);
          background-color: var(--vscode-dropdown-background);
          color: var(--vscode-dropdown-foreground);
          border-radius: 2px;
        }
        .sql-result-nav-button {
          padding: 4px 8px;
          background-color: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          border: none;
          border-radius: 2px;
          cursor: pointer;
        }
        .sql-result-nav-button:hover:not(:disabled) {
          background-color: var(--vscode-button-secondaryHoverBackground);
        }
        .sql-result-nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .sql-result-custom-container {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .sql-result-custom-input {
          width: 60px;
          padding: 3px;
          border: 1px solid var(--vscode-input-border);
          background-color: var(--vscode-input-background);
          color: var(--vscode-input-foreground);
        }
        .sql-result-custom-button {
          padding: 4px 8px;
          background-color: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          border: none;
          border-radius: 2px;
          cursor: pointer;
        }
        .sql-result-custom-button:hover {
          background-color: var(--vscode-button-hoverBackground);
        }
        .sql-filter-container {
          display: flex;
          margin: 10px 0;
          align-items: center;
          gap: 10px;
        }
        .sql-filter-input {
          flex: 1;
          padding: 5px;
          border: 1px solid var(--vscode-input-border);
          background-color: var(--vscode-input-background);
          color: var(--vscode-input-foreground);
          border-radius: 2px;
        }
        .sql-filter-label {
          white-space: nowrap;
        }
      </style>
      <div id="result-${result.resultId}" data-total-rows="${totalRows}">
        <!-- Filter input -->
        <div class="sql-filter-container">
          <input type="text" class="sql-filter-input" id="filter-${result.resultId}" 
                 placeholder="Enter regex pattern to filter rows" 
                 oninput="applyFilter('${result.resultId}')">
        </div>

        <table class="sql-result-table">
          <thead>
            <tr>
              ${columns.map((col, index) => `<th onclick="sortTable('${result.resultId}', ${index})">${col}<span class="sql-sort-icon" id="sort-icon-${result.resultId}-${index}"></span></th>`).join('')}
            </tr>
          </thead>
          <tbody id="table-body-${result.resultId}">
    `;

    // Add initial rows (first page with default page size of 10)
    const initialPageSize = Math.min(10, totalRows);
    result.results.slice(0, initialPageSize).forEach(row => {
      html += '<tr>';
      columns.forEach(col => {
        const value = row[col];
        html += `<td>${value === null || value === undefined ? 'NULL' : String(value)}</td>`;
      });
      html += '</tr>';
    });

    html += `
          </tbody>
        </table>
        
        <!-- Pagination footer -->
        <div class="sql-result-footer">
          <div class="sql-result-page-size">
            <span>Rows per page:</span>
            <select class="sql-result-dropdown" id="page-size-select-${result.resultId}" onchange="changePageSize('${result.resultId}', this.value)">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="${totalRows}">All (${totalRows})</option>
              <option value="custom">Custom...</option>
            </select>
            <div class="sql-result-custom-container" id="custom-size-container-${result.resultId}" style="display: none;">
              <input type="number" min="1" max="${totalRows}" class="sql-result-custom-input" id="custom-size-${result.resultId}" placeholder="Rows">
              <button class="sql-result-custom-button" onclick="applyCustomPageSize('${result.resultId}')">Apply</button>
            </div>
          </div>
          <div class="sql-result-pagination">
            <span class="sql-result-pagination-info">
              Page <span id="current-page-${result.resultId}">1</span> of <span id="total-pages-${result.resultId}">1</span> | 
              Records <span id="record-start-${result.resultId}">1</span>-<span id="record-end-${result.resultId}">${Math.min(initialPageSize, totalRows)}</span> of <span id="total-filtered-rows-${result.resultId}">${totalRows}</span>
            </span>
            <button class="sql-result-nav-button" id="prev-button-${result.resultId}" onclick="goToPrevPage('${result.resultId}')" disabled>Previous</button>
            <button class="sql-result-nav-button" id="next-button-${result.resultId}" onclick="goToNextPage('${result.resultId}')">Next</button>
          </div>
        </div>
    `;

    if (result.messages && result.messages.length > 0) {
      html += `
        <div class="sql-result-messages">
          ${result.messages.map(msg => typeof msg === 'string' ? msg : (msg.message || JSON.stringify(msg))).join('<br>')}
        </div>
      `;
    }

    // Add JavaScript for pagination, sorting and filtering
    html += `
      <script>
        (function() {
          // Store all rows data
          const resultId = "${result.resultId}";
          const rowsData = ${JSON.stringify(result.results)};
          const columns = ${JSON.stringify(columns)};
          const totalRows = ${totalRows};
          
          // Initialize pagination and sorting state
          window.paginationState = window.paginationState || {};
          window.paginationState[resultId] = {
            currentPage: 1,
            pageSize: 10,
            totalPages: Math.ceil(totalRows / 10),
            sortColumn: -1,
            sortDirection: 'asc',
            filteredRows: [...Array(totalRows).keys()], // Initially all rows are shown
            filterPattern: null
          };
          
          // Update total pages display
          document.getElementById('total-pages-' + resultId).textContent = window.paginationState[resultId].totalPages;
          
          // Define the pagination functions in global scope
          window.renderPage = function(resultId) {
            const state = window.paginationState[resultId];
            const tableBody = document.getElementById('table-body-' + resultId);
            const filteredRowCount = state.filteredRows.length;
            const startIdx = (state.currentPage - 1) * state.pageSize;
            const endIdx = Math.min(startIdx + state.pageSize, filteredRowCount);
            
            // Clear existing rows
            tableBody.innerHTML = '';
            
            // Get visible rows based on current filtered and sorted state
            const visibleRowIndices = state.filteredRows.slice(startIdx, endIdx);
            
            // Add rows for current page
            visibleRowIndices.forEach(rowIdx => {
              const row = rowsData[rowIdx];
              let rowHtml = '<tr>';
              columns.forEach(col => {
                const value = row[col];
                rowHtml += '<td>' + (value === null || value === undefined ? 'NULL' : String(value)) + '</td>';
              });
              rowHtml += '</tr>';
              tableBody.innerHTML += rowHtml;
            });
            
            // Update navigation buttons state
            document.getElementById('prev-button-' + resultId).disabled = state.currentPage === 1;
            document.getElementById('next-button-' + resultId).disabled = state.currentPage === state.totalPages || filteredRowCount === 0;
            
            // Update current page display
            document.getElementById('current-page-' + resultId).textContent = filteredRowCount > 0 ? state.currentPage : 0;
            document.getElementById('total-pages-' + resultId).textContent = state.totalPages;
            
            // Update record range display
            document.getElementById('record-start-' + resultId).textContent = filteredRowCount > 0 ? startIdx + 1 : 0;
            document.getElementById('record-end-' + resultId).textContent = endIdx;
            document.getElementById('total-filtered-rows-' + resultId).textContent = filteredRowCount;
          };
          
          // Sorting function
          window.sortTable = function(resultId, colIndex) {
            const state = window.paginationState[resultId];
            
            // Update sort direction
            if (state.sortColumn === colIndex) {
              // Clicking the same column toggles the sort direction
              state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
              // New column to sort, default to ascending
              state.sortColumn = colIndex;
              state.sortDirection = 'asc';
            }
            
            // Clear all sort icons
            columns.forEach((_, idx) => {
              const icon = document.getElementById('sort-icon-' + resultId + '-' + idx);
              icon.textContent = '';
            });
            
            // Set the appropriate sort icon
            const icon = document.getElementById('sort-icon-' + resultId + '-' + colIndex);
            icon.textContent = state.sortDirection === 'asc' ? ' ▲' : ' ▼';
            
            // Sort the filtered rows based on this column
            const colName = columns[colIndex];
            state.filteredRows.sort((a, b) => {
              const valA = rowsData[a][colName];
              const valB = rowsData[b][colName];
              
              // Handle null/undefined values (they come last in either sort direction)
              if (valA === null || valA === undefined) return 1;
              if (valB === null || valB === undefined) return -1;
              
              // Compare values based on their type
              let comparison;
              if (typeof valA === 'number' && typeof valB === 'number') {
                comparison = valA - valB;
              } else {
                const strA = String(valA).toLowerCase();
                const strB = String(valB).toLowerCase();
                comparison = strA.localeCompare(strB);
              }
              
              return state.sortDirection === 'asc' ? comparison : -comparison;
            });
            
            // Reset to first page when changing sort
            state.currentPage = 1;
            
            // Re-render the table
            window.renderPage(resultId);
          };
          
          // Filtering function
          window.applyFilter = function(resultId) {
            const state = window.paginationState[resultId];
            const filterInput = document.getElementById('filter-' + resultId);
            const filterText = filterInput.value.trim();
            
            try {
              // If filter is empty, show all rows
              if (filterText === '') {
                state.filterPattern = null;
                state.filteredRows = [...Array(totalRows).keys()];
              } else {
                // Create regex pattern from input
                state.filterPattern = new RegExp(filterText, 'i');
                
                // Filter rows that match the pattern in any column
                state.filteredRows = [];
                for (let i = 0; i < rowsData.length; i++) {
                  const row = rowsData[i];
                  const matchesFilter = columns.some(col => {
                    const value = row[col];
                    if (value === null || value === undefined) return false;
                    return state.filterPattern.test(String(value));
                  });
                  
                  if (matchesFilter) {
                    state.filteredRows.push(i);
                  }
                }
              }
              
              // Reset to first page
              state.currentPage = 1;
              
              // Recalculate total pages
              state.totalPages = Math.ceil(state.filteredRows.length / state.pageSize) || 1;
              
              // Apply current sort if any column is sorted
              if (state.sortColumn >= 0) {
                sortTable(resultId, state.sortColumn);
              } else {
                // Just re-render the table
                renderPage(resultId);
              }
              
              // Clear any validation styling
              filterInput.style.borderColor = '';
            } catch (e) {
              // Invalid regex pattern
              filterInput.style.borderColor = 'var(--vscode-inputValidation-errorBorder)';
              console.error('Invalid regex pattern:', e);
            }
          };
          
          window.changePageSize = function(resultId, sizeValue) {
            if (sizeValue === 'custom') {
              // Show custom input
              document.getElementById('custom-size-container-' + resultId).style.display = 'flex';
              return;
            } else {
              // Hide custom input
              document.getElementById('custom-size-container-' + resultId).style.display = 'none';
            }
            
            const size = parseInt(sizeValue);
            if (isNaN(size)) return;
            
            const state = window.paginationState[resultId];
            
            // Update state
            state.currentPage = 1;
            state.pageSize = size;
            state.totalPages = Math.ceil(state.filteredRows.length / size) || 1;
            
            // Re-render the page
            window.renderPage(resultId);
          };
          
          window.goToNextPage = function(resultId) {
            const state = window.paginationState[resultId];
            if (state.currentPage < state.totalPages) {
              state.currentPage++;
              window.renderPage(resultId);
            }
          };
          
          window.goToPrevPage = function(resultId) {
            const state = window.paginationState[resultId];
            if (state.currentPage > 1) {
              state.currentPage--;
              window.renderPage(resultId);
            }
          };
          
          window.applyCustomPageSize = function(resultId) {
            const input = document.getElementById('custom-size-' + resultId);
            const customSize = parseInt(input.value);
            
            if (isNaN(customSize) || customSize < 1) {
              input.value = '';
              return;
            }
            
            const state = window.paginationState[resultId];
            const validSize = Math.min(customSize, state.filteredRows.length);
            
            // Update dropdown to reflect a custom value is used
            const dropdown = document.getElementById('page-size-select-' + resultId);
            dropdown.value = 'custom';
            
            // Update pagination state
            state.currentPage = 1;
            state.pageSize = validSize;
            state.totalPages = Math.ceil(state.filteredRows.length / validSize) || 1;
            
            // Re-render the page
            window.renderPage(resultId);
          };
        })();
      </script>
    `;

    html += '</div>';
    return html;
  }

  private _registerMessageHandler() {
    // Register handler for notebook cell output messages (for export buttons)
    vscode.notebooks.registerNotebookCellStatusBarItemProvider(this.notebookType, {
      provideCellStatusBarItems: (cell, token) => {
        if (cell.kind !== vscode.NotebookCellKind.Code || cell.document.languageId !== 'sql') {
          return [];
        }

        // Get the current limit setting to display in the button
        const currentLimit = cell.metadata?.sqltools_limit as number;
        const limitLabel = currentLimit && currentLimit > 0 
          ? `Limit: ${currentLimit}` 
          : 'Limit: none';

        const limitQueryItem = new vscode.NotebookCellStatusBarItem(
          limitLabel,
          vscode.NotebookCellStatusBarAlignment.Right
        );
        limitQueryItem.command = {
          title: 'Limit Results',
          command: 'sqltools.notebook.limitResults',
          arguments: [cell]
        };

        // Get the current cell's connection to display in the button
        const cellConnectionId = cell.metadata?.sqltools_connection as string;
        let connectionLabel = 'No Connection Selected';
        let connectionTooltip = 'Select a connection for this cell';
        
        if (cellConnectionId) {
          // If cell has its own connection, show it
          connectionLabel = `Connection: ${cellConnectionId.split('.').pop() || cellConnectionId}`;
          connectionTooltip = 'Cell connection';
        }

        const connectionItem = new vscode.NotebookCellStatusBarItem(
          connectionLabel,
          vscode.NotebookCellStatusBarAlignment.Right
        );
        connectionItem.command = {
          title: 'Select Cell Connection',
          command: 'sqltools.notebook.selectCellConnection',
          arguments: [cell]
        };
        connectionItem.tooltip = connectionTooltip;

        // Add clear connection item if the cell has a specific connection
        const items = [limitQueryItem, connectionItem];
        
        if (cellConnectionId) {
          const clearConnectionItem = new vscode.NotebookCellStatusBarItem(
            'Clear Connection',
            vscode.NotebookCellStatusBarAlignment.Right
          );
          clearConnectionItem.command = {
            title: 'Clear Cell Connection',
            command: 'sqltools.notebook.clearCellConnection',
            arguments: [cell]
          };
          items.push(clearConnectionItem);
        }
        
        // Export items
        const exportCsvItem = new vscode.NotebookCellStatusBarItem(
          'Export CSV',
          vscode.NotebookCellStatusBarAlignment.Right
        );
        exportCsvItem.command = {
          title: 'Export CSV',
          command: 'sqltools.notebook.exportResults',
          arguments: [cell, 'csv']
        };

        const exportJsonItem = new vscode.NotebookCellStatusBarItem(
          'Export JSON',
          vscode.NotebookCellStatusBarAlignment.Right
        );
        exportJsonItem.command = {
          title: 'Export JSON',
          command: 'sqltools.notebook.exportResults',
          arguments: [cell, 'json']
        };

        items.push(exportCsvItem, exportJsonItem);
        return items;
      }
    });
  }

  private _extractTableDataFromHtml(htmlContent: string): { headers: string[], rows: any[][] } | null {
    try {
      // Simple regex-based extraction - considers a basic HTML table structure
      const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/i;
      const tableMatch = htmlContent.match(tableRegex);
      
      if (!tableMatch) return null;
      
      const tableHtml = tableMatch[0];
      
      // Extract headers
      const headerRegex = /<th[^>]*>(.*?)<\/th>/gi;
      const headers: string[] = [];
      let headerMatch;
      while ((headerMatch = headerRegex.exec(tableHtml)) !== null) {
        headers.push(headerMatch[1].trim());
      }
      
      // Extract rows
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      const rows: any[][] = [];
      
      let rowMatch;
      let startFromSecondRow = false; // Skip header row
      
      while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
        if (!startFromSecondRow) {
          startFromSecondRow = true;
          continue; // Skip header row
        }
        
        const rowHtml = rowMatch[1];
        const cellRegex = /<td[^>]*>(.*?)<\/td>/gi;
        const rowData: any[] = [];
        
        let cellMatch;
        while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
          let value = cellMatch[1].trim();
          // Convert NULL string to null
          if (value === 'NULL') {
            rowData.push(null);
          } else {
            // Try to convert to number if applicable
            const numValue = Number(value);
            rowData.push(isNaN(numValue) ? value : numValue);
          }
        }
        
        rows.push(rowData);
      }
      
      return { headers, rows };
    } catch (error) {
      console.error('Error extracting table data from HTML:', error);
      return null;
    }
  }
  
  private _formatAsCsv(data: { headers: string[], rows: any[][] }): string {
    const { headers, rows } = data;
    
    // Escape and quote function for CSV
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return '';
      const strValue = String(value);
      // If the value contains a comma, quote, or newline, wrap it in quotes and escape existing quotes
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };
    
    // Format the headers
    const csvRows = [
      headers.map(escapeCSV).join(',')
    ];
    
    // Format each row
    for (const row of rows) {
      csvRows.push(row.map(escapeCSV).join(','));
    }
    
    return csvRows.join('\n');
  }
  
  private _formatAsJson(data: { headers: string[], rows: any[][] }): string {
    const { headers, rows } = data;
    
    // Convert to array of objects with named properties
    const jsonData = rows.map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return JSON.stringify(jsonData, null, 2);
  }

  private _setNotebookCellLimit(cell: vscode.NotebookCell, limitValue: number): void {
    // We use VSCode's cell metadata to store our limit value
    const edit = new vscode.WorkspaceEdit();
    const cellMetadata = { ...cell.metadata, sqltools_limit: limitValue };
    
    const nbEdit = vscode.NotebookEdit.updateCellMetadata(cell.index, cellMetadata);
    edit.set(cell.notebook.uri, [nbEdit]);
    
    vscode.workspace.applyEdit(edit);
  }
  
  private _setCellConnection(cell: vscode.NotebookCell, connectionId: string): void {
    // Store the connection ID in cell metadata
    const edit = new vscode.WorkspaceEdit();
    const cellMetadata = { ...cell.metadata, sqltools_connection: connectionId };
    
    const nbEdit = vscode.NotebookEdit.updateCellMetadata(cell.index, cellMetadata);
    edit.set(cell.notebook.uri, [nbEdit]);
    
    vscode.workspace.applyEdit(edit);
  }

  // Method to apply limit to a query if needed
  private _applyLimitToQuery(query: string, limitValue: number, driver?: string): string {
    if (!limitValue || limitValue <= 0) return query;
    
    // Skip adding LIMIT for non-SELECT queries or if there's already a LIMIT clause
    const trimmedQuery = query.trim().toLowerCase();
    
    // Check if it's an action query (non-SELECT)
    if (!trimmedQuery.startsWith('select')) return query;
    
    // Check if query already has a LIMIT clause
    if (trimmedQuery.includes(' limit ')) return query;
    
    // Remove trailing semicolon before adding LIMIT
    let processedQuery = query.trim();
    if (processedQuery.endsWith(';')) {
      processedQuery = processedQuery.slice(0, -1);
    }
    
    // Add LIMIT based on database driver
    switch (driver?.toLowerCase()) {
      case 'mssql':
        // For SQL Server, we use a different approach
        if (trimmedQuery.includes(' top ')) return query;
        // Add TOP clause for SQL Server
        return processedQuery.replace(/select\s+/i, `SELECT TOP ${limitValue} `);
      default:
        // Most databases use a LIMIT clause
        return `${processedQuery} LIMIT ${limitValue}`;
    }
  }

  // Add a method to set cell connection based on last used connection
  private _setDefaultConnectionForNewCell(cell: vscode.NotebookCell): void {
    // Only set default connection for SQL code cells that don't already have a connection
    if (cell.kind !== vscode.NotebookCellKind.Code || 
        cell.document.languageId !== 'sql' || 
        cell.metadata?.sqltools_connection) {
      return;
    }
    
    // If there's a last used connection, apply it to this cell
    if (this._lastUsedConnection) {
      this._setCellConnection(cell, this._lastUsedConnection);
    }
  }

  private async _selectConnection(): Promise<string | null> {
    try {
      // Get available connections with proper parameters
      // Changed to connectedOnly: false to show all available connections
      const connections = await vscode.commands.executeCommand<any[]>(
        `${EXT_NAMESPACE}.getConnections`, 
        { connectedOnly: false, sort: 'connectedFirst' }
      ) || [];
      
      if (connections.length === 0) {
        vscode.window.showErrorMessage('No database connections available. Please add a database connection first.');
        return null;
      }

      // Create connection items with proper ID extraction and more details
      const connectionItems = connections.map(conn => {
        // Extract connection ID and name
        const id = typeof conn === 'string' ? conn : conn.id || conn.name;
        const name = typeof conn === 'string' ? conn : conn.name || conn.id;
        const driver = typeof conn === 'string' ? '' : conn.driver || '';
        const server = typeof conn === 'string' ? '' : conn.server || conn.host || '';
        const database = typeof conn === 'string' ? '' : conn.database || '';
        const isConnected = typeof conn === 'string' ? false : conn.isConnected || false;
        
        // Create a description that shows more connection details
        let description = '';
        if (driver) description += driver;
        if (server) description += description ? ` - ${server}` : server;
        if (database) description += description ? ` - ${database}` : database;
        if (isConnected) description += ' (Connected)';
        
        return {
          label: name,
          description: description,
          id: id,
          isConnected: isConnected
        };
      });

      // Show connection picker with improved descriptions
      const selectedConn = await vscode.window.showQuickPick(connectionItems, {
        placeHolder: 'Select a database connection for this notebook',
        title: 'SQLTools: Select Connection for Notebook',
      });

      if (selectedConn) {
        console.log(`SQLTools Notebook: Selected connection ID: ${selectedConn.id}`);
        
        // If the connection is not already connected, connect to it
        if (!selectedConn.isConnected) {
          vscode.window.showInformationMessage(`Connecting to ${selectedConn.label}...`);
          // Use the selectConnection command to connect to the database
          await vscode.commands.executeCommand(`${EXT_NAMESPACE}.selectConnection`, selectedConn.id);
        }
        
        vscode.window.showInformationMessage(
          `Using connection: ${selectedConn.label}`,
          { modal: false }
        );
        return selectedConn.id;
      }
      
      return null;
    } catch (error) {
      console.error('SQLTools Notebook: Error selecting connection:', error);
      vscode.window.showErrorMessage(`Error selecting connection: ${error}`);
      return null;
    }
  }

  dispose() {
    console.log('SQLTools Notebook: Disposing controller');
    this._controller.dispose();
  }
} 