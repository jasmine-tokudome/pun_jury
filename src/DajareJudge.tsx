import React, { useRef, useCallback, useEffect } from "react";

// 必要データ型定義
type Token = {
  surface_form: string;
  reading?: string;
  pronunciation?: string;
  pos?: string;
};
type SentenceResult = {
  original: string;
  reading: string;
  pronunciation: string;
  nouns: {
    original: string;
    reading: string;
    pronunciation: string;
  }[];
};
type JudgeType = "wait" | "ok" | "ng";
type ResultType = "審議中" | "失格" | "三級合格" | "二級合格" | "一級合格" | "";

// props型定義
interface DajareJudgeProps {
  message: string;
  tokenizer: { tokenize: (message: string) => Token[] } | null;
  setResult: React.Dispatch<React.SetStateAction<ResultType>>;
  setJudges: React.Dispatch<React.SetStateAction<JudgeType[]>>;
}

// 下記 check() 関数は既存のまま利用する想定

const DajareJudge: React.FC<DajareJudgeProps> = ({ message, tokenizer, setResult, setJudges }) => {
  // タイマーID複数管理（ブラウザではnumber）
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((tid) => clearTimeout(tid));
    timersRef.current = [];
  }, []);

  const handleJudge = useCallback(() => {
    clearAllTimers();
    const point = check(message, tokenizer);
    setResult("審議中");
    setJudges(["wait", "wait", "wait"]);

    timersRef.current.push(
      window.setTimeout(() => {
        setJudges([point >= 1 ? "ok" : "ng", "wait", "wait"]);
      }, 500)
    );
    timersRef.current.push(
      window.setTimeout(() => {
        setJudges([point >= 1 ? "ok" : "ng", point >= 1 ? "ok" : "ng", "wait"]);
      }, 1000)
    );
    timersRef.current.push(
      window.setTimeout(() => {
        setJudges([point >= 1 ? "ok" : "ng", point >= 1 ? "ok" : "ng", point >= 1 ? "ok" : "ng"]);
      }, 1500)
    );
    timersRef.current.push(
      window.setTimeout(() => {
        setResult(
          point === 0 ? "失格"
          : point === 1 ? "三級合格"
          : point === 2 ? "二級合格"
          : point === 3 ? "一級合格"
          : ""
        );
      }, 2000)
    );
  }, [message, tokenizer, clearAllTimers, setResult, setJudges]);

  useEffect(() => {
    // クリーンアップでタイマー全消去のみ（複数useEffect依存はここでは不要）
    return () => clearAllTimers();
  }, [clearAllTimers]);

  return (
    <button disabled={!tokenizer} onClick={handleJudge}>
      {tokenizer ? "判定する" : "準備中"}
    </button>
  );
};

export default DajareJudge;
