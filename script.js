const container = document.querySelector(".container")
const mainVideo = container.querySelector("video")
const videoTimeLine = container.querySelector(".video-timeline")
const progressBar = container.querySelector(".progress-bar")
const volumeBtn = container.querySelector(".volume i")
const volumeSlider = container.querySelector(".options.left input")
const skipBackward = container.querySelector(".skip-backward i")
const skipForward = container.querySelector(".skip-forward i")
const playPauseBtn = container.querySelector(".play-pause i")
const speedBtn = container.querySelector(".playback-speed span")
const speedOptions = container.querySelector(".speed-options")
const picInPicBtn = container.querySelector(".pic-in-pic span")
const fullscreenBtn = container.querySelector(".fullscreen i")
const currentVideoTime = container.querySelector(".current-time")
const videoDuration = container.querySelector(".video-duration")
let timer

const hideControls = () => {
    if(mainVideo.paused) return //if video paused do not hide (just return)
    timer = setTimeout(() => {
        container.classList.remove('show-controls')
    }, 3000)
}

container.addEventListener('mousemove', () => {
    container.classList.add('show-controls')
    clearTimeout(timer) //clear timeout to 0
    hideControls()
})


//default volume of video
mainVideo.volume = 0.5
//default slider value relating volume
volumeSlider.value = mainVideo.volume*100
//default progress var width
progressBar.style.width = '0%'

const formatTime = (time) => {
    let seconds = Math.floor(time % 60)
    let minutes = Math.floor(time / 60) % 60
    let hours = Math.floor(time / 3600)

    seconds = seconds < 10 ? `0${seconds}` : seconds
    minutes = minutes < 10 ? `0${minutes}` : minutes
    hours = hours < 10 ? `0${hours}` : hours

    if(hours == 0) { //if hours is 0 only return minutes and seconds
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`
}

//dynamic progress bar
mainVideo.addEventListener('timeupdate', e => {
    //by let {} we can get object values by keys in {}
    let { currentTime, duration } = e.target //getting current time and duration of the video
    let percent = (currentTime / duration) * 100
    progressBar.style.width = `${percent}%`
    //changing current video time
    currentVideoTime.innerHTML = formatTime(currentTime)
})

//changing video duration when data(video) is loaded
mainVideo.addEventListener('loadeddata', e => {
    videoDuration.innerHTML = formatTime(e.target.duration)
})

skipBackward.addEventListener('click', () => {
    mainVideo.currentTime -= 5 //-5 seconds
})

skipForward.addEventListener('click', () => {
    mainVideo.currentTime += 5 //+5 second
})

//play or pause button events
playPauseBtn.addEventListener('click', () => {
    //if video paused, play the video. Else pause the video
    mainVideo.paused ? mainVideo.play() : mainVideo.pause()
})

//change play button to pause icon when video is playing, and opposite
mainVideo.addEventListener('play', () => {
    playPauseBtn.classList.replace("fa-play", "fa-pause")
})

mainVideo.addEventListener('pause', () => {
    playPauseBtn.classList.replace("fa-pause", "fa-play")
})

//tried my version of function to change volume to muted
volumeBtn.addEventListener('click', () => {
    //if video is muted change to unmuted else change to muted
    mainVideo.muted = mainVideo.muted == false ? mainVideo.muted=true : mainVideo.muted=false
    if(mainVideo.muted == true){
        volumeSlider.value = 0
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    else{
        volumeSlider.value = mainVideo.volume*100
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    }
})

//slider volume changes according to its input value
volumeSlider.addEventListener('input', e => {
    mainVideo.volume = e.target.value/100 //passing slider input value as an video volume value
    if(e.target.value == 0){
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    else{
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    }
})

speedBtn.addEventListener('click', () => {
    speedOptions.classList.toggle('show') //toggle extra show class to speedOptions
})

//remove speedOptions when user click at any place at webpage
document.addEventListener('click', e => {
    if(e.target.tagName !== 'SPAN' || e.target.className !== 'material-symbols-rounded'){
        speedOptions.classList.remove('show')
    }
})

//option selecting and changing video speed
speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener('click', () => {
        mainVideo.playbackRate = option.dataset.speed //passing option dataset value as a video play speed
        speedOptions.querySelector(".active").classList.remove('active')//removing active class
        option.classList.add('active')//adding active class to selected option
    })
})

//changing video mode to picture in picture
picInPicBtn.addEventListener('click', () => {
    mainVideo.requestPictureInPicture()
})

//Keyboard buttons pressing events
document.addEventListener('keydown', e => {
    if(e.key === "Escape"){
        console.log('pressed escape')
        container.classList.remove('fullscreen')
        fullscreenBtn.classList.replace("fa-compress", "fa-expand")
        return document.exitFullscreen()
    }
    if(e.code === "Space"){
        //if video paused, play the video. Else pause the video
        mainVideo.paused ? mainVideo.play() : mainVideo.pause()
    }

})

//changing video mode to fullscreen
fullscreenBtn.addEventListener('click', () => {
    container.classList.toggle('fullscreen')
    if(document.fullscreenElement){ //if video is already in fullscreen mode

        fullscreenBtn.classList.replace("fa-compress", "fa-expand")
        return document.exitFullscreen()
    }
    fullscreenBtn.classList.replace("fa-expand", "fa-compress")
    container.requestFullscreen() //go to fullscreen mode

})

document.addEventListener('keydown', e => {
    if(e.key === "Escape"){
        console.log('pressed escape')
        container.classList.remove('fullscreen')
        fullscreenBtn.classList.replace("fa-compress", "fa-expand")
        return document.exitFullscreen()
    }
})


videoTimeLine.addEventListener('click', e => {
    let timelineWidth = e.target.clientWidth
    //updating video current time according to video duration and mouse position
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration    //e.offsetX gives mouse x position
})

videoTimeLine.addEventListener('mousemove', e => {
    const progressTime = videoTimeLine.querySelector("span")
    let offsetX = e.offsetX
    progressTime.style.left = `${offsetX}px`
    let timelineWidth = videoTimeLine.clientWidth
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration
    progressTime.innerHTML = formatTime(percent)
})

//modified event when clicking to videoTimeLine and dragging user can drag the whole screen

videoTimeLine.addEventListener('mousedown', () => { //calling draggableProgressBar function on mousemove event
    document.addEventListener('mousemove', draggableProgressBar)
})

document.addEventListener('mouseup', () => { //calling draggableProgressBar function on mousemove event

    document.removeEventListener('mousemove', draggableProgressBar)
})

const draggableProgressBar = e => {
    e.preventDefault()
    let timelineWidth = e.target.clientWidth
    progressBar.style.width = `${e.offsetX}px`
    //updating video current time according to video duration and mouse position
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration    //e.offsetX gives mouse x position
    currentVideoTime.innerHTML = formatTime( mainVideo.currentTime)
}











