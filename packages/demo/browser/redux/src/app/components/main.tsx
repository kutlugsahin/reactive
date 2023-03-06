import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { browseCurrentTableItem, gotoParentFolder, selectTableItem } from '../store/actions';
import {
  selectLoadingTreeIds,
  selectSelectedTableItemId,
  selectSelectedTreeNodeId,
  selectTableRows,
} from '../store/selectors';
import { Item } from '../store/utils';

export const Main = () => {
  const dispatch: any = useDispatch();

  return (
    <div className="maincontainer">
      <div className="actions">
        <button onClick={() => dispatch(gotoParentFolder())}>←</button>
        <button onClick={() => dispatch(browseCurrentTableItem())}>↴</button>
      </div>
      <Table />
    </div>
  );
};

export const Table = React.memo(() => {
  const dispatch: any = useDispatch();

  const selectedTreeId = useSelector(selectSelectedTreeNodeId);
  const loadingIds = useSelector(selectLoadingTreeIds);
  const loading = loadingIds[selectedTreeId];
  const rows = useSelector(selectTableRows);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode === 8) {
      dispatch(gotoParentFolder());
    }
  }

  if (!rows || loading) {
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
            <Row key={p.data.id} item={p.data} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

interface RowProps {
  item: Item;
}

export const Row = (props: RowProps) => {
  const dispatch: any = useDispatch();
  const selected = useSelector(selectSelectedTableItemId) === props.item.id;

  const { name, id, col1, col2, col3 } = props.item;
  return (
    <tr
      id={`row-${id}`}
      className={selected ? 'selected' : ''}
      onClick={() => dispatch(selectTableItem(props.item.id))}
      onDoubleClick={() => {
        dispatch(browseCurrentTableItem(props.item.id));
      }}
    >
      <td className="id">{id}</td>
      <td className="name">{name}</td>
      <td>{col1}</td>
      <td>{col2}</td>
      <td>{col3}</td>
    </tr>
  );
};
