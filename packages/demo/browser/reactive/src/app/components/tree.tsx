import React from 'react';
import { component } from '@re-active/react';
import { Node } from '../store/utils';
// =============== TYPES ============================
export interface TreeProps<T> {
  nodes: Node<T>[];
  onExpanded: (node: Node<T>) => void;
  onSelected: (node: Node<T>) => void;
  renderNode: (node: Node<T>) => JSX.Element;
}

interface TreeNodeProps<T = any> {
  node: Node<T>;
  level: number;
  onClick: (node: Node<T>) => void;
  onExpand: (node: Node<T>) => void;
  renderNode: (node: Node<T>) => JSX.Element;
}
// =================================================

export const Tree = component((props: TreeProps<any>) => {
  return () => {
    // console.log(`tree render`);
    return (
      <div>
        {props.nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            onClick={props.onSelected}
            renderNode={props.renderNode}
            onExpand={props.onExpanded}
          />
        ))}
      </div>
    );
  };
});

export const TreeNode = component((props: TreeNodeProps) => {
  function onNodeExpand(e: React.MouseEvent) {
    e.stopPropagation();
    props.onExpand(props.node);
  }

  function drawStateIndicator({ loading, expanded, children }: Node) {
    if (loading) return <Loading />;
    if (children)
      return (
        <span onClick={onNodeExpand} className={expanded ? 'caret expanded' : 'caret'}>
          ▶
        </span>
      );
    return <span className="caret" />;
  }

  function renderTreeNode(node: Node) {
    return (
      <TreeNode
        onClick={props.onClick}
        onExpand={props.onExpand}
        renderNode={props.renderNode}
        key={node.id}
        node={node}
        level={props.level + 1}
      />
    );
  }

  return () => {
    const { renderNode, node, onClick } = props;
    const { selected, expanded, children } = props.node;

    function click() {
      onClick(node);
    }

    function dblclick(e:any) {
      onNodeExpand(e);
    }

    return (
      <div className="nodecontainer">
        <div
          id={`node-${node.id}`}
          className={selected ? 'node selected' : 'node'}
          onClick={click}
          onDoubleClick={dblclick}
        >
          {drawStateIndicator(node)}
          {renderNode(node)}
        </div>
        <div style={{ display: expanded ? 'block' : 'none' }}>{children?.map(renderTreeNode)}</div>
      </div>
    );
  };
});

export const Loading = () => {
  return <span className="loadingindicator">◠</span>;
};
