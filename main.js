document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.getElementById("burgerBtn");
    const navMenu = document.getElementById("navMenu");
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdown = document.querySelector(".dropdown");

    // Универсальная функция закрытия всех мобильных и выпадающих меню
    function closeMenu() {
        if (navMenu) {
            navMenu.classList.remove("active");
        }
        if (burgerBtn) {
            burgerBtn.setAttribute("aria-expanded", "false");
        }
        if (dropdown) {
            dropdown.classList.remove("open");
        }
        if (dropdownToggle) {
            dropdownToggle.setAttribute("aria-expanded", "false");
        }
    }

    // Обработка клика по бургер-кнопке
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle("active");
            burgerBtn.setAttribute("aria-expanded", String(isOpen));
        });

        // Закрываем меню при клике вне его области
        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
                closeMenu();
            }
        });

        // Закрываем мобильное меню при переходе по ссылке (кроме самого дропдауна)
        navMenu.querySelectorAll("a").forEach(link => {
            if (!link.classList.contains("dropdown-toggle")) {
                link.addEventListener("click", closeMenu);
            }
        });
    }

    // Обработка аккордеона/дропдауна "Katalog" на мобильных экранах
    if (dropdownToggle && dropdown) {
        dropdownToggle.setAttribute("aria-haspopup", "true");

        dropdownToggle.addEventListener("click", (e) => {
            if (window.innerWidth <= 850) {
                e.preventDefault();
                const isOpen = dropdown.classList.toggle("open");
                dropdownToggle.setAttribute("aria-expanded", String(isOpen));
            }
        });
    }

    // Доступность: закрытие по нажатию клавиши Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMenu();
        }
    });

    // Сброс состояний при смене разрешения (например, поворот экрана)
    window.addEventListener("resize", () => {
        if (window.innerWidth > 850) {
            closeMenu();
        }
    });
});