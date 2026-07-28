// ===============================
// Chess Analyzer
// Designed & Developed by
// Vasilije Dmitrović
// ===============================

let chess = new Chess();

let board;

let moves = [];

let currentMove = 0;

let engine = null;

let currentPGN = "";

const boardConfig = {

position: "start",

draggable: false,

pieceTheme:
"https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png"

};

board = Chessboard("board", boardConfig);

// -----------------------

const pgnInput =
document.getElementById("pgnInput");

const loadBtn =
document.getElementById("loadGame");

const analyzeBtn =
document.getElementById("analyze");

const evaluation =
document.getElementById("evaluation");

const moveList =
document.getElementById("moveList");

const depthSlider =
document.getElementById("depth");

const depthValue =
document.getElementById("depthValue");

depthSlider.oninput = ()=>{

depthValue.innerText =
depthSlider.value;

};

// -----------------------

loadBtn.onclick = ()=>{

currentPGN =
pgnInput.value;

if(currentPGN.trim()===""){

alert("Paste PGN first.");

return;

}

chess.reset();

let ok =
chess.loadPgn(currentPGN);

if(!ok){

alert("Invalid PGN");

return;

}

moves =
chess.history();

currentMove = 0;

chess.reset();

board.position(chess.fen());

renderMoveList();

};

// -----------------------

function renderMoveList(){

moveList.innerHTML="";

let temp =
new Chess();

for(let i=0;i<moves.length;i++){

let b =
document.createElement("button");

b.innerText =
(i+1)+". "+moves[i];

b.onclick=()=>{

goToMove(i+1);

};

moveList.appendChild(b);

temp.move(moves[i]);

}

}

// -----------------------

function goToMove(number){

chess.reset();

for(let i=0;i<number;i++){

chess.move(moves[i]);

}

currentMove=number;

board.position(chess.fen());

}
// -----------------------
// Navigation Buttons
// -----------------------

document.getElementById("startBtn").onclick = () => {

    goToMove(0);

};

document.getElementById("backBtn").onclick = () => {

    if (currentMove > 0) {

        goToMove(currentMove - 1);

    }

};

document.getElementById("nextBtn").onclick = () => {

    if (currentMove < moves.length) {

        goToMove(currentMove + 1);

    }

};

document.getElementById("endBtn").onclick = () => {

    goToMove(moves.length);

};

// -----------------------
// Play Animation
// -----------------------

let playInterval = null;

document.getElementById("playBtn").onclick = () => {

    if (playInterval != null) {

        clearInterval(playInterval);

        playInterval = null;

        return;

    }

    playInterval = setInterval(() => {

        if (currentMove >= moves.length) {

            clearInterval(playInterval);

            playInterval = null;

            return;

        }

        goToMove(currentMove + 1);

    }, 700);

  

}
// ===============================
// STOCKFISH ENGINE
// ===============================

engine = new Worker("stockfish/stockfish.js");

engine.postMessage("uci");


    let line = event.data;

    if(typeof line !== "string") return;

    if(line.includes("info")
        && line.includes("score")){

        let scoreMatch =
        line.match(/score (cp|mate) (-?\d+)/);

        if(scoreMatch){

            if(scoreMatch[1] === "cp"){

                evaluation.innerHTML =
                (scoreMatch[2]/100).toFixed(2);

            }else{

                evaluation.innerHTML =
                "Mate in " + scoreMatch[2];

            }

        }

    }

    if(line.includes("bestmove")){

        console.log(line);

    }

};

analyzeBtn.onclick = ()=>{

    engine.postMessage("ucinewgame");

    engine.postMessage("position fen " + chess.fen());

    engine.postMessage("setoption name MultiPV value 3");

    engine.postMessage("go depth " + depthSlider.value);

};

// ===============================
// MULTIPV (TOP 3)
// ===============================

const pvBoxes = document.querySelectorAll(".pv");

    const line = event.data;

    if(typeof line !== "string") return;

    // Evaluation
    if(line.includes("score")){

        const score = line.match(/score (cp|mate) (-?\d+)/);

        if(score){

            if(score[1] === "cp"){

                evaluation.innerHTML =
                (Number(score[2])/100).toFixed(2);

            }else{

                evaluation.innerHTML =
                "Mate in " + score[2];

            }

        }

    }

    // MultiPV
    if(line.includes(" multipv ")){

        const pvMatch =
        line.match(/multipv (\d+).* pv (.*)/);

        if(pvMatch){

            const index =
            Number(pvMatch[1])-1;

            if(index>=0 && index<3){

                pvBoxes[index].innerHTML =
                "<b>#"+(index+1)+"</b><br>"+pvMatch[2];

            }

        }

    }

    if(line.startsWith("bestmove")){

        console.log(line);

    }

};
// ===============================
// ENGINE STATUS
// ===============================

function clearVariations(){

    pvBoxes.forEach((box)=>{

        box.innerHTML =
        "Waiting...";

    });

}


function startAnalysis(){

    clearVariations();

    evaluation.innerHTML =
    "Analyzing...";


    engine.postMessage(
        "setoption name MultiPV value 3"
    );


    engine.postMessage(
        "position fen " + game.fen()
    );


    engine.postMessage(
        "go depth 18"
    );

}


// Dugme Analyze

analyzeBtn.onclick = function(){

    startAnalysis();

};
// ===============================
// ENGINE ARROWS
// ===============================

let arrowVisible = false;


// Prikaz strelice na tabli

function drawArrow(from, to){

    if(!arrowVisible) return;


    let start =
    document.querySelector(
        ".square-"+from
    );

}


// Uključivanje / isključivanje strelica

const arrowCheckbox =
document.getElementById("showArrows");


if(arrowCheckbox){

    arrowCheckbox.onchange = function(){

        arrowVisible =
        this.checked;


        if(!arrowVisible){

            clearArrows();

        }

    };

}



// Brisanje strelica

function clearArrows(){

    const arrows =
    document.querySelectorAll(".engine-arrow");


    arrows.forEach((a)=>{

        a.remove();

    });

}



// Priprema za najbolji potez

function showBestMove(move){


    clearArrows();


    if(!move) return;


    console.log(
        "Engine best move:",
        move
    );

 // ===============================
// DRAW ENGINE ARROWS
// ===============================

function createArrow(from, to, color = "#38bdf8"){

    clearArrows();


    const boardElement =
    document.getElementById("board");


    const boardRect =
    boardElement.getBoundingClientRect();


    const squareSize =
    boardRect.width / 8;


    function squarePosition(square){

        const file =
        square.charCodeAt(0) - 97;

        const rank =
        8 - Number(square[1]);


        return {

            x: file * squareSize + squareSize/2,

            y: rank * squareSize + squareSize/2

        };

    }


    const start =
    squarePosition(from);


    const end =
    squarePosition(to);


    const arrow =
    document.createElement("div");


    arrow.className =
    "engine-arrow";


    arrow.style.position =
    "absolute";


    arrow.style.left =
    start.x+"px";


    arrow.style.top =
    start.y+"px";


    arrow.style.width =
    Math.sqrt(
        Math.pow(end.x-start.x,2)+
        Math.pow(end.y-start.y,2)
    )+"px";


    arrow.style.height =
    "5px";


    arrow.style.background =
    color;


    arrow.style.transformOrigin =
    "0 50%";


    let angle =
    Math.atan2(
        end.y-start.y,
        end.x-start.x
    );


    arrow.style.transform =
    `rotate(${angle}rad)`;


    boardElement.appendChild(arrow);

}



// Primer korišćenja:
// createArrow("e2","e4");
}
 // ===============================
// STOCKFISH BEST MOVE ARROW
// ===============================

function parseBestMove(move){

    if(!move || move.length < 4){
        return;
    }


    let from =
    move.substring(0,2);


    let to =
    move.substring(2,4);


    if(arrowVisible){

        createArrow(
            from,
            to,
            "#38bdf8"
        );

    }

}



// Obrada najboljeg poteza

function handleEngineMessage(line){


    if(line.startsWith("bestmove")){


        let parts =
        line.split(" ");


        let best =
        parts[1];


        parseBestMove(best);


    }
// ===============================
// CONNECT ENGINE MESSAGE HANDLER
// ===============================

if(engine){

  

        const line = event.data;


        if(typeof line !== "string"){
            return;
        }


        // Najbolji potez

        if(line.startsWith("bestmove")){

            handleEngineMessage(line);

        }


        // Evaluacija

        if(line.includes("score")){


            let score =
            line.match(
                /score (cp|mate) (-?\d+)/
            );


            if(score){


                if(score[1] === "cp"){


                    evaluation.innerHTML =
                    (Number(score[2])/100)
                    .toFixed(2);


                }
                else{


                    evaluation.innerHTML =
                    "Mate in " + score[2];


                }

            }

        }

    };

}
}
 // ===============================
// SHOW / HIDE TOP 3 VARIATIONS
// ===============================

const showPVCheckbox =
document.getElementById("showPV");


if(showPVCheckbox){

    showPVCheckbox.onchange = function(){


        const visible =
        this.checked;


        pvBoxes.forEach((box)=>{


            if(visible){

                box.style.display =
                "block";

            }
            else{

                box.style.display =
                "none";

            }


        });


    };

}



// Reset varijanti pre nove analize

function resetPV(){

    pvBoxes.forEach((box,index)=>{

        box.innerHTML =
        "<b>#"+(index+1)+"</b><br>Waiting...";

    });

}
// ===============================
// DEPTH CONTROL
// ===============================

const depthSliderElement =
document.getElementById("depth");


const depthDisplay =
document.getElementById("depthValue");


// Prikaz trenutne dubine

if(depthSliderElement){

    depthSliderElement.oninput = function(){

        depthDisplay.innerHTML =
        this.value;

    };

}



// Analiza sa izabranom dubinom

function startDepthAnalysis(){

    resetPV();

    clearArrows();


    let depth =
    depthSliderElement.value;


    evaluation.innerHTML =
    "Analyzing depth " + depth + "...";


    engine.postMessage(
        "ucinewgame"
    );


    engine.postMessage(
        "setoption name MultiPV value 3"
    );


    engine.postMessage(
        "position fen " + game.fen()
    );


    engine.postMessage(
        "go depth " + depth
    );

}
// ===============================
// EVALUATION DISPLAY
// ===============================

function updateEvaluation(value){

    let number =
    Number(value);


    if(isNaN(number)){
        return;
    }


    let text;


    if(number > 0){

        text =
        "+" + number.toFixed(2);

    }
    else{

        text =
        number.toFixed(2);

    }


    evaluation.innerHTML =
    text;

}



// ===============================
// EVALUATION BAR
// ===============================

function createEvalBar(){

    if(document.getElementById("evalBar")){
        return;
    }


    const bar =
    document.createElement("div");


    bar.id =
    "evalBar";


    bar.style.height =
    "12px";


    bar.style.width =
    "100%";


    bar.style.background =
    "#111827";


    bar.style.borderRadius =
    "10px";


    bar.style.marginTop =
    "15px";


    evaluation.parentElement
    .appendChild(bar);

}


createEvalBar();



function updateEvalBar(score){

    let value =
    Math.max(
        -5,
        Math.min(5, score)
    );


    let percent =
    50 + (value * 10);


    const bar =
    document.getElementById("evalBar");


    if(bar){

        bar.style.background =
        `linear-gradient(90deg,
        #111 0%,
        #111 ${100-percent}%,
        #fff ${100-percent}%,
        #fff 100%)`;

    }

}
 // ===============================
// ANALYZE BUTTON CONNECTION
// ===============================

if(analyzeBtn){

    analyzeBtn.onclick = function(){

        if(!game){

            alert("Load PGN first.");

            return;

        }


        startDepthAnalysis();

    };

}



// ===============================
// RESET WHEN NEW GAME LOADS
// ===============================

function resetAnalyzer(){

    evaluation.innerHTML =
    "Waiting...";


    resetPV();


    clearArrows();


    moveIndex = 0;

}



// Dodaj reset posle učitavanja PGN-a

const oldLoad =
loadGameButton.onclick;


loadGameButton.onclick = function(){

    resetAnalyzer();

    oldLoad();

};
// ===============================
// MAIN STOCKFISH HANDLER
// ===============================

engine.onmessage = function(event){

    const line = event.data;


    if(typeof line !== "string"){
        return;
    }


    // -------------------------------
    // Evaluation
    // -------------------------------

    if(line.includes("score")){


        let score =
        line.match(
            /score (cp|mate) (-?\d+)/
        );


        if(score){


            if(score[1] === "cp"){


                let value =
                Number(score[2]) / 100;


                updateEvaluation(value);

                updateEvalBar(value);


            }
            else{


                evaluation.innerHTML =
                "Mate in " + score[2];


            }

        }

    }



    // -------------------------------
    // Top 3 Variations
    // -------------------------------

    if(line.includes(" multipv ")){


        let pv =
        line.match(
            /multipv (\d+).* pv (.*)/
        );


        if(pv){


            let index =
            Number(pv[1])-1;


            if(index >=0 && index <3){


                pvBoxes[index].innerHTML =
                "<b>#"+(index+1)+"</b><br>"
                +pv[2];


            }

        }

    }



    // -------------------------------
    // Best Move
    // -------------------------------

    if(line.startsWith("bestmove")){


        let best =
        line.split(" ")[1];


        parseBestMove(best);


    }


};
/* ===============================
   MOBILE RESPONSIVE DESIGN
   =============================== */

@media(max-width:900px){

    header{

        flex-direction:column;

        gap:12px;

        text-align:center;

        padding:20px;

    }


    .logo{

        font-size:22px;

    }


    .container{

        display:flex;

        flex-direction:column;

        padding:15px;

        gap:20px;

    }


    .left,
    .right{

        width:100%;

        padding:15px;

        border-radius:15px;

    }


    #board{

        width:100%;

    }


    .controls button{

        padding:10px 14px;

        font-size:14px;

    }


    textarea{

        height:140px;

    }


}


/* ===============================
   ENGINE ANIMATION
   =============================== */

.pv{

    transition:.25s;

}


.pv:hover{

    transform:translateX(5px);

}


/* ===============================
   SPACE STYLE EFFECT
   =============================== */

.left,
.right{

    animation:fadeIn .7s ease;

}


@keyframes fadeIn{

    from{

        opacity:0;

        transform:translateY(15px);

    }


    to{

        opacity:1;

        transform:translateY(0);

    }

}


/* Engine arrows */

.engine-arrow{

    z-index:20;

    pointer-events:none;

    border-radius:10px;

      }
