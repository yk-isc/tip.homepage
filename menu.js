gsap.registerPlugin(SplitText);

const page = document.querySelector(".page");
const menuToggle = document.querySelector(".menu-toggle");
const menuCol = document.querySelectorAll(".menu-col");
const mobile = window.matchMedia("(max-width: 999px)");
const desktop = 1000;
const tiltMax = 25;
const driftMax = 25;
const smoothing = 0.075;

const lenis = new Lenis({ wrapper: page, content: page, autoRaf: true });

const cardOpen = { width: "18rem", height: "14rem", borderRadius: "0.4rem" };
const cardClosed = { width: "0.4em", height: "0.4em", borderRadius: "0.04em" };

const cardCenter = {
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    xPercent: -50,
    yPercent: -50,
};

const isDesktop = () => window.innerWidth >= desktop;

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

/* cards in the nav */
document.querySelectorAll(".nav-hover").forEach((hov) => {
    const card = spot.querySelector(".nav-img");
    const image = spot.querySelector("img")

    const live = { x: 0, y: 0, tiltX: 0, tiltY: 0};
    const aim = { x: 0, y: 0, tiltX: 0, tiltY: 0};

    let isHovering = false;
    let frame = null;

    const startTracking = () => {
        frame = () => {
            live.x += (aim.x - live.x) * smoothing;
            live.y += (aim.y - live.y) * smoothing;

            live.tiltX += (aim.tiltX - live.tiltX) * smoothing;
            live.tiltY += (aim.tiltY - live.tiltY) * smoothing;

            gsap.set(card, {
                x: live.x,
                y: live.y,
                rotateX: live.tiltX,
                rotateY: live.tiltY,
            });

            gsap.set(image, { x: -live.x, y: -live.y});
        };

        gsap.ticker.add(frame);
    };

    const stopTracking = () => {
        gsap.ticker.remove(frame);
        frame = null;
    };

    const expandCard = () => {
        if (!isDesktop()) return;

        isHovering = true;

        Object.assign(live, { x: 0, y: 0, tiltX: 0, tiltY: 0 });
        Object.assign(aim, { x: 0, y: 0, tiltX: 0, tiltY: 0 });

        gsap.set(card, cardCenter);
        gsap.set(image, { x: 0, y: 0 });

        startTracking();

        gsap.to(card, {
            ...cardOpen,
            duration: 0.75,
            ease: "power3.out",
            overwrite: "auto",
        });

        gsap.to(image, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
        });
    };

    hov.addEventListener("mouseenter", expandCard);
    const aimAtCursor = (event) => {
        if (!isHovering || !isDesktop()) return;

        const bounds = hov.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        let offsetX = event.clientX - centerX;
        let offsetY = event.clientY - centerY;

        const distance = Math.hypot(offsetX, offsetY);

        if (distance > driftMax) {
            const scale = driftMax / distance;
            offsetX *= scale;
            offsetY *= scale;
        }

        aim.x = offsetX;
        aim.y = offsetY;

        const hovBounds = hov.getBoundingClientRect();
        const ratioX = (event.clientX - centerX) / (hovBounds.width / 2);
        const ratioY = (event.clientY - centerY) / (hovBounds.height / 2);

        const clamp = (value) => Math.max(-1, Math.min(1, value));
        aim.tiltX = clamp(ratioY) * tiltMax;
        aim.tiltY = clamp(ratioX) * -tiltMax;
    };

    hov.addEventListener("mousemove", aimAtCursor);

    const shrinkCard = () => {
        if (!isDesktop()) return;

        isHovering = false;
        aim.tiltX = aim.tiltY = 0;

        stopTracking();

        gsap.to(card, {
            ...cardClosed,
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
            onComplete: () => {
                if (isHovering) return;

                gsap.set(card, {
                    clearProps: "width,height,borderRadius",
                    ...cardCenter,
                });

                gsap.set(image, { x: 0, y: 0 });
            },
        });
            

        gsap.to(image, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            overwrite: "auto",
        });
    };

    hov.addEventListener("mouseleave", shrinkCard);
});