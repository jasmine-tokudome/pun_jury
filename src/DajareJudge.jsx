import React, { useRef, useCallback, useEffect } from "react";

// getSentence, getFuzzyWord, getShortSentence, check1, check2, check3, check関数は元のまま

const DajareJudge = ({ message, tokenizer, setResult, setJudges }) => {
  // タイマーIDを保持するRef
  const timersRef = useRef([]);

  // タイマー解除用
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((tid) => clearTimeout(tid));
    timersRef.current = [];
  }, []);

  // 判定処理
  const handleJudge = useCallback(() => {
    clearAllTimers();

    const point = check(message, tokenizer);
    setResult("審議中");
    setJudges(["wait", "wait", "wait"]);

    // 各タイマーセット
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
        setJudges([
          point >= 1 ? "ok" : "ng",
          point >= 1 ? "ok" : "ng",
          point >= 1 ? "ok" : "ng",
        ]);
      }, 1500)
    );
    timersRef.current.push(
      setTimeout(() => {
        setResult(
          point === 0
            ? "失格"
            : point === 1
            ? "三級合格"
            : point === 2
            ? "二級合格"
            : point === 3
            ? "一級合格"
            : ""
        );
      }, 2000)
    );
  }, [message, tokenizer, clearAllTimers, setResult, setJudges]);

  // アンマウント時・再実行時にクリーンアップ
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
