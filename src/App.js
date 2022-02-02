import PageWrapper from './components/PageWrapper';
import Button from './components/Button';
import './App.scss';

function App() {
  return (
    <div className="App">
      <PageWrapper className="welcome">
        <div className="content">
          <div className="title">
            相亲<span>猫</span> &amp; 相亲<span>狗</span>
          </div>
          <div className="description">恋爱话题神器</div>
          <Button className="btn-play">开启约会</Button>
        </div>
      </PageWrapper>
    </div>
  );
}

export default App;
