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

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("click", () => {
            playSound("clickSound");
        });
    });
})