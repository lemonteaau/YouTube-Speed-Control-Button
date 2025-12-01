// ==UserScript==
// @name         YouTube Speed Control Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a speed control button that resets correctly when changing videos.
// @author       lemontea
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let currentSpeedIndex = 0;
  const speeds = [1, 1.5, 2];

  function createSpeedButton() {
    const rightControlsLeft = document.querySelector(".ytp-right-controls-left");
    if (!rightControlsLeft) return false;

    if (document.querySelector(".ytp-speed-button-container")) return true;

    const subtitlesButton = rightControlsLeft.querySelector(".ytp-subtitles-button");
    if (!subtitlesButton) return false;

    const buttonContainer = document.createElement("button");
    buttonContainer.className = "ytp-speed-button-container ytp-button";
    buttonContainer.style.padding = "0 8px";
    buttonContainer.style.minWidth = "48px";
    buttonContainer.style.height = "100%";
    buttonContainer.style.display = "flex";
    buttonContainer.style.alignItems = "center";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.position = "relative";
    buttonContainer.style.cursor = "pointer";
    buttonContainer.setAttribute("title", "Playback Speed: 1x");
    buttonContainer.setAttribute("data-priority", "4");

    const buttonContent = document.createElement("div");
    buttonContent.className = "ytp-speed-button-content";
    buttonContent.style.color = "white";
    buttonContent.style.fontSize = "14px";
    buttonContent.style.fontWeight = "bold";
    buttonContent.style.lineHeight = "1";
    buttonContent.textContent = "1x";

    buttonContainer.appendChild(buttonContent);

    buttonContainer.addEventListener("click", function () {
      currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
      const newSpeed = speeds[currentSpeedIndex];

      const video = document.querySelector("video");
      if (video) {
        video.playbackRate = newSpeed;
      }

      this.setAttribute("title", `Playback Speed: ${newSpeed}x`);
      buttonContent.textContent = `${newSpeed}x`;
    });

    rightControlsLeft.insertBefore(buttonContainer, subtitlesButton);

    return true;
  }

  function initializeOrReset() {
    setTimeout(() => {
      createSpeedButton();

      currentSpeedIndex = 0;
      const defaultSpeed = speeds[currentSpeedIndex];

      const buttonContainer = document.querySelector(".ytp-speed-button-container");
      const buttonContent = document.querySelector(".ytp-speed-button-content");

      if (buttonContainer && buttonContent) {
        buttonContainer.setAttribute("title", `Playback Speed: ${defaultSpeed}x`);
        buttonContent.textContent = `${defaultSpeed}x`;
      }
    }, 1000);
  }

  window.addEventListener("yt-navigate-finish", initializeOrReset);

  initializeOrReset();

})();
