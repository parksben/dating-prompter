import React from 'react';
import RoundCard from '../../components/RoundCard';
import PageLayout from '../../layouts/PageLayout';

export default function RoundThree({ onClick = () => {} }) {
  return (
    <PageLayout className="round-three" onClick={onClick}>
      <RoundCard round={3} tip="点击任意位置继续" />
    </PageLayout>
  );
}
