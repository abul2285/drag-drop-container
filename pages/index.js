import Head from 'next/head';
import { Inter } from 'next/font/google';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Drag } from '@/components/DnD';
import { source } from '@/utils/source';
import { useRef, useState } from 'react';
import EmptyDrop from '@/components/EmptyDrop';

const inter = Inter({ subsets: ['latin'] });

const getEmptyProps = (type) => {
  return {
    section: 'row',
    row: 'column',
    column: 'component',
    container: 'component',
  }[type];
};

const Recursive = ({
  content,
  type,
  handleAdd,
  setData,
  index,
  address = '',
  text,
  parentType,
  isLast,
}) => {
  const path = address ? `${address}.${index}` : `${index}`;
  const emptyType = getEmptyProps(type);
  return (
    <Drag
      type={type}
      setData={setData}
      index={index}
      handleAdd={handleAdd}
      parentType={parentType}
      address={path}
      text={text}
      isLast={isLast}
    >
      {content?.length
        ? content.map((item, idx) => (
            <Recursive
              {...item}
              key={idx}
              handleAdd={handleAdd}
              parentType={type}
              setData={setData}
              index={idx}
              address={path}
              isLast={content.length - 1 === idx}
            />
          ))
        : emptyType && (
            <EmptyDrop
              setData={setData}
              payload={{
                item: {
                  index: 0,
                  address: `${path}.0`,
                  parentType: type,
                  type: emptyType,
                },
              }}
              handleAdd={handleAdd}
            >
              <div>Add {emptyType}</div>
            </EmptyDrop>
          )}
    </Drag>
  );
};

const _reducer = (data, path, cb) => {
  const splitPath = path.split('.');
  return splitPath.reduce(cb, data);
};

const _get = ({ data, path }) => {
  return _reducer(data, path, (acc, curr, index, { length }) => {
    if (index === length - 1) {
      return acc.slice(curr, 1).at(0);
    }
    const { content } = acc[curr] || {};
    if (!content) return;
    return content;
  });
};

const _pull = (data, path) => {
  return _reducer(data, path, (acc, curr, index, { length }) => {
    if (index === length - 1) {
      if (!acc) return;
      return acc.splice(curr, 1).at(0);
    }
    const { content } = acc[curr] || {};
    if (!content) return;
    return content;
  });
};

const _put = ({ data, path, value }) => {
  return _reducer(data, path, (acc, curr, index, { length }) => {
    if (index === length - 1) {
      return acc.splice(curr, 0, value);
    }
    const { content } = acc[curr] || {};
    if (!content) return;
    return content;
  });
};

const _drop = ({ data, path }) => {
  return _reducer(data, path, (acc, curr, index, { length }) => {
    if (index === length - 1) {
      acc.splice(curr, 1);
    }
    const { content } = acc[curr] || {};
    if (!content) return;
    return content;
  });
};

const getDeletePath = ({ dragPath = '', dropPath = '' }) => {
  const match = dropPath.match(dragPath) || dragPath.match(dropPath);
  if (match) {
    const splitAddress = dragPath.split('.');
    const lastNumber = Number(splitAddress.pop());
    return splitAddress.concat(lastNumber + 1).join('.');
  }
  return dragPath;
};

const getDropPath = ({ dragPath = '', dropPath = '' }) => {
  if (dragPath > dropPath) return dropPath;

  const isDroppingInside = dropPath.startsWith(dragPath.slice(0, -2));
  if (isDroppingInside) {
    const dragPathParts = dragPath.split('.');
    const dropPathParts = dropPath.split('.');
    const length = dragPathParts.length;

    const updatedPath = [
      ...dropPathParts.slice(0, length - 1),
      Number(dropPathParts[length - 1]) - 1,
      ...dropPathParts.slice(length),
    ].map((part) => part.toString());

    return updatedPath.join('.');
  }

  return dropPath;
};

const getEdgeItem = ({ path, data }) => {
  return path.reduce((nestedResource, position, index) => {
    if (path.length - 1 === index) {
      return nestedResource[position];
    }
    return nestedResource[position].content;
  }, data);
};

const pullAndPut = (source, sourcePosition, targetPosition) => {
  const updatedSource = JSON.parse(JSON.stringify(source));

  const sourcePath = sourcePosition.split('.');
  const targetPath = targetPosition.split('.');

  const sourceItem = getEdgeItem({ path: sourcePath, data: updatedSource });

  const sourceIndex = sourcePath.pop();
  const targetIndex = targetPath.pop();

  const sourceParent = getEdgeItem({ path: sourcePath, data: updatedSource });

  const isSamePosition =
    targetPosition.replace(/\d$/gi, () => `${sourceIndex}`) === sourcePosition;

  if (isSamePosition) {
    const [removedItem] = sourceParent.content.splice(sourceIndex, 1);
    const insertionIndex =
      sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    sourceParent.content.splice(insertionIndex, 0, removedItem);
    return updatedSource;
  }

  const targetParent = getEdgeItem({ path: targetPath, data: updatedSource });

  sourceParent.content.splice(sourceIndex, 1);
  targetParent.content.splice(targetIndex, 0, sourceItem);
  return updatedSource;
};

export default function Home() {
  const [data, setData] = useState(source);
  const handleDrag = ({ dragPath, dropPath }) => {
    const updateSource = pullAndPut(data, dragPath, dropPath);

    setData(updateSource);
    return true;
  };

  const handleAdd = (item) => {
    const _data = JSON.parse(JSON.stringify(data));
    _put({
      data: _data,
      path: item.address,
      value: { type: item.type, content: [] },
    });
    setData(_data);
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {data.map((item, idx) => {
            return (
              <Recursive
                {...item}
                key={idx}
                setData={handleDrag}
                index={idx}
                handleAdd={handleAdd}
                isLast={data.length - 1 === idx}
              />
            );
          })}
        </div>
      </DndProvider>
    </>
  );
}
