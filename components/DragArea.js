import React, { forwardRef, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';

const getColor = (type) => {
  return {
    section: 'green',
    row: 'red',
    column: 'black',
    container: 'orange',
    component: 'blue',
  }[type];
};

export const DragArea = forwardRef(({ payload, children, text }, ref) => {
  const [ep, setEp] = useState({});
  const [{ isDragging }, drag] = useDrag(
    {
      type: payload.type,
      item: payload.item,
      isDragging: (monitor) => {
        console.log({ pi: payload.item, mi: monitor.getItem() });
        return payload.item.address === monitor.getItem().address;
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [payload]
  );

  const extraProps = {};

  console.log({ isDragging, payload });

  useEffect(() => {
    if (isDragging) {
      setEp({
        height: 0,
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        borderTop: '4px solid black',
      });
    } else {
      setEp({});
    }
  }, [isDragging]);

  drag(ref);

  return (
    <div
      ref={ref}
      style={{
        background: getColor(payload.type),
        color: 'white',
        margin: 30,
        padding: 50,
        border: '4px solid #ccc',
        ...ep,
      }}
    >
      {children} {text}
    </div>
  );
});

DragArea.displayName = 'DragArea';
