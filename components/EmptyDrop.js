import { createDragHoverCallback } from '@/utils/createDragHoverCallback';
import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

const EmptyDrop = ({ children, payload, handleAdd, setData }) => {
  const ref = useRef();
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ['section', 'row', 'column', 'container', 'component'],
    hover: createDragHoverCallback(ref, payload.item, setData),
    canDrop: (item) => {
      console.log({ item, payload }, '9999');
      if (item.type !== payload.item.type) {
        console.log('not same time');
        return false;
      }
      if (item.address === payload.item.address) {
        console.log('address same');
        return false;
      }
      return true;
    },
    collect: (monitor) => ({
      canDrop: !!monitor.canDrop(),
      isOver: !!monitor.isOver(),
    }),
  });
  drop(ref);

  return (
    <div ref={ref}>
      <button
        style={{
          padding: '8px 12px',
          background: 'white',
          border: '1px dashed yellow',
          display: 'flex',
          gap: 5,
          cursor: 'pointer',
        }}
        onClick={() => handleAdd(payload.item)}
      >
        + {children}{' '}
      </button>
      {payload.item.parentType === 'container' && (
        <>
          <br />
          <br />
          <button
            style={{
              padding: '8px 12px',
              background: 'white',
              border: '1px dashed yellow',
              display: 'flex',
              gap: 5,
              cursor: 'pointer',
            }}
            onClick={() => handleAdd({ ...payload.item, type: 'container' })}
          >
            + add container
          </button>
        </>
      )}
    </div>
  );
};

export default EmptyDrop;
