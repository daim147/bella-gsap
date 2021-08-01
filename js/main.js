gsap.registerPlugin(ScrollTrigger);

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
      console.log("I AM ENTER");
      animateNav(obj.direction);
    },
    onLeaveBack: ({ direction }) => {
      console.log("I AM Leave BACK");
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

  console.log(xPos, "X POS", yPos, "Y POS");

  const imagesLeft = document.querySelectorAll(".hg__left .hg__image");
  const imagesRight = document.querySelectorAll(".hg__right .hg__image");

  imagesLeft.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2,
      x: xPos * 40 * (index * 1.2 + 0.5),
      y: yPos * 30 * (index * 1.2 + 0.5),
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

function init() {
  navbar();
  imageToTilt();
}

window.addEventListener("load", function () {
  init();
});
