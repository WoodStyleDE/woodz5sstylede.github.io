document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.getElementById("burgerBtn");
    const navMenu = document.getElementById("navMenu");
    
    function closeMenu() {
        if (navMenu) navMenu.classList.remove("active");
        if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "false");
        const dropdown = document.querySelector(".dropdown");
        if (dropdown) dropdown.classList.remove("open");
        document.body.style.overflow = ""; 
    }

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isActive = navMenu.classList.toggle("active");
            document.body.style.overflow = isActive ? "hidden" : "";
            burgerBtn.setAttribute("aria-expanded", String(isActive));
        });
    }

    // Дропдаун в мобильном меню
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    if (dropdownToggle) {
        dropdownToggle.addEventListener("click", (e) => {
            if (window.innerWidth <= 850) {
                e.preventDefault();
                e.stopPropagation();
                document.querySelector(".dropdown").classList.toggle("open");
            }
        });
    }

    // SPA: ПЕРЕХОД БЕЗ ПЕРЕЗАГРУЗКИ СТРАНИЦЫ
    document.body.addEventListener("click", async (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        
        if (!href || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
        if (href.startsWith("#")) return;

        const urlParts = href.split("#");
        const targetPath = urlParts[0];
        const targetHash = urlParts.length > 1 ? `#${urlParts[1]}` : null;

        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        if (currentPath === targetPath) {
            if (targetHash) {
                const targetEl = document.querySelector(targetHash);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
            }
            closeMenu();
            return;
        }

        e.preventDefault();

        try {
            const response = await fetch(targetPath);
            if (!response.ok) throw new Error("Page not found");
            
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            
            const newMain = doc.querySelector("main").innerHTML;
            const newTitle = doc.querySelector("title").innerText;

            const currentMain = document.querySelector("main");
            
            currentMain.style.opacity = "0";
            currentMain.style.transform = "translateY(10px)";
            
            setTimeout(() => {
                currentMain.innerHTML = newMain;
                document.title = newTitle;
                
                if (targetHash) {
                    const targetEl = document.querySelector(targetHash);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                
                currentMain.style.opacity = "1";
                currentMain.style.transform = "translateY(0)";
            }, 200);

            history.pushState(null, "", href);

            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            const activeLink = document.querySelector(`.nav-link[href^="${targetPath}"]`);
            if (activeLink) activeLink.classList.add("active");

            closeMenu();

        } catch (error) {
            console.error("Ошибка навигации:", error);
            window.location.href = href;
        }
    });

    window.addEventListener("popstate", () => {
        window.location.reload();
    });
});