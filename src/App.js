import React, { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import Welcome from './pages/Welcome';
import PuppyForm from './pages/PuppyForm';
import KittyForm from './pages/KittyForm';
import Conditional from './components/Conditional';
import RoundCard from './components/RoundCard';
import Conversation from './components/Conversation';
import Firework from './components/Firework';
import Summary from './components/Summary';
import Report from './components/Report';
import PageLayout from './layouts/PageLayout';
import Storage from './utils/Storage';

// 话题的总回合数
const ROUND_TOTAL = 3;

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  // 话题级别
  const [level, setLevel] = useState(1);

  // 话题类型
  const [types, setTypes] = useState([]);

  // 累计耗时
  const [roundTick, setRoundTick] = useState(0);

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
                  )} 分钟，休息一下，喝口水润润嘴唇`;
                }

                if (level === 2) {
                  text =
                    '你们已经交换了关于生活的许多个答案。这一刻，这个城市里，又多了一个让彼此觉得有意思的人';
                }

                if (level === 3) {
                  text =
                    '谢谢这三个回合的分享和聆听，很高兴在茫茫人海中遇见特别的你';
                }

                // 设置累计耗时
                setRoundTick((prev) => prev + duration);

                // 设置小结文案
                setSummaryTip(text);

                // 跳转到彩蛋页面
                setCurrentPage('firework');
              });
            }}
          />
        </PageLayout>
      </Conditional>

      {/* 彩蛋页面 */}
      <Conditional visible={currentPage === 'firework'}>
        <PageLayout
          onClick={() => {
            // 跳转小结页面
            setCurrentPage('summary');
          }}>
          <Firework tip="点击任意位置继续">
            <div>{Math.ceil(roundTick / (60 * 1000))}min</div>
            记得鼓励下自己 (^_^)
          </Firework>
        </PageLayout>
      </Conditional>

      {/* 小结页面 */}
      <Conditional visible={currentPage === 'summary'}>
        <PageLayout
          onClick={() => {
            if (level === ROUND_TOTAL) {
              setCurrentPage('report');
              return;
            }

            // 跳转到下一轮话题
            setLevel((prev) => prev + 1);
            setCurrentPage('round');
          }}>
          <Summary
            level={level}
            tip={
              level < ROUND_TOTAL ? '点击任意位置继续' : '点击任意位置查看结果'
            }>
            {summaryTip}
          </Summary>
        </PageLayout>
      </Conditional>

      {/* 报告页面 */}
      <Conditional visible={currentPage === 'report'}>
        <PageLayout>
          <Report
            duration={roundTick}
            onShare={() => {
              const overlay = document.getElementById('overlay');
              const imgContainer = overlay.querySelector('.image');

              if (imgContainer.querySelector('img')) {
                overlay.classList.add('display');
                return;
              }

              html2canvas(document.getElementById('screenshot')).then(
                (canvas) => {
                  overlay.classList.add('display');

                  const dataUrl = canvas.toDataURL('image/jpg');
                  const img = document.createElement('img');
                  img.src = dataUrl;
                  img.onclick = () => {
                    overlay.classList.remove('display');
                  };

                  imgContainer.innerHTML = '';
                  imgContainer.appendChild(img);
                }
              );
            }}
          />
        </PageLayout>
      </Conditional>

      {/* 截图所需页面 */}
      <div className="screenshot" id="screenshot">
        <PageLayout>
          <Report duration={roundTick} noShare />
          <div className="qrcode">
            <div className="image" />
            <div className="notes">
              <div>快乐约会，拒绝尴尬</div>
            </div>
          </div>
          <div className="extra">
            扫码关注公众号 并 回复关键字：<span>相亲提词器</span>
          </div>
        </PageLayout>
      </div>

      {/* 分享图片的弹层 */}
      <div
        className="overlay"
        id="overlay"
        onClick={(e) => {
          e.target.classList.remove('display');
        }}>
        <div className="image" />
      </div>
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
