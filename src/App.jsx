import { useState } from 'react';
import './main.css';

function App() {
  const [message, setMessage] = useState('猫が寝転んだ');
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      <div id="result">ダジャレ審議会</div>
      <div id="judges">
        <div className="judge wait cat1"></div>
        <div className="judge wait cat2"></div>
        <div className="judge wait cat3"></div>
      </div>
      <div id="dajare">
        <input 
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          size="30"
        />
        <button disabled={!isReady}>
          {isReady ? '判定する' : '準備中'}
        </button>
      </div>
    </>
  );
}

export default App;
