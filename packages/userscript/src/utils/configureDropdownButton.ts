export function configureDropdownButton({
  dropdown,
  saveButton,
  handleUseAPI,
  handleUseWhisper,
}: {
  dropdown: HTMLDivElement;
  saveButton: HTMLButtonElement;
  handleUseAPI: () => void;
  handleUseWhisper: () => void;
}) {
  dropdown.setAttribute(
    "style",
    `
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
  `,
  );

  function createDropdownOption(text: string) {
    const option = document.createElement("button");

    option.textContent = text;

    option.setAttribute(
      "style",
      `
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
    `,
    );

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
  // Close Dropdown
  // --------------------

  document.addEventListener("click", (e) => {
    if (
      !saveButton.contains(e.target as Node) &&
      !dropdown.contains(e.target as Node)
    ) {
      dropdown.style.display = "none";
    }
  });

  document.body.appendChild(dropdown);
}
