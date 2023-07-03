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
  console.log({ data, path });
  return _reducer(data, path, (acc, curr, index, { length }) => {
    console.log({ acc, curr, length });
    if (index === length - 1) {
      return acc.slice(curr, 1).at(0);
    }
    const { content } = acc[curr] || {};
    if (!content) return;
    return content;
  });
};

const _pull = (data, path) => {
  console.log({ data, path });
  return _reducer(data, path, (acc, curr, index, { length }) => {
    console.log({ acc, curr, length });
    // 0.
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
    console.log({ acc, curr, value }, '50');
    if (index === length - 1) {
      return acc.splice(curr, 0, value);
    }
    const { content } = acc[curr] || {};
    if (!content) return;

    console.log({ acc, content }, '50');
    return content;
  });
};

const _drop = ({ data, path }) => {
  return _reducer(data, path, (acc, curr, index, { length }) => {
    console.log({ acc, curr }, 'remove');
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
  if (dragPath.length >= dropPath.length) return dropPath;

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
    console.log({ updatedPath });

    return updatedPath.join('.');
  }

  return dropPath;
};

export default function Home() {
  const [data, setData] = useState(source);
  const handleDrag = ({ dragPath, dropPath }) => {
    console.log({ dragPath, dropPath });
    if (dropPath.includes(dragPath)) return;
    const _data = JSON.parse(JSON.stringify(data));
    const dragItem = _pull(_data, dragPath);
    console.log({ dragItem, _data }, '75');
    if (!dragItem) return;
    const path = getDropPath({ dragPath, dropPath });
    console.log({ dragPath, dropPath, path });
    _put({ data: _data, path, value: dragItem });

    setData(_data);
    return true;
  };

  const handleAdd = (item) => {
    const _data = JSON.parse(JSON.stringify(data));

    console.log('hey', item, _data);
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
              />
            );
          })}
        </div>
      </DndProvider>
    </>
  );
}
