function $(id)
{
    return document.getElementById(id);
}
/*get the dom */
var dealerCardDom=$('dealer-card');
var dealerScore=$('dealer-score');
var playerCardDom=$('player-card');
var playerScore=$('player-score');
/*get the button*/
var hitBtn=$('hit');
var standBtn=$('stand');
var initBtn=$('init');
var winLos=$('winLos');
var plusBtn=$('plus');
var reduceBtn=$('reduce');
var insureBtn=$('insure');
var dealBtn=$('deal');
var newBtn=$('newgame');
var insureBtn=$('insure');

/*get the balance&bet num*/
var balance=$('dollar1');
var bet=$('dollar2');

/*init card*/
var dcard1;
var dcard2;
var pcard1;
var pcard2;

/*init object*/
var dealer=new Dealer();
var player=new Player();

/* whether deal*/
var isdeal=0;

/* event*/
var EventUtil = {
    addHandler: function(element,type,handler){
        if(element.addEventListener){
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type]=handler;
        }
    }
};

/* add event*/
EventUtil.addHandler(hitBtn,'click',hit);
EventUtil.addHandler(standBtn,'click',stand);
EventUtil.addHandler(initBtn,'click',init);
EventUtil.addHandler(plusBtn,'click',plus);
EventUtil.addHandler(insureBtn,'click',insure);
EventUtil.addHandler(reduceBtn,'click',reduce);
EventUtil.addHandler(dealBtn,'click',deal);
EventUtil.addHandler(newBtn,'click',newgame);
EventUtil.addHandler(insureBtn,'click',insure);

/* Object card*/
function Card() {
    this.PointNum =Math.floor(Math.random() * 13 + 1);
    this.SuitNum=Math.floor(Math.random() * 4 + 1);
}
Card.prototype.Back=function(){
        return "<div class='card' id='back'></div>";
}
Card.prototype.createCard=function(){
        var suit, point, suitString;
        var result = "<div class='card rank";
        if (this.PointNum <= 10 && this.PointNum != 1) {
            point = this.PointNum;
        }
        else if (this.PointNum == 11) {
            point = "J";
        }
        else if (this.PointNum == 12) {
            point = "Q";
        }
        else if (this.PointNum == 13) {
            point = "K";
        }
        else {
            point = "A";
        }
        switch (this.SuitNum) {
            case 1:
                suit = 'S';
                suitString = '&spades';
                break;
            case 2:
                suit = 'H';
                suitString = '&hearts';
                break;
            case 3:
                suit = 'C';
                suitString = '&clubs';
                break;
            case 4:
                suit = 'D';
                suitString = '&diams';
                break;
        }
        return result + point + suit + "'>" + point + " <br/> " + suitString + ";</div>";
};

/* object people*/
function People(){
    this.cardArr=[];                    //玩家手上牌的数组
    this.score=function(){
        return Score(this.cardArr);    //返回玩家手上牌的点数和
    }
    this.isBust=function(){
        return Score(this.cardArr)>21;  //判断是否爆
    }
    this.isBlackJack=function(){
        return (Score(this.cardArr)==21);  //判断是否黑杰克
    }
}

/*object player*/
function Player()  //玩家
{
    People.apply(this);   //继承People
    this.balanceNum=1000; //余额
    this.betNum=0;          //赌金
}

/*object dealer*/
function Dealer()  //庄家
{
    People.apply(this);
}


/* count the score of  cards*/
var Score=function(card){
        var result=0;
        var hasA=false;
        for(var i=0;i<card.length;i++)
        {
            if(card[i].PointNum==1)
              hasA=true;
            if(card[i].PointNum<=10)
            result+=card[i].PointNum;
            else
            result+=10;
        }
        if(hasA&&result<=11)
          return result+10;
       return result;
}
/* init a game*/
function init(){
    winLos.innerHTML="";
    dealerScore.innerHTML=0;
    dcard1=new Card();
     dcard2=new Card();
     pcard1=new Card();
     pcard2=new Card();
    dealer.cardArr=[];
    player.cardArr=[];
    winner=-2;
    dealer.cardArr.push(dcard1);
    dealer.cardArr.push(dcard2);
    player.cardArr.push(pcard1);
    player.cardArr.push(pcard2);
    dealerCardDom.innerHTML=dcard1.createCard()+dcard2.Back();
    playerCardDom.innerHTML=pcard1.createCard()+pcard2.createCard();
    playerScore.innerHTML=player.score();
    bet.style.color="#000";
    balance.innerHTML = player.balanceNum;
    bet.innerHTML = player.betNum;
    isdeal=0;
}

function hit(){
    if(!player.isBust()&&!player.isBlackJack()&&winner==-2) {
        var tempCard = new Card();   //创建一张新牌
        player.cardArr.push(tempCard); //压入手上牌的数组中
        playerCardDom.innerHTML += tempCard.createCard();
        playerScore.innerHTML = Score(player.cardArr);
    }
    if(player.isBust())  //是否爆炸
    {
        lost();
        winLos.innerHTML="BUST";
    }
    if(player.isBlackJack()) //是否21点
    {
        winLos.innerHTML="BlackJack";
    }
}

/*whether push*/
function isPush() {
    return (player.score()==dealer.score())
}

/*winner
 * 0 represent dealer
 * 1 represent player
 * -1 represent push
 * -2 no result
 * */
var winner=-2;


/* win the game*/
function win(){
    if(isdeal) {
        var Bet = player.betNum;
        player.balanceNum += 2 * Bet;
        player.betNum = 0;
        balance.innerHTML = player.balanceNum;
        bet.innerHTML = player.betNum;
    }
}

/* lose the game*/
function lost(){
    if(isdeal) {
        player.betNum = 0;
        bet.innerHTML = player.betNum;
    }
}

/*show the result*/
function result(){
    if(dealer.isBust())  //dealer是否爆
    {
        winner=1;
        winLos.innerHTML = "YOU WIN";
        win();
    }
    else {
        if(!isPush()) {
            winner = (dealer.score() > player.score()) ? 0 : 1;
            if (winner) {
                winLos.innerHTML = "YOU WIN";
                win();
            }
            else {
                lost();
                winLos.innerHTML = "YOU LOSS";
            }
        }
        else
        {
            winner=-1;
            player.balanceNum+=player.betNum;
            player.betNum=0;
            balance.innerHTML=player.balanceNum;
            bet.innerHTML = +player.betNum;;
            winLos.innerHTML = "Push";
        }
    }
}


function stand(){
    if(!player.isBust()&&winner==-2) {
        /*先把背着的牌翻开来*/
        var dDom = "";
        for (x in dealer.cardArr) {
            dDom += dealer.cardArr[x].createCard();
        }
        dealerCardDom.innerHTML = dDom;
        var dScore = dealer.score();

        /*然后判断一下玩家是否已经21点了,如果是,则直接赢*/
        if(player.isBlackJack()&&!dealer.isBlackJack())
        {
            win();
            winLos.innerHTML="BlackJack";
            dealerScore.innerHTML = dScore;
        }else {
            /*如果玩家不是21点,那么就需要对庄家的分数进行判断*/
            function addCard() {
                var tcard = new Card();
                dealer.cardArr.push(tcard);
                dDom += tcard.createCard();
                dScore = dealer.score();
                dealerCardDom.innerHTML = dDom;
                var t = setTimeout(addCard, 1000);
                dealerScore.innerHTML = dScore;
                /*如果分数大于玩家分数了,就不继续抽牌了*/
                if (dScore >= player.score()) {
                    clearTimeout(t);
                    result();
                }
            };
            /*如果此时庄家的分数小于玩家分数,那么庄家继续抽牌*/
            if (dScore < player.score()) {
                setTimeout(addCard, 1000);
            }
            /*否则就显示结果*/
            else {
                result();
            }
            dealerScore.innerHTML = dScore;
        }
    }
}

/* plus the bet num*/
function plus()
{
    if(player.balanceNum>0&&!isdeal) {
        balance.innerHTML = player.balanceNum -= 50;
        bet.innerHTML = player.betNum += 50;
    }
}
/* reduce the bet num*/
function reduce()
{
    if(player.betNum>0&&!isdeal) {
        balance.innerHTML = player.balanceNum += 50;
        bet.innerHTML = player.betNum -= 50;
    }
}

/* add the insurance*/
function insure(){
    if(dcard1.PointNum==1){
        var insurance = player.betNum / 2;
        isdeal=1;

        var dDom = "";
        for (x in dealer.cardArr) {
            dDom += dealer.cardArr[x].createCard();
        }
        dealerCardDom.innerHTML = dDom;
        var dScore = dealer.score();
        dealerScore.innerHTML = dScore;


        balance.innerHTML = player.balanceNum -= insurance;

        if(dcard2.PointNum>=10) {
            player.balanceNum +=insurance;
            win();
        }
        else
        {
            stand();
        }
    }
}

/* deal the game*/
function deal(){
    if(isdeal==0) {
        isdeal = 1;
        bet.style.color="#890000"
    }
}

/*new one game*/
function newgame(){
    dealer=new Dealer();
    player=new Player();
    init();
}
init();