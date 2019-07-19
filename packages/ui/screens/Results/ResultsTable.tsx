import React from "react";
import { Grid, Plugins, Data } from "slickgrid-es6";

import Menu from "./../../components/Menu";
import { clipboardInsert } from "@sqltools/ui/lib/utils";
import getVscode from "../../lib/vscode";
import "slick.grid.variables.scss";
import "slick.grid.scss";
import "slick-default-theme.scss";
import ReactDOM from "react-dom";

const FilterByValueOption = "Filter by '{value}'";
const ReRunQueryOption = "Re-run this query";
const ClearFiltersOption = "Clear all filters";
const CopyCellOption = "Copy Cell value";
const CopyRowOption = "Copy Row value";
const SaveCSVOption = "Save results as CSV";
const SaveJSONOption = "Save results as JSON";
const OpenEditorWithValueOption = "Open editor with'{value}'";
const OpenEditorWithRowOption = "Open editor with row";

interface IResultsTableProps {
  cols: string[];
  data: any[];
  paginationSize: number; // add setting to change
  query: string;
  connId: string;
}
interface IFilterProps {
  columnFilters: { [id: string]: any };
  columnId: any;
  dv: Slick.Data.DataView<any>;
}
interface IResultsTableState {
  clickedData: { value: any, index: number, col: string };
  contextMenu: { x: number, y: number, open: boolean };
}

class Filter extends React.PureComponent<IFilterProps>  {
  handleChange = ({target}) => {
    let dv = this.props.dv;
    let columnFilters = this.props.columnFilters;
    let columnId = this.props.columnId;
    const value = target.value.trim();
    updateFilters(value, columnFilters, columnId, dv);
  }

  render() {
    return <input defaultValue={this.props.columnFilters[this.props.columnId]} type="text"
                  className="editor-text" style={{background: "white"}} onChange={this.handleChange} />;
  }
}

export default class ResultsTable extends React.PureComponent<IResultsTableProps, IResultsTableState> {
  static initialState: IResultsTableState = {
    clickedData: { value: undefined, index: -1, col: undefined },
    contextMenu: { x: undefined, y: undefined, open: false }
  };
  state = ResultsTable.initialState;
  gridElement: HTMLDivElement = null;
  gridSizer: HTMLDivElement = null;
  theCanvas = null;
  grid: Slick.Grid<any> = null;
  dv: Slick.Data.DataView<any> = null;
  columnFilters = {};

  openContextMenu = (e: { pageX: any; pageY: any; }) => {
    this.setState({ contextMenu: { open: true, x: e.pageX, y: e.pageY } });
  }

  clipboardInsert(value: string) {
    value = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    clipboardInsert(value);
  }

  onTableClick = () => {
    if (this.state.contextMenu.open) {
      const { contextMenu } = ResultsTable.initialState;
      this.setState({ contextMenu });
    }
  }

  tableContextOptions = (): any[] => {
    const options: any[] = [];
    if (!this.state.clickedData.col) { return options; }
    const { clickedData } = this.state;
    if (typeof this.state.clickedData.value !== "undefined") {
      options.push({ get label() { return FilterByValueOption.replace("{value}", clickedData.value); }, value: FilterByValueOption });
      options.push("sep");
    }
    if (Object.keys(this.columnFilters).length > 0) {
      options.push(ClearFiltersOption);
      options.push("sep");
    }
    return options
      .concat([
        { get label() { return OpenEditorWithValueOption.replace("{value}", clickedData.value); }, value: OpenEditorWithValueOption },
        OpenEditorWithRowOption,
        CopyCellOption,
        CopyRowOption,
        "sep",
        ReRunQueryOption,
        SaveCSVOption,
        SaveJSONOption,
      ]);
  }

  onMenuSelect = (choice: string) => {
    const data = this.state.clickedData;
    switch (choice) {
      case FilterByValueOption:
          let headerCol = this.grid.getHeaderRowColumn(data.col);
          let editor = (headerCol as HTMLElement).getElementsByClassName("editor-text")[0] as HTMLInputElement;
          editor.value = data.value;
          updateFilters(data.value, this.columnFilters, data.col, this.dv);
        break;
      case CopyCellOption:
        this.clipboardInsert(data.value);
        break;
      case CopyRowOption:
        this.clipboardInsert(this.dv.getItemByIdx(data.index) || "Failed");
        break;
      case ClearFiltersOption:
        let header = this.grid.getHeaderRow();
        let editors = (header as HTMLElement).getElementsByClassName("editor-text");
        for (let editor of Array.from(editors)) {
          (editor as HTMLInputElement).value = null;
        }
        this.columnFilters = {};
        this.dv.refresh();
        break;
      case OpenEditorWithValueOption:
        getVscode().postMessage({
          action: "call",
          payload: { command: `${process.env.EXT_NAME}.insertText`, args: [data.value] }
        });
        break;
      case OpenEditorWithRowOption:
        getVscode().postMessage({
          action: "call",
          payload: {
            command: `${process.env.EXT_NAME}.insertText`,
            args: [JSON.stringify(this.dv.getItemByIdx(data.index), null, 2)]
          }
        });
        break;
      case ReRunQueryOption:
        getVscode().postMessage({
          action: "call",
          payload: { command: `${process.env.EXT_NAME}.executeQuery`, args: [this.props.query, this.props.connId] }
        });
        break;
      case SaveCSVOption:
        getVscode().postMessage({
          action: "call",
          payload: { command: `${process.env.EXT_NAME}.saveResults`, args: ["csv", this.props.connId] }
        });
        break;
      case SaveJSONOption:
        getVscode().postMessage({
          action: "call",
          payload: { command: `${process.env.EXT_NAME}.saveResults`, args: ["json", this.props.connId] }
        });
        break;
    }
    const { contextMenu } = ResultsTable.initialState;
    this.setState({ contextMenu });
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
    } catch (e) { /**/ }
    return null;
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(previousProps: any, __: any, snapshot: { scrollLeft: number; scrollTop: number; }) {
    if (previousProps.data != this.props.data) {
      this.init();
    }
    if (!snapshot) { return; }

    const tbody = this.tbodyRef && this.tbodyRef.current;

    if (!tbody) { return; }

    tbody.scrollLeft = snapshot.scrollLeft;
    tbody.scrollTop = snapshot.scrollTop;

  }

  render() {
    let thestyle = { width: "100%" };
    let thestyle2 = { top: "0px", bottom: "95px", width: 0, position: "absolute" as "absolute" };
    return (<div onContextMenu={this.openContextMenu} onClick={this.onTableClick} >
      <div id="thegrid" ref={grid => this.gridElement = grid} style={thestyle} className="slickgrid-container"></div>
      <Menu {...this.state.contextMenu} width={250} onSelect={this.onMenuSelect} options={this.tableContextOptions()} />
      <div id="myGridSizer" ref={gridSizer => this.gridSizer = gridSizer} style={thestyle2}></div></div>);
  }

  getTextWidth(text: string) {
    let context = null;
    if (!this.theCanvas) {
      this.theCanvas = document.createElement("canvas");
      context = this.theCanvas.getContext("2d");
      let container = document.querySelector(".query-results-container");
      let compStyle = getComputedStyle(container);
      let fontSize = compStyle.getPropertyValue("font-size");
      let fontName = compStyle.getPropertyValue("font-family");
      context.font = fontSize + " " + fontName;
    } else {
      context = this.theCanvas.getContext("2d");
    }
    return context.measureText(text).width;
  }

  init() {
    if (this.grid != null) {
      this.grid.destroy();
    }
    window.onresize = () => {
      let newHeight = this.gridSizer.offsetHeight + "px";
      this.gridElement.style.height = newHeight;
      if (this.grid != null) {
        this.grid.resizeCanvas();
      }
    };

    let data = this.props.data.slice(0);
    let i = 1;
    for (let p of data) {
      p.id = i++;
    }

    let columns = [];
    for (let col of this.props.cols) {
      let width = this.getTextWidth(col) + 20;
      for (let p of data) {
        let curWidth = this.getTextWidth(p[col]) + 20;
        if (curWidth > width) {
          width = curWidth;
        }
      }
      if (width < 50) { width = 50; }
      if (width > 300) { width = 300; }
      columns.push(({ id: col, name: col, field: col, sortable: true, visible: true, width: width }));
    }
    let newHeight = this.gridSizer.offsetHeight + "px";
    this.gridElement.style.height = newHeight;
    this.dv = new Data.DataView();
    this.dv.setItems(data);
    this.grid = new Grid(this.gridElement, this.dv, columns,
      { enableCellNavigation: true, enableColumnReorder: true, forceFitColumns: false,
        enableRowSelection: true, showHeaderRow: true, explicitInitialization: true });

    this.grid.setSelectionModel(new Plugins.RowSelectionModel({ selectActiveRow: true }));
    this.grid.onSort.subscribe((e, args) => {
      const comparer = (a, b) =>  ((a[args.sortCol.field] || 0) > (b[args.sortCol.field] || 0)) ? 1 : -1;
      this.dv.sort(comparer, args.sortAsc);
    });

    this.grid.onHeaderRowCellRendered.subscribe((_e, {node, column}) => {
      ReactDOM.render(<Filter columnId={column.id} columnFilters={this.columnFilters} dv={this.dv}/>, node);
      node.classList.add("slick-editable");
    });

    this.dv.onRowCountChanged.subscribe(() => {
      this.grid.updateRowCount();
      this.grid.render();
    });

    this.dv.onRowsChanged.subscribe((_e, {rows}) => {
      this.grid.invalidateRows(rows);
      this.grid.render();
    });

    this.dv.setFilter(item => {
      let pass = true;
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          if (key in this.columnFilters && this.columnFilters[key].length && key !== "health") {
            pass = pass && (String(item[key]).match(new RegExp(this.columnFilters[key], "ig")) ? true : false);
          }
        }
      }
      return pass;
    });

    this.grid.onActiveCellChanged.subscribe( (_e, args) => {
      let rowIndex = args.row;
      let colIndex = args.cell;
      let col = this.grid.getColumns()[colIndex].field;
      let val = this.dv.getItems()[rowIndex][col];
      this.setState({ clickedData: { value: val, col: col, index: rowIndex } });
    });

    this.grid.init();
  }
}

function updateFilters(value: any, columnFilters: any, columnId: any, dv: Slick.Data.DataView<any>) {
  if (value.length) {
    columnFilters[columnId] = value;
  } else {
    delete columnFilters[columnId];
  }
  dv.refresh();
}

