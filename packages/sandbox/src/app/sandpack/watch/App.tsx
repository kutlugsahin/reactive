import { component, computed, reactive, ref, watch } from '@re-active/react';

const Watch = component(() => {
  const count = ref(0);
  const user = reactive({
    name: 'John',
    lastname: 'Doe',
    age: 30
  })

  const fullName = computed(() => `${user.name} ${user.lastname}`);

  /**
   * ref can be watched
   */
  watch(count, (newVal, oldVal) => {
    console.log(newVal, oldVal);
  })

  /**
  * computed values can be watched
  */
  watch(fullName, (newVal, oldVal) => {
    console.log(newVal, oldVal);
  })


  /**
  * a getter function can be used to be watched
  */
  watch(() => user.age, (newVal, oldVal) => {
    console.log(newVal, oldVal);
  })


  /**
  * reactive objects are deeply watched by default
  *
  */
  watch(user, (newVal, oldVal) => {
    console.log(JSON.stringify(newVal), JSON.stringify(oldVal));
  })


  return () => (
    <div>
      <button onClick={() => count.value++}>
        Inc. counter {count.value}
      </button>
      <input type="text" value={user.name} onChange={e => user.name = e.target.value} />
      <button onClick={() => user.age++}>
        Inc. age {user.age}
      </button>
    </div>
  );
});


export default Watch;
