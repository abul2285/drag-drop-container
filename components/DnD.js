import DropZone from './DropZone';
import { useDrag } from 'react-dnd';
import React, { useRef } from 'react';

const getColor = (type) => {
  return {
    section: 'green',
    row: 'red',
    column: 'black',
    container: 'orange',
    component: 'blue',
  }[type];
};

export const Drag = (props) => {
  const { type, children, isLast } = props;
  const ref = useRef();

  const [{ isDragging }, drag] = useDrag(
    {
      item: {
        address: props.address,
        index: props.index,
        type: props.type,
        parentType: props.parentType,
      },
      type,
      isDragging: (monitor) => {
        return props.address === monitor.getItem().address;
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [props]
  );

  return (
    <>
      <DropZone
        item={{
          address: props.address,
          index: props.index,
          type: props.type,
          parentType: props.parentType,
        }}
        onDrop={props.setData}
      />
      <div
        ref={drag}
        style={{
          background: getColor(type),
          color: 'white',
          margin: 30,
          padding: 50,
          border: '4px solid #ccc',
        }}
      >
        {children} {props.text} {props.address}
      </div>
      {isLast && (
        <DropZone
          onDrop={props.setData}
          item={{
            address: props.address.replace(/\d$/gi, (n) => `${Number(n) + 1}`),
            index: Number(props.index) + 1,
            type: props.type,
            parentType: props.parentType,
          }}
        />
      )}
    </>
  );
};
