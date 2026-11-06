gsap.registerPlugin(SplitText);

const page = document.querySelector(".page");
const menuToggle = document.querySelector(".menu-toggle");
const menuCol = document.querySelectorAll(".menu-col");
const mobile = window.matchMedia("(max-width: 999px)");

const lenis = new Lenis({ wrapper: page, content: page, autoRaf: true });

SplitText.create(".menu-col a", {
    type: "words",
    wordsClass: "word",
    mask: "words",
});

let isMenuHidden = false;

lenis.on("scroll", ({ direction }) => {
    const hide = direction == 1;
    if (hide == isMenuHidden) return;
    isMenuHidden = hide;

    /*gsap.to(navLogo, {
        x: hide ? -300 : 0,
        diration: 1.5,
        ease: "power3.out",
        overwrite: true,
    });*/
    gsap.to(menuToggle, {
        x: hide ? 300 : 0,
        duration: 1,
        ease: "power3.out",
        overwrite: true,
    });
});

let isMenuOpen = false
let t1;

menuToggle.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    menuToggle.classList.toggle("open", isMenuOpen);
    document.body.classList.toggle("menu-open", isMenuOpen);
    isMenuOpen ? lenis.stop() : lenis.start();

    t1?.kill();
    t1 = gsap.timeline();

    t1.to(page, {
        y: isMenuOpen ? (mobile.matches ? "65svh" : "50svh") : 0,
        scale: isMenuOpen ? (mobile.matches ? 0.85 : 0.95) : 1,
        borderRadius: isMenuOpen ? "20px" : "0px",
        duration: 1.5,
        ease: "power3.inOut",
    });

    menuCol.forEach((col) => {
        col.querySelectorAll("a").forEach((link, i) => {
            t1.to(
                link.querySelectorAll(".word"),
                {
                    y: isMenuOpen ? "0%" : "100%",
                    duration: isMenuOpen ? 1 : 0.75,
                    ease: "power3.out",
                },
                isMenuOpen ? 0.65 + i * 0.1 : 0.1,
            );
        });
    });
});