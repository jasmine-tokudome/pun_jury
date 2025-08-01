const button = document.querySelector("#button");
let tokenizer;
// 形態素解析(文章の分析)の準備
kuromoji.builder({ dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/" }).
    build(function (error, _tokenizer) {
        if (error) {
            console.log(error);
        } else {
            tokenizer = _tokenizer;
            button.textContent = "審議";
            button.disabled = false;
        }
    });

// 審議ボタンを押したときの処理
button.addEventListener("click", function () {
    if (tokenizer) {
        const message = document.querySelector("#message").value;
        const point = check(message);
        reset();
        judge(point);
    }
});

//表示を元に戻す
function reset() {
    document.querySelector("#result").textContent = "審議中";
    document.querySelector("#judge_1").className = "judge wait cat1";
    document.querySelector("#judge_2").className = "judge wait cat2";
    document.querySelector("#judge_3").className = "judge wait cat3";
}

// 審議ネコを表示する
function judge(point) {
    // 0.5秒後に審議ネコ1を表示する
    setTimeout(function (){
        if (point >= 1) {
            document.querySelector("#judge_1").className = "judge ok cat1";
        } else {
            document.querySelector("#judge_1").className = "judge ng cat1";
        }
    },500);
    // 1秒後に審議ネコ2を表示する
    setTimeout(function (){
        if (point >= 2) {
            document.querySelector("#judge_2").className = "judge ok cat2";
        } else {
            document.querySelector("#judge_2").className = "judge ng cat2";
        }
    },1000);
    // 1.5秒後に審議ネコ3を表示する
    setTimeout(function (){
        if (point >= 3) {
            document.querySelector("#judge_3").className = "judge ok cat3";
        } else {
            document.querySelector("#judge_3").className = "judge ng cat3";
        }
    },1500);
    // 2秒後に結果を表示する
    setTimeout(function () {
        switch (point) {
            case 0:
            document.querySelector("#result").textContent = "失格";
            break;
            case 1:
            document.querySelector("#result").textContent = "三級合格";
            break;
            case 2:
            document.querySelector("#result").textContent = "二級合格";
            break;
            case 3:
            document.querySelector("#result").textContent = "一級合格";
            break;
        }
        document.querySelector("#result").className = "kurukuru";
    }, 2000);
}

// 点数を審議する
function check(message) {
    const result1 = check1(message);
    const result2 = check2(message);
    const result3 = check3(message);
    if (result1 == false && result2 == false && result3 == false) {
        return 0;
    }
    if (result1 == true && result2 == false && result3 == false) {
        return 1;
    }
    if (result2 == false && result3 == true) {
        return 3;
    }
    if (result2 == true) {
        return 2;
    }
}

// ダジャレの判定(単純に読みが一致していればOK)
function check1(message) {
    const sentence = getSentence(message);
    if (sentence.reading.length != 0){
        for (let noun of sentence.nouns){
            const hit_reading = (sentence.reading.match(new RegExp(noun.reading, "g")) ?? []).length;
        if (1 < hit_reading){
            return true;
        }
        }
    }
    return false;
}

// ダジャレの判定(単純な同じ単語の繰り返しはNG)
function check2(message) {
    const sentence = getSentence(message);
    if (sentence.original.length !=0 &&
    sentence.reading.length != 0){
        for (let noun of sentence.nouns){
            const hit_original = (sentence.original.match(new RegExp(noun.original, "g")) ?? []).length;
            const hit_reading = (sentence.reading.match(new RegExp(noun.reading, "g")) ?? []).length;
            if (hit_original < hit_reading){
                return true;
            }
        }
    }
    return false;
}

// ダジャレの判定(読みがちょっと違っていてもOK)
function check3(message) {
    const sentence = getSentence(message);
    if (sentence.original.length != 0 &&
        sentence.reading.length != 0 &&
        sentence.pronunciation.length != 0){
            for (let noun of sentence.nouns){
                const hit_original = (sentence.original.match(new RegExp(noun.original, "g")) ?? []).length;
                const hit_reading = (sentence.reading.match(new RegExp(noun.reading, "g")) ?? []).length;

                const hit_pronunciation = (sentence.pronunciation.match(new RegExp(noun.pronunciation, "g")) ?? []).length;
                const short_reading = getShortSentence(sentence.reading);
                const hit_short = (short_reading.match(new RegExp(noun.reading, "g")) ?? []).length;
                const fuzzy_noun = getFuzzyWord(noun.reading);
                const hit_fuzzy = (sentence.reading.match(new RegExp(fuzzy_noun, "g")) ?? []).length;
                if (hit_original < Math.max(hit_reading, hit_pronunciation,hit_fuzzy,hit_short)){
                    return true;
                }
            }
        }
    return false;
}

// 文章を解析して返す
function getSentence(message) {
    const tokens = tokenizer.tokenize(message);
    const nouns = [];
    let reading = "";
    let pronunciation = "";
    for (let token of tokens){
        reading += token.reading ?? token.surface_form;
        pronunciation += token.pronunciation ?? token.surface_form;
        if (token.pos == "名詞"){
            nouns.push(
                {
                    original: token.surface_form,
                    reading: token.reading && token.reading != "*" ? token.reading : token.surface_form,
                    pronunciation: token.pronunciation && token.pronunciation != "*" ? token.pronunciation : token.surface_form,
                }
            );
        }
    }
    return {
        original: message, // 元の文章「今日はいい天気ですね」
        reading: reading,
        pronunciation: pronunciation,
        nouns: nouns,
    }
}

// 単語の読みの補正(ちょっとした違いならOKとする)
function getFuzzyWord(text) {
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

// 文中の省略できる文字を省略する
function getShortSentence(text) {
    text = text.replaceAll("ッ", "");
    text = text.replaceAll("ー", "");
    return text;
}

// 文中の省略できる文字を省略する
function getShortSentence(text){
    text = text.replaceAll("ッ","");
    text = text.replaceAll("-","");
    return text;
}
