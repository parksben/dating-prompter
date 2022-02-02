import React, { useCallback, useState, useRef } from 'react';
import classnames from 'classnames';
import Button from '../Button';
import ICON_GRXQ from '../../svg/grxq.svg';
import ICON_SJDZY from '../../svg/sjdzy.svg';
import ICON_JTXQ from '../../svg/jtxq.svg';
import ICON_LHPP from '../../svg/lhpp.svg';
import ICON_LXG from '../../svg/lxg.svg';
import ICON_LAXQ from '../../svg/laxq.svg';
import './index.scss';

export default function Profile({ onSubmit = () => {} }) {
  const [nickname, setNickname] = useState('');
  const [topicMyself, setTopicMyself] = useState([]);
  const [topicEachOther, setTopicEachOther] = useState([]);

  // 表单提示
  const [errorTip, setErrorTip] = useState('');

  // 显示表单提示的方法
  const timer = useRef(null);
  const showTip = useCallback((msg) => {
    setErrorTip(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setErrorTip('');
    }, 1.5e3);
  }, []);

  // 点击提交按钮的回调
  const handleSubmit = useCallback(() => {
    if (!nickname) {
      showTip('请输入昵称~');
      return;
    }

    if (!topicMyself.length) {
      showTip('请选择跟 TA 分享的话题类型~');
      return;
    }

    if (!topicEachOther.length) {
      showTip('请选择想了解 TA 的话题类型~');
      return;
    }

    if (typeof onSubmit === 'function') {
      onSubmit({ nickname, topicMyself, topicEachOther });
    }
  }, [onSubmit, showTip, nickname, topicEachOther, topicMyself]);

  return (
    <div className="profile-form">
      {/* 输入昵称 */}
      <div className="form-item">
        <span className="label">
          {nickname && <span className="icon-done" />}昵称
        </span>
        <span className="value">
          <input
            value={nickname}
            onChange={(e) => {
              setNickname(String(e.target.value).trim());
            }}
            placeholder="请输入..."
          />
        </span>
      </div>

      {/* 想分享的话题类型 */}
      <div className="form-item multiline">
        <span className="label">
          {topicMyself.length > 0 && <span className="icon-done" />}
          {'想跟 TA 分享什么话题 (多选)'}
        </span>
        <span className="options">
          <TopicTypeSelect value={topicMyself} onSelect={setTopicMyself} />
        </span>
      </div>

      {/* 想了解的话题类型 */}
      <div className="form-item multiline">
        <span className="label">
          {topicEachOther.length > 0 && <span className="icon-done" />}
          {'想了解 TA 的哪些方面 (多选)'}
        </span>
        <span className="options">
          <TopicTypeSelect
            value={topicEachOther}
            onSelect={setTopicEachOther}
          />
        </span>
      </div>

      {/* 提交按钮 */}
      <div className="submit">
        {errorTip && <div className="error-tip">{errorTip}</div>}
        <Button
          onClick={handleSubmit}
          disabled={!nickname || !topicEachOther.length || !topicMyself.length}>
          完成并继续
        </Button>
      </div>
    </div>
  );
}

const TOPIC_TYPES = [
  {
    icon: ICON_GRXQ,
    text: '个人星球',
  },
  {
    icon: ICON_SJDZY,
    text: '时间的爪印',
  },
  {
    icon: ICON_JTXQ,
    text: '家庭星球',
  },
  {
    icon: ICON_LHPP,
    text: '灵魂碰碰',
  },
  {
    icon: ICON_LXG,
    text: '理想国',
  },
  {
    icon: ICON_LAXQ,
    text: '恋爱星球',
  },
];

// 话题类型多选
function TopicTypeSelect({ value = [], onSelect = () => {} }) {
  return (
    <div className="topic-type-select">
      {TOPIC_TYPES.map(({ icon, text }) => (
        <div
          className={classnames('option', { selected: value.includes(text) })}
          onClick={() => {
            if (typeof onSelect !== 'function') return;

            const nextValue = value.includes(text)
              ? value.filter((x) => x !== text)
              : [...value, text];

            onSelect(nextValue);
          }}
          key={`topic-type-${text}`}>
          <div className="icon" style={{ backgroundImage: `url("${icon}")` }} />
          {text}
        </div>
      ))}
    </div>
  );
}
