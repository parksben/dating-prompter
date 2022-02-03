import React from 'react';
import Conversation from '../../components/Conversation';
import PageLayout from '../../layouts/PageLayout';

export default function ProcessThree(props) {
  return (
    <PageLayout className="process-three">
      <Conversation {...props} level={3} />
    </PageLayout>
  );
}
