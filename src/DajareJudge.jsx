import React from "react";

// 文章を解析して返す
function getSentence(message, tokenizer){
  if (!tokenizer) return null;
  const tokens = tokenizer.tokenize(message);
  const nouns = [];
  let reading = "";
  let pronunciation = "";
  for (let token of tokens){
    reading += token.reading ? token.reading : token.surface_form;
    pronunciation += token.pronunciation ? token.pronunciation : token.surface_form;
    if(token.pos === "名詞"){
      nouns.push({
        original: token.surface_form,
        reading: token.reading && token.reading !== "*" ? token.reading : token.surface_form,
        pronunciation: token.pronunciation && token.pronunciation !== "*" ? token.pronunciation : token.surface_form,
      });
    }
  }
  return {
    original: message,
    reading: reading,
    pronunciation: pronunciation,
    nouns: nouns,
  }
}

// 単語の読みの補正
function getFuzzyWord(text){
  text = text.replaceAll("ッ", "[ツッ]?");
  text = text.replaceAll("ァ", "[アァ]?");
  text = text.replaceAll("ィ", "[イィ]?");
  text = text.replaceAll("ゥ", "[ウゥ]?");
  text = text.replaceAll("ェ", "[エェ]?");
  text = text.replaceAll("ォ", "[オォ]?");
  text = text.replaceAll("ズ", "[スズヅ]");
  text = text.replaceAll("ヅ", "[ツズヅ]");
  text = text.replaceAll("ヂ", "[チジヂ]");
  text = text.replaceAll("ジ", "[シジヂ]");
  text = text.replaceAll("ガ", "[カガ]");
  text = text.replaceAll("ギ", "[キギ]");
  text = text.replaceAll("グ", "[クグ]");
  text = text.replaceAll("ゲ", "[ケゲ]");
  text = text.replaceAll("ゴ", "[コゴ]");
  text = text.replaceAll("ザ", "[サザ]");
  text = text.replaceAll("ゼ", "[セゼ]");
  text = text.replaceAll("ゾ", "[ソゾ]");
  text = text.replaceAll("ダ", "[タダ]");
  text = text.replaceAll("デ", "[テデ]");
  text = text.replaceAll("ド", "[トド]");
  text = text.replaceAll("ャ", "[ヤャ]");
  text = text.replaceAll("ュ", "[ユュ]");
  text = text.replaceAll("ョ", "[ヨョ]");
  text = text.replaceAll("ー", "[ー]?");
  text = text.replaceAll("キ[ヤャ]", "(キ[ヤャ]|カ)");
  text = text.replaceAll("シ[ヤャ]", "(シ[ヤャ]|サ)");
  text = text.replaceAll("シ[ヨョ]", "(シ[ヨョ]|ソ)");
  text = text.replaceAll(/[ハバパ]/g, "[ハバパ]");
  text = text.replaceAll(/[ヒビピ]/g, "[ヒビピ]");
  text = text.replaceAll(/[フブプ]/g, "[フブプ]");
  text = text.replaceAll(/[ヘベペ]/g, "[ヘベペ]");
  text = text.replaceAll(/[ホボポ]/g, "[ホボポ]");
  text = text.replaceAll(/([アカサタナハマヤラワャ])ー/g, "$1[アァ]?");
  text = text.replaceAll(/([イキシチニヒミリ])ー/g, "$1[イィ]?");
  text = text.replaceAll(/([ウクスツヌフムユルュ])ー/g, "$1[ウゥ]?");
  text = text.replaceAll(/([エケセテネへメレ])ー/g, "$1[エェ]?");
  text = text.replaceAll(/([オコソトノホモヨロヲョ])ー/g, "$1[ウゥオォ]?");
  return text;
}

// 省略形にする
function getShortSentence(text){
  return text.replaceAll("ッ", "").replaceAll("ー", "");
}

// 判定関数群
function check1(message, tokenizer){
  const sentence = getSentence(message, tokenizer);
  if(sentence && sentence.reading.length > 0){
    for(const noun of sentence.nouns){
      const readingRegex = new RegExp(noun.reading,"g");
      const hit_reading = (sentence.reading.match(readingRegex) ?? []).length;
      if (hit_reading > 1){
        return true;
      }
    }
  }
  return false;
}

function check2(message, tokenizer){
  const sentence = getSentence(message, tokenizer);
  if(sentence && sentence.original.length > 0 && sentence.reading.length > 0){
    for(const noun of sentence.nouns){
      const originalRegex = new RegExp(noun.original,"g");
      const readingRegex = new RegExp(noun.reading, "g");
      const hit_original = (sentence.original.match(originalRegex) ?? []).length;
      const hit_reading = (sentence.reading.match(readingRegex) ?? []).length;
      if(hit_original < hit_reading){
        return true;
      }
    }
  }
  return false;
}

function check3(message, tokenizer){
  const sentence = getSentence(message, tokenizer);
  if(
    sentence &&
    sentence.original.length > 0 &&
    sentence.reading.length > 0 &&
    sentence.pronunciation.length > 0
  ){
    for(const noun of sentence.nouns){
      const originalRegex = new RegExp(noun.original,"g");
      const readingRegex = new RegExp(noun.reading, "g");
      const pronunciationRegex = new RegExp(noun.pronunciation, "g");
      const hit_original = (sentence.original.match(originalRegex) ?? []).length;
      const hit_reading = (sentence.reading.match(readingRegex) ?? []).length;
      const hit_pronunciation = (sentence.pronunciation.match(pronunciationRegex) ?? []).length;
      const short_reading = getShortSentence(sentence.reading);
      const hit_short = (short_reading.match(readingRegex) ?? []).length;
      const fuzzy_noun = getFuzzyWord(noun.reading);
      const fuzzyRegex = new RegExp(fuzzy_noun,"g");
      const hit_fuzzy = (sentence.reading.match(fuzzyRegex) ?? []).length;
      if(hit_original < Math.max(hit_reading, hit_pronunciation, hit_fuzzy, hit_short)){
        return true;
      }
    }
  }
  return false;
}

function check(message, tokenizer){
  const result1 = check1(message, tokenizer);
  const result2 = check2(message, tokenizer);
  const result3 = check3(message, tokenizer);
  if (!result1 && !result2 && !result3){
    return 0;
  }
  if (result1 && !result2 && !result3){
    return 1;
  }
  if (!result2 && result3){
    return 3;
  }
  if (result2){
    return 2;
  }
  return 0;
}

const DajareJudge = ({ message, tokenizer, setResult, setJudges }) => {
  const handleJudge = () => {
    const point = check(message, tokenizer);
    setResult("審議中");
    setJudges(["wait", "wait", "wait"]);
    setTimeout(() => {
      setJudges([point >= 1 ? "ok" : "ng", "wait", "wait"]);
    }, 500);
    setTimeout(() => {
      setJudges([point >= 1 ? "ok" : "ng", point >= 1 ? "ok" : "ng", "wait"]);
    }, 1000);
    setTimeout(() => {
      setJudges([point >= 1 ? "ok" : "ng", point >= 1 ? "ok" : "ng", point >= 1 ? "ok" : "ng"]);
    }, 1500);
    setTimeout(() => {
      setResult(
        point === 0 ? "失格" :
        point === 1 ? "三級合格" :
        point === 2 ? "二級合格" :
        point === 3 ? "一級合格" : ""
      );
    }, 2000);
  };

  return (
    <button
      disabled={!tokenizer}
      onClick={handleJudge}
    >
      {tokenizer ? "判定する" : "準備中"}
    </button>
  );
};

export default DajareJudge;
