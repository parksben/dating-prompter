import React from 'react';
import PageLayout from '../../layouts/PageLayout';
import Profile from '../../components/Profile';
import './index.scss';

export default function PuppyForm({ onSubmit = () => {} }) {
  return (
    <PageLayout className="puppy-form">
      <div className="content">
        <div className="title">汪先生</div>
        <Profile
          onSubmit={(fields) => {
            if (typeof onSubmit === 'function') {
              onSubmit(fields);
            }
          }}
        />
      </div>
    </PageLayout>
  );
}
