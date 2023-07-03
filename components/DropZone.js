import React from 'react';
import { useDrop } from 'react-dnd';

const handleDrop = (props, monitor, onDrop) => {
  const item = monitor.getItem();
  onDrop({
    dragPath: item.address,
    dropPath: props.item.address,
  });
  item.index = props.item.index;
  item.address = props.item.address;
};

const DropZone = (props) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    {
      accept: ['section', 'row', 'column', 'container', 'component'],
      drop: (item, monitor) => handleDrop(props, monitor, props.onDrop),
      canDrop: (item) => {
        const { type, address, parentType } = props.item;
        const isSameAddress = item.address === address;
        if (isSameAddress) return false;

        const isNestedContainer =
          type === 'container' && address.split('.').length > 2;
        const isTopContainer =
          type === 'container' && address.split('.').length <= 2;
        const isSameType = type === item.type;
        const isComponentInsideContainer =
          type === 'component' && parentType === 'container';

        const isDropAllowed =
          {
            row: isTopContainer,
            component: isNestedContainer,
            container: type === 'row' || isComponentInsideContainer,
          }[item.type] || isSameType;

        const nextAddress = item.address.replace(
          /\d$/gi,
          (n) => `${Number(n) + 1}`
        );

        if (nextAddress === address) return;

        return isDropAllowed;
      },
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
        isOver: !!monitor.isOver(),
      }),
    },
    [props]
  );
  const isActive = canDrop && isOver;

  return (
    <div
      ref={drop}
      style={{
        background: isActive ? 'green' : canDrop ? 'yellow' : 'transparent',
        height: canDrop ? 12 : 0,
        // width: 10,
      }}
    />
  );
};

export default DropZone;
