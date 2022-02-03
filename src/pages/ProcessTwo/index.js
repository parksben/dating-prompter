import React from 'react';
import Conversation from '../../components/Conversation';
import PageLayout from '../../layouts/PageLayout';

export default function ProcessTwo(props) {
  return (
    <PageLayout className="process-two">
      <Conversation {...props} level={2} />
    </PageLayout>
  );
}
