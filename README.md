#JS实现“21点”扑克牌小游戏

## 1.概况
     
一个21点游戏，玩家可以和庄家对战。

游戏规则为，一副去掉大小王的扑克牌，庄家给玩家发两张牌，给自己也发两张牌，一张朝上，一张朝下。

点数规则为：

```
  A     ...  1点或11点，由玩家自定
  2-10  ...  牌面点数
  J-K   ...  10点
```


玩家有1000金币的现金，每次可以下注50的倍数。

如果庄家的底牌是A，则玩家可以选择是否保险。

保险会是赌额的一半。如果接下来庄家的另一张牌的点数是10点，则玩家直接获胜，保险金退换，并且能或者两倍赌额的赌金。如果不保险，则和下面的玩法一样。

如果庄家底牌不是A，则玩家可以选择Hit（继续抽牌），Stand（让庄家开牌）。

如果此时玩家的点数大于21，则玩家Bust（爆），输掉本局，赌金被扣除。

如果玩家的点数小于21，则换庄家开牌，庄家如果小于玩家的牌，可以继续抽牌，直到Bust，或者大于等于玩家。庄家Bust，则玩家获胜，得到两倍赌金。庄家如果和玩家点数一样，则为Push，赌金退还。

如果玩家的点数恰好为21，则直接获胜，得到两倍赌金。


## 2.操作介绍

![](http://ww3.sinaimg.cn/large/81fc3c30gw1f2s4es0hayj20lb0ipwh2.jpg)

```
Hit:继续抽牌

Stand:开牌。

Init:新开一局游戏。

New:重置游戏。

Balance:余额

Bet：赌金

+/-：增加或减少赌金，只能是50的倍数

Insure：保险

Deal：成交。
```

每次new一个game，就可以有1000余额的赌金。

每次init，就可以新开一局牌。

如果不选deal的话，不论输赢，都不会增加或者减少余额。只有选了deal，赌金才会参与游戏。

deal以后，不允许再修改赌金，直到stand出结果。

## 3.主要设计思路

### 3.1一张牌Card对象的构造：

```
function Card() {
    this.PointNum =Math.floor(Math.random() * 13 + 1);
    this.SuitNum=Math.floor(Math.random() * 4 + 1);
}
Card.prototype.Back=function(){ ... }
Card.prototype.createCard=function(){ ... }
```

首先`PointNum`和`SuitNum`随机生成，`PointNum`表示了这张牌的点数，1代表A，2-10代表各自的点数，11-13代表J,Q,K。`SuitNum`代表牌的种类，0，1，2，3代表黑红草方。

`Back`方法显示这张牌的背面（暗牌）
`createCard`把这张牌创建出来。

牌的创建使用了`CSS Sprite`
![](http://ww1.sinaimg.cn/large/81fc3c30gw1f2s4wdcekqj20go0740va.jpg)

根据牌的点数和黑红草方来绘制图片。样式借鉴了Github上一个斗地主的代码。


### 3.2 玩家对象

```
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

```

然后玩家对象和庄家对象都继承`people`对象。玩家对象还需要余额和赌金的属性

```
function Player()   //玩家对象
{
    People.apply(this);   //继承People
    this.balanceNum=1000; //余额
    this.betNum=0;          //赌金
}

function Dealer()  //庄家
{
    People.apply(this);
}

```

### 3.3 hit

```
function hit(){
    if(!player.isBust()&&!player.isBlackJack()&&winner==-2) {
        var tempCard = new Card();   //创建一张新牌
        player.cardArr.push(tempCard); //压入手上牌的数组中
        playerCardDom.innerHTML += tempCard.createCard();
        playerScore.innerHTML = Score(player.cardArr);
    }
    if(player.isBust())
    {
        lost();
        winLos.innerHTML="BUST";
    }
    if(player.isBlackJack())
    {
        winLos.innerHTML="BlackJack";
    }
}

```

hit方法的设计思路是，如果玩家没有爆，或者没有21点，那么创建一张新牌，压入玩家的手上牌的数组中。
如果爆了，或者已经21点了的话，就不能再抽牌了。

### 3.4 Stand

```
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

```

## 4.Demo

[Demo地址](https://github.com/adspoing/blackjack)



