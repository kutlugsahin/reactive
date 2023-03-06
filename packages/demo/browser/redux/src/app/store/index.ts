import { Dictionary, Item, Node, fetchItems, defaultNodes, makeTreeNode, RowItem, ItemNode } from './utils';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
type Action = {
  type: string;
  [key: string]: any;
};

export interface Store {
  items: Dictionary<ItemNode>;
  selectedTreeNodeId: string;
  expandedTreeNodesIds: Dictionary<boolean>;
  loadingTreeNodesIds: Dictionary<boolean>;
  selectedTableItemId: string;
}

export type PushItemsAction = {
  type: string;
  payload: {
    id: string;
    children: Item[];
  };
};

export type UpdateItemAction = {
  type: string;
  payload: {
    id: string;
    path: string;
    value: string;
  };
};

const items = (state: Dictionary<ItemNode> = defaultNodes, action: Action) => {
  switch (action.type) {
    case 'add-child': {
      const { id, children } = (action as PushItemsAction).payload;
      const newState = { ...state };
      newState[id].children = children.map((p) => p.id);
      children.forEach((p) => (newState[p.id] = makeTreeNode(p, id)));
      return newState;
    }
    case 'update-item': {
      const { id, path, value } = (action as UpdateItemAction).payload;
      const newState = { ...state };
      const newItem = { ...state[id] };

      newItem.data[path] = value;

      newState[id] = newItem;
      return newState;
    }
    default:
      break;
  }
  return state;
};

const selectedTreeNodeId = (state: string = null, action: Action) => {
  if (action.type === 'set-selected-tree-item') {
    return action.payload;
  }

  return state;
};

const expandedTreeNodesIds = (state: Dictionary<boolean> = {}, action: Action) => {
  if (action.type === 'set-expanded-tree-item') {
    const { id, expand } = action.payload;

    return {
      ...state,
      [id]: expand ?? !state[id],
    };
  }

  return state;
};

const loadingTreeNodesIds = (state: Dictionary<boolean> = {}, action: Action) => {
  if (action.type === 'set-loading-tree-item') {
    const { id, loading } = action.payload;

    return {
      ...state,
      [id]: loading,
    };
  }

  return state;
};

const selectedTableItemId = (state: string = null, action: Action) => {
  if (action.type === 'set-selected-table-item') {
    return action.payload;
  }

  return state;
};

const rootReducer = combineReducers({
  items,
  selectedTreeNodeId,
  selectedTableItemId,
  expandedTreeNodesIds,
  loadingTreeNodesIds,
});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
