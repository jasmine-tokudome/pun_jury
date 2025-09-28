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

// 審議ネコを表示する

    // 0.5秒後に審議ネコ1を表示する
    
    // 1秒後に審議ネコ2を表示する
    
    // 1.5秒後に審議ネコ3を表示する
    
    // 2秒後に結果を表示する

// 点数を審議する

// ダジャレの判定(単純に読みが一致していればOK)

// ダジャレの判定(単純な同じ単語の繰り返しはNG)

// ダジャレの判定(読みがちょっと違っていてもOK)

// 文章を解析して返す

// 単語の読みの補正(ちょっとした違いならOKとする)

// 文中の省略できる文字を省略する

// 文中の省略できる文字を省略する
