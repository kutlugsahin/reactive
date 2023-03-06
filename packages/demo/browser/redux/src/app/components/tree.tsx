import React from 'react';
import { createComponent } from '@re-active/react';
import { TreeNode, selectLoadingTreeIds, selectExpandedTreeIds, selectSelectedTreeNodeId } from '../store/selectors';
import { useSelector } from 'react-redux';

export interface TreeProps<T> {
  nodes: TreeNode[];
  onExpanded: (node: TreeNode) => void;
  onSelected: (node: TreeNode) => void;
  renderNode: (node: TreeNode) => JSX.Element;
}

interface TreeNodeProps<T = any> {
  node: TreeNode;
  level: number;
  onClick: (node: TreeNode) => void;
  onExpand: (node: TreeNode) => void;
  renderNode: (node: TreeNode) => JSX.Element;
}
// =================================================

export const Tree = (props: TreeProps<any>) => {
  // console.log(`tree render`);
  return (
    <div>
      {props.nodes.map((node) => (
        <TreeNodeComponent
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

export const TreeNodeComponent = (props: TreeNodeProps) => {
  const loadingIds = useSelector(selectLoadingTreeIds);
  const expandedIds = useSelector(selectExpandedTreeIds);
  const selectedId = useSelector(selectSelectedTreeNodeId);
  const children = props.node.children;

  const loading = loadingIds[props.node.id];
  const expanded = expandedIds[props.node.id];
  const selected = selectedId === props.node.id;

  function onNodeExpand(e: React.MouseEvent) {
    e.stopPropagation();
    props.onExpand(props.node);
  }

  function drawStateIndicator() {
    if (loading) return <Loading />;
    if (children)
      return (
        <span onClick={onNodeExpand} className={expanded ? 'caret expanded' : 'caret'}>
          ▶
        </span>
      );
    return <span className="caret" />;
  }

  function renderTreeNode(node: TreeNode) {
    return <TreeNodeComponent {...props} key={node.id} node={node} level={props.level + 1} />;
  }
  // console.log(`tree node render: ${props.node.id}`);

  const { renderNode, node, onClick } = props;

  return (
    <div className="nodecontainer">
      <div
        id={`node-${node.id}`}
        className={selected ? 'node selected' : 'node'}
        onClick={() => onClick(node)}
        onDoubleClick={onNodeExpand}
      >
        {drawStateIndicator()}
        {renderNode(node)}
      </div>
      <div style={{ display: expanded ? 'block' : 'none' }}>{children?.map(renderTreeNode)}</div>
    </div>
  );
};

export const Loading = () => {
  return <span className="loadingindicator">◠</span>;
};
