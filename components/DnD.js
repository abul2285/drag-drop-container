import useDragAndDrop from '@/hooks/useDragAndDrop';
import { createDragHoverCallback } from '@/utils/createDragHoverCallback';
import React, { useMemo, useRef } from 'react';
import { DropZone } from './DropZone';
import { DragArea } from './DragArea';

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

  const payload = useMemo(() => {
    return {
      item: {
        address: props.address,
        index: props.index,
        type: props.type,
        parentType: props.parentType,
      },
      type,
      hover: createDragHoverCallback(ref, props, props.setData),
    };
  }, [props, type]);

  // const { isDragging, canDrop, isOver } = useDragAndDrop(ref, payload);

  return (
    <>
      <DropZone payload={payload}>
        <DragArea ref={ref} payload={payload} text={props.text}>
          {children}
        </DragArea>
      </DropZone>
    </>
  );
};
