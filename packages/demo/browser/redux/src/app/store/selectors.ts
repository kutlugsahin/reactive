import { Store } from './index';
import { ItemNode, Item } from './utils';

export type TreeNode = {
  data: Item;
  id: string;
  parent?: TreeNode;
  children?: TreeNode[];
};

export const getTree = (state: Store) => {
  function buildTree(nodes: ItemNode[], parent?: TreeNode): TreeNode[] {
    return nodes.map((p) => {
      const node = {
        data: p.data,
        id: p.id,
        children: [],
        parent,
      };

      node.children = buildTree(
        p.children.map((q) => state.items[q]),
        node
      );

      return node;
    });
  }

  return buildTree(Object.values(state.items).filter((p) => !p.parent));
};
export const selectSelectedTreeNodeId = (state: Store) => state.selectedTreeNodeId;
export const selectSelectedTableItemId = (state: Store) => state.selectedTableItemId;
export const selectExpandedTreeIds = (state: Store) => state.expandedTreeNodesIds;
export const selectLoadingTreeIds = (state: Store) => state.loadingTreeNodesIds;
export const selectCurrentTreeNode = (state: Store) => state.items[state.selectedTreeNodeId];

export const selectTableRows = (state: Store) => {
  if (state.selectedTreeNodeId) {
    return state.items[state.selectedTreeNodeId]?.children?.map((p) => state.items[p]);
  }

  return [];
};

export const selectEditingItem = (state: Store) => {
  if (state.selectedTableItemId) {
    return state.items[state.selectedTableItemId].data;
  }

  if (state.selectedTreeNodeId) {
    return state.items[state.selectedTreeNodeId].data;
  }

  return null;
};
