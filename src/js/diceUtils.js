//Ritorna il numero attuale di dadi
const countDice = (diceList) => {
    let numberOfDice = 0;
    if(diceList !== null) {
        for(let i=0; i<diceList.length; i++){if(diceList[i] !== "add" && diceList[i] !== "remove" && diceList[i] !== "none") numberOfDice++}
    }
    return numberOfDice;
}

export default countDice;