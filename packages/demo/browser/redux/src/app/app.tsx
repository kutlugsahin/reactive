import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Details } from './components/details';
import { Main } from './components/main';
import { Tree } from './components/tree';
import { store } from './store';
import { getTree, TreeNode } from './store/selectors';
import { loadChildren } from './store/actions';

const AppComp = () => {
  const tree = useSelector(getTree);

  const dispatch: any = useDispatch();

  function renderNode(node: TreeNode) {
    return <span>{node.data.name}</span>;
  }

  return (
    <div className="app">
      <div className="header"></div>
      <div className="main">
        <div className="treepanel">
          <Tree
            nodes={tree}
            onSelected={(p) => {
              dispatch({
                type: 'set-selected-tree-item',
                payload: p.id,
              });

              dispatch(loadChildren(p.id));
            }}
            renderNode={renderNode}
            onExpanded={(p) => {
              dispatch({
                type: 'set-expanded-tree-item',
                payload: {
                  id: p.id,
                },
              });
              dispatch(loadChildren(p.id));
            }}
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
};

export const App = () => (
  <Provider store={store}>
    <AppComp />
  </Provider>
);
