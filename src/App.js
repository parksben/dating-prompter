import React, { useState, useCallback, useEffect } from 'react';
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
import { init, event } from './utils/uweb';
import './App.scss';

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

  // 双方的昵称
  const [nicknames, setNicknames] = useState([]);

  const [typeStats, setTypeStats] = useState([]);

  // 初始化友盟打点
  useEffect(() => {
    init();
  }, []);

  // 更新个人信息到前端界面
  const updateProfile = useCallback(() => {
    Promise.all([
      Storage.get('puppyProfile'),
      Storage.get('kittyProfile'),
    ]).then(([puppy, kitty]) => {
      // 获取双方话题类型的并集
      setTypes(
        uniq([
          ...puppy.data.topicMyself,
          ...puppy.data.topicEachOther,
          ...kitty.data.topicMyself,
          ...kitty.data.topicEachOther,
        ])
      );

      // 获取双方的昵称
      setNicknames([puppy.data.nickname, kitty.data.nickname]);
    });
  }, []);

  // 更新话题的类型统计给前端界面
  const updateTypeStats = useCallback(() => {
    const promises = [];
    for (let i = 0; i < ROUND_TOTAL; i++) {
      promises.push(Storage.get(`round-${i + 1}`));
    }

    Promise.all(promises).then((respList) => {
      const statistics = {};

      for (const resp of respList) {
        const history = resp.data.history || [];

        for (const { type } of history) {
          if (statistics[type]) {
            statistics[type] += 1;
          } else {
            statistics[type] = 1;
          }
        }
      }

      const result = Object.entries(statistics).map(([type, total]) => ({
        type,
        total,
      }));

      setTypeStats(result);
    });
  }, []);

  return (
    <div className="App">
      {/* 欢迎页 */}
      <Conditional visible={currentPage === 'welcome'}>
        <Welcome
          onPlay={() => {
            setCurrentPage('puppy');

            // 友盟事件上报
            event('开启约会');
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

            // 友盟事件上报
            event('提交男生信息', JSON.stringify(fields));
          }}
        />
      </Conditional>

      {/* 女生信息 */}
      <Conditional visible={currentPage === 'kitty'}>
        <KittyForm
          onSubmit={(fields) => {
            // 保存数据
            Storage.set('kittyProfile', fields).then(() => {
              // 更新个人信息到前端界面
              updateProfile();

              // 跳转到第一轮话题
              setLevel(1);
              setCurrentPage('round');
            });

            // 友盟事件上报
            event('提交女生信息', JSON.stringify(fields));
          }}
        />
      </Conditional>

      {/* 回合欢迎页 */}
      <Conditional visible={currentPage === 'round'}>
        <PageLayout
          onClick={() => {
            setCurrentPage('process');

            // 友盟事件上报
            event('进入约会话题', `第${level}轮话题`);
          }}>
          <RoundCard types={types} round={level} tip="点击任意位置继续" />
        </PageLayout>
      </Conditional>

      {/* 第 N 轮话题 */}
      <Conditional visible={currentPage === 'process'}>
        <PageLayout>
          <Conversation
            level={level}
            onFinish={(duration, history) => {
              // 友盟事件上报
              event(
                `第${level}轮话题结束`,
                `时长:${duration}`,
                '聊过的话题',
                JSON.stringify(history)
              );

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

                // 友盟事件上报
                event('进入烟花彩蛋', `第${level}轮话题`);
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

            // 友盟事件上报
            event('进入小结页面', `第${level}轮话题`);
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
              // 更新话题类型统计给前端界面
              updateTypeStats();

              // 跳转到结果页面
              setCurrentPage('report');

              // 友盟事件上报
              event('进入结果页面');

              return;
            }

            // 切换到下一轮
            setLevel((prev) => prev + 1);

            // 跳转到下一轮话题
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
            nicknames={nicknames}
            typeStats={typeStats}
            duration={roundTick}
            onShare={() => {
              handleShare();

              // 友盟事件上报
              event(
                '生成分享截图',
                JSON.stringify({ nicknames, typeStats, duration: roundTick })
              );
            }}
          />
        </PageLayout>
      </Conditional>

      {/* 截图所需页面 - 在视口外不可见 */}
      <div className="screenshot" id="screenshot">
        <PageLayout>
          <Report
            nicknames={nicknames}
            typeStats={typeStats}
            duration={roundTick}
            noShare
          />
          <div className="qrcode">
            <div className="image" />
            <div className="notes">
              <div>快乐约会，拒绝尴尬</div>
            </div>
          </div>
          <div className="extra">
            关注公众号 并 回复关键字：<span>相亲</span>
          </div>
        </PageLayout>
      </div>

      {/* 分享/保存图片的弹层 */}
      <div
        className="overlay"
        id="overlay"
        onClick={(e) => {
          e.target.classList.remove('display');
        }}>
        <div
          className="image"
          onClick={(e) => {
            e.target.parentElement.classList.remove('display');
          }}
        />
      </div>
    </div>
  );
}

// 点击分享按钮的回调
function handleShare() {
  const overlay = document.getElementById('overlay');
  const imgContainer = overlay.querySelector('.image');

  // 截图已存在，则避免面重复截图
  if (imgContainer.querySelector('img')) {
    overlay.classList.add('display');
    return;
  }

  // 截图并显示弹层
  html2canvas(
    document.getElementById('screenshot').querySelector('.page-inner')
  ).then((canvas) => {
    overlay.classList.add('display');

    const dataUrl = canvas.toDataURL();
    const img = document.createElement('img');
    img.src = dataUrl;
    img.onclick = () => {
      overlay.classList.remove('display');
    };

    imgContainer.innerHTML = '';
    imgContainer.appendChild(img);
  });
}

function uniq(list) {
  const map = {};
  for (const item of list) {
    map[item] = true;
  }
  return Object.keys(map);
}
