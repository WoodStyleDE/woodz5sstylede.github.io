// Мобильное меню. Переходы между страницами обычные (без SPA):
// плавность даёт CSS @view-transition, шапка и подвал одинаковы на всех страницах.
document.addEventListener("DOMContentLoaded", () => {
    const burgerBtn = document.getElementById("burgerBtn");
    const navMenu = document.getElementById("navMenu");
    if (!burgerBtn || !navMenu) return;

    function setMenu(open) {
        navMenu.classList.toggle("active", open);
        burgerBtn.setAttribute("aria-expanded", String(open));
        burgerBtn.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
        document.body.style.overflow = open ? "hidden" : "";
    }

    burgerBtn.addEventListener("click", () => setMenu(!navMenu.classList.contains("active")));

    // Закрытие: Esc, клик по ссылке, переход на широкий экран
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navMenu.classList.contains("active")) {
            setMenu(false);
            burgerBtn.focus();
        }
    });
    navMenu.addEventListener("click", (e) => {
        if (e.target.closest("a")) setMenu(false);
    });
    window.matchMedia("(min-width: 851px)").addEventListener("change", (e) => {
        if (e.matches) setMenu(false);
    });
});
