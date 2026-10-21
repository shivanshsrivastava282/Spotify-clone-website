let currentSong=new Audio();
let songs;
let currfolder;


function formatTime(seconds) {
    if(isNaN(seconds) || seconds<0){
        return "00:00" 

    }


    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
 
async function getSongs(folder) {
    currfolder=folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []


    // for (let index = 0; index < as.length; index++) {
    //     const element = as[index];
    //     if(element.href.endsWith(".mp3")){
    //         songs.push(element.href)
    //     }
    // }
    for (let link of as) {
        let filename = link.textContent.trim();

        if (filename.toLowerCase().endsWith(".mp3")) {
            songs.push(
                `http://127.0.0.1:3000/${folder}/` +
                encodeURIComponent(filename)
            );
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ol")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert icons" src="img/music-svgrepo-com.svg" alt="">
                            <div class="info">
                                <div> ${decodeURI(song.replace(`http://127.0.0.1:3000/${folder}/`, ""))}</div>
                                <div>Shivansh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  src="img/play-button.svg" alt="">
                            </div>
       </li>`;
    }

    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            //.trim() removes space from aagge piche
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs

}

const playMusic=(track,pause=false)=>{
    
    // let audio=new Audio("songs/"+ track);
    currentSong.src=`${currfolder}/`+ track;
    if(!pause){

        currentSong.play();
        start.src="img/pause-button.svg"
    }
        document.querySelector(".songinfo").innerHTML=decodeURI(track);
        document.querySelector(".songtime").innerHTML="00:00/00:00";

    
}
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div)
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    let array =Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        // console.log(e.href)
        if(e.href.includes("songs")){
            let lol="http://127.0.0.1:3000/songs/"+ e.textContent.trim()
            let folder=lol.split("/").slice(-2)[0]
            //get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML=cardContainer.innerHTML + ` <div data-folder="${folder}" class="card rounded">
                            <div class="play p-1">
                                <img src="img/play-button.svg" alt="">
                            </div>
                            <img class="rounded" src=songs/${folder}/conimg1.jpg alt="">
                            <div class="font cpadding">${response.title}</div>
                            <p class="darkgrey">${response.description}</p>
                        </div>`


        }
    }
    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=> {
       e.addEventListener("click",async item=>{
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
          playMusic(decodeURI(songs[0].replace(`http://127.0.0.1:3000/${currfolder}/`,"")))
        //   console.log(decodeURI(songs[0].replace(`http://127.0.0.1:3000/songs/${currfolder}/`,"")))

          
          
    
    
       })
     });

    
        
 
}

async function main() {
    
    //get the list of all songs
    await getSongs(`songs/ncs`);
    console.log(songs)
    playMusic(songs[0].replace(`http://127.0.0.1:3000/${currfolder}/`, ""),true)

    //display all the albums on the page
    displayAlbums()

    




    //play first song
    // var audio = new Audio(songs[1]);

    // let playButton = document.querySelector("#start");

    // playButton.addEventListener("click", () => {
    //     audio.play()
    //         .then(() => {
    //             console.log("Song is playing");
    //         })
    //         .catch((error) => {
    //             console.error("Playback failed:", error);
    //         });
    // });





//attach an event listener to play ,next and previous
    start.addEventListener("click",()=>{
        if (currentSong.paused){
            currentSong.play();
            start.src="img/pause-button.svg"
        }else{
            currentSong.pause();
            start.src="img/play-button.svg"
            
        }
    })


    //listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";

    })


    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime=((currentSong.duration)*percent)/100


    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0%"
        document.querySelector(".hamburger").style.display="none";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-100%"
        document.querySelector(".hamburger").style.display="block";
    })

    //add an event listener to previous 
    previous.addEventListener("click",()=>{
        console.log("previous clicked")
        let index=songs.indexOf(currentSong.src)
        console.log(songs, index)
        if(index > 0){
            playMusic(decodeURI(songs[index - 1].replace(`http://127.0.0.1:3000/${currfolder}/`, "")))
            
        }
    })
    //add an event listener to next
    next.addEventListener("click",()=>{
        console.log("next clicked")
        let index=songs.indexOf(currentSong.src)
        console.log(songs, index)
        if(index < songs.length-1){
            playMusic(decodeURI(songs[index + 1].replace(`http://127.0.0.1:3000/${currfolder}/`, "")))

        }


    })

    // add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,parseInt(e.target.value))
        currentSong.volume=parseInt(e.target.value)/100


    })

    //add event listener to mute the track
    vol.addEventListener("click",()=>{
        if(vol.src=="http://127.0.0.1:3000/img/volume.svg"){
            vol.src="img/mute-svgrepo-com.svg"
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;

        }else{
            vol.src="img/volume.svg"
            currentSong.volume=0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
       


    })
  

}
main();

