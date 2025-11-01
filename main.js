
// Чекаємо, поки вся HTML-сторінка завантажиться
document.addEventListener('DOMContentLoaded', function() {

    // 1. Знаходимо елементи: кнопку-бургер і саму навігацію
    const menuToggle = document.querySelector('.header__menu-toggle');
    const headerNav = document.querySelector('.header__nav');
    const body = document.querySelector('body');

    // 2. Перевіряємо, чи ми їх взагалі знайшли
    if (menuToggle && headerNav) {
        
        // 3. Вішаємо "слухача" на клік по бургеру
        menuToggle.addEventListener('click', function() {
            
            // 4. При кліку - додаємо/прибираємо клас 'is-active' 
            //    для самої кнопки (щоб вона стала "X")
            menuToggle.classList.toggle('is-active');
            
            //    ... і для навігації (щоб вона з'явилась)
            headerNav.classList.toggle('is-active');

            //    ... і для body (щоб заблокувати скрол сторінки)
            body.classList.toggle('no-scroll');
        });
    }
});
