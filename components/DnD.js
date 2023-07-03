import useDragAndDrop from '@/hooks/useDragAndDrop';
import { createDragHoverCallback } from '@/utils/createDragHoverCallback';
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
  const { type, children } = props;
  const ref = useRef();

  const { isDragging, canDrop, isOver } = useDragAndDrop(ref, {
    item: {
      address: props.address,
      index: props.index,
      type: props.type,
      parentType: props.parentType,
    },
    type,
    hover: createDragHoverCallback(ref, props, props.setData),
  });

  const extraProps = {};

  if (isDragging) {
    extraProps.height = 0;

    extraProps.padding = 0;
    extraProps.margin = 0;

    extraProps.overflow = 'hidden';
    extraProps.borderTop = '4px solid black';
  }

  return (
    <>
      <div
        ref={ref}
        style={{
          background: getColor(type),
          color: 'white',
          margin: 30,
          padding: 50,
          border: '4px solid #ccc',
          ...extraProps,
        }}
      >
        {children}
      </div>
    </>
  );
};
