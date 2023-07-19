

document.addEventListener('DOMContentLoaded', () => {
  //Listen for all start game buttons
  const startButton = document.getElementById('start button')
  startButton.addEventListener('click', startGame)

  const buttonOne = document.getElementById('option one')
  const buttonTwo = document.getElementById('option two')

  const streakText = document.getElementById('streak')

  a = "MDZiOGY3MjllNmFhYTZiOGM5YTViNTQ1MDQxMWFlMDg="
  b = atob(a)
  //pls don't break my infosec-degree-level encryption! my lastfm api key is all i have! (⋟﹏⋞)

  let guessingList
  let streak = 0

  async function startGame(event) {
    const username = document.getElementById('username').value
    const gamemode = document.querySelector('input[name="gamemode"]:checked').value
    const period = document.querySelector('input[name="period"]:checked').value
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value
    if (!username) { alert("Put your last.fm username in at the top!"); return }
    await fetch(`https://ws.audioscrobbler.com/2.0/?method=${gamemode}&user=${username}&period=${period}&limit=${difficulty}&api_key=${b}&format=json`
    ).then(res => res.json()
    ).then(x => { 
      switch (gamemode) {
        case "user.gettopartists":
          guessingList = x['topartists']['artist']
          break
        case "user.gettopalbums":
          guessingList = x['topalbums']['album']
          break
        case "user.gettoptracks":
          guessingList = x['toptracks']['track']
          break
  }})
    runRound(guessingList)
  }

  async function runRound(elements) {
    const [choiceOne, choiceTwo] = getRandomChoices(elements)
    const optionOnePlaycount = parseInt(choiceOne["playcount"])
    buttonOne.value = choiceOne['name']
    buttonOne.revealedValue = choiceOne['name'] + `: ${optionOnePlaycount} plays`

    const optionTwoPlaycount = parseInt(choiceTwo["playcount"])
    buttonTwo.value = choiceTwo['name']
    buttonTwo.revealedValue = choiceTwo['name'] + `: ${optionTwoPlaycount} plays`

    console.log(optionOnePlaycount, optionTwoPlaycount)
    if (optionOnePlaycount > optionTwoPlaycount) {
      buttonOne.onclick = () => {endRound(correct = true)}
      buttonTwo.onclick = () => {endRound(correct = false)}
    } else {
      buttonOne.onclick = () => {endRound(correct = false)}
      buttonTwo.onclick = () => {endRound(correct = true)}
    }

  }

  function getRandomChoices(elements) {
    const elemOne = elements[Math.floor(Math.random()*elements.length)]
    const elemTwo = elements[Math.floor(Math.random()*elements.length)]
    if (elemOne['name'] == elemTwo['name'] || parseInt(elemOne['playcount']) == parseInt(elemTwo['playcount'])) {
      return getRandomChoices(elements)
    }
    return [elemOne, elemTwo]
  }

  async function endRound(correct) {
    console.log("ENDROUND")
    if (correct) { streak += 1 }
    else { streak = 0 }
    buttonOne.value = buttonOne.revealedValue
    buttonOne.disabled = true
    buttonTwo.value = buttonTwo.revealedValue
    buttonTwo.disabled = true
    streakText.innerHTML = `Streak: ${streak}`
    await new Promise(r => setTimeout(r, 2000))
    buttonOne.disabled = false
    buttonTwo.disabled = false
    runRound(guessingList)
  }
})

//TODO:
//Use Spotify API to get artist image
//make look cool