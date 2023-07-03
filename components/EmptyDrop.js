import { createDragHoverCallback } from '@/utils/createDragHoverCallback';
import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import DropZone from './DropZone';

const EmptyDrop = ({ children, payload, handleAdd, setData }) => {
  return (
    <div>
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
          <br />
        </>
      )}
      <DropZone
        onDrop={setData}
        item={{
          address: payload.item.address,
          index: 0,
          type: payload.item.type,
          parentType: payload.parentType,
        }}
      />
    </div>
  );
};

export default EmptyDrop;
