

document.addEventListener('DOMContentLoaded', () => {
  //Listen for all start game buttons
  const startButton = document.getElementById('start button')
  startButton.addEventListener('click', startGame)

  const optionOne = document.getElementById('option one')
  optionOne.addEventListener('click', optionSelect)
  const optionTwo = document.getElementById('option two')
  optionTwo.addEventListener('click', optionSelect)

  const streakText = document.getElementById('streak')

  API_KEY = ""

  let elementsList
  let tempFunc1
  let tempFunc2
  let streak = 0

  async function startGame(event) {
    const username = document.getElementById('username').value
    const gamemode = document.querySelector('input[name="gamemode"]:checked').value
    const period = document.querySelector('input[name="period"]:checked').value
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value
    if (!username || !gamemode || !period) {return}
    await fetch(`http://ws.audioscrobbler.com/2.0/?method=${gamemode}&user=${username}&period=${period}&limit=${difficulty}&api_key=${API_KEY}&format=json`
    ).then(res => res.json()
    ).then(x => { 
      switch (gamemode) {
        case "user.gettopartists":
          elementsList = x['topartists']['artist']
          break
        case "user.gettopalbums":
          elementsList = x['topalbums']['album']
          break
        case "user.gettoptracks":
          elementsList = x['toptracks']['track']
          break
  }})
    runRound(elementsList)
  }

  function runRound(elements) {
    const [elemOne, elemTwo] = selectElements(elements)
    optionOne.value = elemOne['name']
    optionOne.revealedValue = elemOne['name'] + `: ${elemOne["playcount"]} plays`
    optionTwo.value = elemTwo['name']
    optionTwo.revealedValue = elemTwo['name'] + `: ${elemTwo["playcount"]} plays`
    optionOne.options = [elemOne, elemTwo]
    optionTwo.options = [elemTwo, elemOne]
  }

  function selectElements(elements) {
    const elemOne = elements[Math.floor(Math.random()*elements.length)]
    const elemTwo = elements[Math.floor(Math.random()*elements.length)]
    if (elemOne['name'] == elemTwo['name'] || parseInt(elemOne['playcount']) == parseInt(elemTwo['playcount'])) {
      return selectElements(elements)
    }
    return [elemOne, elemTwo]
  }

  async function optionSelect(event) {
    const [selected, other] = event.currentTarget.options
    if (parseInt(selected['playcount']) > parseInt(other['playcount'])) {
      streak += 1
    }
    else {
      streak = 0
    }
    optionOne.value = optionOne.revealedValue
    optionOne.disabled = true
    optionTwo.value = optionTwo.revealedValue
    optionTwo.disabled = true
    streakText.innerHTML = `Streak: ${streak}`
    await new Promise(r => setTimeout(r, 2000))
    optionOne.disabled = false
    optionTwo.disabled = false
    runRound(elementsList)
  }
  
})

//TODO:
//Use Spotify API to get artist image
//make look cool