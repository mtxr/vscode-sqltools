import React from 'react';
import ReactTable, { ReactTableDefaults, GlobalColumn, Column, CellInfo, RowInfo, Filter } from 'react-table';
import ReactDOM from 'react-dom';
import Menu from './../../components/Menu';
import { clipboardInsert } from '@sqltools/ui/lib/utils';

const FilterByValue = 'Filter by \'{value}\'';
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
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    let node = ReactDOM.findDOMNode(e.target) as Element & HTMLElement;
    let i = 0;
    while (i < 5) {
      if (!node) return true;
      if (node.classList.contains('copy-allowed')) break;
      i++;
      node = node.parentNode as Element & HTMLElement;
    }

    const { value, index, col } = node.dataset;
    const { pageX, pageY } = e;

    this.setState({
      clickedData: {
        value,
        col,
        index: parseInt(index),
      },
    }, () => {
      // delay menu open til we have clickedData
      this.setState({
        contextMenu: {
          open: true,
          x: pageX,
          y: pageY,
        }
      });
    });
  }

  clipboardInsert(value) {
    value = typeof value ==='string' ? value : JSON.stringify(value, null, 2);
    clipboardInsert(value);
  }

  onMenuClose = (e = undefined) => {
    if (e) {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
    }

    const { clickedData, contextMenu } = ResultsTable.initialState;
    this.setState({
      clickedData,
      contextMenu,
    })
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
      CopyCellOption,
      CopyRowOption,
      'sep',
      { label: SaveCSVOption, command: encodeURI(`${process.env.EXT_NAME || 'sqltools'}.saveResults?csv`) },
      { label: SaveJSONOption, command: encodeURI(`${process.env.EXT_NAME || 'sqltools'}.saveResults?json`) },
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
      case SaveCSVOption:
      case SaveJSONOption:
        // handled with commands uri
        break;
    }
    this.onMenuClose();
  }

  render() {
    const firstRow = (this.props.data[0] || {});
    const cols = this.props.cols.map<Column>(c => getSizeForItem(c, firstRow[c]));
    if (cols.length > 0 && cols.length < 8) {
      delete cols[0].width;
    }
    return (
      <div onContextMenu={this.openContextMenu} onClick={this.onMenuClose} className="react-table-clickable">
        <ReactTable
          noDataText="Query didn't return any results."
          data={this.props.data}
          columns={cols}
          column={this.columnDefault}
          filterable
          filtered={this.state.tableFiltered}
          FilterComponent={FilterComponent}
          showPagination={this.props.data.length > this.props.paginationSize}
          minRows={this.props.data.length === 0 ?  this.props.paginationSize : Math.min(this.props.paginationSize, this.props.data.length)}
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
          className="-striped"
        />
        <Menu {...this.state.contextMenu} width={250} onSelect={this.onMenuSelect} options={this.tableContextOptions()} />
      </div>
    );
  }
}
