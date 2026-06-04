const puppeteer = require('puppeteer');

const baseUrl = 'http://localhost:8080';

describe('Trip Calendar E2E Tests', () => {
    let browser;
    let page;

    // 1. Запускаем браузер перед началом всех тестов
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true, // Запуск в фоновом режиме
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Безопасность для Linux/GitHub Actions
        });
        page = await browser.newPage();
    });

    // 2. Обязательно закрываем браузер после окончания тестов
    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    // 3. Перед каждым тестом открываем главную страницу с чистого листа
    beforeEach(async () => {
        await page.goto(baseUrl);
    });

    // ТЕСТ 1: Проверяем, открывается ли календарь "Туда" при клике на инпут
    test('should show departure calendar popover when departure input is clicked', async () => {
        const departureInput = await page.$('#departure-input');
        await departureInput.click();

        // Проверяем прямо в браузере, что у календаря исчез класс 'hidden'
        const isPopoverVisible = await page.evaluate(() => {
            const popover = document.querySelector('#departure-calendar');
            return popover && !popover.classList.contains('hidden');
        });

        expect(isPopoverVisible).toBe(true);
    });

    // ТЕСТ 2: Проверяем, разблокируется ли инпут "Обратно" при клике на чекбокс
    test('should enable return input when "Round trip" checkbox is checked', async () => {
        const checkbox = await page.$('#round-trip-toggle');
        await checkbox.click();

        // Проверяем, что с поля снялся атрибут disabled
        const isReturnInputEnabled = await page.evaluate(() => {
            const returnInput = document.querySelector('#return-input');
            return returnInput && !returnInput.hasAttribute('disabled');
        });

        expect(isReturnInputEnabled).toBe(true);
    });
});