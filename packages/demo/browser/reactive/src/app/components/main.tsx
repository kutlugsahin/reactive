import { createComponent } from '@re-active/react';
import React from 'react';
import { actions, values } from '../store';
import { RowItem } from '../store/utils';

export const Main = createComponent(() => {
  return () => {
    return (
      <div className="maincontainer">
        <div className="actions">
          <button onClick={actions.gotoParentFolder}>←</button>
          <button onClick={actions.browseCurrentTableItem}>↴</button>
          <span>
            <button onClick={actions.resetState}>Reset State</button>
          </span>
        </div>
        <Table />
      </div>
    );
  };
});

export const Table = createComponent(() => {
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      actions.gotoParentFolder();
    }
  }

  return () => {
    const { loading, rows } = values.tableState;

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
  };
});

interface RowProps {
  item: RowItem;
}

export const Row = createComponent((props: RowProps) => {
  let row: HTMLTableRowElement | null;

  // onRendered(() => {
  //     row.classList.add('flash');
  //     setTimeout(() => {
  //         row?.classList.remove('flash');
  //     }, 500);
  // })

  return () => {
    const { name, id, col1, col2, col3 } = props.item.data;
    return (
      <tr
        ref={(e) => (row = e)}
        id={`row-${id}`}
        className={props.item.selected ? 'row selected' : 'row'}
        onClick={() => actions.selectTableItem(props.item)}
        onDoubleClick={() => actions.browseTableItem(props.item)}
      >
        <td className="id">{id}</td>
        <td className="name">{name}</td>
        <td>{col1}</td>
        <td>{col2}</td>
        <td>{col3}</td>
      </tr>
    );
  };
});
