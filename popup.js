(function () {
    const pages = [
      "startMenu",
      "readingMenu",
      "concludingProcess",
      "concludedMenu",
      "translatingPage",
      "translatedPage",
      "analyzingProcess",
      "reviewAnalysisPage",
    ];
  
    function showPage(pageId) {
      pages.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.style.display = id === pageId ? "flex" : "none";
        }
      });
    }
  
    window.addEventListener("DOMContentLoaded", function () {
      showPage("startMenu");
  
      const actionButton = document.getElementById("actionButton");
      if (actionButton) {
        actionButton.addEventListener("click", function () {
          showPage("readingMenu");
        });
      }
  
      const concludeButton = document.getElementById("concludeButton");
      if (concludeButton) {
        concludeButton.addEventListener("click", async function () {
          showPage("concludingProcess");
  
          // 获取当前 Tab 的 URL
          let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!tab || !tab.url) {
            alert("无法获取当前页面 URL");
            return;
          }
  
          // 发送请求到 Flask 服务器
          try {
            const response = await fetch("http://64.227.2.159:8001/crawl_and_summarize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: tab.url }),
            }
          );

          const data = await response.json();

          if (data.error) {
            document.getElementById(
              "concludedContent"
            ).innerHTML = `<p style="color:red">❌ 错误: ${data.error}</p>`;
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
          ).innerHTML = `<p style="color:red">❌ 请求失败: ${error}</p>`;
        }

        // 显示总结页面
        showPage("concludedMenu");
      });
    }

    const analyzeButton = document.getElementById("analyzeButton");
    if (analyzeButton) {
      analyzeButton.addEventListener("click", function () {
        showPage("analyzingProcess");
        setTimeout(function () {
          showPage("concludedMenu");
        }, 2000);
      });
    }

    const reviewButton = document.getElementById("reviewButton");
    if (reviewButton) {
      reviewButton.addEventListener("click", function () {
        showPage("analyzingProcess");
        setTimeout(function () {
          showPage("reviewAnalysisPage");
        }, 2000);
      });
    }

    const backButtons = document.querySelectorAll("#backButton");
    backButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        showPage("readingMenu");
      });
    });

    const tryAgainButton = document.getElementById("tryAgainButton");
    if (tryAgainButton) {
      tryAgainButton.addEventListener("click", function () {
        showPage("concludedMenu");
      });
    }

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
      "Drinking coffee...Done!",
      'Running echo "Done!"...Done!',
      'std::cout << "Done!\\n";...Done!',
      "Jumping outta the infinite loop...Done!",
      "Touch...Done!",
    ];

    // const linesToShow = lines.slice(0, -3);
    const linesToShow = lines;

    const tl = gsap.timeline();

    linesToShow.forEach((text) => {
      tl.to("#typewriter", {
        duration: 1.5,
        text: text,
        ease: "none",
      });
      tl.to({}, { duration: 1 });
    });
  });
})();
