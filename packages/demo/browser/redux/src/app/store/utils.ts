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

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const nodes: Dictionary<ItemNode> = {};

Array(nodeGenerationCount)
  .fill(null)
  .forEach((_, i) => {
    const node: Node<Item> = {
      id: `${i}`,
      data: makeItem(`${i}`),
      children: [],
    };

    nodes[node.id] = node;
  });

for (const key in nodes) {
  if (Object.prototype.hasOwnProperty.call(nodes, key)) {
    const parentNode = nodes[key];

    Array(nodeGenerationCount)
      .fill(null)
      .forEach((_, i) => {
        const node: Node<Item> = {
          id: `${key}-${i}`,
          data: makeItem(`${key}-${i}`),
          children: [],
          parent: parentNode.id,
        };

        nodes[node.id] = node;

        parentNode.children.push(node.id);
      });
  }
}

export const defaultNodes = nodes;

export type Dictionary<T> = { [key: string]: T };
export type Node<T = any> = {
  id: string;
  data: T;
  children?: string[];
  parent?: string;
};

export interface Item {
  id: string;
  name: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

export type ItemNode = Node<Item>;

export async function fetchItems(id: string) {
  return new Promise<Item[]>((res) => {
    setTimeout(() => {
      res(
        Array(nodeGenerationCount)
          .fill(null)
          .map((_, i) => {
            return makeItem(`${id}-${i}`);
          })
      );
    }, fetchTimeout);
  });
}

export function makeTreeNode(item: Item, parent?: string): Node<Item> {
  return {
    data: item,
    id: item.id,
    children: [],
    parent,
  };
}

export interface RowItem {
  selected: boolean;
  data: Item;
}
