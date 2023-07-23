let blackjackGame={
    'you':{'scoreSpan':'#yourResult', 'div':'#yourBox', 'score':0},
    'dealer':{'scoreSpan':'#dealerResult', 'div':'#dealerBox', 'score':0},
    'cards':['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap':{'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'K':10, 'J':10, 'Q':10, 'A':[1, 11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isHold':false,
    'turnsOver':false,
};

const YOU=blackjackGame['you']
const DEALER=blackjackGame['dealer']
const hitSound=new Audio('sounds/swish.m4a');
const winSound=new Audio('sounds/cash.mp3');
const lossSound=new Audio('sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click', blackjackHit);
document.querySelector('#hold').addEventListener('click', blackjackHold);
document.querySelector('#deal').addEventListener('click', blackjackDeal);

function blackjackHit(){
    if(blackjackGame['isHold']===false){
    let card=randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    }
}

function randomCard(){
    let randomIndex=Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer){
    if(activePlayer['score']<=21){
    let cardImage=document.createElement('img');
    cardImage.src=`images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
    }
}

function blackjackDeal(){
    if(blackjackGame['turnsOver']===true){
        blackjackGame['isHold']=false;

    let yourImages=document.querySelector('#yourBox').querySelectorAll('img');
    let dealerImages=document.querySelector('#dealerBox').querySelectorAll('img');

    for(i=0;i<yourImages.length;i++){
        yourImages[i].remove();
    }
    for(i=0;i<dealerImages.length;i++){
        dealerImages[i].remove();
    }
    YOU['score']=0;
    DEALER['score']=0;
    document.querySelector('#yourResult').textContent=0;
    document.querySelector('#dealerResult').textContent=0;

    document.querySelector('#yourResult').style.color='#ffffff';
    document.querySelector('#dealerResult').style.color='#ffffff';

    document.querySelector('#blackjackResult').textContent="Let's Play";
    document.querySelector('#blackjackResult').style.color='#ffffff';
    blackjackGame['turnsOver']=true;
    }
}

function updateScore(card, activePlayer){
    if(card==='A'){
    //If Adding 11 Keeps Me Below 21, Add 11, Otherwise, Add 1
    if(activePlayer['score']+=blackjackGame['cardsMap'][card][1]<=21){
        activePlayer['score']+=blackjackGame['cardsMap'][card][1];
    }
    else{
        activePlayer['score']+=blackjackGame['cardsMap'][card][0];
    }
}
    else{
    activePlayer['score']+=blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if (activePlayer['score']>21){
        document.querySelector(activePlayer['scoreSpan']).textContent='BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color='red';
    }
    else{
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve, ms));
}

async function blackjackHold(){
    blackjackGame['isHold']=true;

    while(DEALER['score']<16 && blackjackGame['isHold']===true){
    let card=randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
    }

    blackjackGame['turnsOver']=true;
    let winner= computeWinner();
    showResult(winner);
}

//Compute winner and return who just won.
//Update wins, losses, and draws.
function computeWinner(){
    let winner;
    if(YOU['score']<=21){
        //Condition: higher score than dealer or when dealer busts but you're winner
        if(YOU['score']>DEALER['score'] || (DEALER['score']>21)){
            blackjackGame['wins']++;
            winner=YOU;
        }

        else if(YOU['score']<DEALER['score']){
            blackjackGame['losses']++;
            winner=DEALER;
        }

        else if(YOU['score']===DEALER['score']){
            blackjackGame['draws']++;
        }
    }

        //Condition- you bust but dealer doesn't
        else if(YOU['score']>21 && DEALER['score']<=21){
            blackjackGame['losses']++;
            winner=DEALER;
        }

        //Comdition- if both you and dealer busted.
        else if(YOU['score']>21 && DEALER['score']>21){
            blackjackGame['draws']++;
        }
        console.log(blackjackGame);
        return winner;
}

function showResult(winner){
    let message, messageColor;

    if(blackjackGame['turnsOver']===true){

    if(winner===YOU){
        document.querySelector('#win').textContent=blackjackGame['wins'];
        message='You Won!';
        messageColor='green';
        winSound.play();
    }

    else if(winner===DEALER){
        document.querySelector('#loss').textContent=blackjackGame['losses'];
        message='You Lost!';
        messageColor='red';
        lossSound.play();
    }

    else{
        document.querySelector('#draw').textContent=blackjackGame['draws'];
        message='You Drew!';
        messageColor='black';
    }
    document.querySelector('#blackjackResult').textContent=message;
    document.querySelector('#blackjackResult').style.color=messageColor;
}
}