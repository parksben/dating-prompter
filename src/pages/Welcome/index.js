import React from 'react';
import PageLayout from '../../layouts/PageLayout';
import Button from '../../components/Button';
import './index.scss';

export default function Welcome({ onPlay = () => {} }) {
  return (
    <PageLayout className="welcome">
      <div className="content">
        <div className="title">
          相亲<span>猫</span> &amp; 相亲<span>狗</span>
        </div>
        <div className="description">恋爱话题神器</div>
        <Button className="btn-play" size="large" onClick={onPlay}>
          开启约会
        </Button>
      </div>
    </PageLayout>
  );
}
