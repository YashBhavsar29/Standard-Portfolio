const isProjectPage = window.location.pathname.includes("/projects/");
const rootPath = isProjectPage ? "../" : "./";

const fallbackPartials = {
    "components/header": `
        <header class="nav">
            <a href="#home" class="logo" aria-label="Yash Bhavsar home">Yash B.</a>
            <ul class="nav-links" id="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#resume">Resume</a></li>
            </ul>
            <div class="nav-right">
                <a class="icon-btn social-link social-link--linkedin" href="https://www.linkedin.com/in/your-handle" target="_blank" rel="noopener" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a class="icon-btn social-link social-link--github" href="https://github.com/your-handle" target="_blank" rel="noopener" aria-label="GitHub">
                    <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                </a>
                <a class="icon-btn social-link social-link--mail" href="mailto:your-email@example.com" aria-label="Email">
                    <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                </a>
                <span class="divider" aria-hidden="true"></span>
                <button class="icon-btn" id="theme-toggle" type="button" aria-label="Switch to light theme">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                </button>
                <button class="icon-btn menu-toggle" id="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">
                    <svg viewBox="0 0 24 24"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
                </button>
            </div>
        </header>`,
    "components/footer": `
        <footer>
            <span>© <span id="year"></span> Yash Bhavsar</span>
            <a href="#home">yashbhavsar.dev</a>
        </footer>`,
};

const loadPartial = async (name) => {
    const target = document.querySelector(`[data-include="${name}"]`);
    if (!target) {
        throw new Error(`Missing include target: [data-include="${name}"]`);
    }

    if (window.location.protocol === "file:") {
        target.innerHTML = fallbackPartials[name];
        return;
    }

    try {
        const partialUrl = new URL(`${rootPath}${name}.html`, document.baseURI);
        const response = await fetch(partialUrl);

        if (!response.ok) {
            throw new Error(`Unable to load ${partialUrl}: ${response.status}`);
        }

        const componentDocument = new DOMParser().parseFromString(
            await response.text(),
            "text/html",
        );
        target.innerHTML = componentDocument.body.innerHTML;
    } catch (error) {
        console.warn(`Using embedded fallback for ${name}.`, error);
        target.innerHTML = fallbackPartials[name];
    }
};

const initializePage = async () => {
    await Promise.all([loadPartial("components/header"), loadPartial("components/footer")]);

    const homeUrl = isProjectPage ? "../index.html" : "index.html";

    document.querySelectorAll(".nav-links a").forEach((link) => {
        const target = link.getAttribute("href");
        link.href = isProjectPage ? `${homeUrl}${target}` : target;
    });
    document.querySelector(".logo").href = isProjectPage
        ? `${homeUrl}#home`
        : "#home";
    document.querySelector("footer a").href = `${homeUrl}#home`;

    if (!isProjectPage) {
        document.querySelector('.nav-links a[href="#home"]').setAttribute(
            "aria-current",
            "page",
        );
    }

    document.getElementById("year").textContent = new Date().getFullYear();

    const heroImage = document.querySelector(".hero img");
    const updateHeroImage = (lightTheme) => {
        if (heroImage) {
            heroImage.src = lightTheme
                ? "portfolio-hero-white.png"
                : "portfolio-hero.png";
        }
    };
    updateHeroImage(document.documentElement.dataset.theme === "light");

    const toggle = document.getElementById("menu-toggle");
    const links = document.getElementById("nav-links");
    toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
    });
    links.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    });

    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", () => {
        const lightTheme =
            document.documentElement.dataset.theme !== "light";
        document.documentElement.dataset.theme = lightTheme ? "light" : "dark";
        updateHeroImage(lightTheme);
        themeToggle.setAttribute(
            "aria-label",
            lightTheme ? "Switch to dark theme" : "Switch to light theme",
        );
        themeToggle.querySelector("svg").innerHTML = lightTheme
            ? '<path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5z"/>'
            : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
    });

    const header = document.querySelector(".nav");
    const updateHeader = () => {
        const scrolled = window.scrollY > 40;
        header.classList.toggle("visible", scrolled);
        if (!scrolled) {
            links.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    };
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    // ---- "Other Notable Projects" expand/collapse (home page only) ----
    const otherToggle = document.getElementById("other-toggle");
    if (otherToggle) {
        const otherProjects = Array.from(
            document.querySelectorAll(".other-project"),
        );
        const otherToggleCopy = document.getElementById("other-toggle-copy");
        const count = otherProjects.length;
        const collapsedCopy =
            count === 1
                ? "1 more project — click to reveal"
                : `${count} more projects — click to reveal`;

        if (otherToggleCopy) {
            otherToggleCopy.textContent = collapsedCopy;
        }

        otherToggle.addEventListener("click", () => {
            const expanded =
                otherToggle.getAttribute("aria-expanded") === "true";
            otherToggle.setAttribute("aria-expanded", String(!expanded));

            otherProjects.forEach((card) => {
                card.hidden = expanded;
            });

            if (otherToggleCopy) {
                otherToggleCopy.textContent = expanded
                    ? collapsedCopy
                    : "Click to collapse";
            }
        });
    }

    const fill = document.getElementById("progress-fill");
    if (fill) {
        const updateProgress = () => {
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const pct =
                docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            fill.style.width = `${pct}%`;
        };

        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
    }
};

initializePage().catch((error) => {
    console.error("Page initialization failed:", error);

    const message = document.createElement("p");
    message.textContent =
        "Shared header and footer could not be loaded. Open this page through a local web server, such as VS Code Live Server.";
    message.style.cssText =
        "padding: 16px; color: #f4f4f4; background: #7c0000; font-family: system-ui, sans-serif;";
    document.body.prepend(message);
});