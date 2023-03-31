import { component, computed, effect, reactive } from '@re-active/react';
import { Card } from '../shared/card';

export default component(() => {
  const shoppingCard = reactive([
    {
      name: 'milk',
      amount: 0,
      price: 1.25,
    },
    {
      name: 'egg',
      amount: 0,
      price: 2.25,
    },
    {
      name: 'bread',
      amount: 0,
      price: 0.9,
    },
  ]);

  function addProduct(productName: string) {
    return () => {
      const product = shoppingCard.find((p) => p.name === productName);
      if (product) product.amount++;
    };
  }

  function removeProduct(productName: string) {
    return () => {
      const product = shoppingCard.find((p) => p.name === productName);
      if (product && product.amount > 0) product.amount--;
    };
  }

  const total = computed(() => {
    return shoppingCard.reduce((acc, product) => acc + product.amount * product.price, 0);
  });

  effect(() => {
    if (total.value > 20) {
      alert('Out of budget!');
    }
  });

  return () => (
    <Card title="Shopping cart">
      <div style={{ display: 'flex' }}>
        <Card title="Milk">
          <button onClick={removeProduct('milk')}>-</button>
          {shoppingCard[0].amount}
          <button onClick={addProduct('milk')}>+</button>
        </Card>
        <Card title="Egg">
          <button onClick={removeProduct('egg')}>-</button>
          {shoppingCard[1].amount}
          <button onClick={addProduct('egg')}>+</button>
        </Card>
        <Card title="Bread">
          <button onClick={removeProduct('bread')}>-</button>
          {shoppingCard[2].amount}
          <button onClick={addProduct('bread')}>+</button>
        </Card>
      </div>
      <div>Total: {total.value}</div>
    </Card>
  );
});
