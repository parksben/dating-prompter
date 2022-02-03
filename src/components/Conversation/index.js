import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import Button from '../Button';
import Timer from '../Timer';
import fetchQuestion, { ALL_TYPES } from '../../utils/fetchQuestion';
import './index.scss';

export default function Conversation({
  level = 1,
  types = ALL_TYPES,
  duration = 15 * 60 * 1000,
  onNext = () => {},
  onFinish = () => {},
}) {
  // 题库
  const [questionList, setQuestionList] = useState([]);

  // 卡片样式
  const [currentStyle, setCurrentStyle] = useState(true);

  // 当前问题
  const [question, setQuestion] = useState(null);

  // 已经抽过的题
  const questionHistory = useRef([]);

  // 计时是否暂停
  const [isPaused, setIsPaused] = useState(true);

  // 本轮话题开始时间
  const begin = useRef(performance.now());

  // 加载题库
  useEffect(() => {
    fetchQuestion(level, types).then((list) => {
      setQuestionList(list);
      setQuestion(randomItem(list, questionHistory));
    });
  }, [level, types]);

  return (
    <div
      className={classnames(
        'conversation',
        currentStyle ? 'style-one' : 'style-two',
        `level-${level}`
      )}>
      <Timer
        paused={isPaused}
        onFinish={() => {
          onNext(duration);
        }}
      />

      <div className="question">
        {question && question.content && (
          <>
            <span>{question.content.substring(0, 1)}</span>
            {question.content.substring(1)}
          </>
        )}
      </div>

      <div className="action-group">
        <Button
          onClick={() => {
            setIsPaused((prev) => !prev);
          }}>
          {isPaused ? '开始计时' : '暂停计时'}
        </Button>

        <Button
          className="change-question"
          onClick={() => {
            setIsPaused(true);
            setQuestion(randomItem(questionList, questionHistory));
            setCurrentStyle((prev) => !prev);
          }}>
          换个话题
        </Button>
      </div>

      <div
        className="finish-round"
        size="small"
        onClick={() => {
          onNext(performance.now() - begin.current);
        }}>
        不聊了，结束此轮话题
      </div>
    </div>
  );
}

// 从题库中随机抽一道题
function randomItem(list = [], history) {
  if (!history) return null;

  const randomIdx = Math.round((list.length - 1) * Math.random());
  const item = list[randomIdx];

  if (!history.current.some((x) => x.content === item.content)) {
    history.current.push(item);
    return item;
  }

  return randomItem(list, history);
}
