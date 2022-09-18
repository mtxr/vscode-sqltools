import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import formatter from '@sqltools/formatter/lib/sqlFormatter';
import { Config } from '@sqltools/formatter/src/core/types';
import Editor from 'react-simple-code-editor';

const PlaygroundContainer = styled.div`
  height: calc(100vh - 300px);
  font-size: 14px;
  font-size: 0.8rem;
  display: flex;
  > div {
    font-size: inherit;
    width: 50%;
    border: 1px solid gray;
    box-sizing: content-box;
    float: left;
    overflow: auto;
    &:first-child {
      border-right: none;
    }
  }
  code[class*="language-"], pre[class*="language-"] {
    text-shadow: none;
  }
`;
const OptionsContainer = styled.div`
margin-bottom: 1em;
> header {
  font-weight: bold;
  font-size: 1.2em;
  margin: 0;
}
p {
  margin: 0;
}
> main {
  display: flex;
  flex-direction: row;
}
`;

const Formatter = () => {
  const [state, setState] = useState({
    code,
    indentSize: 2,
    options: {
      reservedWordCase: 'upper',
      linesBetweenQueries: 2,
    } as Config,
    indentType: ' ',
  });


  const editor = React.createRef<HTMLTextAreaElement>();
  useEffect(() => {
    editor.current && editor.current.focus();
  }, []);

  const format = (code: string) => {
    return formatter.format(code, {
      ...state.options,
      indent: new Array(state.indentSize).fill(state.indentType === ' ' ? ' ' : '\t').join(''),
    });
  }

  // render stuff
  const renderEditor = () => (
    <div>
      <Editor
        value={state.code}
        onValueChange={code => { setState(s => ({ ...s, code })); }}
        highlight={code => window["Prism"]?.highlight?.(code, window["Prism"]?.languages?.sql, 'sql')}
        {...baseEditorProps}
      />
    </div>
  );

  const renderResults = () => (
    <div>
      <Editor
        onValueChange={() => void 0}
        value={state.code}
        highlight={code => window["Prism"]?.highlight?.(format(code), window["Prism"]?.languages?.sql, 'sql')}
        {...baseEditorProps}
      />
    </div>
  );
  const renderOptions = () => (
    <OptionsContainer>
      <header>Options</header>
      <main>
        <p>
          <label>Reserved Words Case</label>
          <select defaultValue={state.options.reservedWordCase} onChange={e => setState(s => ({ ...s, options: { ...state.options, reservedWordCase: e.target.value as any } }))}>
            <option>Preserve</option>
            <option value="upper">Uppercase</option>
            <option value="lower">Lowercase</option>
          </select>
        </p>
        <p>
          <label>Lines Between Queries</label>
          <select defaultValue={state.options.linesBetweenQueries} onChange={e => setState(s => ({ ...s, options: { ...state.options, linesBetweenQueries: e.target.value as any } }))}>
            <option value='preserve'>Preserve</option>
            <option value="1">1 line</option>
            <option value="2">2 line</option>
            <option value="3">3 line</option>
            <option value="4">4 line</option>
            <option value="5">5 line</option>
          </select>
        </p>
        <p>
          <label>Identation</label>
          <select defaultValue={state.indentType} onChange={e => setState(s => ({ ...s, indentType: e.target.value }))}>
            <option value=" ">Use spaces</option>
            <option value="tab">Use Tabs</option>
          </select>
        </p>
        <p>
          <label>Indent size</label>
          <input type="number" value={state.indentSize} min='1' onChange={e => setState(s => ({ ...s, indentSize: Number(e.target.value) }))} />
        </p>
      </main>
    </OptionsContainer>
  );

  return (
    <>
      {renderOptions()}
      <PlaygroundContainer>
        {renderEditor()}
        {renderResults()}
      </PlaygroundContainer>
    </>
  );
}

export default Formatter;

const code = `SELECT a, b FROM t CROSS JOIN t2 on t.id = t2.id_t;

SELECT DISTINCT name, ROUND(age/7) field1, 18 + 20 AS field2, 'some string' FROM foo;

-- here is a comment
# another comment

UPDATE "log" SET "time" = '2020-02-01 09:00:00' WHERE "id" = 1 RETURNING "time";

CREATE TABLE foo (id INTEGER PRIMARY KEY,name VARCHAR(200) NOT NULL);

ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;

select t.column1 Кириллица_cyrilic_alias
  , t.column2 Latin_alias
from db_table t
where a >= some_date1  -- from
and a <  some_date2  -- to
and b >= some_date3  -- and
and b <  some_date4  -- where, select etc.
and 1 = 1;
`

const baseEditorProps = {
  padding: 10,
  preClassName: 'language-sql',
  style: {
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 12,
  }
};