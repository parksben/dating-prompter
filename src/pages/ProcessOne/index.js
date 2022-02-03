import React from 'react';
import Conversation from '../../components/Conversation';
import PageLayout from '../../layouts/PageLayout';

export default function ProcessOne(props) {
  return (
    <PageLayout className="process-one">
      <Conversation {...props} level={1} />
    </PageLayout>
  );
}
