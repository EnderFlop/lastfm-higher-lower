

document.addEventListener('DOMContentLoaded', () => {
  //Listen for all start game buttons
  const startButton = document.getElementById('start-button')
  startButton.onclick = startGame

  const buttonOne = document.getElementById('choice-one')
  const buttonTwo = document.getElementById('choice-two')

  const imageOne = document.getElementById('image-one')
  const imageTwo = document.getElementById('image-two')

  const titleOne = document.getElementById('title-one')
  const titleTwo = document.getElementById('title-two')

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
      }
    })
    runRound(guessingList)
  }

  async function runRound(elements) {
    const [choiceOne, choiceTwo] = getRandomChoices(elements)
    
    await loadImages(choiceOne["name"], choiceTwo["name"])

    const optionOnePlaycount = parseInt(choiceOne["playcount"])
    titleOne.innerText = choiceOne['name']
    titleOne.revealedValue = choiceOne['name'] + `: ${optionOnePlaycount} plays`

    const optionTwoPlaycount = parseInt(choiceTwo["playcount"])
    titleTwo.innerText = choiceTwo['name']
    titleTwo.revealedValue = choiceTwo['name'] + `: ${optionTwoPlaycount} plays`

    if (optionOnePlaycount > optionTwoPlaycount) {
      buttonOne.onclick = () => {endRound(correct = true)}
      buttonTwo.onclick = () => {endRound(correct = false)}
    } else {
      buttonOne.onclick = () => {endRound(correct = false)}
      buttonTwo.onclick = () => {endRound(correct = true)}
    }
    
    buttonOne.disabled = false
    buttonTwo.disabled = false
  }

  function getRandomChoices(elements) {
    const elemOne = elements[Math.floor(Math.random()*elements.length)]
    const elemTwo = elements[Math.floor(Math.random()*elements.length)]
    if (elemOne['name'] == elemTwo['name'] || parseInt(elemOne['playcount']) == parseInt(elemTwo['playcount'])) {
      return getRandomChoices(elements)
    }
    return [elemOne, elemTwo]
  }

  async function getImageForArtist(artistName, album, size) {
    let url;
    const params = {}
    if (album) { params["album"] = album}
    if (size) { params["size"] = size}
    await albumArt( artistName, {} ).then((data) => {url = data})
    return url;
  }

  async function loadImages(nameOne, nameTwo, album=false, size=false) {
    const urlOne = await getImageForArtist(nameOne, album, size)
    const urlTwo = await getImageForArtist(nameTwo, album, size)
    imageOne.src = urlOne
    imageTwo.src = urlTwo
  }

  async function endRound(correct) {
    if (correct) { streak += 1 }
    else { streak = 0 }

    titleOne.innerText = titleOne.revealedValue
    buttonOne.disabled = true
    titleTwo.innerText = titleTwo.revealedValue
    buttonTwo.disabled = true
    streakText.innerHTML = `Streak: ${streak}`

    await new Promise(r => setTimeout(r, 1000))
    runRound(guessingList)
  }
})

//TODO:
// if artist, show artist
// if album, get artist and album, show album
// if song, get artist and album, show album
// fetch images during downtime between rounds. first time fetching do it during setup.

//make look cool
// images are shoved down from top when hovered