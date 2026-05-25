export function configureModal({
  modalOverlay,
  handleUseAPI,
  handleUseWhisper,
}: {
  modalOverlay: HTMLDivElement;
  handleUseAPI: () => void;
  handleUseWhisper: () => void;
}) {
  // --------------------
  // Modal Overlay Styles (Blur & Darken)
  // --------------------
  modalOverlay.setAttribute(
    "style",
    `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    
    display: none;
    align-items: center;
    justify-content: center;
    
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    
    z-index: 99999;
    transition: opacity 0.25s ease;
    `,
  );

  // --------------------
  // Modal Container (The actual box)
  // --------------------
  const modalContainer = document.createElement("div");
  modalContainer.setAttribute(
    "style",
    `
    min-width: 320px;
    padding: 24px;
    
    background: rgba(28, 28, 30, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    
    box-shadow: 
      0 24px 48px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    
    display: flex;
    flex-direction: column;
    gap: 16px;
    `,
  );

  const title = document.createElement("h2");
  title.textContent = "Select Save Mode";
  title.setAttribute(
    "style",
    `
    margin: 0 0 8px 0;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    letter-spacing: -0.5px;
    `,
  );

  function createModalOption(text: string, subtext: string) {
    const option = document.createElement("button");
    option.setAttribute(
      "style",
      `
      width: 100%;
      padding: 16px;
      
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      `,
    );

    const label = document.createElement("span");
    label.textContent = text;
    label.setAttribute(
      "style",
      `
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      `,
    );

    const desc = document.createElement("span");
    desc.textContent = subtext;
    desc.setAttribute(
      "style",
      `
      color: rgba(255, 255, 255, 0.5);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      `,
    );

    option.appendChild(label);
    option.appendChild(desc);

    option.addEventListener("mouseenter", () => {
      option.style.background = "rgba(255, 255, 255, 0.07)";
      option.style.borderColor = "rgba(255, 255, 255, 0.15)";
      option.style.transform = "translateY(-2px)";
    });

    option.addEventListener("mouseleave", () => {
      option.style.background = "rgba(255, 255, 255, 0.03)";
      option.style.borderColor = "rgba(255, 255, 255, 0.06)";
      option.style.transform = "translateY(0)";
    });

    return option;
  }

  const apiOption = createModalOption("YouTube API", "Fast, use official transcripts");
  const whisperOption = createModalOption("Whisper AI", "High quality, AI-generated transcription");

  apiOption.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    handleUseAPI();
  });

  whisperOption.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    handleUseWhisper();
  });

  modalContainer.appendChild(title);
  modalContainer.appendChild(apiOption);
  modalContainer.appendChild(whisperOption);
  modalOverlay.appendChild(modalContainer);

  // Close on backdrop click
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });

  document.body.appendChild(modalOverlay);
}
