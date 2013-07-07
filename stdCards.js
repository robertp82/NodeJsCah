var stdCard = require("./stdCard");

var stdCardList = [];

var i = 1;
for (x in stdCard.CardEnum)
{
    for (y in stdCard.SuitsEnum) 
    {
	var card1 = new stdCard.StdCard(i, x, y);
	stdCardList.push(card1);
	i++;
    }
}
stdCardList.sort(function () {
    return 0.5 - Math.random();
})

exports.StdCards = stdCardList;