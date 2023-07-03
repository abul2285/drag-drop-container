import { useDrag, useDrop } from 'react-dnd';

export function useDragAndDrop(ref, payload) {
  console.log({ payload });
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

  const [{ canDrop, isOver }, drop] = useDrop(
    {
      accept: ['section', 'row', 'column', 'container', 'component'],
      hover: payload.hover,
      canDrop: (item) => {
        const { type, address } = payload.item;
        const isSameAddress = item.address === address;
        if (isSameAddress) return false;

        const isNestedContainer =
          type === 'container' && address.split('.').length > 2;
        const isTopContainer =
          type === 'container' && address.split('.').length <= 2;
        const isSameType = type === item.type;

        const isDropAllowed =
          {
            row: isTopContainer,
            component: isNestedContainer,
            container: type === 'row',
          }[item.type] || isSameType;

        return isDropAllowed;
      },
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
        isOver: !!monitor.isOver(),
      }),
    },
    [payload]
  );

  drag(drop(ref));

  console.log({ isDragging }, '54');

  return {
    isOver,
    canDrop,
    isDragging,
  };
}

export default useDragAndDrop;
