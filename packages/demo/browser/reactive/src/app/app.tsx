import React from 'react';
import { Tree } from './components/tree';

import { values, actions } from './store';
import { Item, Node } from './store/utils';
import { Main } from './components/main';
import { Details } from './components/details';
import { component } from '@re-active/react';

export default component(() => {
  function renderNode(node: Node<Item>) {
    return <span>{node.data.name}</span>;
  }

  return () => (
    <div className="app">
      <div className="header"></div>
      <div className="main">
        <div className="treepanel">
          <Tree
            nodes={values.tree}
            onSelected={actions.selectTreeNode}
            renderNode={renderNode}
            onExpanded={actions.expandTreeNode}
          />
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
