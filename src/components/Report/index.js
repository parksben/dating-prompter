import React from 'react';
import { TOPIC_TYPES } from '../Profile';
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
  duration = 45 * 60 * 1000,
  typeStats = DEFAULT_STATISTICS,
}) {
  return (
    <div className="report">
      <div className="description">
        今天的约会持续了 {Math.ceil(duration / (60 * 1000))} 分钟
        <br />
        我们彼此分享了这些话题
      </div>

      <div className="statistics">
        {sortTypes(typeStats).map(({ type, total }) => (
          <div className="stat-item" key={`stat-item-${type}`}>
            <div
              className="icon"
              style={{ backgroundImage: `url("${ICON_MAP[type]}")` }}
            />
            <div className="text">
              {type}
              <br />
              {total}个话题
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 按排版效果进行排序
function sortTypes(list) {
  const ordered = list.sort((a, b) => b.total - a.total);
  return [3, 0, 4, 1, 5, 2].map((idx) => ordered[idx]);
}
