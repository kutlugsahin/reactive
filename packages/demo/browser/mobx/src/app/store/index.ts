import { action, computed, flow, observable } from 'mobx';
import { Dictionary, fetchItems, Item, makeTreeNode, Node, nodes, RowItem } from './utils';

interface Store {
  items: Dictionary<Item>;
  tree: Node<Item>[];
  selectedTreeNode: Node<Item> | null;
  table: {
    loading: boolean;
    rows: RowItem[];
    selectedRow: RowItem | null;
  };
}

export const state = observable<Store>({
  items: nodes.reduce((acc: Dictionary<Item>, node) => {
    acc[node.id] = node.data;

    node.children.forEach((p) => {
      acc[p.id] = p.data;
    });

    return acc;
  }, {}),
  // items: {},
  tree: nodes,
  selectedTreeNode: null,
  table: {
    loading: false,
    rows: [],
    selectedRow: null,
  },
});

export const tree = computed(() => state.tree);
export const selectedTreeNode = computed(() => state.selectedTreeNode);
export const tableState = computed(() => state.table);
export const editingItem = computed(() => state.table.selectedRow?.data || state.selectedTreeNode?.data);

export const loadChildren = flow(function* (node: Node) {
  console.log('load children');
  try {
    if (node.children.length === 0) {
      node.loading = true;
      const newItems: Item[] = yield fetchItems(node);
      newItems.forEach((p) => (state.items[p.id] = p));
      node.children = newItems.map((p) => makeTreeNode(p, node));
      return newItems;
    }
  } finally {
    node.loading = false;
  }
});

export const selectTreeNode = flow(function* (node: Node) {
  try {
    if (state.selectedTreeNode) state.selectedTreeNode.selected = false;
    state.selectedTreeNode = node;
    node.selected = true;
    state.table.loading = true;
    yield loadChildren(node);

    state.table.selectedRow = null;
    state.table.rows = state.selectedTreeNode.children.map((p) => ({ selected: false, data: p.data }));
  } finally {
    state.table.loading = false;
  }
});

export const expandTreeNode = action(async (node: Node) => {
  node.expanded = !node.expanded;
  return await loadChildren(node);
});

export const selectTableItem = action((item: RowItem) => {
  if (state.table.selectedRow) state.table.selectedRow.selected = false;
  state.table.selectedRow = item;
  state.table.selectedRow.selected = true;
});

export const browseTableItem = action(async (item: RowItem) => {
  state.selectedTreeNode!.expanded = true;
  const treeNode = state.selectedTreeNode!.children.find((p) => p.id === item.data.id);
  await selectTreeNode(treeNode!);
});

export const browseCurrentTableItem = action(async () => {
  const selectedItem = state.table.selectedRow;
  if (selectedItem) {
    await browseTableItem(selectedItem);
  }
});

export const gotoParentFolder = action(() => {
  const currentTreeNode = selectedTreeNode.get();
  if (currentTreeNode && currentTreeNode.parent) {
    selectTreeNode(currentTreeNode.parent);
  }
});

export const setState = action(() => {
  Object.assign(state, {
    items: nodes.slice(0, 10).reduce((acc: Dictionary<Item>, node) => {
      acc[node.id] = node.data;

      node.children.forEach((p) => {
        acc[p.id] = p.data;
      });

      return acc;
    }, {}),
    // items: {},
    tree: nodes.slice(0, 10),
    selectedTreeNode: null,
    table: {
      loading: false,
      rows: [],
      selectedRow: null,
    },
  });
});

export const updateItem = action((id: string, path: string, value: any) => {
  editingItem.get()![path] = value;
  state.items[id][path] = value;
});
