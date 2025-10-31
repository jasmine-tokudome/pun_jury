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

// getSentence, getFuzzyWord, getShortSentence, check1, check2, check3, check関数は元のまま利用可能

const DajareJudge: React.FC<DajareJudgeProps> = ({ message, tokenizer, setResult, setJudges }) => {
  // タイマーID複数管理（number型またはNodeJS.Timeout型, null初期化）
  const timersRef = useRef<Array<ReturnType<typeof setTimeout> | number>>([]);

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
      setTimeout(() => {
        setJudges([point >= 1 ? "ok" : "ng", "wait", "wait"]);
      }, 500)
    );
    timersRef.current.push(
      setTimeout(() => {
        setJudges([point >= 1 ? "ok" : "ng", point >= 1 ? "ok" : "ng", "wait"]);
      }, 1000)
    );
    timersRef.current.push(
      setTimeout(() => {
        setJudges([point >= 1 ? "ok" : "ng", point >= 1 ? "ok" : "ng", point >= 1 ? "ok" : "ng"]);
      }, 1500)
    );
    timersRef.current.push(
      setTimeout(() => {
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
    return clearAllTimers;
  }, [clearAllTimers, message, tokenizer]);

  return (
    <button disabled={!tokenizer} onClick={handleJudge}>
      {tokenizer ? "判定する" : "準備中"}
    </button>
  );
};

export default DajareJudge;
