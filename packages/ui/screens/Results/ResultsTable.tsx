import React from 'react';
import ReactTable, { ReactTableDefaults, GlobalColumn } from 'react-table';

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

interface ResultsTableProps {
  cols: string[];
  data: any[];
  paginationSize: number; // add setting to change
}
interface ResultsTableState {
  filtered: any;
}
export default class ResultsTable extends React.PureComponent<ResultsTableProps, ResultsTableState> {
  state = {
    filtered: {},
  };

  columnDefault: Partial<GlobalColumn> = {
    ...ReactTableDefaults.column,
    ...{ minResizeWidth: 11 },
      Cell: r => {
        let v = r.original[r.column.id];
        if (v === null) return <small>(NULL)</small>;
        if (v === true) return <span>TRUE</span>;
        if (v === false) return <span>FALSE</span>;
        if (typeof v === 'object' || Array.isArray(v)) {
          return (
            <div className="syntax json">
              <pre>{JSON.stringify(v)}</pre>
            </div>
          );
        }
        v = String(v);
        if (!this.state.filtered[r.column.id]) return v;
        return v
          .replace(this.state.filtered[r.column.id], '<###>$1<###>')
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
          });
      },
  };

  render() {
    const cols = this.props.cols.map(c => {
      return {
        Header: c,
        accessor: c,
      };
    });
    return (
      <ReactTable
        noDataText="Query didn't return any results."
        data={this.props.data}
        columns={cols}
        column={this.columnDefault}
        filterable
        FilterComponent={FilterComponent}
        showPagination={this.props.data.length > this.props.paginationSize}
        minRows={Math.min(this.props.paginationSize, this.props.data.length + 1)}
        {...{ minResizeWidth: 11 }}
        getTdProps={(_, rowInfo, column) => {
          try {
            const v = rowInfo.original[column.id];
            const props = {} as any;
            if (v === true) props.className = 'td-icon green';
            if (v === false) props.className = 'td-icon red';
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
    );
  }
}
