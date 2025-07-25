window.addEventListener("DOMContentLoaded", () => {
  // Load sidebar
  const depth = window.location.pathname.split("/").length - 2;
  const path = `${"../".repeat(depth)}components/sidebar.html`;

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
    pinyin: {
      1: [
        { front: "nǐ hǎo", back: "Hello" },
        { front: "xièxie", back: "Thank you" }
      ],
      2: [
        { front: "zàijiàn", back: "Goodbye" },
        { front: "qǐng wèn", back: "May I ask" }
      ]
    },
    hanzi: {
      1: [
        { front: "你好", back: "Hello" },
        { front: "谢谢", back: "Thank you" }
      ],
      2: [
        { front: "再见", back: "Goodbye" },
        { front: "请问", back: "May I ask" }
      ]
    }
  };

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
    frontEl.textContent = card.front;
    backEl.textContent = card.back;
    cardEl.classList.remove("flipped");
  }

  // Prev / Next buttons
  document.getElementById("nextCard").addEventListener("click", () => {
    const cards = flashcards[currentType]?.[currentCategory];
    if (!cards) return;
    currentIndex = (currentIndex + 1) % cards.length;
    updateCard();
  });

  document.getElementById("prevCard").addEventListener("click", () => {
    const cards = flashcards[currentType]?.[currentCategory];
    if (!cards) return;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCard();
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
          updateCard();
          presetGrid.classList.add("hidden");
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

  updateCard(); // initialize
});
