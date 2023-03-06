const nodeGenerationCount = 200;
const fetchTimeout = 500;

export function makeItem(id: string) {
  return {
    id,
    name: `item ${id}`,
    col1: `item ${id} columns 1`,
    col2: `item ${id} columns 2`,
    col3: `item ${id} columns 3`,
    col4: `item ${id} columns 4`,
  };
}

export const nodes: Node<Item>[] = Array(nodeGenerationCount)
  .fill(null)
  .map((_, i) => {
    const node: Node<Item> = {
      id: `${i}`,
      data: makeItem(`${i}`),
      expanded: false,
      loading: false,
      selected: false,
      children: Array(nodeGenerationCount)
        .fill(null)
        .map((_, j) => {
          return {
            data: makeItem(`${i}-${j}`),
            expanded: false,
            id: `${i}-${j}`,
            loading: false,
            selected: false,
            children: [],
          };
        }),
    };

    // node.children.forEach(p => p.parent = node);

    return node;
  });

export type Dictionary<T> = { [key: string]: T };
export type Node<T = any> = {
  id: string;
  data: T;
  children: Node<T>[];
  loading: boolean;
  expanded: boolean;
  selected: boolean;
  parent?: Node<T>;
};

export interface Item {
  id: string;
  name: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

export async function fetchItems(node: Node<Item>) {
  return new Promise<Item[]>((res) => {
    setTimeout(() => {
      res(
        Array(nodeGenerationCount)
          .fill(null)
          .map((_, i) => {
            return makeItem(`${node.id}-${i}`);
          })
      );
    }, fetchTimeout);
  });
}

export function makeTreeNode(item: Item, parent?: Node): Node<Item> {
  return {
    data: item,
    expanded: false,
    id: item.id,
    loading: false,
    selected: false,
    children: [],
    parent,
  };
}

export interface RowItem {
  selected: boolean;
  data: Item;
}
