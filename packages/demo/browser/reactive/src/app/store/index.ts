import { computed, reactive, watch } from '@re-active/react';
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

const state = reactive<Store>({
    items: nodes.reduce((acc: Dictionary<Item>, node) => {
        acc[node.id] = node.data;

        node.children.forEach((p) => {
            acc[p.id] = p.data;
        });

        return acc;
    }, {}),
    tree: nodes,
    selectedTreeNode: null,
    table: {
        loading: false,
        rows: [],
        selectedRow: null,
    },
});

// watchActions(async (actionName, params, result) => {
//     console.log(`action ${actionName} is called`);

//     console.log(`${actionName} returned: ${await result}`);
// })

// ================ SELECTORS ===========================
export const values = reactive({
    tree: computed(() => {
        return state.tree;
    }),
    selectedTreeNode: computed(() => {
        return state.selectedTreeNode;
    }),
    tableState: computed(() => {
        return state.table;
    }),
    editingItem: computed(() => {
        return state.table.selectedRow?.data || state.selectedTreeNode?.data;
    }),
});
// ================ ACTIONS ===========================

export const actions = {
    async loadChildren(node: Node) {
        if (node.children.length === 0 && node.loading === false) {
            try {
                node.loading = true;
                const newItems: Item[] = await fetchItems(node);
                newItems.forEach((p) => (state.items[p.id] = p));
                node.children = newItems.map((p) => makeTreeNode(p, node));
                return newItems;
            } finally {
                node.loading = false;
            }
        }

        return [];
    },
    async selectTreeNode(node: Node) {
        if (node.selected === false) {
            try {
                state.selectedTreeNode = node;
                state.table.loading = true;
                await actions.loadChildren(node);
                state.table.selectedRow = null;
                state.table.rows = state.selectedTreeNode.children.map((p) => ({ selected: false, data: p.data }));
            } finally {
                state.table.loading = false;
            }
        }
    },
    async expandTreeNode(node: Node) {
        node.expanded = !node.expanded;
        return await actions.loadChildren(node);
    },
    selectTableItem(item: RowItem) {
        state.table.selectedRow = item;
    },
    async browseTableItem(item: RowItem) {
        state.selectedTreeNode!.expanded = true;
        const treeNode = state.selectedTreeNode!.children.find((p) => p.id === item.data.id);
        await actions.selectTreeNode(treeNode!);
    },
    async browseCurrentTableItem() {
        const selectedItem = state.table.selectedRow;
        if (selectedItem) {
            actions.browseTableItem(selectedItem);
        }
    },
    gotoParentFolder() {
        const currentTreeNode = values.selectedTreeNode;
        if (currentTreeNode && currentTreeNode.parent) {
            actions.selectTreeNode(currentTreeNode.parent);
        }
    },
    updateItem(id: string, path: string, value: any) {
        (state.items[id] as any)[path] = value;
    },
    resetState() {
        const newState = {
            items: nodes.slice(0, 10).reduce((acc: Dictionary<Item>, node) => {
                acc[node.id] = node.data;

                node.children.forEach((p) => {
                    acc[p.id] = p.data;
                });

                return acc;
            }, {}),
            tree: nodes.slice(0, 10),
            selectedTreeNode: null,
            table: {
                loading: false,
                rows: [],
                selectedRow: null,
            },
      };

      Object.assign(state, newState);
    },
};

// ================ WATCHERS ===========================
watch(
    () => state.selectedTreeNode,
    (newNode, oldNode) => {
        if (oldNode) oldNode.selected = false;
        if (newNode) newNode.selected = true;
    }
);

watch(
    () => state.table.selectedRow,
    (newItem, oldItem) => {
        if (oldItem) oldItem.selected = false;
        if (newItem) newItem.selected = true;
    }
);
