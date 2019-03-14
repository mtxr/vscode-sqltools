import React from 'react';
import ReactTable, { ReactTableDefaults, GlobalColumn, Column, CellInfo, RowInfo, Filter } from 'react-table';
import ReactDOM from 'react-dom';
import Menu from './../../components/Menu';
import { clipboardInsert } from '@sqltools/ui/lib/utils';
import getVscode from '../../lib/vscode';

const FilterByValue = 'Filter by \'{value}\'';
const ReRunQuery = 'Re-run this query';
const ClearFilters = 'Clear all filters';
const CopyCellOption = 'Copy Cell value';
const CopyRowOption = 'Copy Row value';
const SaveCSVOption = 'Save results as CSV';
const SaveJSONOption = 'Save results as JSON';
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
  return value
}

const FilterComponent = ({ filter, column, onChange }) => {
  return (
    <input
      type="text"
      placeholder={`Filter by ${column.id}`}
      style={{ width: '100%' }}
      value={filter ? filter.value : ''}
      onChange={event => onChange(event.target.value)}
    />
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
  filtered: { [id: string]: string | RegExp };
  tableFiltered: Filter[];
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
    filtered: {},
    tableFiltered: [],
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
        if (v === null) return <small>(NULL)</small>;
        if (v === true) return <span>TRUE</span>;
        if (v === false) return <span>FALSE</span>;
        if (typeof v === 'object' || Array.isArray(v)) {
          return (
            <div className="syntax json copy-allowed">
              <pre>{JSON.stringify(v)}</pre>
            </div>
          );
        }
        v = String(v);
        if (!this.state.filtered[r.column.id]) return <span>{v}</span>;
        return <span>
          {
            v.replace(this.state.filtered[r.column.id], '<###>$1<###>')
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

  highlightClickedRow (e, cb = (() => void 0)) {
    let node = ReactDOM.findDOMNode(e.target) as Element & HTMLElement;
    let i = 0;
    while (i < 3) {
      if (!node) return true;
      if (node.classList.contains('copy-allowed')) break;
      i++;
      node = node.parentNode as Element & HTMLElement;
    }

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

  onTableClick = (e = undefined) => {

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
      options.push({ get label() { return FilterByValue.replace('{value}', clickedData.value) }, value: FilterByValue });
      options.push('sep');
    }
    if (this.state.tableFiltered.length > 0) {
      options.push(ClearFilters);
      options.push('sep');
    }
    return options
    .concat([
      ReRunQuery,
      'sep',
      CopyCellOption,
      CopyRowOption,
      'sep',
      SaveCSVOption,
      SaveJSONOption,
    ]);
  }

  onMenuSelect = (choice: string) => {
    const { clickedData } = this.state;
    switch(choice) {
      case FilterByValue:
        const { filtered = {}, tableFiltered = [] } = this.state;
        this.setState({
          tableFiltered: tableFiltered.filter(({ id }) => id !== clickedData.col).concat([{
            id: clickedData.col,
            value: clickedData.value,
          }]),
          filtered: {
            ...filtered,
            [clickedData.col]: toRegEx(clickedData.value),
          },
        })
      case CopyCellOption:
        this.clipboardInsert(clickedData.value);
        break;
      case CopyRowOption:
        this.clipboardInsert(this.props.data[clickedData.index] || 'Failed');
        break;
      case ClearFilters:
        this.setState({
          tableFiltered: [],
          filtered: {},
        });
        break;
      case ReRunQuery:
        getVscode().postMessage({ action: 'call', payload: { command: `${process.env.EXT_NAME}.executeQuery`, args: [this.props.query]} });
        break;
      case SaveCSVOption:
        getVscode().postMessage({ action: 'call', payload: { command: `${process.env.EXT_NAME}.saveResults`, args: ['csv']} });
        break;
      case SaveJSONOption:
        getVscode().postMessage({ action: 'call', payload: { command: `${process.env.EXT_NAME}.saveResults`, args: ['json']} });
        break;
    }
    this.onTableClick();
  }

  handleScroll(event) {
    let headers = document.getElementsByClassName("rt-thead");
    for (let i = 0; i < headers.length; i++) {
      headers[i].scrollLeft = event.target.scrollLeft;
    }
  }

  _tBodyComponent: Element = null;

  componentDidMount() {
    setTimeout(() => {
      this._tBodyComponent = document.getElementsByClassName("rt-tbody")[0];
      this._tBodyComponent && this._tBodyComponent.addEventListener("scroll", this.handleScroll);
    }, 1000);
  }

  componentWillUnmount() {
    this._tBodyComponent && this._tBodyComponent.removeEventListener("scroll", this.handleScroll);
  }

  getSnapshotBeforeUpdate() {
    try {
      if (document.getElementsByClassName("rt-tbody")[0]) {
        const { scrollHeight, scrollLeft, scrollTop, scrollWidth } = document.getElementsByClassName("rt-tbody")[0];
        return {
          scrollHeight, scrollLeft, scrollTop, scrollWidth
        };
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  componentDidUpdate(_, __, snapshot) {
    if (
        snapshot !== null
        && document.getElementsByClassName("rt-tbody")[0]
      ) {
      document.getElementsByClassName("rt-tbody")[0].scrollLeft = snapshot.scrollLeft;
      document.getElementsByClassName("rt-tbody")[0].scrollTop = snapshot.scrollTop;
    }
  }

  render() {
    const firstRow = (this.props.data[0] || {});
    const cols = this.props.cols.map<Column>(c => getSizeForItem(c, firstRow[c]));
    if (cols.length > 0 && cols.length < 8) {
      delete cols[0].width;
    }

    const TbodyComponent = props => {
      for (let i = 0; i < props.children[0].length; i++) {
        props.children[0][i] = React.cloneElement(props.children[0][i], {
          minWidth: props.style.minWidth
        });
      }

      return <div className="rt-tbody">{props.children}</div>;
    };

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
    return (
      <div onContextMenu={this.openContextMenu} onClick={this.onTableClick} className="react-table-clickable">
        <ReactTable
          noDataText="Query didn't return any results."
          data={this.props.data}
          columns={cols}
          column={this.columnDefault}
          filterable
          filtered={this.state.tableFiltered}
          FilterComponent={FilterComponent}
          pageSize={this.props.paginationSize}
          showPagination={this.props.data.length > this.props.paginationSize}
          minRows={this.props.data.length === 0 ? 1 : Math.min(this.props.paginationSize, this.props.data.length)}
          getTrProps={(_, rowInfo: RowInfo) => {
            if (!rowInfo) return {};
            if (rowInfo && rowInfo.index === this.state.clickedData.index)
              return { className: ' active-row' };
            return {};
          }}
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
              if (v === true) props.className += ' td-icon green';
              if (v === false) props.className += ' td-icon red';
              if (column.id === this.state.clickedData.col && rowInfo && rowInfo.index === this.state.clickedData.index) {
                props.className += ' active-cell';
              }

              return props;
            } catch (e) {
              /** */
            }
            return {};
          }}
          onFilteredChange={filtered => {
            this.setState({
              tableFiltered: filtered,
              filtered: filtered.reduce((p, c) => {
                p[c.id] = toRegEx(String(c.value));
                return p;
              }, {}),
            });
          }}
          defaultFilterMethod={(filter, row) => {
            const exp = this.state.filtered[filter.id];
            if (exp instanceof RegExp) {
              return exp.test(String(row[filter.id]));
            }
            return String(row[filter.id]) === exp;
          }}
          className="-striped -highlight"
          TbodyComponent={TbodyComponent}
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
