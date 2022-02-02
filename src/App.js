import React, { useState } from 'react';
import Welcome from './pages/Welcome';
import PuppyForm from './pages/PuppyForm';
import KittyForm from './pages/KittyForm';
import Conditional from './components/Conditional';
import Storage from './utils/Storage';

function App() {
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
            Storage.set('kittyProfile', fields);
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

export default App;
