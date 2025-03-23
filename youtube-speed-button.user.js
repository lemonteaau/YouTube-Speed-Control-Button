// ==UserScript==
// @name         YouTube Speed Control Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a speed control button to YouTube that cycles through 1x, 1.5x, and 2x speeds
// @author       lemontea
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let currentSpeedIndex = 0;
  const speeds = [1, 1.5, 2];

  function createSpeedButton() {
    const rightControls = document.querySelector(".ytp-right-controls");
    if (!rightControls) return false;

    if (document.querySelector(".ytp-speed-button-container")) return true;

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "ytp-speed-button-container";
    buttonContainer.style.display = "inline-block";
    buttonContainer.style.width = "36px";
    buttonContainer.style.height = "36px";
    buttonContainer.style.position = "relative";
    buttonContainer.style.alignSelf = "center";
    buttonContainer.style.cursor = "pointer";
    buttonContainer.setAttribute("title", "Playback Speed: 1x");

    const buttonContent = document.createElement("div");
    buttonContent.className = "ytp-speed-button-content";
    buttonContent.style.width = "100%";
    buttonContent.style.height = "100%";
    buttonContent.style.display = "flex";
    buttonContent.style.alignItems = "center";
    buttonContent.style.justifyContent = "center";
    buttonContent.style.color = "white";
    buttonContent.style.fontSize = "14px";
    buttonContent.style.fontWeight = "bold";
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

    const parent = rightControls.parentNode;
    if (parent) {
      parent.insertBefore(buttonContainer, rightControls);
    }

    return true;
  }

  function initSpeedButton() {
    if (!createSpeedButton()) {
      setTimeout(initSpeedButton, 1000);
    }
  }

  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(initSpeedButton, 1500); // Wait for the player to load
    }
  });

  observer.observe(document, { subtree: true, childList: true });

  initSpeedButton();

  // Additional check for dynamic loading
  window.addEventListener("yt-navigate-finish", initSpeedButton);
})();
