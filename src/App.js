import React, { useState, useCallback } from 'react';
import Welcome from './pages/Welcome';
import PuppyForm from './pages/PuppyForm';
import KittyForm from './pages/KittyForm';
import Conditional from './components/Conditional';
import RoundCard from './components/RoundCard';
import Conversation from './components/Conversation';
import Summary from './components/Summary';
import PageLayout from './layouts/PageLayout';
import Storage from './utils/Storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  // 话题级别
  const [level, setLevel] = useState(1);

  // 话题类型
  const [types, setTypes] = useState([]);

  // 小结提示文案
  const [summaryTip, setSummaryTip] = useState('');

  // 更新/获取全部话题类型
  const updateTypes = useCallback(() => {
    Promise.all([
      Storage.get('puppyProfile'),
      Storage.get('kittyProfile'),
    ]).then(([puppy, kitty]) => {
      setTypes(
        uniq([
          ...puppy.data.topicMyself,
          ...puppy.data.topicEachOther,
          ...kitty.data.topicMyself,
          ...kitty.data.topicEachOther,
        ])
      );
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
              setLevel(1);
              setCurrentPage('round');
            });
          }}
        />
      </Conditional>

      {/* 回合欢迎页 */}
      <Conditional visible={currentPage === 'round'}>
        <PageLayout
          onClick={() => {
            setCurrentPage('process');
          }}>
          <RoundCard types={types} round={level} tip="点击任意位置继续" />
        </PageLayout>
      </Conditional>

      {/* 第一轮话题 */}
      <Conditional visible={currentPage === 'process'}>
        <PageLayout>
          <Conversation
            level={level}
            onFinish={(duration, history) => {
              Storage.set(`round-${level}`, { duration, history }).then(() => {
                let text = '';

                if (level === 1) {
                  text = `哇~ 已经互动了 ${Math.ceil(
                    duration / (60 * 1000)
                  )} 分钟，休息一下，喝口水润润嘴唇。`;
                }

                if (level === 2) {
                  text =
                    '你们已经交换了关于生活的许多个答案。这一刻，这个城市里，又多了一个让彼此觉得有意思的人。';
                }

                if (level === 3) {
                  text =
                    '谢谢这三个回合的分享和聆听，很高兴在茫茫人海中遇见特别的你。';
                }

                // 设置小结文案
                setSummaryTip(text);

                // 跳转到小结页面
                setCurrentPage('summary');
              });
            }}
          />
        </PageLayout>
      </Conditional>

      {/* 小结页面 */}
      <Conditional visible={currentPage === 'summary'}>
        <PageLayout
          onClick={() => {
            if (level === 3) return;

            // 跳转到下一轮话题
            setLevel((prev) => prev + 1);
            setCurrentPage('round');
          }}>
          <Summary tip="点击任意位置继续">{summaryTip}</Summary>
        </PageLayout>
      </Conditional>
    </div>
  );
}

function uniq(list) {
  const map = {};
  for (const item of list) {
    map[item] = true;
  }
  return Object.keys(map);
}
