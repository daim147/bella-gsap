gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const main = document.querySelector("#main");
const imageContainer = document.querySelectorAll(".rg__column");
const loaderPage = document.querySelector(".loader");
const loaderInner = document.querySelector(".loader .inner");
const loaderProgress = document.querySelector(".loader .progress");

//! LOADING PAGE
gsap.set(loaderPage, { autoAlpha: 1 });
gsap.set(loaderInner, { scaleY: 0.005, transformOrigin: "bottom" });
const progressTween = gsap.to(loaderProgress, {
  scaleX: 0,
  paused: true,
  transformOrigin: "right",
});

// ! Setting Up Image Load

let imageLoad = 0,
  imgCount;

const imageLoadFun = imagesLoaded(main);

// ! SEtting images in  main and set to imageCount
imgCount = imageLoadFun.images.length;

// ! INITAIL VALUE
updateProgressBar(0);

// ! PRogressing Image loaded
imageLoadFun.on("progress", (instance, image) => {
  //! IT will call on each image loaded
  imageLoad++;
  updateProgressBar(imageLoad);
});

// ! ON Complete Load of Images
imageLoadFun.on("done", (instance) => {
  gsap.set(loaderProgress, { autoAlpha: 0, onComplete: loader });
});

// ! Update Progress

function updateProgressBar(value) {
  gsap.to(progressTween, {
    progress: value / imgCount,
    duration: 0.3,
    ease: "power2.out",
  });
}

const fillBg = document.querySelector(".fill-background");
let smoothScroll;

const navbar = () => {
  //  ! Adding class to slide bottom of <a></a>
  const navbarLinks = document.querySelectorAll(".main-nav ul li a");
  navbarLinks.forEach((link) => {
    link.addEventListener("mouseleave", () => {
      link.classList.add("animate-out");
      setTimeout(() => {
        //   ! Removing Class
        link.classList.remove("animate-out");
      }, 300);
    });
  });

  // ! Making Simple Animation to fade and move <a></a>
  const animateNav = (direction) => {
    //   ! CHECKING WHAT IS THE DIRECTION OF SCROLL BASED ON SCROLL MAKING ANIMATION

    return gsap.to(
      direction === 1 ? navbarLinks : Array.from(navbarLinks).reverse(),
      {
        autoAlpha: () => (direction === 1 ? 0 : 1),
        y: () => (direction === 1 ? 20 : 0),
        stagger: 0.1,
        duration: 0.5,
        ease: "Power4.out",
      }
    );
  };

  //   ! Making Scroll Triger

  ScrollTrigger.create({
    start: 100, //! Start After 100px of scroll
    end: "bottom bottom-=200",
    toggleClass: {
      targets: "body",
      className: "has-scrolled",
    },
    onEnter: (obj) => {
      animateNav(obj.direction);
    },
    onLeaveBack: ({ direction }) => {
      animateNav(direction);
    },
  });
};

const imageToTilt = () => {
  document.querySelector("header").addEventListener("mousemove", tilt);
};
// ! TIlt Function on Image
const tilt = (e) => {
  const {
    offsetX,
    offsetY,
    target: { clientHeight, clientWidth },
  } = e;

  const xPos = offsetX / clientWidth - 0.5;
  const yPos = offsetY / clientHeight - 0.5;

  const imagesLeft = document.querySelectorAll(".hg__left .hg__image");
  const imagesRight = document.querySelectorAll(".hg__right .hg__image");

  imagesLeft.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2,
      x: xPos * 40 * (index * 1.2 + 0.5),
      y: yPos * 20 * (index * 1.2 + 0.5),
      rotateX: yPos * 10,
      rotateY: xPos * 40,
      ease: "Power3.out",
    });
  });
  imagesRight.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2,
      x: xPos * 40 * (index * 1.2 + 0.5),
      y: -(yPos * 30 * (index * 1.2 + 0.5)),
      rotateX: yPos * 10,
      rotateY: xPos * 40,
      ease: "Power3.out",
    });
  });

  gsap.to(".decor__circle", {
    duration: 1.7,
    x: 100 * xPos,
    y: 120 * yPos,
    ease: "Power4.out",
  });
};

// ! Revealing Image

const revealImage = () => {
  imageContainer.forEach((container) => {
    container.imageBlock = container.querySelector(".rg__image");
    container.imageMask = container.querySelector(".rg__image--mask");
    container.image = container.querySelector(".rg__image--mask img");
    container.text = container.querySelector(".rg__text");
    container.textCopy = container.querySelector(".rg__text--copy");
    container.textCopyMask = container.querySelector(".rg__text--mask");
    container.textCopyMaskPara = container.querySelector(".rg__text--mask p");
    container.bgClolor = container.dataset.color;

    // ! Moving away the mask and image container
    gsap.set([container.imageBlock, container.textCopyMask], {
      yPercent: -101,
    });
    gsap.set([container.imageMask, container.textCopyMaskPara], {
      yPercent: 101,
    });
    gsap.set(container.image, {
      scale: 1.2,
    });

    //! Adding event Listener on mouseleave and enter

    container.addEventListener("mouseleave", hoverSectionReveal);
    container.addEventListener("mouseenter", hoverSectionReveal);
  });
};

//! Getting Height of text
const textHeight = (textCopy) => textCopy.clientHeight;

// ! Making Hover Effect
const hoverSectionReveal = (e) => {
  const {
    imageBlock,
    imageMask,
    text,
    textCopy,
    textCopyMaskPara,
    textCopyMask,
    image,
    bgClolor,
  } = e.target;

  // ! Making TimeLine
  const tl = gsap.timeline({
    defaults: {
      ease: "Power4.out",
      duration: 0.7,
    },
  });

  // ! Checking Event Type

  if (e.type === "mouseleave") {
    tl.to([imageBlock, textCopyMask], {
      yPercent: -101,
    })
      .to(
        [imageMask, textCopyMaskPara],
        {
          yPercent: 100,
        },
        0
      )
      .to(
        text,
        {
          y: 0,
        },
        0
      )
      .to(
        image,
        {
          scale: 1.2,
          duration: 1.2,
        },
        0
      )
      .to(fillBg, { backgroundColor: "#ACB7AE", ease: "none", duration: 1 });
  }

  // ! Checcking Event Type

  if (e.type === "mouseenter") {
    tl.to([imageBlock, imageMask, textCopyMask, textCopyMaskPara], {
      yPercent: 0,
    })
      .to(
        text,
        {
          y: () => -textHeight(textCopy) / 2,
        },
        0
      )
      .to(
        image,
        {
          scale: 1,
          duration: 1.2,
        },
        0
      )
      .to(fillBg, { backgroundColor: bgClolor, ease: "none", duration: 1 }, 0);
  }
};

// ! PortFolio function of link hover and image
// ! DOM ELEMENTS NEDDED
const linksContainer = document.querySelector(".portfolio__categories");
const links = document.querySelectorAll(".portfolio__categories a");
const imageL = document.querySelector(".portfolio__image--l");
const Linside = document.querySelector(".portfolio__image--l .image_inside");
const imageS = document.querySelector(".portfolio__image--s");
const Sinside = document.querySelector(".portfolio__image--s .image_inside");

const portFolio = () => {
  links.forEach((link) => {
    link.addEventListener("mouseenter", portfolioHover);
    link.addEventListener("mouseleave", portfolioHover);
    link.addEventListener("mousemove", portfolioMove);
  });
};

const portfolioMove = (e) => {
  const containerHeight = () => linksContainer.clientHeight;
  gsap.to(imageL, {
    y: -(containerHeight() - e.clientY) / 6,
    duration: 1.2,
    ease: "Power3.inOut",
  });
  gsap.to(imageS, {
    y: -(containerHeight() - e.clientY) / 3,
    duration: 0.8,
    ease: "Power3.inOut",
  });
};

const portfolioHover = (e) => {
  const { imagelarge, color, imagesmall } = e.target.dataset;
  const tl = gsap.timeline();

  if (e.type === "mouseenter") {
    console.log("ENER");

    // ! Filtering the current hover node element

    const siblings = Array.from(links).filter((link) => link !== e.target);

    // ! Creating Timeline
    tl.set(Linside, { backgroundImage: `url(${imagelarge})` })
      .set(Sinside, {
        backgroundImage: `url(${imagesmall})`,
      })
      .to(
        [imageL, imageS],
        {
          autoAlpha: 1,
          duration: 1,
        },
        0
      )
      .to(siblings, { color: "#fff", autoAlpha: 0.2 }, 0)
      .to(e.target, { color: "#fff", autoAlpha: 1 }, 0)
      .to(fillBg, { backgroundColor: color, duration: 1 }, 0);
  }

  if (e.type === "mouseleave") {
    gsap.killTweensOf([imageL, imageS]);

    tl.to(
      [imageL, imageS],
      {
        autoAlpha: 0,
      },
      0
    )
      .to(links, { color: "#000", autoAlpha: 1 }, 0)
      .to(fillBg, { backgroundColor: "#ACB7AE", duration: 1 }, 0);
  }
};

// ! Parallax Image on scroll
const parallax = () => {
  const paralllaxContainer = document.querySelectorAll(".with-parallax");
  paralllaxContainer.forEach((parallax) => {
    const image = parallax.querySelector("img");
    const imageContainer = image.parentElement;

    gsap.to(image, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: imageContainer,
        strat: "top bottom",
        scrub: 1,
        markers: true,
      },
    });
  });
};

// ! PINNING the navbar of parallax

const pinParallaxNav = () => {
  ScrollTrigger.create({
    trigger: ".fixed-nav",
    start: "top center",
    pin: true,
    // pinReparent: true,
    endTrigger: "#stage4",
    end: "center center",
    onEnter: () => console.log("HYYY"),
    markers: true,
  });

  const stages = document.querySelectorAll(".stage");
  const links = document.querySelectorAll(".fixed-nav li");
  stages.forEach((stage, index) => {
    ScrollTrigger.create({
      trigger: stage,
      start: "top center",
      end: () => `+=${stage.clientHeight + window.innerHeight / 10}`,
      toggleClass: {
        targets: links[index],
        className: "is-active",
      },
      onEnter: () => {
        gsap.to(fillBg, {
          backgroundColor: stage.dataset.color,
          duration: 0.5,
        });
      },
      onEnterBack: () => {
        gsap.to(fillBg, {
          backgroundColor: stage.dataset.color,
          duration: 0.5,
        });
      },
      // markers: true,
    });
  });
};

// !  SCROLL to specific section

const scrollTo = () => {
  const links = document.querySelectorAll(".fixed-nav li a");

  links.forEach((link) => {
    const target = link.getAttribute("href");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // ! using smooth scroll to navigate to specific link
      smoothScroll.scrollIntoView(document.querySelector(target), {
        damping: 0.04,
      });
    });
  });
};

const smoothScrollBar = () => {
  // ! Adding smooth scroll behavior
  smoothScroll = Scrollbar.init(document.querySelector("#viewPort"), {
    damping: 0.04,
    renderByPixels: true,
  });

  smoothScroll.track.xAxis.element.remove();

  // ! Making greensock scrolltrigger know about smooth scrolling
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        smoothScroll.scrollTop = value; // setter
      }
      return smoothScroll.scrollTop; // getter
    },
  });

  //! when the smooth scroller updates, tell ScrollTrigger to update() too:
  smoothScroll.addListener(ScrollTrigger.update);
};

function loader() {
  const loaderInner = document.querySelector(".loader .inner");
  const mask = document.querySelector(".loader__image--mask");
  const image = document.querySelector(".loader__image--mask img");
  const line1 = document.querySelector(
    ".loader__title--mask:nth-child(1) span"
  );
  const line2 = document.querySelector(
    ".loader__title--mask:nth-child(2) span"
  );
  const lines = document.querySelectorAll(".loader__title--mask");
  const loaderContent = document.querySelector(".loader__content");

  // ! Loading In Timeline
  const tlLoaderIn = gsap.timeline({
    defaults: {
      duration: 1.1,
      ease: "power2.out",
    },
    onComplete: () => document.body.classList.remove("is-loading"),
  });

  tlLoaderIn
    .set(loaderContent, { autoAlpha: 1 })
    .to(
      loaderInner,
      {
        scaleY: 1,
        transformOrigin: "bottom",
      },
      0.2
    )
    .addLabel("revealImage")
    .from(
      mask,
      {
        yPercent: 100,
      },
      "revealImage-=0.6"
    )
    .from(
      image,
      {
        yPercent: -80,
      },
      "revealImage-=0.6"
    )
    .from(
      [line1, line2],
      {
        yPercent: 100,
        stagger: 0.1,
      },
      "revealImage-=0.4"
    );

  // ! Loading Out Timeline
  const tlLoaderOut = gsap.timeline({
    defaults: {
      duration: 1.2,
      ease: "power2.out",
    },
    delay: 1,
  });

  tlLoaderOut
    .to(
      lines,
      {
        yPercent: -500,
        stagger: 0.2,
      },
      0
    )
    .to(
      [loaderPage, loaderContent],
      {
        yPercent: -100,
      },
      0.2
    )
    .from(
      "#main",
      {
        y: 150,
      },
      0.2
    );

  //! Joining Timeline
  const joinTween = gsap.timeline();

  joinTween.add(tlLoaderIn).add(tlLoaderOut);
}

function init() {
  // loader();
  smoothScrollBar();
  pinParallaxNav();
  parallax();
  scrollTo();
  navbar();
  imageToTilt();
  revealImage();
  portFolio();
}

const mq = window.matchMedia("(min-width: 768px)");
console.log(mq);

mq.addEventListener("change", handleChange);

window.addEventListener("load", function () {
  handleChange(mq);
});

// ! RESET ALL PROPS

const resetProps = (elements) => {
  gsap.killTweensOf(elements);
  elements.forEach((el) => {
    el &&
      gsap.set(el, {
        clearProps: "all",
      });
  });
};

function handleChange(e) {
  if (!e.matches) {
    imageContainer.forEach((container) => {
      container.removeEventListener("mouseleave", hoverSectionReveal);
      container.removeEventListener("mouseenter", hoverSectionReveal);
      const {
        imageBlock,
        imageMask,
        text,
        textCopy,
        textCopyMaskPara,
        textCopyMask,
        image,
      } = container;
      // ! Reseting Props
      resetProps([
        imageBlock,
        imageMask,
        text,
        textCopy,
        textCopyMaskPara,
        textCopyMask,
        image,
      ]);
    });
  } else {
    console.log("CHANGE HAPPENS");

    init();
  }
}

// ! Custom SMOOTH SCROLL
// const main = document.querySelector("#scroll-container");
// const html = document.querySelector("html");
// let height;
// const setHeight = () => {
//   height = main.clientHeight;
//   document.body.style.height = `${height}px`;
//   console.log("TRIGGERS", height);
// };

// ScrollTrigger.addEventListener("refreshInit", setHeight);

// gsap.to(main, {
//   ease: "none",
//   y: () => {
//     return -(height - document.documentElement.clientHeight);
//   },
//   scrollTrigger: {
//     trigger: document.body,
//     start: "top top",
//     end: "bottom bottom",
//     scrub: 1,
//     invalidateOnRefresh: true,
//     markers: true,
//   },
// });
