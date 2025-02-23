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
      concludeButton.addEventListener("click", function () {
        showPage("concludingProcess");
        setTimeout(function () {
          showPage("concludedMenu");
        }, 2000);
      });
    }

    const conclusionTranslateButton = document.querySelector(
      "#translateConclusion button"
    );
    if (conclusionTranslateButton) {
      conclusionTranslateButton.addEventListener("click", function () {
        showPage("translatingPage");
        // TODO: After translation has been processed it will show the translated page.
        setTimeout(function () {
          showPage("concludedMenu");
        }, 2000);
      });
    }

    const translateButton = document.getElementById("translateButton");
    if (translateButton) {
      translateButton.addEventListener("click", function () {
        showPage("translatingPage");
        setTimeout(function () {
          showPage("translatedPage");
        }, 2000);
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
  });
})();
