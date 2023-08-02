const containerElement = document.querySelector(".container");
const controls = document.querySelectorAll(".control");

const videos = document.querySelectorAll(".video");
const videoFadeTime = 1000;

let runningVideo = 0;
let fading = false;

function fadeAudio(videoElement, fadeOut, maxVol = 1) {
  const fadeInTime = videoFadeTime;
  const steps = 24;
  const interval = fadeInTime / steps;

  let i = 0;
  let intervalId = setInterval(function () {
    const volume = fadeOut
      ? maxVol - (maxVol / steps) * i
      : (maxVol / steps) * i;
    videoElement.volume = volume;
    if (++i >= steps) clearInterval(intervalId);
  }, interval);
}

const runAnimation = (numInput) => {
  const animationInt = numInput - 1;

  if (fading) {
    return;
  }
  if (animationInt !== runningVideo) {
    fading = true;
    console.log("run animation", animationInt);
    const prevVideo = videos[runningVideo];
    const nextVideo = videos[animationInt];
    prevVideo.classList.remove("video--show");
    nextVideo.classList.add("video--show");
    nextVideo.volume = 0;
    nextVideo.play();
    fadeAudio(nextVideo);
    fadeAudio(prevVideo, true);

    setTimeout(() => {
      prevVideo.pause();
      prevVideo.currentTime = 0;
      fading = false;
    }, videoFadeTime);

    runningVideo = animationInt;
  }
};

const newPhoneInput = (input) => {
  console.log("input:", input);

  const numInput = parseInt(input);

  if (input.includes("hungUp") || input.includes("lifted")) {
    console.log(input);
  } else if (numInput === 0) {
    runAnimation(10);
  } else if (numInput < videos.length + 1) {
    runAnimation(numInput);
  } else {
    console.error(`unknown input ${input}`);
  }
};

const connectToWebsocket = () => {
  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => console.log("connected to", socket);
  socket.onerror = (err) => console.log("WebSocket error", err);

  socket.onmessage = (message) => newPhoneInput(message.data);
};

const init = () => {
  // [...controls].forEach((control) => {
  //   control.addEventListener("click", (e) => {
  //     const animationInt = parseInt(e.currentTarget.innerHTML);

  //     runAnimation(animationInt);
  //   });
  // });

  document.addEventListener("keyup", (e) => {
    newPhoneInput(e.key);
  });

  connectToWebsocket();
};

init();
