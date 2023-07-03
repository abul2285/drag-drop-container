const getNumericAddress = (address) => Number(address.split('.').join(''));

export const createDragHoverCallback = (ref, currentItem, onDrop) => {
  return (otherItem, monitor) => {
    if (!monitor.canDrop()) return;
    const dragIndex = getNumericAddress(otherItem.address);
    const hoverIndex = getNumericAddress(currentItem.address);

    const hoverBoundingRect = ref.current.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    const hoverClientX = clientOffset.x - hoverBoundingRect.right;

    // Only perform the move when the mouse has crossed half of the items height or width
    // When dragging downwards or right to left, only move when the cursor is below 50%
    if (
      dragIndex < hoverIndex &&
      hoverClientY < hoverMiddleY &&
      hoverClientX < hoverMiddleX
    ) {
      return;
    }

    // When dragging upwards or left to right, only move when the cursor is above 50%
    if (
      dragIndex > hoverIndex &&
      hoverClientY > hoverMiddleY &&
      hoverClientX > hoverMiddleX
    ) {
      return;
    }

    // Time to actually perform the action
    // this is where you would want to reorder your list
    // In case you wan't to use the whole object, don't forget to
    // make a deep copy, because we are mutating the object on the last line
    onDrop({
      dragPath: otherItem.address,
      dropPath: currentItem.address,
    });

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.

    otherItem.index = currentItem.index;
    otherItem.address = currentItem.address;
  };
};
