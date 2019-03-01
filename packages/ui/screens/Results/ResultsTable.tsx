import React from 'react';
import ReactTable, { ReactTableDefaults, GlobalColumn, Column, CellInfo, RowInfo } from 'react-table';
import ReactDOM from 'react-dom';
import Menu from './../../components/Menu';
import { clipboardInsert } from '@sqltools/ui/lib/utils';

const CopyCellOption = 'Copy Cell value';
const CopyRowOption = 'Copy Row value';
const SaveCSVOption = 'Save as CSV';
const SaveJSONOption = 'Save as JSON';

const TableContextMenuOptions = [
  CopyCellOption,
  CopyRowOption,
  // @TODO: add option to export save menu
  // 'sep',
  // SaveCSVOption,
  // SaveJSONOption,
];

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
    props.width = 50;
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
  filtered: { [id: string]: any };
  clickedData: {
    value: any,
    index: number,
    col: string,
  },
  contextMenu: {
    x: number,
    y: number,
    open: boolean,
  }
}

export default class ResultsTable extends React.PureComponent<ResultsTableProps, ResultsTableState> {
  static initialState = {
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
    this.setState({
      clickedData: {
        value,
        col,
        index: parseInt(index),
      },
      contextMenu: {
        open: true,
        x: e.pageX,
        y: e.pageY,
      }
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

  onMenuSelect = (choice: typeof TableContextMenuOptions[number]) => {
    const { clickedData } = this.state;
    switch(choice) {
      case CopyCellOption:
        this.clipboardInsert(clickedData.value);
        break;
      case CopyRowOption:
        this.clipboardInsert(this.props.data[clickedData.index] || 'Failed');
        break;
      case SaveCSVOption:
        break;
      case SaveJSONOption:
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
              filtered: filtered.reduce((p, c) => {
                let exp: string | RegExp = String(c.value);
                try {
                  exp = new RegExp(`(${exp})`, 'gi');
                } catch (e) {
                  /** */
                }
                p[c.id] = exp;
                return p;
              }, {}),
            });
          }}
          defaultFilterMethod={(filter, row) => {
            let exp: string | RegExp = String(filter.value);
            try {
              exp = new RegExp(`(${exp})`, 'gi');
              return exp.test(String(row[filter.id]));
            } catch (e) {
              return String(row[filter.id]) === exp;
            }
          }}
          className="-striped"
        />
        <Menu {...this.state.contextMenu} onSelect={this.onMenuSelect} options={TableContextMenuOptions} />
      </div>
    );
  }
}
