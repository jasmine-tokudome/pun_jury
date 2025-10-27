import React, { useState, useEffect } from 'react';
import './main.css';
import DajareJudge from './DajareJudge';

function App() {
  const [message, setMessage] = useState('猫が寝転んだ');
  const [result, setResult] = useState("ダジャレ審議会");
  const [judges, setJudges] = useState(["wait", "wait", "wait"]);
  const [tokenizer, setTokenizer] = useState(null);

  // kuromoji初期化
  useEffect(() => {
    import("kuromoji").then(kuromoji => {
      kuromoji.builder({ dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dic/" })
        .build((err, _tokenizer) => {
          if (!err) setTokenizer(_tokenizer);
        });
    });
  }, []);

  return (
    <>
      <div id="result">{result}</div>
      <div id="judges">
        {judges.map((j, i) =>
          <div key={i} className={`judge ${j} cat${i + 1}`}></div>
        )}
      </div>
      <div id="dajare">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          size="30"
        />
        <DajareJudge
          message={message}
          tokenizer={tokenizer}
          setResult={setResult}
          setJudges={setJudges}
        />
      </div>
    </>
  );
}

export default App;
