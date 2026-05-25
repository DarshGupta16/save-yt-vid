export function reattachWatcherFn(saveButton: HTMLButtonElement) {
  // Function that checks every 2.5 seconds if the save button is still attached to the page, and if not, re-attaches it (this is to handle YouTube's dynamic page changes that can cause the button to disappear)
  setInterval(() => {
    if (!document.getElementById("obsidian-save-button")) {
      const target = document.querySelector(
        "h1.style-scope.ytd-watch-metadata",
      );
      if (target != undefined && target != null) {
        target.appendChild(saveButton);
        target.setAttribute("style", "position:relative;");
        console.log("Re-attached save button after it was removed!");
      }
    }
  }, 2500);
}
