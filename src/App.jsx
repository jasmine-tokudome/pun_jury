import { createRoot } from 'react-dom/client'
import { useState } from 'react';
import './main.css';

function App() {
  const [message, setMessage] = useState('猫が寝転んだ');
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      <div id="result">ダジャレ審議会</div>
      <div id="judges">
        <div id="judge_1" className="judge wait cat1"></div>
        <div id="judge_2" className="judge wait cat2"></div>
        <div id="judge_3" className="judge wait cat3"></div>
      </div>

      <div id="dajare">
        <input 
          type="text" 
          id="message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          size="30" 
        />
        <button id="button" disabled={!isReady}>
          {isReady ? '判定する' : '準備中'}
        </button>
      </div>
    </>
  );
}

const root = createRoot(document.getElementById('app'))
root.render(<App />)

export default App;
