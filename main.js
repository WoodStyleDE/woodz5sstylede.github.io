document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.getElementById("burgerBtn");
    const navMenu = document.getElementById("navMenu");
    
    // Создаем кнопку закрытия для мобильного меню (крестик)
    const closeBtn = document.createElement("button");
    closeBtn.className = "mobile-close-btn";
    closeBtn.innerHTML = "&times;";
    if (navMenu) navMenu.prepend(closeBtn);

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
            navMenu.classList.toggle("active");
            document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
        });
        closeBtn.addEventListener("click", closeMenu);
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

    // ==========================================
    // SPA: ПЕРЕХОД БЕЗ ПЕРЕЗАГРУЗКИ СТРАНИЦЫ
    // ==========================================
    document.body.addEventListener("click", async (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        
        // Игнорируем внешние ссылки, мессенджеры и пустые ссылки
        if (!href || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;

        // Если это якорная ссылка на этой же странице (например, #schneidebretter)
        if (href.startsWith("#")) return;

        // Отделяем путь от хэша (katalog.html#schneidebretter)
        const urlParts = href.split("#");
        const targetPath = urlParts[0];
        const targetHash = urlParts.length > 1 ? `#${urlParts[1]}` : null;

        // Если мы уже на этой странице, просто скроллим к якорю (если он есть)
        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        if (currentPath === targetPath) {
            if (targetHash) {
                const targetEl = document.querySelector(targetHash);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
            }
            closeMenu();
            return;
        }

        e.preventDefault(); // Отменяем стандартную перезагрузку

        try {
            const response = await fetch(targetPath);
            if (!response.ok) throw new Error("Page not found");
            
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            
            const newMain = doc.querySelector("main").innerHTML;
            const newTitle = doc.querySelector("title").innerText;

            const currentMain = document.querySelector("main");
            
            // Плавное исчезновение
            currentMain.style.opacity = "0";
            currentMain.style.transform = "translateY(10px)";
            
            setTimeout(() => {
                // Подмена контента
                currentMain.innerHTML = newMain;
                document.title = newTitle;
                
                // Скролл к якорю или вверх
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
                
                // Плавное появление
                currentMain.style.opacity = "1";
                currentMain.style.transform = "translateY(0)";
            }, 200);

            // Обновляем URL
            history.pushState(null, "", href);

            // Обновляем активный класс в меню
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            const activeLink = document.querySelector(`.nav-link[href^="${targetPath}"]`);
            if (activeLink) activeLink.classList.add("active");

            closeMenu(); // Закрываем меню на мобилке

        } catch (error) {
            console.error("Ошибка навигации:", error);
            window.location.href = href; // Если что-то пошло не так, грузим страницу стандартно
        }
    });

    // Обработка кнопки "Назад" в браузере
    window.addEventListener("popstate", () => {
        window.location.reload();
    });
});