"use strict";
// ==UserScript==
// @name        Save YouTube Video to Obsidian
// @namespace   Violentmonkey Scripts
// @icon        https://www.youtube.com/s/desktop/5af4fee3/img/favicon.ico
// @version     1.0.0
//
// @match       https://www.youtube.com/watch*
// @grant       none
//
// @author      -
// @description Save YouTube videos to Obsidian
// ==/UserScript==
const saveButton = document.createElement("button");
saveButton.textContent = "Save to Obsidian";
let mode = "api";
saveButton.setAttribute("style", `
  position:absolute;
  right:0;
  top:0;
  z-index:1000;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;

  padding:8px 14px;

  border:none;
  border-radius:9999px;

  background:rgba(32, 33, 36, 0.82);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);

  color:rgba(255,255,255,0.92);

  font-family:'JetBrains Mono','Fira Code','IBM Plex Mono',monospace;
  font-size:12px;
  font-weight:500;
  letter-spacing:0.4px;

  box-shadow:
    0 2px 10px rgba(0,0,0,0.28),
    inset 0 1px 0 rgba(255,255,255,0.06);

  cursor:pointer;

  transition:
    background 0.18s ease,
    transform 0.14s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;

  opacity:0.94;
  `);
// --------------------
// Dropdown
// --------------------
const dropdown = document.createElement("div");
dropdown.setAttribute("style", `
  position:absolute;
  top:40px;
  right:0;
  min-width:180px;

  display:none;
  flex-direction:column;

  padding:6px;

  border-radius:16px;

  background:rgba(28, 28, 30, 0.88);
  backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);

  box-shadow:
    0 8px 24px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.05);

  border:1px solid rgba(255,255,255,0.06);

  z-index:1001;
  `);
function createDropdownOption(text) {
    const option = document.createElement("button");
    option.textContent = text;
    option.setAttribute("style", `
    width:100%;

    padding:10px 12px;

    border:none;
    border-radius:12px;

    background:transparent;

    color:rgba(255,255,255,0.92);

    font-family:'JetBrains Mono','Fira Code','IBM Plex Mono',monospace;
    font-size:12px;
    font-weight:500;

    text-align:left;

    cursor:pointer;

    transition:
      background 0.15s ease,
      transform 0.12s ease;
    `);
    option.addEventListener("mouseenter", () => {
        option.style.background = "rgba(255,255,255,0.06)";
    });
    option.addEventListener("mouseleave", () => {
        option.style.background = "transparent";
        option.style.transform = "translateX(0)";
    });
    option.addEventListener("mousedown", () => {
        option.style.transform = "scale(0.98)";
    });
    option.addEventListener("mouseup", () => {
        option.style.transform = "scale(1)";
    });
    return option;
}
// --------------------
// Option Handlers
// --------------------
function handleUseAPI() {
    mode = "api";
    save();
    // Your logic here
}
function handleUseWhisper() {
    mode = "whisper";
    save();
    // Your logic here
}
// --------------------
// Options
// --------------------
const apiOption = createDropdownOption("Use API");
const whisperOption = createDropdownOption("Use Whisper");
apiOption.addEventListener("click", () => {
    dropdown.style.display = "none";
    handleUseAPI();
});
whisperOption.addEventListener("click", () => {
    dropdown.style.display = "none";
    handleUseWhisper();
});
dropdown.appendChild(apiOption);
dropdown.appendChild(whisperOption);
// --------------------
// Button Interactions
// --------------------
saveButton.addEventListener("mouseenter", () => {
    saveButton.style.background = "rgba(48, 49, 52, 0.92)";
    saveButton.style.transform = "translateY(-1px)";
    saveButton.style.boxShadow =
        "0 4px 16px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08)";
});
saveButton.addEventListener("mouseleave", () => {
    saveButton.style.background = "rgba(32, 33, 36, 0.82)";
    saveButton.style.transform = "translateY(0)";
    saveButton.style.boxShadow =
        "0 2px 10px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)";
});
saveButton.addEventListener("mousedown", () => {
    saveButton.style.transform = "scale(0.97)";
});
saveButton.addEventListener("mouseup", () => {
    saveButton.style.transform = "translateY(-1px)";
});
saveButton.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
});
// --------------------
// Close Dropdown
// --------------------
document.addEventListener("click", () => {
    dropdown.style.display = "none";
});
saveButton.setAttribute("id", "obsidian-save-button");
document.body.appendChild(dropdown);
let foundTarget = false;
const save = async () => {
    alert("Saving to Obsidian!");
    const response = await fetch(`http://localhost:3000/save-video?url=${window.location.href}&mode=${mode}`);
    const responseJson = await response.json();
    if (responseJson.queued) {
        alert("Video queued for processing! It will be saved to Obsidian within the next hour.");
    }
    else {
        alert("Failed to queue video for processing: " + responseJson.error);
    }
};
const createButtonInterval = setInterval(() => {
    const target = document.querySelector("h1.style-scope.ytd-watch-metadata");
    if (!foundTarget && target != undefined && target != null) {
        foundTarget = true;
        target.appendChild(saveButton);
        target.setAttribute("style", "position:relative;");
        clearInterval(createButtonInterval);
        console.log("Found target element and attached save button!");
    }
}, 500);
setTimeout(() => {
    clearInterval(createButtonInterval);
    if (!foundTarget) {
        alert("Did not find target element to attach save button within 20 seconds. Please refresh the page and try again.");
    }
}, 20000);
// Function that checks every 2.5 seconds if the save button is still attached to the page, and if not, re-attaches it (this is to handle YouTube's dynamic page changes that can cause the button to disappear)
setInterval(() => {
    if (!document.getElementById("obsidian-save-button")) {
        const target = document.querySelector("h1.style-scope.ytd-watch-metadata");
        if (target != undefined && target != null) {
            target.appendChild(saveButton);
            target.setAttribute("style", "position:relative;");
            console.log("Re-attached save button after it was removed!");
        }
    }
}, 2500);
