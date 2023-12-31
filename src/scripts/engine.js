const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score_points'),
  },
  cardSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCards: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card'),
  },
  playerSides: {
    player1: 'player-cards',
    player1Box: document.querySelector('#player-cards'),
    computer: 'computer-cards',
    computerBox: document.querySelector('#computer-cards'),
  },
  actions: {
    button: document.getElementById('next-duel'),
  },
}

const pathImages = './src/assets/icons/'

const cardData = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: pathImages + 'dragon.png',
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: pathImages + 'magician.png',
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: pathImages + 'exodia.png',
    winOf: [0],
    loseOf: [1],
  },
]

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex].id
}

async function removeAllCardsImages() {
  const { computerBox, player1Box } = state.playerSides
  
  let imgElements = computerBox.querySelectorAll('img')
  imgElements.forEach((img) => img.remove())
  
  imgElements = player1Box.querySelectorAll('img')
  imgElements.forEach((img) => img.remove() )
}

async function checkDuelResults(cardId, computerCardId) {
  let duelResults = "DRAW"
  let playerCard = cardData[cardId]

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "WIN"
    state.score.playerScore++
  }
  
  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "LOSE"
    state.score.computerScore++
  }

  if (duelResults !== 'DRAW') {
    await playAudio(duelResults)
  }

  return duelResults
}

async function updateScore(){
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(duelResults){
  state.actions.button.innerText = duelResults
  state.actions.button.style.display = "block"
}

async function setCardsField(cardId) {
  await removeAllCardsImages()

  let computerCardId = await getRandomCardId()

  state.fieldCards.player.style.display = 'block'
  state.fieldCards.computer.style.display = 'block'

  state.fieldCards.player.style.backgroundImage = `url(${cardData[cardId].img})`  
  state.fieldCards.computer.style.backgroundImage = `url(${cardData[computerCardId].img})`

  let duelResults = await checkDuelResults(cardId, computerCardId)

  await updateScore()
  await drawButton(duelResults)
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement('img')
  cardImage.setAttribute('height', '100px')
  cardImage.setAttribute('alt', 'card')
  cardImage.setAttribute('src', `${pathImages}card-back.png`)
  cardImage.setAttribute('data-id', idCard)
  
  if (fieldSide === state.playerSides.player1) {
    cardImage.classList.add('card')
    
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute('data-id'))
    })

    cardImage.addEventListener('mouseover', () => {
      state.cardSprites.avatar.style.backgroundImage = `url(${cardData[idCard].img})`
      state.cardSprites.name.innerText = cardData[idCard].name
      state.cardSprites.type.innerText = `Attribute: ${cardData[idCard].type}`
    })
  }

  return cardImage
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++){
    const randomIdCard = await getRandomCardId()
    const cardImage = await createCardImage(randomIdCard, fieldSide)

    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function resetDuel() {
  state.cardSprites.avatar.style.backgroundImage = ""
  state.cardSprites.name.innerText = ""
  state.cardSprites.type.innerText = ""
  
  state.actions.button.style.display = "none"

  state.fieldCards.player.style.backgroundImage = ""
  state.fieldCards.computer.style.backgroundImage = ""

  init()
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  audio.play()
}

function init (){
  drawCards(5, state.playerSides.player1)
  drawCards(5, state.playerSides.computer)

  const bgm = document.getElementById('bgm')
  bgm.volume = 0.05
  bgm.play()
}

init()
