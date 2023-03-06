import React from 'react';
import { Tree } from './components/tree';
import { createComponent } from '@re-active/react';
import { expandTreeNode, selectTreeNode, tree } from './store';
import { Item, Node } from './store/utils';
import { Main } from './components/main';
import { Details } from './components/details';
import { observer } from 'mobx-react';

export const App = observer(() => {
  function renderNode(node: Node<Item>) {
    return <span>{node.data.name}</span>;
  }

  return (
    <div className="app">
      <div className="header"></div>
      <div className="main">
        <div className="treepanel">
          <Tree nodes={tree.get()} onSelected={selectTreeNode} renderNode={renderNode} onExpanded={expandTreeNode} />
        </div>
        <div className="mainpanel">
          <Main />
        </div>
        <div className="detailpanel">
          <Details />
        </div>
      </div>
    </div>
  );
});
