import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Store, PushItemsAction } from './index';
import { selectCurrentTreeNode, selectSelectedTableItemId, selectSelectedTreeNodeId } from './selectors';
import { fetchItems } from './utils';

export const selectTableItem = (id: string) => (dispatch, getState) => {
  dispatch({
    type: 'set-selected-table-item',
    payload: id,
  });
};

export const gotoParentFolder = () => (dispatch, getState) => {
  const state = getState() as Store;

  const node = selectCurrentTreeNode(state);

  if (node.parent) {
    dispatch({
      type: 'set-selected-tree-item',
      payload: node.parent,
    });
  }
};

export const loadChildren = (id: string) => async (dispatch, getState) => {
  const state = getState() as Store;

  const node = state.items[id];

  dispatch({
    type: 'set-loading-tree-item',
    payload: {
      id: node.id,
      loading: true,
    },
  });

  if (node.children.length === 0) {
    const items = await fetchItems(node.id);

    dispatch({
      type: 'add-child',
      payload: {
        id: node.id,
        children: items,
      },
    } as PushItemsAction);
  }

  dispatch({
    type: 'set-loading-tree-item',
    payload: {
      id: node.id,
      loading: false,
    },
  });
};

export const browseCurrentTableItem = (id?: string) => async (dispatch, getState) => {
  const tableItemId = id || selectSelectedTableItemId(getState());

  if (tableItemId) {
    dispatch({
      type: 'set-expanded-tree-item',
      payload: {
        id: selectSelectedTreeNodeId(getState()),
        expand: true,
      },
    });

    await loadChildren(tableItemId)(dispatch, getState);

    dispatch({
      type: 'set-selected-tree-item',
      payload: tableItemId,
    });

    dispatch({
      type: 'set-selected-table-item',
      payload: null,
    });
  }
};

export const updateItem = (id: string, path: string, value: string) => ({
  type: 'update-item',
  payload: {
    id,
    path,
    value,
  },
});
