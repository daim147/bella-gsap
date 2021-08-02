gsap.registerPlugin(ScrollTrigger);

const imageContainer = document.querySelectorAll(".rg__column");

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
    markers: true,
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
      rotateX: xPos * 10,
      rotateY: yPos * 40,
      ease: "Power3.out",
    });
  });
  imagesRight.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2,
      x: xPos * 40 * (index * 1.2 + 0.5),
      y: -(yPos * 30 * (index * 1.2 + 0.5)),
      rotateX: xPos * 10,
      rotateY: yPos * 40,
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
      );
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
      );
  }
};

function init() {
  navbar();
  imageToTilt();
  // revealImage();
}

window.addEventListener("load", function () {
  init();
});

const mq = window.matchMedia("(min-width: 768px)");
console.log(mq);

mq.addEventListener("change", handleChange);

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
    revealImage();
  }
}
