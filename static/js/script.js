let typingTimer;
let inactivityTimer;
let fedeInterval;

const removeDisplay = 8000;
const rgbWhitemode = 50;
const rgbBlackmode = 225;

const writingArea = document.getElementById("writingArea");
const wordCount = document.getElementById("wordCount");
const toggleBackground = document.getElementById("toggleBackground");
const toggleFullscreen = document.getElementById("toggleFullscreen");
const expand = document.querySelector(".bi-arrows-angle-expand");
const unexpand = document.querySelector(".bi-arrows-angle-contract");
const body = document.querySelector("body");
const note = document.querySelector(".note");

window.onload = function () {
  writingArea.focus();
};

writingArea.addEventListener("input", function () {
  clearInterval(fedeInterval);
  resetOpacityFont();
  updateWordCount();

  startFading();
});

//
function startFading() {
  const step = 0.01;
  const intervalTime = removeDisplay * step;

  // let count = 0;
  let opacity = 1;
  let r, g, b;
  let hSadow = 0;
  let vShadow = 0;
  let blurRadius = 0;
  const min = 0;
  const max = 180;

  if (body.classList.contains("white-mode")) {
    r = rgbWhitemode;
    g = rgbWhitemode;
    b = rgbWhitemode;
  } else if (body.classList.contains("black-mode")) {
    r = rgbBlackmode;
    g = rgbBlackmode;
    b = rgbBlackmode;
  }

  fedeInterval = setInterval(function () {
    // count += 1;
    opacity -= step;
    writingArea.style.opacity = opacity;

    if (body.classList.contains("white-mode")) {
      // Target red: rgb(180, 0, 0)
      r += step * (max - 50);
      g -= step * (50 - min);
      b = g;
    } else if (body.classList.contains("black-mode")) {
      // Target red: rgb(180, 0, 0)
      r -= step * (225 - max);
      g -= step * (225 - min);
      b = g;
    }

    writingArea.style.color = `rgb(${Math.floor(r)}, ${Math.floor(
      g
    )}, ${Math.floor(b)})`;

    hSadow += step;
    vShadow += step;
    blurRadius += step * 5;
    textShadow = `${hSadow}px ${vShadow}px ${blurRadius}px rgba(${Math.floor(
      r
    )}, ${Math.floor(g)}, ${Math.floor(b)}, 1)`;
    writingArea.style.textShadow = textShadow;

    if (opacity <= 0) {
      clearInterval(fedeInterval);
      clearText();
      alert("Oops! You're too slow. All the content has disappeared...");
    }
  }, intervalTime);
}

function resetOpacityFont() {
  opacity = 1;
  writingArea.style.opacity = 1;

  if (body.classList.contains("white-mode")) {
    writingArea.style.color = `rgb(${rgbWhitemode}, ${rgbWhitemode}, ${rgbWhitemode})`;
  } else if (body.classList.contains("black-mode")) {
    writingArea.style.color = `rgb(${rgbBlackmode}, ${rgbBlackmode}, ${rgbBlackmode})`;
  }
  writingArea.style.textShadow = "none";
}

function clearText() {
  writingArea.value = "";
  resetOpacityFont();
  updateWordCount();
}

function updateWordCount() {
  const text = writingArea.value.trim();
  fetch("/word_count", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text }),
  })
    .then((response) => response.json())
    .then((data) => {
      wordCount.innerHTML = `Word count: ${data.count}`;
    });
}

// Add event to Black/White mode btn:
toggleBackground.addEventListener("mouseenter", function () {
  toggleBackground.classList.remove("opacity");
});
toggleBackground.addEventListener("mouseleave", function () {
  toggleBackground.classList.add("opacity");
});
toggleBackground.addEventListener("click", function () {
  if (body.classList.contains("white-mode")) {
    SwithToBlackMode();
  } else if (body.classList.contains("black-mode")) {
    SwithToWhiteMode();
  }
  writingArea.focus();
});

function SwithToWhiteMode() {
  body.classList.remove("black-mode");
  body.classList.add("white-mode");
  writingArea.classList.remove("black-mode");
  writingArea.classList.add("white-mode");

  toggleBackground.style.backgrountColor = "rgb(225, 225, 225)";
  toggleBackground.style.color = "rgb(0, 0, 0)";
  toggleFullscreen.style.backgrountColor = "rgb(225, 225, 225)";
  toggleFullscreen.style.color = "rgb(0, 0, 0)";
}
function SwithToBlackMode() {
  body.classList.remove("white-mode");
  body.classList.add("black-mode");

  writingArea.classList.remove("white-mode");
  writingArea.classList.add("black-mode");

  toggleBackground.style.backgrountColor = "rgb(0, 0, 0)";
  toggleBackground.style.color = "rgb(225, 225, 225)";
  toggleFullscreen.style.backgrountColor = "rgb(0, 0, 0)";
  toggleFullscreen.style.color = "rgb(225, 225, 225)";
}

// Fullscreen on and off
toggleFullscreen.addEventListener("mouseenter", function () {
  toggleFullscreen.classList.remove("opacity");
});
toggleFullscreen.addEventListener("mouseleave", function () {
  toggleFullscreen.classList.add("opacity");
});
toggleFullscreen.addEventListener("click", function () {
  if (!document.fullscreenElement) {
    document.documentElement
      .requestFullscreen()
      .then(function () {
        expand.classList.add("hidden");
        unexpand.classList.remove("hidden");
      })
      .catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
  } else {
    document
      .exitFullscreen()
      .then(function () {
        expand.classList.remove("hidden");
        unexpand.classList.add("hidden");
      })
      .catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
  }
});
