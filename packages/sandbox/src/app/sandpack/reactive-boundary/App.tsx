import { component, reactive, ReactiveBoundary } from '@re-active/react';

import { Card } from '../shared/card';

const user = reactive({
  name: 'John Doe12',
  skills: [
    {
      name: 'js11111',
    },
    {
      name: 'java',
    },
    {
      name: 'c++',
    }
  ],
});

const WithReactiveBoundary = component(() => {
  function renderSkill(skill: { name: string }) {
    return (
      <Card highlightOnRender>
        <input type="text" value={skill.name} onChange={(e) => (skill.name = e.target.value)} />
      </Card>
    );
  }

  return () => (
    <Card title="With ReactiveBoundary" highlightOnRender>
      User Name: <b>{user.name}</b>
      <p>Each skill card is wrapped with ReactiveBoundary component and acts like a seperate reactive component.</p>
      {user.skills.map((skill: { name: string }, index: number) => (
        <ReactiveBoundary key={index} data={skill}>
          {renderSkill}
        </ReactiveBoundary>
      ))}
    </Card>
  );
});

const WithoutReactiveBoundary = component(() => {
  function renderSkill(skill: { name: string }, index: number) {
    return (
      <Card key={index} highlightOnRender>
        <input type="text" value={skill.name} onChange={(e) => (skill.name = e.target.value)} />
      </Card>
    );
  }

  return () => (
    <Card title="Without ReactiveBoundary" highlightOnRender>
      User Name: <b>{user.name}</b>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni totam unde iste dolorum error. Corporis illum
        est, aliquid accusamus obcaecati perferendis similique eligendi quibusdam magni, enim, minus dicta ipsa iure.
      </p>
      {user.skills.map(renderSkill)}
    </Card>
  );
});

export default component(() => (
  <div>
    <p>
      In this example we use "user" reactive data as a global state for both components to demonstrate how to use
      ReactiveBoundary component to further optimize your components
      <br />
      {`<Card highlightOnRender>`} gets highlighted whenever it's rendered
    </p>
    <p>
      <input type="text" value={user.name} onChange={(e) => (user.name = e.target.value)} />
    </p>
    <WithReactiveBoundary />
    <WithoutReactiveBoundary />
  </div>
));
