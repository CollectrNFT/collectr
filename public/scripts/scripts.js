// Settings
var speed = 0.3;
var delay = 0;

// Background
var bgTL = gsap.timeline({ repeat: -1, defaults: { duration: speed } });
var bgPath = document.getElementById("bg-1");

bgTL
  .to(bgPath, { delay: delay, ease: "power4.out" }, "+=1")
  .to(bgPath, { delay: delay, ease: "power4.out" }, "+=1")
  .to(bgPath, { delay: delay, ease: "power4.out" }, "+=1")
  .to(bgPath, { delay: delay, ease: "power4.out" }, "+=1")
  .to(bgPath, { delay: delay, ease: "power4.out" }, "+=1")
  .to(bgPath, { delay: delay, ease: "power4.out" }, "+=1")
  .to(bgPath, { ease: "power4.out" }, "+=1"); // back to original color

// Square
var squareTL = gsap.timeline({ repeat: -1, defaults: { duration: speed } });
var squarePath = document.getElementById("square-1");

squareTL
  .to(
    squarePath,
    { morphSVG: "#square-2", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    squarePath,
    { morphSVG: "#square-3", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    squarePath,
    { morphSVG: "#square-4", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    squarePath,
    { morphSVG: "#square-5", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    squarePath,
    { morphSVG: "#square-6", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    squarePath,
    { morphSVG: "#square-7", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(squarePath, { morphSVG: squarePath, ease: "power4.out" }, "+=1"); // back to original color

// Circle
var circleTL = gsap.timeline({ repeat: -1, defaults: { duration: speed } });
var circlePath = document.getElementById("circle-1");

circleTL
  .to(
    circlePath,
    { morphSVG: "#circle-2", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    circlePath,
    { morphSVG: "#circle-3", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    circlePath,
    { morphSVG: "#circle-4", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    circlePath,
    { morphSVG: "#circle-5", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    circlePath,
    { morphSVG: "#circle-6", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(
    circlePath,
    { morphSVG: "#circle-7", delay: delay, ease: "power4.out" },
    "+=1"
  )
  .to(circlePath, { morphSVG: circlePath, ease: "power4.out" }, "+=1"); // back to original color

setTimeout(function () {
  document.getElementById("loader-wrapper") &&
    document.getElementById("loader-wrapper").classList.add("ready");
  bgTL.play();
  squareTL.play();
  circleTL.play();
}, 10);
