import React, { useState, useCallback } from 'react';
import Welcome from './pages/Welcome';
import PuppyForm from './pages/PuppyForm';
import KittyForm from './pages/KittyForm';
import RoundOne from './pages/RoundOne';
import RoundTwo from './pages/RoundTwo';
import RoundThree from './pages/RoundThree';
import ProcessOne from './pages/ProcessOne';
import Conditional from './components/Conditional';
import Storage from './utils/Storage';

// for debuging
window.Storage = Storage;

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  // 话题类型
  const [types, setTypes] = useState([]);

  // 更新/获取全部话题类型
  const updateTypes = useCallback(() => {
    Promise.all([
      Storage.get('puppyProfile'),
      Storage.get('kittyProfile'),
    ]).then(([puppy, kitty]) => {
      setTypes([
        ...puppy.data.topicMyself,
        ...puppy.data.topicEachOther,
        ...kitty.data.topicMyself,
        ...kitty.data.topicEachOther,
      ]);
    });
  }, []);

  return (
    <div className="App">
      {/* 欢迎页 */}
      <Conditional visible={currentPage === 'welcome'}>
        <Welcome
          onPlay={() => {
            setCurrentPage('puppy');
          }}
        />
      </Conditional>

      {/* 男生信息 */}
      <Conditional visible={currentPage === 'puppy'}>
        <PuppyForm
          onSubmit={(fields) => {
            // 保存数据
            Storage.set('puppyProfile', fields).then(() => {
              setCurrentPage('kitty');
            });
          }}
        />
      </Conditional>

      {/* 女生信息 */}
      <Conditional visible={currentPage === 'kitty'}>
        <KittyForm
          onSubmit={(fields) => {
            // 保存数据
            Storage.set('kittyProfile', fields).then(() => {
              // 更新话题类型
              updateTypes();

              // 跳转到第一轮话题
              setCurrentPage('round-one');
            });
          }}
        />
      </Conditional>

      {/* Round One */}
      <Conditional visible={currentPage === 'round-one'}>
        <RoundOne
          types={types}
          onClick={() => {
            setCurrentPage('process-one');
          }}
        />
      </Conditional>

      {/* 第一轮话题 */}
      <Conditional visible={currentPage === 'process-one'}>
        <ProcessOne
          onFinish={(duration, history) => {
            Storage.set('roundOne', { duration, history }).then(() => {
              // 跳转到小结页面
              // setCurrentPage('summary-one');
            });
          }}
        />
      </Conditional>

      {/* Round Two */}
      <Conditional visible={currentPage === 'round-two'}>
        <RoundTwo
          onClick={() => {
            setCurrentPage('round-three');
          }}
        />
      </Conditional>

      {/* Round Three */}
      <Conditional visible={currentPage === 'round-three'}>
        <RoundThree
          onClick={() => {
            console.log('开始第三轮话题');
          }}
        />
      </Conditional>
    </div>
  );
}
