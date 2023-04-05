import { component, computed, watch, reactive, updateEffect } from '@re-active/react';

import { Card } from '../shared/card';

export default component(() => {

  const shoppingCard = reactive(new Map([
    ['milk', { amount: 0, price: 1.225 }],
    ['egg', { amount: 0, price: 2.25, }],
    ['bread', { amount: 0, price: 0.9, }],
  ]));

  function addProduct(productName: string) {
    return () => {
      const product = shoppingCard.get(productName);
      if (product) product.amount++;
    };
  }

  function removeProduct(productName: string) {
    return () => {
      const product = shoppingCard.get(productName);
      if (product && product.amount > 0) product.amount--;
    };
  }

  const total = computed(() => {
    return [...shoppingCard.values()].reduce((acc, product) => acc + product.amount * product.price, 0);
  });

  watch(total, (newVal, oldVal = 0) => {
    if (newVal > 20 && newVal > oldVal) {
      alert('Out of budget!');
    }
  });

  return () => (
    <Card title="Shopping cart">
      <div style={{ display: 'flex' }}>
        <Card title="Milk">
          <button onClick={removeProduct('milk')}>-</button>
          {shoppingCard.get('milk')?.amount}
          <button onClick={addProduct('milk')}>+</button>
        </Card>
        <Card title="Egg">
          <button onClick={removeProduct('egg')}>-</button>
          {shoppingCard.get('egg')?.amount}
          <button onClick={addProduct('egg')}>+</button>
        </Card>
        <Card title="Bread">
          <button onClick={removeProduct('bread')}>-</button>
          {shoppingCard.get('bread')?.amount}
          <button onClick={addProduct('bread')}>+</button>
        </Card>
      </div>
      <div>Total: {total.value}</div>
    </Card>
  );
});
