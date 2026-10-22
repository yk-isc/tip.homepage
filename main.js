function playSound(soundName) {
    const audio = document.querySelector("#" + soundName);
    if (!audio) return;

    audio.muted = false;
    audio.volume = 1; // change volume here if needed

    if (audio.readyState < 4 || !audio.duration) {
        audio.load();
        audio.addEventListener(
            "canplaythrough",
            () => {
                audio
                    .play()
                    .catch((err) =>
                    console.error("Playback of " + soundName + " failed:", err),
                    );
            },
            { once: true },
        );
    } else {
        audio
        .play()
        .catch((err) =>
            console.error("Playback of " + soundName + " failed:", err),
        );
    }
}

window.addEventListener("mousemove", (e)=>{
    let cursor = document.getElementById("cursor");
    setTimeout(()=>{
        cursor.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;
    }, 100)

    let hovered = e.target.closest(".window");
    document.querySelectorAll(".window.activity").forEach(win => {
        if (win === hovered) {
            win.classList.add("activity")

            const handles = win.querySelectorAll(".handle");
            handles.forEach(handle => {
                handle.style.backgroundColor = "var(--secondary-color)";
            })
        }
        else {
            win.classList.remove("activity");

            const handles = win.querySelectorAll(".handle");
            handles.forEach(handle => {
                handle.style.backgroundColor = "white";
            })
        }
    })

    if (hovered) {
        hovered.classList.add("activity")
    }

    cursor.classList.toggle("active", !!e.target.closest(".window"));
    cursor.classList.toggle("shrink", !!e.target.closest('.retro'));
})

document.addEventListener("DOMContentLoaded", function () {
    function updateTime() {
        const text = document.getElementById("time");
        if (text) {
            text.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }

    updateTime();
    setInterval(updateTime, 1000);

    function darkHour() {
        const hour = new Date().getHours();
        const dark = 22;
        const mainTime = document.getElementById("main-time");

        if (hour === dark) {
            mainTime.style.backgroundColor = "rgba(0, 167, 225, 1)";
            mainTime.style.boxShadow = "inset 0 4px 20px rgba(255,255,255,.5)";
            mainTime.style.color = "var(--main-text)";
        }
    }

    darkHour();
})