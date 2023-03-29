import { component, reactive, ReactiveBoundary } from '@re-active/react';

import { Card } from '../shared/card';

const user = reactive({
  name: 'John Doe',
  skills: [
    {
      name: 'js',
    },
    {
      name: 'java',
    },
    {
      name: 'c++',
    },
  ],
});

const WithReactiveBoundary = component(() => {

  const skillCard = (skill: {name:string}) => (
    <Card highlightOnRender>
      <input type="text" value={skill.name} onChange={(e) => (skill.name = e.target.value)} />
    </Card>
  );

  return () => (
    <Card title="With ReactiveBoundary" highlightOnRender>
      User Name: <b>{user.name}</b>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni totam unde iste dolorum error. Corporis illum
        est, aliquid accusamus obcaecati perferendis similique eligendi quibusdam magni, enim, minus dicta ipsa iure.
      </p>
      {user.skills.map((skill, i) => (
        <ReactiveBoundary key={i} data={skill}>
          {skillCard}
        </ReactiveBoundary>
      ))}
    </Card>
  );
});

const WithoutReactiveBoundary = component(() => (
  <Card title="Without ReactiveBoundary" highlightOnRender>
    User Name: <b>{user.name}</b>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni totam unde iste dolorum error. Corporis illum est,
      aliquid accusamus obcaecati perferendis similique eligendi quibusdam magni, enim, minus dicta ipsa iure.
    </p>
    {user.skills.map((skill, i) => (
      <Card key={i} highlightOnRender>
        <input type="text" value={skill.name} onChange={(e) => (skill.name = e.target.value)} />
      </Card>
    ))}
  </Card>
));

export default component(() => (
  <div>
    <p>
      <input type="text" value={user.name} onChange={(e) => (user.name = e.target.value)} />
    </p>
    <WithReactiveBoundary />
    <WithoutReactiveBoundary />
  </div>
));
