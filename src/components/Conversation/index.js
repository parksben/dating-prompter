import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Fragment,
} from 'react';
import classnames from 'classnames';
import Button from '../Button';
import Timer from '../Timer';
import fetchQuestion, { ALL_TYPES } from '../../utils/fetchQuestion';
import './index.scss';

export default function Conversation({
  level = 1,
  types = ALL_TYPES,
  duration = 15 * 60 * 1000,
  onFinish = () => {},
}) {
  const container = useRef(null);

  // 题库
  const questionList = useRef([]);

  // 卡片样式
  const [currentStyle, setCurrentStyle] = useState(true);

  // 当前问题
  const [question, setQuestion] = useState(null);

  // 计时是否暂停
  const [isPaused, setIsPaused] = useState(true);

  // 记录讨论过的话题，即哪些话题使用了时间
  const history = useRef([]);

  // 更新话题历史
  useEffect(() => {
    if (isPaused) return;

    if (!history.current.some((x) => x.content === question.content)) {
      history.current.push(question);
    }
  }, [isPaused, question]);

  // 从题库中随机抽一道题
  const randomItem = useCallback((list) => {
    if (!list.length) return null;

    const randomIdx = Math.round((list.length - 1) * Math.random());
    const item = list[randomIdx];

    return item;
  }, []);

  // 显示题库见底的文本提示
  const [errorTip, setErrorTip] = useState('');
  const timer = useRef(null);
  const showTip = useCallback((msg) => {
    setErrorTip(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setErrorTip('');
    }, 1.5e3);
  }, []);

  // 加载题库
  useEffect(() => {
    fetchQuestion(level, types).then((list) => {
      questionList.current.push(...list);

      const item = randomItem(questionList.current);
      setQuestion(item);

      questionList.current = questionList.current.filter(
        (x) => x.content !== item.content
      );
    });
  }, [level, randomItem, types]);

  return (
    <div
      className={classnames(
        'conversation',
        currentStyle ? 'style-one' : 'style-two',
        `level-${level}`
      )}
      ref={container}>
      <Timer
        paused={isPaused}
        onFinish={() => {
          setIsPaused(true);
          onFinish(duration, history.current);
        }}
      />

      <div className="question">
        {question && question.content && (
          <>
            <span>{question.content.substring(0, 1)}</span>
            {renderParagraph(question.content.substring(1))}
          </>
        )}
      </div>

      <div
        className={classnames(
          'action-group',
          isPaused ? 'multi-action' : 'single-action'
        )}>
        {isPaused && (
          <Button
            onClick={() => {
              setIsPaused(false);
            }}>
            聊一聊
          </Button>
        )}

        <Button
          className="change-question"
          onClick={() => {
            if (!questionList.current.length) {
              showTip('被掏空了 T_T');
              return;
            }

            setIsPaused(true);
            setCurrentStyle((prev) => !prev);

            const item = randomItem(questionList.current);
            setQuestion(item);

            questionList.current = questionList.current.filter(
              (x) => x.content !== item.content
            );
          }}>
          {errorTip || (isPaused ? '换一个' : '聊完了，换个话题')}
        </Button>
      </div>

      <div
        className="finish-round"
        size="small"
        onClick={() => {
          setIsPaused(true);
          onFinish(
            Number(
              container.current.querySelector('.timer .clock').dataset.tick
            ) || 0,
            history.current
          );
        }}>
        不聊了，结束此轮话题
      </div>
    </div>
  );
}

function renderParagraph(text = '') {
  const paragraphs = text.split('\n');
  return paragraphs.map((x, i) => (
    <Fragment key={`para-${i}`}>
      {i > 0 && <br />}
      {x}
    </Fragment>
  ));
}
