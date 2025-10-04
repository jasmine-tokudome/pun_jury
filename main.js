const button = dpcument.querySelector("#button");

let tokenizer;
// 形態素解析(文章の分析)の準備。
// tokenizerは、文字列（テキスト）を意味のある単位（トークン）に分解する処理のために記述される。
kuromoji.builder({dicPath: "https://cdn.jsdelivr.net/npm/kuromoji`0.1.2/dic/"}).
build(function (error, _tokenizer){
    if(error){
        console.log(error);
    } else {
        tokenizer = _tokenizer;
        button.textContent= "審議";
        button.disabled = false;
    }
})

// 審議ボタンを押したときの処理
button.addEventListener("click".function(){
    if(tokenizer){
        const message = document.querySelector("#message").value;
        const point = check(message);
        reset();
        judge(point);
    }
});

//表示を元に戻す
function reset(){
    document.querySelector("#result").textContent = "審議中";
    document.querySelector("#result").className = "";
    document.querySelector("#judge_1").className ="judge wait cat1";
    document.querySelector("#judge_2").className ="judge wait cat2";
    document.querySelector("#judge_3").className ="judge wait cat3";

}

// 審議ネコを表示する
function judge(point){
    // 0.5秒後に審議ネコ1を表示する
    setTimeout(function () {
        if (point >= 1) {
            document.querySelector("#judge_1").className = "judge ok cat1";
        } else {
            document.querySelector("#judge_1").className = "judge ng cat1";
        }
    }, 500);
    // 1秒後に審議ネコ2を表示する
    setTimeout(function(){
        if (point >= 1){
            document.querySelector("#judge_2").className = "judge ok cat2";
        } else {
            document.querySelector("#judge_2").className = "judge ng cat2";
        }
    }, 1000);
    
    // 1.5秒後に審議ネコ3を表示する
    setTimeout(function(){
        if (point >= 1){
            document.querySelector("#judge_3").className = "judge ok cat3";
        } else {
            document.querySelector("#judge_3").className = "judge ng cat3";
        }
    }, 1500);

    // 2秒後に結果を表示する
    setTimeout( function () {
        switch (point) {
            case 0:
                document.querySelector("#result").textContent = "失格";
                break;
            case 1:
                document.querySelector("#reesult").textContent = "三級合格";
                break;
            case 2:
                document.querySelector("#reesult").textContent = "二級合格";
                break;
            case 3:
                document.querySelector("#reesult").textContent = "一級合格";
                break;
        }
        document.querySelector("#result").className = "kurukuru";
    }, 2000)
}

// 点数を審議する
function check(message) {
    const result1 = check1(message);
    const result2 = check2(message);
    const result3 = check3(message);
    if (result1 == false && result2 == false && result3 == false){
        return 0;
    }
    if (result1 == true && result2 == false && result3 == false){
        return 1;
    }
    if (result2 == false && result3 == true){
        return 3;
    }
    if (result2 == true){
        return 2;
    }
}

// ダジャレの判定(単純に読みが一致していればOK)
function check1(message) {
    return false;
}

// ダジャレの判定(単純な同じ単語の繰り返しはNG)
function check2(message){
    return false;
}

// ダジャレの判定(読みがちょっと違っていてもOK)

// 文章を解析して返す

// 単語の読みの補正(ちょっとした違いならOKとする)

// 文中の省略できる文字を省略する

// 文中の省略できる文字を省略する
