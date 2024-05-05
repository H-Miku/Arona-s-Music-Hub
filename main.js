'use strict';



/**
 * all music information
 */

const musicData = [
  {
    backgroundImage: "/assets /img/fuli poster.jpeg",
    posterUrl: "/assets /img/Fuli.jpeg",
    title: "Fuli Auto Shooter",
    album: "Phigros/MuseDash",
    year: 2018,
    artist: "MYUKKE.",
    musicPath: "/music/MYUKKE. - FULi AUTO SHOOTER.mp3",
  },
  {
    backgroundImage: "./assets /img/inkar.jpg",
    posterUrl: "./music/Inkar poster.jpeg",
    title: "Inkar-Usi",
    album: "Arcaea/Rotaeno",
    year: 2021,
    artist: "DIA",
    musicPath: "/music/inkar-usi.mp3",
  },
  {
    backgroundImage: "./assets /img/last resort poster.jpeg",
    posterUrl: "/assets /img/last resort poster.jpeg",
    title: "Last Resort",
    album: "Punishing:Gray Raven",
    year: 2022,
    artist: "Ghostfinal",
    musicPath: "/music/【GhostFinal】Last Resort .feat Kinoko蘑菇「Punishing- Gray Raven OST - 空晓界限」 【パニシング-グレイレイヴン】Official.mp3",
  },
  {
    backgroundImage: "./assets /img/rabit.jpeg",
    posterUrl: "./assets /img/rabit.jpeg",
    title: "Usagi Flap",
    album: "Blue Archive",
    year: 2022,
    artist: "Nor",
    musicPath: "/music/ブルーアーカイブ Blue Archive OST 113. Usagi Flap.mp3",
  },
  {
    backgroundImage: "/assets /img/aru.jpeg",
    posterUrl: "/assets /img/aru.jpeg",
    title: "Unwelcome School",
    album: "Blue Archive",
    year: 2022,
    artist: "Mitsukiyo",
    musicPath: "/music/ブルーアーカイブ Blue Archive OST 7. Unwelcome School.mp3",
  },
  {
    backgroundImage: "/assets /img/whoTao.jpeg",
    posterUrl: "/assets /img/whoTao.jpeg",
    title: "Who? Tao Theme(Let the Living Beware)",
    album: "The could never G Game",
    year: 2021,
    artist: "tnbee",
    musicPath: "/music/Let the Living Beware.mp3",
    },

];



/**
 * add eventListnere on all elements that are passed
 */

const addEventOnElements = function(elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * PLAYLIST
 * 
 * add all music in playlist, from 'musicData'
 */

const playlist = document.querySelector("[data-music-list]");

for (let i = 0, len = musicData.length; i < len; i++) {
  playlist.innerHTML += `
  <li>
    <button class="music-item ${i === 0 ? "playing" : ""}" data-playlist-toggler data-playlist-item="${i}">
      <img src="${musicData[i].posterUrl}" width="800" height="800" alt="${musicData[i].title} Album Poster"
        class="img-cover">

      <div class="item-icon">
        <span class="material-symbols-rounded">equalizer</span>
      </div>
    </button>
  </li>
  `;
}



/**
 * PLAYLIST MODAL SIDEBAR TOGGLE
 * 
 * show 'playlist' modal sidebar when click on playlist button in top app bar
 * and hide when click on overlay or any playlist-item
 */

const playlistSideModal = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlaylist = function() {
  playlistSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
}

addEventOnElements(playlistTogglers, "click", togglePlaylist);



/**
 * PLAYLIST ITEM
 * 
 * remove active state from last time played music
 * and add active state in clicked music
 */

const playlistItems = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlaylistItem = function() {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
}

addEventOnElements(playlistItems, "click", function() {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlaylistItem();
});



/**
 * PLAYER
 * 
 * change all visual information on player, based on current music
 */

const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerAlbum = document.querySelector("[data-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

const audioSource = new Audio(musicData[currentMusic].musicPath);

const changePlayerInfo = function() {
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.setAttribute("alt", `${musicData[currentMusic].title} Album Poster`);
  document.body.style.backgroundImage = `url(${musicData[currentMusic].backgroundImage})`;
  playerTitle.textContent = musicData[currentMusic].title;
  playerAlbum.textContent = musicData[currentMusic].album;
  playerYear.textContent = musicData[currentMusic].year;
  playerArtist.textContent = musicData[currentMusic].artist;

  audioSource.src = musicData[currentMusic].musicPath;

  audioSource.addEventListener("loadeddata", updateDuration);
  playMusic();
}

addEventOnElements(playlistItems, "click", changePlayerInfo);

/** update player duration */
const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

/** pass seconds and get timcode formate */
const getTimecode = function(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration - (minutes * 60));
  const timecode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return timecode;
}

const updateDuration = function() {
  playerSeekRange.max = Math.ceil(audioSource.duration);
  playerDuration.textContent = getTimecode(Number(playerSeekRange.max));
}

audioSource.addEventListener("loadeddata", updateDuration);



/**
 * PLAY MUSIC
 * 
 * play and pause music when click on play button
 */

const playBtn = document.querySelector("[data-play-btn]");

let playInterval;

const playMusic = function() {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
}

playBtn.addEventListener("click", playMusic);


/** update running time while playing music */

const playerRunningTime = document.querySelector("[data-running-time");

const updateRunningTime = function() {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);

  updateRangeFill();
  isMusicEnd();
}



/**
 * RANGE FILL WIDTH
 * 
 * change 'rangeFill' width, while changing range value
 */

const ranges = document.querySelectorAll("[data-range]");
const rangeFill = document.querySelector("[data-range-fill]");

const updateRangeFill = function() {
  let element = this || ranges[0];

  const rangeValue = (element.value / element.max) * 100;
  element.nextElementSibling.style.width = `${rangeValue}%`;
}

addEventOnElements(ranges, "input", updateRangeFill);



/**
 * SEEK MUSIC
 * 
 * seek music while changing player seek range
 */

const seek = function() {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
}

playerSeekRange.addEventListener("input", seek);



/**
 * END MUSIC
 */

const isMusicEnd = function() {
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    /*audioSource.currentMusic=0;*/
    /*playerSeekRange.value = audioSource.currentTime;*/
    playerRunningTime.textContent = getTimecode(audioSource.currentTime);
    lastPlayedMusic = currentNlMusic;
    if (isShuffled) {
      shuffleMusic();
    } else {
      currentMusic >= musicData.length - 1 ? currentMusic = 0 : currentMusic++;
    }
    skipNext();
    changePlayerInfo();
    changePlaylistItem();
    updateRangeFill();
  }
}


/**
 * SKIP TO NEXT MUSIC
 */

const playerSkipNextBtn = document.querySelector("[data-skip-next]");

const skipNext = function() {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= musicData.length - 1 ? currentMusic = 0 : currentMusic++;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipNextBtn.addEventListener("click", skipNext);



/**
 * SKIP TO PREVIOUS MUSIC
 */

const playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

const skipPrev = function() {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic <= 0 ? currentMusic = musicData.length - 1 : currentMusic--;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipPrevBtn.addEventListener("click", skipPrev);



/**
 * SHUFFLE MUSIC
 */

/** get random number for shuffle */
const getRandomMusic = () => Math.floor(Math.random() * musicData.length);

const shuffleMusic = () => currentMusic = getRandomMusic();

const playerShuffleBtn = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffle = function() {
  playerShuffleBtn.classList.toggle("active");

  isShuffled = isShuffled ? false : true;
}
playerShuffleBtn.addEventListener("click", shuffle);



/**
 * REPEAT MUSIC
 */

const playerRepeatBtn = document.querySelector("[data-repeat]");

const repeat = function() {
  if (!audioSource.loop) {
    audioSource.loop = true;
    this.classList.add("active");
  } else {
    audioSource.loop = false;
    this.classList.remove("active");
  }
}

playerRepeatBtn.addEventListener("click", repeat);



/**
 * MUSIC VOLUME
 * 
 * increase or decrease music volume when change the volume range
 */

const playerVolumeRange = document.querySelector("[data-volume]");
const playerVolumeBtn = document.querySelector("[data-volume-btn]");

const changeVolume = function() {
  audioSource.volume = playerVolumeRange.value;
  audioSource.muted = false;

  if (audioSource.volume <= 0.1) {
    playerVolumeBtn.children[0].textContent = "volume_mute";
  } else if (audioSource.volume <= 0.5) {
    playerVolumeBtn.children[0].textContent = "volume_down";
  } else {
    playerVolumeBtn.children[0].textContent = "volume_up";
  }
}

playerVolumeRange.addEventListener("input", changeVolume);


/**
 * MUTE MUSIC
 */

const muteVolume = function() {
  if (!audioSource.muted) {
    audioSource.muted = true;
    playerVolumeBtn.children[0].textContent = "volume_off";
  } else {
    changeVolume();
  }
}

playerVolumeBtn.addEventListener("click", muteVolume);



// Function to play the next song when the current one ends
const playNextSong = function() {
  // Increment current music index or shuffle if shuffle mode is active
  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic = (currentMusic + 1) % musicData.length;
  }

  // Change player info and play the next song
  changePlayerInfo();
  changePlaylistItem();
}

// Event listener for 'ended' event of the audio element
audioSource.addEventListener("ended", playNextSong);

// Function to play a randomly selected song
const playRandomSong = function() {
  shuffleMusic(); // Shuffle the music
  changePlayerInfo(); // Change player info to the shuffled song
  changePlaylistItem(); // Update playlist item to reflect the shuffled song
}

