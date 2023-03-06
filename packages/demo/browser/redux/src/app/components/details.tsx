import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateItem } from '../store/actions';
import { selectEditingItem } from '../store/selectors';
import { Item } from '../store/utils';

export const Details = () => {
  const item = useSelector(selectEditingItem);

  if (!item) {
    return <p>Select an item</p>;
  }

  return (
    <div>
      <h3>{item.name}</h3>
      <Field item={item} label="name" path="name" />
      <Field item={item} label="Col1" path="col1" />
      <Field item={item} label="Col2" path="col2" />
      <Field item={item} label="Col3" path="col3" />
      <Field item={item} label="Col4" path="col4" />
    </div>
  );
};

interface FieldProps {
  label: string;
  item: Item;
  path: string;
}

export const Field = (props: FieldProps) => {
  const dispatch = useDispatch();
  return (
    <div className="field">
      <label className="label" htmlFor="">
        {props.label}
      </label>
      <div>
        <input
          id={`input-${props.path}-${props.item.id}`}
          className="input"
          type="text"
          value={props.item[props.path]}
          onChange={(e) => {
            dispatch(updateItem(props.item.id, props.path, e.target.value));
          }}
        />
      </div>
    </div>
  );
};
