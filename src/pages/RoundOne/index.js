import React from 'react';
import RoundCard from '../../components/RoundCard';
import PageLayout from '../../layouts/PageLayout';

export default function RoundOne({ onClick = () => {} }) {
  return (
    <PageLayout className="round-one" onClick={onClick}>
      <RoundCard round={1} tip="点击任意位置继续" />
    </PageLayout>
  );
}
