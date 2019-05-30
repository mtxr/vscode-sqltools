import React, { UIEventHandler, HTMLAttributes } from 'react';
import ReactTable, { ReactTableDefaults, GlobalColumn, Column, CellInfo, RowInfo, Filter } from 'react-table';
import Menu from './../../components/Menu';
import { clipboardInsert } from '@sqltools/ui/lib/utils';
import getVscode from '../../lib/vscode';

const FilterByValueOption = 'Filter by \'{value}\'';
const ReRunQueryOption = 'Re-run this query';
const ClearFiltersOption = 'Clear all filters';
const CopyCellOption = 'Copy Cell value';
const CopyRowOption = 'Copy Row value';
const SaveCSVOption = 'Save results as CSV';
const SaveJSONOption = 'Save results as JSON';
const OpenEditorWithValueOption = 'Open editor with\'{value}\'';
const OpenEditorWithRowOption = 'Open editor with row';

const isRegExMatcher = /^\/(.+)\/(\w+)?$/gi;

function toRegEx(value: string | RegExp) {
  if (value instanceof RegExp) return value;
  try {
    if (isRegExMatcher.test(value)) {
      try {
        return eval(value.replace(isRegExMatcher, '/($1)/$2'));
      } catch(ee) {}
    }
    return new RegExp(`(${value})`, 'gi');
  } catch (e) { }
  return value;
}

const FilterComponent = ({ filter = { value: '' }, column, onChange }) => {
  return (
    <input
      type="text"
      placeholder={`Filter by ${column.id}`}
      style={{ width: '100%' }}
      value={filter.value}
      onChange={event => onChange(column.id, event.target.value)}
    />
  );
};

const TbodyComponent = React.forwardRef<any, { onScroll: UIEventHandler<HTMLDivElement> } & HTMLAttributes<any>>(({ onScroll, ...props }, ref) => {
  for (let i = 0; i < props.children[0].length; i++) {
    props.children[0][i] = React.cloneElement(props.children[0][i], {
      minWidth: props.style.minWidth
    });
  }

  return <div className="rt-tbody" id="tbody" onScroll={onScroll} ref={ref}>{props.children}</div>;
});

const TrGroupComponent = props => {
  return (
    <div
      className="rt-tr-group"
      role="rowgroup"
      style={{ minWidth: props.minWidth }}
    >
      {props.children}
    </div>
  );
};

// @TODO: use the real column types here instead of a sample;
const getSizeForItem = (colname: string, sample: any): Column => {
  const props: Column = {
    Header: colname,
    accessor: colname,
  };
  if (typeof sample === 'undefined') {
    props.width = 100;
  } else if (
    sample instanceof Date
  ) {
    props.width = 200;
  } else if (typeof sample === 'number') {
    props.width = 100;
    props.className = 'text-right';
  } else if (typeof sample === 'boolean') {
    props.width = 75;
    props.className = 'text-center';
  }

  return props;
}

interface ResultsTableProps {
  cols: string[];
  data: any[];
  paginationSize: number; // add setting to change
  query: string;
  connId: string;
}
interface ResultsTableState {
  page: number,
  filtered: { [id: string]: Filter & { regex: RegExp | string } };
  clickedData: {
    value: any,
    index: number,
    col: string,
  };
  contextMenu: {
    x: number,
    y: number,
    open: boolean,
  };
}

export default class ResultsTable extends React.PureComponent<ResultsTableProps, ResultsTableState> {
  static initialState: ResultsTableState = {
    page: 0,
    filtered: {},
    clickedData: {
      value: undefined,
      index: -1,
      col: undefined,
    },
    contextMenu: {
      x: undefined,
      y: undefined,
      open: false,
    }
  };
  state = ResultsTable.initialState;

  columnDefault: Partial<GlobalColumn> = {
    ...ReactTableDefaults.column,
    ...{ minResizeWidth: 11 },
      Cell: (r: CellInfo) => {
        let v = r.original[r.column.id];
        if (v === null) return <small>NULL</small>;
        if (v === true) return <span>TRUE</span>;
        if (v === false) return <span>FALSE</span>;
        if (typeof v === 'object' || Array.isArray(v)) {
          return (
            <div className="syntax json copy-allowed" data-value={v === null ? 'null' : JSON.stringify(v, null, 2)} data-col={r.column.id} data-index={r.index}>
              <pre>{JSON.stringify(v)}</pre>
            </div>
          );
        }
        v = String(v);
        if (!this.state.filtered[r.column.id]) return <span>{v}</span>;
        return <span>
          {
            v.replace(this.state.filtered[r.column.id].regex || this.state.filtered[r.column.id].value, '<###>$1<###>')
            .split('<###>')
            .map((str, i) => {
              if (i % 2 === 1)
                return (
                  <mark key={i} className="filter-highlight">
                    {str}
                  </mark>
                );
              if (str.trim().length === 0) return null;
              return <span key={i}>{str}</span>;
            })
          }
        </span>
      },
  };

  openContextMenu = (e) => {
    const { pageX, pageY } = e;

    this.highlightClickedRow(e, () => {
      this.setState({
        contextMenu: {
          open: true,
          x: pageX,
          y: pageY,
        }
      });
    });
  }

  highlightClickedRow (e: React.MouseEvent<HTMLElement>, cb = (() => void 0)) {
    let node = e.target as HTMLElement;
    if (!node.matches('.copy-allowed')) {
      node = node.closest('.copy-allowed') as HTMLElement;
    }

    if (!node) return;

    const { value, index, col } = node.dataset;
    if (typeof index === 'undefined' || typeof col === 'undefined') {
      return;
    }

    this.setState({
      clickedData: {
        value,
        col,
        index: parseInt(index),
      },
    }, () => cb());
  }

  clipboardInsert(value) {
    value = typeof value ==='string' ? value : JSON.stringify(value, null, 2);
    clipboardInsert(value);
  }

  onTableClick = (e: React.MouseEvent<HTMLElement> = undefined) => {
    if (this.state.contextMenu.open) {
      const { clickedData, contextMenu } = ResultsTable.initialState;
      this.setState({
        clickedData,
        contextMenu,
      });
    } else if (e) {
      this.highlightClickedRow(e);
    }
  }

  tableContextOptions = (): any[] => {
    const options: any[] = [];
    if (!this.state.clickedData.col) return options;
    const { clickedData } = this.state;;
    if (typeof this.state.clickedData.value !== 'undefined') {
      options.push({ get label() { return FilterByValueOption.replace('{value}', clickedData.value) }, value: FilterByValueOption });
      options.push('sep');
    }
    if (Object.keys(this.state.filtered).length > 0) {
      options.push(ClearFiltersOption);
      options.push('sep');
    }
    return options
    .concat([
      { get label() { return OpenEditorWithValueOption.replace('{value}', clickedData.value) }, value: OpenEditorWithValueOption },
      OpenEditorWithRowOption,
      CopyCellOption,
      CopyRowOption,
      'sep',
      ReRunQueryOption,
      SaveCSVOption,
      SaveJSONOption,
    ]);
  }

  onFilterChange = (id: string, value: string = '', cb?: Function) => {
    const { filtered } = this.state;
    if (!value) {
      delete filtered[id];
    } else {
      filtered[id] = {
        id,
        value,
        regex: toRegEx(value),
      }
    }
    this.setState({
      filtered
    }, () => cb ? cb(value) : void 0);
  }

  onPageChange = (page: number) => this.setState({ page });

  onMenuSelect = (choice: string) => {
    const { clickedData } = this.state;
    switch(choice) {
      case FilterByValueOption:
        const { filtered = {} } = this.state;
        this.setState({
          filtered: {
            ...filtered,
            [clickedData.col]: {
              id: clickedData.col,
              value: clickedData.value,
              regex: clickedData.value
            },
          },
        })
      case CopyCellOption:
        this.clipboardInsert(clickedData.value);
        break;
      case CopyRowOption:
        this.clipboardInsert(this.props.data[clickedData.index] || 'Failed');
        break;
      case ClearFiltersOption:
        this.setState({ filtered: {} });
        break;
      case OpenEditorWithValueOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.insertText`,
            args: [clickedData.value]
          }
        });
        break;
      case OpenEditorWithRowOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.insertText`,
            args: [JSON.stringify(this.props.data[clickedData.index], null, 2)]
          }
        });
        break;
      case ReRunQueryOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.executeQuery`,
            args: [this.props.query, this.props.connId]
          }
        });
        break;
      case SaveCSVOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.saveResults`,
            args: ['csv', this.props.connId]
          }
        });
        break;
      case SaveJSONOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.saveResults`,
            args: ['json', this.props.connId]
          }
        });
        break;
    }
    this.onTableClick();
  }

  handleScroll = () => {
    const tbody = this.tbodyRef && this.tbodyRef.current;
    if (!tbody) return;
    let headers = document.querySelectorAll('.rt-thead') || [];
    headers.forEach(header => {
      header.scrollLeft = tbody.scrollLeft
    });
  }

  tbodyRef = React.createRef<HTMLDivElement>();

  getSnapshotBeforeUpdate() {
    try {
      const tbody = this.tbodyRef && this.tbodyRef.current;
      if (tbody) {
        const { scrollHeight, scrollLeft, scrollTop, scrollWidth } = tbody;
        return {
          scrollHeight, scrollLeft, scrollTop, scrollWidth
        };
      }
    } catch (e) { }
    return null;
  }

  componentDidUpdate(_, __, snapshot) {
    if (!snapshot) return;

    const tbody = this.tbodyRef && this.tbodyRef.current;

    if (!tbody) return;

    tbody.scrollLeft = snapshot.scrollLeft;
    tbody.scrollTop = snapshot.scrollTop;
  }

  render() {
    const firstRow = (this.props.data[0] || {});
    const cols = this.props.cols.map<Column>(c => getSizeForItem(c, firstRow[c]));
    if (cols.length > 0 && cols.length < 8) {
      delete cols[0].width;
    }

    return (
      <div onContextMenu={this.openContextMenu} onClick={this.onTableClick} className="react-table-clickable">
        <ReactTable
          noDataText="Query didn't return any results."
          data={this.props.data}
          columns={cols}
          column={this.columnDefault}
          filterable
          filtered={Object.values(this.state.filtered)}
          FilterComponent={({ column, onChange }) => <FilterComponent filter={this.state.filtered[column.id]} column={column} onChange={(id, value) => this.onFilterChange(id, value, onChange)} />}
          pageSize={this.props.paginationSize}
          showPagination={this.props.data.length > this.props.paginationSize}
          minRows={this.props.data.length === 0 ? 1 : Math.min(this.props.paginationSize, this.props.data.length)}
          getTrProps={(_, rowInfo: RowInfo) => {
            if (!rowInfo) return {};
            if (rowInfo && rowInfo.index === this.state.clickedData.index)
              return { className: ' active-row' };
            return {};
          }}
          onPageChange={this.onPageChange}
          page={this.state.page}
          getTdProps={(_, rowInfo: RowInfo, column: Column) => {
            if (!rowInfo || !column) return {};
            try {
              const v = rowInfo.original[column.id];
              const props = {
                className: 'copy-allowed',
                'data-value': v === null ? 'null' : v,
                'data-col': column.id,
                'data-index': rowInfo.index,
              } as any;
              if (v === null) props.className += ' td-null';
              if (v === true) props.className += ' td-badge green';
              if (v === false) props.className += ' td-badge red';
              if (column.id === this.state.clickedData.col && rowInfo && rowInfo.index === this.state.clickedData.index) {
                props.className += ' active-cell';
              }

              return props;
            } catch (e) {
              /** */
            }
            return {};
          }}
          defaultFilterMethod={(filter, row) => {
            const filterData = this.state.filtered[filter.id];
            if (!filterData || typeof row[filter.id] === 'undefined') return true;
            const { regex, value } = filterData;
            const position = `${row[filter.id]}`.search(regex || value);
            return position !== -1;
          }}
          className="-striped -highlight"
          TbodyComponent={(props) => <TbodyComponent {...props} onScroll={this.handleScroll} ref={this.tbodyRef} />}
          TrGroupComponent={TrGroupComponent}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
        <Menu {...this.state.contextMenu} width={250} onSelect={this.onMenuSelect} options={this.tableContextOptions()} />
      </div>
    );
  }
}
