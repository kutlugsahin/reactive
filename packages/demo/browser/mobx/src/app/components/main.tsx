import React from 'react';
import {
  browseCurrentTableItem,
  browseTableItem,
  gotoParentFolder,
  selectTableItem,
  setState,
  tableState,
} from '../store';
import { RowItem } from '../store/utils';
import { observer } from 'mobx-react';
export const Main = observer(() => {
  return (
    <div className="maincontainer">
      <div className="actions">
        <button onClick={gotoParentFolder}>←</button>
        <button onClick={browseCurrentTableItem}>↴</button>
        <button onClick={setState}>reset</button>
      </div>
      <Table />
    </div>
  );
});

export const Table = observer(() => {
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode === 8) {
      gotoParentFolder();
    }
  }

  const { loading, rows } = tableState.get();

  if (!rows) {
    return null;
  }

  return (
    <div className="tablecontainer" onKeyDown={onKeyDown} tabIndex={-1}>
      <table className={loading ? 'table loading' : 'table'}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Col1</th>
            <th>Col2</th>
            <th>Col3</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <Row key={p.data.id} item={p} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

interface RowProps {
  item: RowItem;
}

export const Row = observer((props: RowProps) => {
  const { name, id, col1, col2, col3 } = props.item.data;
  return (
    <tr
      id={`row-${id}`}
      className={props.item.selected ? 'row selected' : 'row'}
      onClick={() => selectTableItem(props.item)}
      onDoubleClick={() => browseTableItem(props.item)}
    >
      <td className="id">{id}</td>
      <td className="name">{name}</td>
      <td>{col1}</td>
      <td>{col2}</td>
      <td>{col3}</td>
    </tr>
  );
});
