import React, { useState } from 'react';
import Welcome from './pages/Welcome';
import PuppyForm from './pages/PuppyForm';
import KittyForm from './pages/KittyForm';
import RoundOne from './pages/RoundOne';
import RoundTwo from './pages/RoundTwo';
import RoundThree from './pages/RoundThree';
import Conditional from './components/Conditional';
import Storage from './utils/Storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

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
              setCurrentPage('round-one');
            });
          }}
        />
      </Conditional>

      {/* Round One */}
      <Conditional visible={currentPage === 'round-one'}>
        <RoundOne
          onClick={() => {
            setCurrentPage('round-two');
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

      {/* 转场动效 */}
      <Conditional visible={currentPage === 'start'}>
        <div>转场动效</div>
      </Conditional>
    </div>
  );
}
