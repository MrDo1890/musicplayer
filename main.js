// Slider start
function slider(sliderElement,sliderCfg) {
    // sliderCfg = {min, max, step, callback}
    sliderElement.min = sliderCfg.min
    sliderElement.max = sliderCfg.max
    sliderElement.step = sliderCfg.step
    bindEvent(sliderElement, 'input', function (event) {
        this.style.backgroundSize = this.value + '% 100%'
        if (typeof(sliderCfg.callback) === "function"){
            sliderCfg.callback(this)
        }
    })
}
// Slider end

// Main start
function rotateCD() {
    let cd = e('.rotated-cd')
    if(cd.interval === undefined) {
        cd.interval = null
    }
    if(cd.degree === undefined) {
        cd.degree = 0
    }
    e("#id-gan").classList.add('gan-playing')
    clearInterval(cd.interval)
    cd.interval = setInterval(function() {
        cd.degree = (cd.degree + 0.25) % 360
        cd.style.transform = `rotateZ(${cd.degree}deg)`
    }, 20)
}
function stopRotateCD() {
    let cd = e('.rotated-cd')
    clearInterval(cd.interval)
    e("#id-gan").classList.remove('gan-playing')
}
function resetCD() {
    let cd = e('.rotated-cd')
    cd.style.transform = `rotateZ(0deg)`
    cd.degree = 0
}
function changeInfo(musicName) {
    let coverPath = `docs/cover/${musicName}.jpg`
    e('.current-img').src = coverPath
    e('.cd-cover').src = coverPath
    e('.music-name').innerText = musicName.split('-')[0]
    e('.music-author').innerText = musicName.split('-')[1]
    e('.info-music-name').innerText = musicName
    e('.lrc').innerText = lrc[musicName]
}
// Main end

// Control Bar start
// Play control
function cutMusic(path) {
    let audio = e('#id-audio')
    localStorage.previous = audio.getAttribute('src')
    audio.src = path
    stopRotateCD()
    resetCD()
    changeInfo(path.slice(9,-4))
}

function musicControl() {
    let audio = e('#id-audio')
    bindEvent(audio, 'canplay', function () {
        audio.play()
        if (e('.fa-play') != null){
            e('.fa-play').className = 'fa fa-pause fa-lg'
        }
        rotateCD()
    })
    bindEvent(audio, 'ended', function () {
        e('.fa-pause').className = 'fa fa-play fa-lg'
        e('.fa-step-forward').click()
        stopRotateCD()
    })
    bindEvent(e('.music-control'), 'click', function (event) {
        let target = event.target
        if (target.classList.contains('fa-play')){
            rotateCD()
            audio.play()
            target.classList.remove('fa-play')
            target.classList.add('fa-pause')
        } else if(target.classList.contains('fa-pause')){
            audio.pause()
            stopRotateCD()
            target.classList.remove('fa-pause')
            target.classList.add('fa-play')
        } else if(target.classList.contains('fa-step-backward')){
            cutMusic(localStorage.previous)
        } else if (target.classList.contains('fa-step-forward')){
            let mode = e('.mode').dataset.mode
            let path = audio.getAttribute('src')
            let list = srcList()
            if (mode === '0'){
                for (var i = 0; i < list.length; i++) {
                    if ((path === list[i]) && (i != (list.length - 1))){
                        cutMusic(list[i + 1])
                        break
                    }
                }
            } else if(mode === '1') {
                audio.currentTime = 0;
                audio.play()
            } else if(mode === '2') {
                for (var i = 0; i < list.length; i++) {
                    if ((path === list[i])){
                        cutMusic(list[(i + 1) % list.length])
                        break
                    }
                }
            } else if(mode === '3') {
                let index = Math.floor(Math.random() * list.length)
                cutMusic(list[index])
            }
        }
    })
}

function clickModeButton() {
    let modes = ['order', 'circle', 'listcircle', 'random']
    let modeButton = e('.mode')
    bindEvent(modeButton, 'click',function(){
        let mode = parseInt(modeButton.dataset.mode)
        let nextMode = (mode + 1) % 4
        modeButton.className = "mode " + modes[nextMode]
        modeButton.dataset.mode = nextMode
    })
}
// Time control
function timeFormat(rawTime) {
    let time = Math.round(rawTime)
    let minate = Math.floor(time / 60) > 9 ? Math.floor(time / 60) : ('0'+ Math.floor(time / 60))
    let second = time % 60 > 9 ? (time % 60) : ('0'+ (time % 60))
    return `${minate}:${second}`
}
function showTime() {
    let currentTime = e(".current-time")
    let durationTime = e(".duration-time")
    let audio = e("#id-audio")
    let timeSlider = e('.time-range input')
    bindEvent(audio, 'canplay', function () {
        setInterval(function () {
            currentTime.innerText = timeFormat(audio.currentTime)
            timeSlider.value = audio.currentTime / audio.duration * 100
            timeSlider.style.backgroundSize = timeSlider.value + '% 100%'
        }, 500)
        durationTime.innerText = timeFormat(audio.duration)
    })
}
// Volume control
function volumeControl(sliderElement) {
    let value = Number(sliderElement.value)
    let audio = e('#id-audio')
    let vol = e('#id-vol')
    audio.volume = value / 100
    if (value === 0){
        vol.className = "fa fa-volume-off fa-lg"
    } else if(value < 50) {
        vol.className = "fa fa-volume-down fa-lg"
    }   else if(value >= 50) {
        vol.className = "fa fa-volume-up fa-lg"
    }
    localStorage.vol = JSON.stringify(value)
}

function setVol(value) {
    // value为整型
    let volumeSlider = e('#id-vol-range input')
    let audio = e('#id-audio')
    let vol = e('#id-vol')
    volumeSlider.value = value
    volumeSlider.style.backgroundSize = value + '% 100%'
    audio.volume = value / 100
    if (value === 0){
        vol.className = "fa fa-volume-off fa-lg"
    } else if(value < 50) {
        vol.className = "fa fa-volume-down fa-lg"
    }   else if(value >= 50) {
        vol.className = "fa fa-volume-up fa-lg"
    }
}

function clickVolButton() {
    let volButton = e('#id-vol')
    bindEvent(volButton, 'click', function(){
        if (volButton.classList.contains('fa-volume-off')){
            setVol(JSON.parse(localStorage.vol))
        } else {
            setVol(0)
        }
    })
}

function control_init(){
    clickModeButton()
    clickVolButton()
    musicControl()
    slider(e('.time-range input'), {min:0, max:100,step:0.1,callback:function(){
        let audio = e('#id-audio')
        let value = Number(e('.time-range input').value)
        audio.currentTime = value / 100 * audio.duration
    }})
    slider(e('#id-vol-range input'), {min:0, max:100,step:0.1,callback:volumeControl})
    if (localStorage.vol === undefined){
        setVol(50)
    } else {
        setVol(JSON.parse(localStorage.vol))
    }
    showTime();
    (function () {
        let audio = e('#id-audio')
        setInterval(function () {
            e(".current-time").innerText = timeFormat(audio.currentTime)
            e('.time-range input').value = audio.currentTime / audio.duration * 100
            e('.time-range input').style.backgroundSize = e('.time-range input').value + '% 100%'
        }, 500)
        e(".duration-time").innerText = timeFormat(audio.duration)
    })()
}
//Control Bar end


// List Bar start
function srcList() {
    let musicList = es('.music')
    let list = []
    for(var i = 0; i < musicList.length; i++){
        let musicName = musicList[i].innerText.split(' ').join('')
        let path = `docs/mp3/${musicName}.mp3`
        list.push(path)
    }
    return list
}

function clickList() {
    let musicList = e('.music-list')
    bindEventDelegate(musicList, 'click', function(event){
        let target = event.target
        let musicName = target.innerText.split(' ').join('')
        let path = `docs/mp3/${musicName}.mp3`
        cutMusic(path)
    }, "music")
}

function currentPanel() {
    bindEvent(e(".current-music-panel"), 'click', function(evnet){
        let target = event.target
        if (target.classList.contains('current-img')){
            e(".music-info-page").classList.toggle('info-show')
            e("#id-gan").classList.toggle('gan-show')
        } else if(target.classList.contains('fa-heart-o')) {
            target.className = "fa fa-heart"
        } else if(target.classList.contains('fa-heart')) {
            target.className = "fa fa-heart-o"
        }
    })
}

function list_init() {
    clickList()
    currentPanel()
}
// List Bar end

//轮播图
function activePoint(index){
    let points = es('.carousel-indi-point')
    for (var i = 0; i < points.length; i++) {
        points[i].classList.remove('activate')
    }
    let point = e("#point" + index)
    point.classList.add('activate')
}
function clickPhoto() {
    bindAll('.photo', 'click', function(event){
        let target = event.target
        let index = target.dataset.index
        changePhoto(index)
        activePoint(index)
    })
}
function clickPoint() {
    bindAll('.carousel-indi-point', 'click', function(event){
        let target = event.target
        let index = target.dataset.index
        changePhoto(index)
        activePoint(index)
    })
}
function changePhoto(index) {
    let front = e('#photo'+index)
    let right = e('#photo'+(index + 2) % 3)
    let left = e('#photo'+(index + 1) % 3)
    front.className = "photo front"
    right.className = "photo right-back"
    left.className = "photo left-back"
    activePoint(index)
}
function lpbo(){
    clickPoint()
    clickPhoto()
    let index = (function(){
        let a = 0
        return function(){
            a = (a + 1) % 3
            return a
        }
    })();
    setInterval(function(){
        changePhoto(index())
    }, 3000)
}
//轮播图 END

function __main(){
    lpbo()
    e("body").style.height = window.innerHeight + "px"
    e(".main").style.width = (window.innerWidth - 250) + 'px'
    control_init()
    list_init()
}

__main()
