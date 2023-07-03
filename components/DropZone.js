import { useDrop } from 'react-dnd';

export const DropZone = ({ payload, children }) => {
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

  return <div ref={drop}>{children}</div>;
};
