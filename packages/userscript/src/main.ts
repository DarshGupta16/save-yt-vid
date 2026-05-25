import { configureSaveButton } from "./utils/configureSaveButton";
import { configureModal } from "./utils/configureModal";
import { reattachWatcherFn } from "./utils/reattachWatcherFn";

console.log("Let me see if this works haha!");

const saveButton = document.createElement("button");
const modalOverlay = document.createElement("div");

let mode: "api" | "whisper" = "api";
configureSaveButton(saveButton, modalOverlay);

function handleUseAPI() {
  mode = "api";
  save();
}

function handleUseWhisper() {
  mode = "whisper";
  save();
}

configureModal({
  modalOverlay,
  handleUseAPI,
  handleUseWhisper,
});

let foundTarget = false;

const save = async () => {
  alert("Saving to Obsidian!");
  const response = await fetch(
    `http://localhost:3000/save-video?url=${window.location.href}&mode=${mode}`,
  );
  const responseJson = await response.json();
  if (responseJson.queued) {
    alert(
      "Video queued for processing! It will be saved to Obsidian within the next hour.",
    );
  } else {
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
    alert(
      "Did not find target element to attach save button within 20 seconds. Please refresh the page and try again.",
    );
  }
}, 20000);

reattachWatcherFn(saveButton);
