import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Position,
  Handle,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  NodeMouseHandler,
} from 'react-flow-renderer';
import dagre from 'dagre';
import 'react-flow-renderer/dist/style.css';

// Hide React Flow attribution watermark
const hideAttribution = document.createElement('style');
hideAttribution.textContent = '.react-flow__attribution { display: none !important; }';
document.head.appendChild(hideAttribution);
import { UIAction } from '../actions';
import sendMessage from '../../../lib/messages';
import Loading from '../../../components/Loading';

// ─── Types ─────────────────────────────────────────────────────────

interface IColumn {
  label: string;
  dataType: string;
  isPk?: boolean;
  isFk?: boolean;
  isNullable?: boolean | string;
}

interface IForeignKey {
  constraintName: string;
  sourceTableSchema: string;
  sourceTableName: string;
  sourceColumnName: string;
  targetTableSchema: string;
  targetTableName: string;
  targetColumnName: string;
}

interface ERData {
  tables: Array<{ label: string }>;
  columns: { [tableName: string]: IColumn[] };
  foreignKeys: IForeignKey[];
  schemaName: string;
  connectionName: string;
}

// ─── Focus helpers ─────────────────────────────────────────────────

function getConnectedTableIds(tableId: string, foreignKeys: IForeignKey[]): Set<string> {
  const connected = new Set<string>();
  connected.add(tableId);
  for (const fk of foreignKeys) {
    if (fk.sourceTableName === tableId) connected.add(fk.targetTableName);
    if (fk.targetTableName === tableId) connected.add(fk.sourceTableName);
  }
  return connected;
}

function getConnectedEdgeIds(tableId: string, edges: Edge[]): Set<string> {
  const ids = new Set<string>();
  for (const e of edges) {
    if (e.source === tableId || e.target === tableId) ids.add(e.id);
  }
  return ids;
}

const DIM_OPACITY = 0.15;

// ─── Table color palette ───────────────────────────────────────────

const TABLE_COLORS = [
  '#3794ff', // blue
  '#89d185', // green
  '#cca700', // yellow
  '#e06c75', // red
  '#c678dd', // purple
  '#56b6c2', // cyan
  '#d19a66', // orange
  '#61afef', // light blue
  '#98c379', // lime
  '#e5c07b', // gold
  '#be5046', // rust
  '#c882e7', // lavender
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function getTableColor(name: string): string {
  return TABLE_COLORS[hashString(name) % TABLE_COLORS.length];
}

// ─── Custom Table Node ─────────────────────────────────────────────

const ROW_HEIGHT = 28;
const HEADER_HEIGHT = 36;

interface TableNodeData {
  label: string;
  columns: IColumn[];
  dimmed?: boolean;
  focused?: boolean;
  color: string;
}

function TableNodeComponent({ data }: { data: TableNodeData }) {
  const { label, columns, dimmed, focused, color } = data;
  const width = Math.max(220, label.length * 9 + 40, ...columns.map(c => (c.label.length + (c.dataType || '').length) * 7.5 + 80));

  return (
    <div style={{
      background: 'var(--vscode-editor-background, #1e1e1e)',
      border: focused
        ? `2px solid ${color}`
        : '1.5px solid var(--vscode-panel-border, #555)',
      borderRadius: 6,
      overflow: 'hidden',
      minWidth: width,
      fontSize: 12,
      fontFamily: 'var(--vscode-font-family, sans-serif)',
      boxShadow: focused
        ? `0 0 12px ${color}66, 0 2px 8px rgba(0,0,0,0.3)`
        : '0 2px 8px rgba(0,0,0,0.3)',
      opacity: dimmed ? DIM_OPACITY : 1,
      transition: 'opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
    }}>
      {/* Header with table color accent */}
      <div style={{
        background: 'var(--vscode-sideBarSectionHeader-background, #37373d)',
        padding: '8px 12px',
        fontWeight: 'bold',
        fontSize: 13,
        color: 'var(--vscode-sideBarSectionHeader-foreground, #ccc)',
        borderBottom: '1px solid var(--vscode-panel-border, #555)',
        textAlign: 'center',
        borderTop: `3px solid ${color}`,
      }}>
        {label}
      </div>

      {/* Columns */}
      {columns.length === 0 && (
        <div style={{ padding: '8px 12px', color: 'var(--vscode-descriptionForeground, #666)', fontStyle: 'italic' }}>
          no columns
        </div>
      )}
      {columns.map((col, i) => (
        <div key={col.label + i} style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: '4px 12px',
          height: ROW_HEIGHT,
          background: i % 2 === 1 ? 'var(--vscode-list-hoverBackground, rgba(255,255,255,0.04))' : 'transparent',
          borderBottom: i < columns.length - 1 ? '1px solid var(--vscode-widget-border, rgba(255,255,255,0.06))' : 'none',
        }}>
          <Handle type="target" position={Position.Left} id={`${col.label}-target`}
            style={{ top: '50%', width: 1, height: 1, background: 'transparent', border: 'none', opacity: 0 }}
          />
          <Handle type="source" position={Position.Right} id={`${col.label}-source`}
            style={{ top: '50%', width: 1, height: 1, background: 'transparent', border: 'none', opacity: 0 }}
          />
          <span style={{
            width: 22, fontSize: 9, fontWeight: 'bold', flexShrink: 0,
            color: col.isPk ? 'var(--vscode-charts-yellow, #cca700)' : col.isFk ? 'var(--vscode-charts-blue, #3794ff)' : 'transparent',
          }}>
            {col.isPk ? 'PK' : col.isFk ? 'FK' : ''}
          </span>
          <span style={{
            flex: 1, color: 'var(--vscode-editor-foreground, #d4d4d4)',
            fontFamily: 'var(--vscode-editor-fontFamily, Consolas, monospace)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {col.label}
          </span>
          <span style={{
            color: 'var(--vscode-descriptionForeground, #888)',
            fontFamily: 'var(--vscode-editor-fontFamily, Consolas, monospace)',
            fontSize: 11, marginLeft: 8, flexShrink: 0,
          }}>
            {(col.dataType || '').toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}

const nodeTypes = { tableNode: TableNodeComponent };

// ─── Layout with dagre ─────────────────────────────────────────────

function measureNode(label: string, cols: IColumn[]): { w: number; h: number } {
  const w = Math.max(220, label.length * 9 + 40, ...cols.map(c => (c.label.length + (c.dataType || '').length) * 7.5 + 80));
  const h = HEADER_HEIGHT + Math.max(cols.length, 1) * ROW_HEIGHT + 8;
  return { w, h };
}

function buildNodesAndEdges(data: ERData): { nodes: Node[]; edges: Edge[] } {
  const { tables, columns, foreignKeys } = data;

  // Build edges with color from source table
  const edges: Edge[] = foreignKeys.map((fk, i) => {
    const color = getTableColor(fk.sourceTableName);
    return {
      id: `fk-${i}`,
      source: fk.sourceTableName,
      sourceHandle: `${fk.sourceColumnName}-source`,
      target: fk.targetTableName,
      targetHandle: `${fk.targetColumnName}-target`,
      type: 'default',
      animated: false,
      style: { stroke: color, strokeWidth: 2 },
      label: fk.sourceColumnName,
      labelStyle: { fill: 'var(--vscode-descriptionForeground, #888)', fontSize: 10, fontFamily: 'var(--vscode-font-family, sans-serif)' },
      labelBgStyle: { fill: 'var(--vscode-editor-background, #1e1e1e)', fillOpacity: 0.85 },
      labelBgPadding: [4, 2] as [number, number],
      labelBgBorderRadius: 3,
    };
  });

  // Use dagre for layout
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'LR',    // left-to-right flow
    nodesep: 60,       // vertical spacing between nodes in same rank
    ranksep: 120,      // horizontal spacing between ranks
    edgesep: 30,       // spacing between edges
    marginx: 40,
    marginy: 40,
  });

  // Add nodes with measured dimensions
  for (const t of tables) {
    const cols = columns[t.label] || [];
    const { w, h } = measureNode(t.label, cols);
    g.setNode(t.label, { width: w, height: h });
  }

  // Add edges
  for (const fk of foreignKeys) {
    if (g.hasNode(fk.sourceTableName) && g.hasNode(fk.targetTableName)) {
      g.setEdge(fk.sourceTableName, fk.targetTableName);
    }
  }

  dagre.layout(g);

  // Build React Flow nodes from dagre positions
  const nodes: Node[] = tables.map(t => {
    const cols = columns[t.label] || [];
    const { w, h } = measureNode(t.label, cols);
    const pos = g.node(t.label);
    return {
      id: t.label,
      type: 'tableNode',
      // dagre gives center position, React Flow uses top-left
      position: { x: pos.x - w / 2, y: pos.y - h / 2 },
      data: { label: t.label, columns: cols, dimmed: false, focused: false, color: getTableColor(t.label) },
    };
  });

  return { nodes, edges };
}

// ─── Inner Flow (needs ReactFlowProvider) ──────────────────────────

function ERFlowInner({ data, focusedTable, setFocusedTable }: {
  data: ERData;
  focusedTable: string | null;
  setFocusedTable: (t: string | null) => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [baseNodes, setBaseNodes] = useState<Node[]>([]);
  const [baseEdges, setBaseEdges] = useState<Edge[]>([]);
  const reactFlow = useReactFlow();

  // Build initial layout
  useEffect(() => {
    const { nodes: n, edges: e } = buildNodesAndEdges(data);
    setBaseNodes(n);
    setBaseEdges(e);
    setNodes(n);
    setEdges(e);
  }, [data]);

  // Apply focus mode
  useEffect(() => {
    if (!focusedTable) {
      setNodes(baseNodes.map(n => ({
        ...n,
        data: { ...n.data, dimmed: false, focused: false },
      })));
      setEdges(baseEdges.map(e => ({
        ...e,
        style: { ...e.style, opacity: 1 },
        animated: false,
      })));
      return;
    }

    const connectedNodes = getConnectedTableIds(focusedTable, data.foreignKeys);
    const connectedEdges = getConnectedEdgeIds(focusedTable, baseEdges);

    setNodes(baseNodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        dimmed: !connectedNodes.has(n.id),
        focused: n.id === focusedTable,
      },
    })));

    setEdges(baseEdges.map(e => ({
      ...e,
      style: {
        ...e.style,
        opacity: connectedEdges.has(e.id) ? 1 : DIM_OPACITY,
        strokeWidth: connectedEdges.has(e.id) ? 3 : 2,
      },
      animated: connectedEdges.has(e.id),
    })));
  }, [focusedTable, baseNodes, baseEdges, data]);

  // Pan to focused table
  useEffect(() => {
    if (!focusedTable || baseNodes.length === 0) return;
    const node = baseNodes.find(n => n.id === focusedTable);
    if (!node) return;
    const cols = data.columns[focusedTable] || [];
    const { w, h } = measureNode(focusedTable, cols);
    reactFlow.setCenter(node.position.x + w / 2, node.position.y + h / 2, { zoom: 0.75, duration: 800 });
  }, [focusedTable, baseNodes]);

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setFocusedTable(focusedTable === node.id ? null : node.id);
  }, [focusedTable, setFocusedTable]);

  const onPaneClick = useCallback(() => {
    setFocusedTable(null);
  }, [setFocusedTable]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.05}
      maxZoom={3}
      defaultEdgeOptions={{ type: 'default' }}
      style={{ background: 'var(--vscode-editor-background, #1e1e1e)' }}
    >
      <Background color="var(--vscode-widget-border, rgba(255,255,255,0.05))" gap={20} />
      <Controls
        style={{
          background: 'var(--vscode-sideBar-background, #252526)',
          border: '1px solid var(--vscode-panel-border, #555)',
          borderRadius: 4,
        }}
      />
    </ReactFlow>
  );
}

// ─── Table Search Component ────────────────────────────────────────

function TableSearch({ tables, focusedTable, onSelect }: {
  tables: Array<{ label: string }>;
  focusedTable: string | null;
  onSelect: (name: string | null) => void;
}) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = search
    ? tables.filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
    : tables;

  const handleSelect = (name: string) => {
    onSelect(focusedTable === name ? null : name);
    setSearch('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onSelect(null);
    setSearch('');
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder={focusedTable ? focusedTable : 'Search tables...'}
          value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === 'Escape') { setOpen(false); setSearch(''); onSelect(null); inputRef.current?.blur(); }
            if (e.key === 'Enter' && filtered.length > 0) handleSelect(filtered[0].label);
          }}
          style={{
            background: 'var(--vscode-input-background, #3c3c3c)',
            color: 'var(--vscode-input-foreground, #ccc)',
            border: '1px solid var(--vscode-input-border, #555)',
            borderRadius: 3,
            padding: '3px 8px',
            fontSize: 12,
            width: 180,
            outline: 'none',
            fontFamily: 'var(--vscode-font-family, sans-serif)',
          }}
        />
        {focusedTable && (
          <button onClick={handleClear} style={{
            ...btnStyle,
            padding: '3px 6px',
            fontSize: 10,
          }}>✕</button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 2,
          background: 'var(--vscode-dropdown-background, #3c3c3c)',
          border: '1px solid var(--vscode-dropdown-border, #555)',
          borderRadius: 4,
          maxHeight: 240,
          overflowY: 'auto',
          zIndex: 100,
          width: 220,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}>
          {filtered.map(t => (
            <div
              key={t.label}
              onClick={() => handleSelect(t.label)}
              style={{
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: 12,
                color: focusedTable === t.label ? 'var(--vscode-list-activeSelectionForeground, #fff)' : 'var(--vscode-dropdown-foreground, #ccc)',
                background: focusedTable === t.label ? 'var(--vscode-list-activeSelectionBackground, #094771)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              onMouseEnter={e => {
                if (focusedTable !== t.label) (e.currentTarget as HTMLDivElement).style.background = 'var(--vscode-list-hoverBackground, rgba(255,255,255,0.08))';
              }}
              onMouseLeave={e => {
                if (focusedTable !== t.label) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: getTableColor(t.label), flexShrink: 0 }} />
              {t.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────

export default function ERDiagramContainer() {
  const [data, setData] = useState<ERData | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusedTable, setFocusedTable] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const { action, payload } = event.data;
      if (action === UIAction.RESPONSE_ER_DATA) {
        setData(payload);
        setLoading(false);
      }
    };
    window.addEventListener('message', handler);
    sendMessage(UIAction.NOTIFY_VIEW_READY, true);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Escape key to clear focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocusedTable(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (loading) return <div style={centerStyle}><Loading /></div>;

  if (!data || data.tables.length === 0) {
    return (
      <div style={centerStyle}>
        <p>No tables found in schema <strong>{data?.schemaName || 'unknown'}</strong>.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', background: 'var(--vscode-editor-background, #1e1e1e)' }}>
      <div style={toolbarStyle}>
        <span>
          <strong style={{ color: 'var(--vscode-foreground)' }}>{data.connectionName}</strong>
          {' / '}
          <strong style={{ color: 'var(--vscode-foreground)' }}>{data.schemaName}</strong>
        </span>
        <span>{data.tables.length} tables</span>
        <span>{data.foreignKeys.length} relationships</span>
        <TableSearch
          tables={data.tables}
          focusedTable={focusedTable}
          onSelect={setFocusedTable}
        />
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--vscode-descriptionForeground)' }}>
          Click a table to focus · Esc to clear
        </span>
      </div>
      <div style={{ width: '100%', height: 'calc(100vh - 36px)' }}>
        <ReactFlowProvider>
          <ERFlowInner data={data} focusedTable={focusedTable} setFocusedTable={setFocusedTable} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

const centerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  height: '100vh', color: 'var(--vscode-foreground)',
};

const toolbarStyle: React.CSSProperties = {
  padding: '6px 16px',
  borderBottom: '1px solid var(--vscode-panel-border, #444)',
  display: 'flex', alignItems: 'center', gap: '12px',
  fontSize: '12px', color: 'var(--vscode-descriptionForeground)',
  userSelect: 'none',
  background: 'var(--vscode-sideBar-background, #252526)',
};

const btnStyle: React.CSSProperties = {
  background: 'var(--vscode-button-secondaryBackground, #3a3d41)',
  color: 'var(--vscode-button-secondaryForeground, #ccc)',
  border: '1px solid var(--vscode-panel-border, #555)',
  borderRadius: 3, cursor: 'pointer',
  fontSize: '11px', lineHeight: '16px',
};
