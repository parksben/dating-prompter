import React from 'react';
import RoundCard from '../../components/RoundCard';
import PageLayout from '../../layouts/PageLayout';

export default function RoundTwo({ onClick = () => {} }) {
  return (
    <PageLayout className="round-two" onClick={onClick}>
      <RoundCard round={2} tip="点击任意位置继续" />
    </PageLayout>
  );
}
