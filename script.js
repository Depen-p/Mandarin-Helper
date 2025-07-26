window.addEventListener("DOMContentLoaded", () => {
  // Load sidebar
  const depth = window.location.pathname.split("/").length - 2;
  const path = `${"../".repeat(depth)}sidebar.html`;

  fetch(path)
    .then(res => res.text())
    .then(data => {
      document.getElementById("sidebar-placeholder").innerHTML = data;

      const sidebar = document.getElementById("sidebar");
      const toggleBtn = document.getElementById("sidebarToggle");

      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          sidebar.classList.toggle("collapsed");
          const layout = document.querySelector(".layout");
          if (layout) {
            layout.classList.toggle("sidebar-collapsed");
          }
        });
      }
    });

  // Sample flashcard data for both pinyin and hanzi presets
  const flashcards = {
    pinyin: {},
    hanzi: {}
  };

  // Load HSK 1 from JSON file
  async function loadPresetHSK1() {
    try {
      const response = await fetch("../data/hsk1_new.json");
      const data = await response.json();
  
      flashcards.pinyin[1] = data.map(item => ({
        front: item.pinyin,
        back: `${item.hanzi}\n${item.english}`
      }));
  
      currentCategory = 1;
      currentIndex = 0;
      updateCard();
    } catch (error) {
      console.error("❌ Failed to load HSK 1 Pinyin preset:", error);
    }
  }

  async function loadPresetHSK1_Hanzi() {
    try {
      const response = await fetch("../data/hsk1_new.json");
      const data = await response.json();
  
      flashcards.hanzi[1] = data.map(item => ({
        front: item.hanzi,
        back: `${item.pinyin} — ${item.english}`
      }));
  
      currentCategory = 1;
      currentIndex = 0;
      updateCard();
    } catch (error) {
      console.error("❌ Failed to load HSK 1 Hanzi preset:", error);
    }
  }
  
  // Initial state
  let currentCategory = 1;
  let currentType = "pinyin"; // 'pinyin' or 'hanzi'
  let currentIndex = 0;

  const frontEl = document.getElementById("flashcard-front");
  const backEl = document.getElementById("flashcard-back");
  const cardEl = document.getElementById("flashcard");

  function updateCard() {
    const currentSet = flashcards[currentType]?.[currentCategory];
    if (!currentSet || currentSet.length === 0) {
      frontEl.textContent = "No cards available";
      backEl.textContent = "";
      return;
    }

    const card = currentSet[currentIndex];
    frontEl.innerHTML = `
  <div style="font-size: 2rem; font-weight: bold; text-align: center;">
    ${card.front}
  </div>
`;
    if (currentType === "pinyin") {
      const [hanzi, english] = card.back.split("\n");
      backEl.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
          <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">${hanzi}</div>
          <div style="font-size: 1.2rem;">${english}</div>
        </div>
      `;
    } else if (currentType === "hanzi") {
      const [pinyin, english] = card.back.split(" — ");
      backEl.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
          <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">${pinyin}</div>
          <div style="font-size: 1.2rem;">${english}</div>
        </div>
      `;
    } 
    cardEl.classList.remove("flipped");
  }

  // Prev / Next buttons
  document.getElementById("nextCard").addEventListener("click", () => {
    cardEl.classList.remove("flipped");
    const cards = flashcards[currentType]?.[currentCategory];
    if (!cards) return;
    setTimeout(() => {
      if (randomize) {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * cards.length);
        } while (newIndex === currentIndex && cards.length > 1);
        currentIndex = newIndex;
      } else {
        currentIndex = (currentIndex + 1) % cards.length;
      }
      updateCard();
    }, 150); // match flip animation
  });
  

  
  document.getElementById("prevCard").addEventListener("click", () => {
    cardEl.classList.remove("flipped");
    const cards = flashcards[currentType]?.[currentCategory];
    if (!cards) return;
    setTimeout(() => {
      if (randomize) {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * cards.length);
        } while (newIndex === currentIndex && cards.length > 1);
        currentIndex = newIndex;
      } else {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      }
      updateCard();
    }, 150);
  });
  

  // Flip card
  cardEl.addEventListener("click", () => {
    cardEl.classList.toggle("flipped");
  });

  // Preset toggle logic
  const presetGrid = document.getElementById("presetGrid");
  const presetPinyinBtn = document.getElementById("presetPinyinBtn");
  const presetHanziBtn = document.getElementById("presetHanziBtn");

  let activePresetType = null;

  function togglePresetGrid(type) {
    if (presetGrid.classList.contains("hidden") || activePresetType !== type) {
      presetGrid.innerHTML = ""; // clear
      activePresetType = type;
      currentType = type;

      for (let i = 1; i <= 6; i++) {
        const btn = document.createElement("button");
        btn.textContent = `HSK ${i}`;
        btn.classList.add("preset-option");
        btn.dataset.level = i;
        btn.addEventListener("click", () => {
          currentCategory = parseInt(btn.dataset.level);
          currentIndex = 0;
          presetGrid.classList.add("hidden");

          // If HSK 1 and pinyin type, load from JSON
          if (currentType === "pinyin" && currentCategory === 1) {
            loadPresetHSK1();
          } else if (currentType === "hanzi" && currentCategory === 1) {
            loadPresetHSK1_Hanzi();
          } else {
            updateCard();
          }
        });
        presetGrid.appendChild(btn);
      }

      presetGrid.classList.remove("hidden");
    } else {
      presetGrid.classList.add("hidden");
    }
  }

  presetPinyinBtn?.addEventListener("click", () => togglePresetGrid("pinyin"));
  presetHanziBtn?.addEventListener("click", () => togglePresetGrid("hanzi"));

  let randomize = false;
  const randomToggle = document.getElementById("randomToggle");
  randomToggle?.addEventListener("change", () => {
    randomize = randomToggle.checked;
  });

  updateCard(); // initialize
});
