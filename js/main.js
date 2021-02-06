// EVENT LISTENERS
document.querySelector('#deck').addEventListener('click', shuffleDeck)
document.querySelector('#draw').addEventListener('click', getCard)

// VARIABLES
let deckID = ''
let playerScore = 0
let botScore = 0
const handResult = document.querySelector('#hand-result')


// FETCH DECK
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      deckID = data.deck_id
    })
    .catch(err => {
        console.log(`error ${err}`)
    });


function shuffleDeck(){
  playerScore = 0
  botScore = 0
  document.querySelector('#player-card').src = ''
  document.querySelector('#bot-card').src = ''
  handResult.innerText = ''
  document.querySelector('#player-score').innerText = playerScore
  document.querySelector('#bot-score').innerText = botScore

  const url = 'https://deckofcardsapi.com/api/deck/'+deckID+'/shuffle/'  

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        deckID = data.deck_id
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
  console.log(deckID)
  return deckID
}

function getCard(){
  const url = 'https://deckofcardsapi.com/api/deck/'+deckID+'/draw/?count=2' 
  let player, bot
  
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        document.querySelector('#player-card').src = data.cards[0].image
        document.querySelector('#bot-card').src = data.cards[1].image

        player = data.cards[0].value
        bot = data.cards[1].value

        handResult.innerText = checkWin(player, bot)

        if(checkWin(player,bot) === "WIN!") playerScore++
        if(checkWin(player,bot) === "LOSE!") botScore++

        document.querySelector('#player-score').innerText = playerScore
        document.querySelector('#bot-score').innerText = botScore

        if (data.remaining === 0) {
          handResult.innerText = "Game Over! "
          if (playerScore > botScore) handResult.innerText += " You WIN!"
          else if (playerScore === botScore) handResult.innerText += " You TIE!"
          else handResult.innerText += " You LOSE!"
          handResult.innerText += " Shuffle Deck to play again!"
        }  

      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function checkWin(player, bot){
  player = Number(convertValue(player))
  bot = Number(convertValue(bot))
  if (player > bot) return "WIN!"
  else if (player < bot) return "LOSE!"
  else return "TIE!"
}

function convertValue(card){
  if (Number(card) > 1 && Number(card) < 11) return card
  if (card === "JACK") return 11
  if (card === "QUEEN") return 12
  if (card === "KING") return 13
  if (card === "ACE") return 14
}