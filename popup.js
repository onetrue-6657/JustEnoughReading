(function () {
  const pages = [
    "startMenu",
    "readingMenu",
    "concludingProcess",
    "translatingProcess",
    "analyzingProcess",
    "concludedMenu",
    "translateOptionsPage",
    "translatedPage",
    "deepAnalysisPromptPage",
  ];

  const originalLanguage = navigator.language || navigator.userLanguage;
  const newLanguage = "";

  const targetLengthSlider = document.getElementById("targetLength");
  const targetLengthValue = document.getElementById("targetLengthValue");
  if (targetLengthSlider && targetLengthValue) {
    targetLengthSlider.addEventListener("input", (event) => {
      targetLengthValue.textContent = event.target.value;
    });
  }

  //   function showPage(pageId) {
  //     pages.forEach((id) => {
  //       const el = document.getElementById(id);
  //       if (el) {
  //         el.style.display = id === pageId ? "flex" : "none";
  //       }
  //     });
  //   }

  window.addEventListener("DOMContentLoaded", function () {
    showPage("startMenu");

    // ✅ StartMenu => MainMenu (readingMenu)
    const actionButton = document.getElementById("actionButton");
    if (actionButton) {
      actionButton.addEventListener("click", function () {
        showPage("readingMenu");
      });
    }

    // ✅ MainMenu => ConcludingProcess => ConcludedMenu
    const concludeButton = document.getElementById("concludeButton");
    if (concludeButton) {
      concludeButton.addEventListener("click", async function () {
        showPage("concludingProcess");

        // 获取当前 Tab 的 URL
        let [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (!tab || !tab.url) {
          alert("Not able to access URL of current page.");
          return;
        }

        // 发送请求到 Flask 服务器
        try {
          const response = await fetch(
            "http://64.227.2.159:8001/crawl_and_summarize",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: tab.url }),
            }
          );

          const data = await response.json();

          if (data.error) {
            document.getElementById(
              "concludedContent"
            ).innerHTML = `<p style="color:red">❌ Error: ${data.error}</p>`;
          } else {
            document.getElementById("concludedContent").innerHTML = `
                  <h2>${data.title}</h2>
                  <p><strong>Main Topics:</strong> ${data.main_topics.join(
                    ", "
                  )}</p>
                  <p><strong>Summary:</strong> ${data.summary}</p>
                  <p><strong>Key Facts:</strong></p>
                  <ul>${data.key_facts
                    .map((fact) => `<li>${fact}</li>`)
                    .join("")}</ul>
                `;
          }
        } catch (error) {
          document.getElementById(
            "concludedContent"
          ).innerHTML = `<p style="color:red">❌ Request Failed: ${error}</p>`;
        }

        // 显示总结页面
        showPage("concludedMenu");
      });
    }

    // ✅ MainMenu => TranslateOptionsPage
    const translateButton = document.getElementById("translateButton");
    if (translateButton) {
      translateButton.addEventListener("click", function () {
        showPage("translateOptionsPage");
      });
    }

    // TODO - TranslateOptionsPage => TranslatedPage
    const translatePageButton = document.getElementById("translatePageButton");

    // TODO - TranslatedPage => TranslatingProcess => TranslatedPage (Original)
    const switchButton = document.getElementById("switchButton");

    // ✅ MainMenu => deepAnalysisPromptPage
    const analysisButton = document.getElementById("analysisButton");
    if (analysisButton) {
      analysisButton.addEventListener("click", function () {
        showPage("deepAnalysisPromptPage");
      });
    }

    // ✅ ConcludedMenu/TranslateOptionsPage/TranslatedPage/DeepAnalysisPromptPage => MainMenu
    const backButtons = document.querySelectorAll("#backButton");
    backButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        showPage("readingMenu");
      });
    });

    // TODO - ConcludedMenu => AnalyzingProcess => ConcludedMenu
    const refreshButton = document.getElementById("refreshButton");

    // TODO - ConcludedMenu => TranslatingProcess => ConcludedMenu
    const translateSummaryButton = document.getElementById(
      "translateSummaryButton"
    );

    // TODO - DeepAnalysisPromptPage => AnalyzingProcess => ConcludedMenu
    const analyzeButton = document.getElementById("analyzeButton");

    gsap.registerPlugin(TextPlugin);

    const lines = [
      "Warming up RTX5090...",
      "Booting up neural networks...",
      "Deploying quantum entanglement...",
      "Shimmying with the tragic little rectangle...",
      "Building a s**t Alps...",
      "Running sudo make it work...",
      "Dividing by zero...",
      "git push -f -f --force -ffffff...",
      "Loading OSU Components...",
      "Hacking General Kim's ETH wallet...",
      "Making a perpetual motion machine...",
      "Going to Buckeye's game...",
      "Git conflict...",
      "Walking to lower.com field...",
      "Waking up sleeping servers...",
      "Overclocking your CPU with flair...",
      "Synthesizing digital miracles...",
      "Spinning up parallel universes...",
      "Unleashing rogue algorithms...",
      "Encrypting laughter bytes...",
      "Debugging the fabric of reality...",
      "Initiating the ultimate hackathon...",
    ];

    function getRandomMessage(arr) {
      const index = Math.floor(Math.random() * arr.length);
      return arr.splice(index, 1)[0];
    }

    const contentEl = document.querySelector(".typewriter-content");
    const tl = gsap.timeline();

    while (lines.length > 0) {
      const text = getRandomMessage(lines);
      const p = document.createElement("p");
      p.style.margin = "0";
      p.style.padding = "0";
      p.textContent = "";
      contentEl.appendChild(p);

      tl.to(p, {
        duration: 1.5,
        text: text,
        ease: "none",
      });
      tl.to({}, { duration: 2 });

      if (lines.length > 0) {
        tl.call(() => {
          const height = p.offsetHeight;
          gsap.to(contentEl, {
            duration: 0.5,
            y: `-=${height}`,
            ease: "power1.inOut",
          });
        });
      }
    }
  });
})();
