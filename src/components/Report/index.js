import React from 'react';
import classnames from 'classnames';
import { TOPIC_TYPES } from '../Profile';
import Button from '../Button';
import './index.scss';

const ICON_MAP = TOPIC_TYPES.reduce((acc, cur) => {
  acc[cur.text] = cur.icon;
  return acc;
}, {});

export default function Report({
  nicknames = ['汪先生', '喵小姐'],
  duration = 45 * 60 * 1000,
  typeStats = [],
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
  if (!list || !list.length) return [];

  const fullTypes = TOPIC_TYPES.map(({ text }) => ({
    type: text,
    total: list.find((x) => x.type === text)?.total || 0,
  }));

  const ordered = fullTypes.sort((a, b) => b.total - a.total);

  return [3, 0, 4, 1, 5, 2].map((idx) => ordered[idx]);
}
