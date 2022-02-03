import React from 'react';
import classnames from 'classnames';
import { TOPIC_TYPES } from '../Profile';
import Button from '../Button';
import './index.scss';

const ICON_MAP = TOPIC_TYPES.reduce((acc, cur) => {
  acc[cur.text] = cur.icon;
  return acc;
}, {});

const DEFAULT_STATISTICS = [
  {
    type: '时间的爪印',
    total: 5,
  },
  {
    type: '理想国',
    total: 4,
  },
  {
    type: '家庭星球',
    total: 1,
  },
  {
    type: '恋爱星球',
    total: 7,
  },
  {
    type: '个人星球',
    total: 3,
  },
  {
    type: '灵魂碰碰',
    total: 2,
  },
];

export default function Report({
  nicknames = ['汪先生', '喵小姐'],
  duration = 45 * 60 * 1000,
  typeStats = DEFAULT_STATISTICS,
  onShare = () => {},
  noShare = false,
}) {
  return (
    <div className="report">
      <div className="description">
        <div className="name">{nicknames.join(' & ')}</div>
        <div>
          今天共约会 <span>{Math.ceil(duration / (60 * 1000))}</span> 分钟
        </div>
        <div>深入交流了这些话题</div>
      </div>

      <div className="statistics">
        {sortTypes(typeStats).map(({ type, total }, i) => (
          <div
            className={classnames('stat-item', { large: i % 2 === 1 })}
            key={`stat-item-${type}`}>
            <div
              className="icon"
              style={{ backgroundImage: `url("${ICON_MAP[type]}")` }}
            />
            <div className="text">
              {type}
              <br />
              <span>{total}</span> 个话题
            </div>
          </div>
        ))}
      </div>

      {!noShare && (
        <Button className="btn-share" onClick={onShare}>
          分享给更多人
        </Button>
      )}
    </div>
  );
}

// 按排版效果进行排序
function sortTypes(list) {
  const ordered = list.sort((a, b) => b.total - a.total);
  return [3, 0, 4, 1, 5, 2].map((idx) => ordered[idx]);
}
