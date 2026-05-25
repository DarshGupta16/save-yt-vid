export function configureSaveButton(
  {saveButton,
  dropdown,}:{saveButton: HTMLButtonElement; dropdown:HTMLDivElement}
) {
  saveButton.textContent = "Save to Obsidian";
  saveButton.setAttribute("id", "obsidian-save-button");

  saveButton.setAttribute(
    "style",
    `
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
  `,
  );

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

    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";
  });
}
