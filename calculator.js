// Чекаємо, поки вся HTML-сторінка завантажиться
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Знаходимо нашу форму і блок результатів
    const calcForm = document.getElementById('calcForm');
    const calcResults = document.getElementById('calcResults');

    // 2. "Слухаємо", коли користувач натисне кнопку "Розрахувати"
    calcForm.addEventListener('submit', function(event) {
        
        // Забороняємо формі перезавантажувати сторінку
        event.preventDefault(); 
        
        // Виконуємо розрахунок
        calculate();
    });

    // 3. Головна функція розрахунку (за твоїми формулами)
    function calculate() {
        
        // === КРОК 1: Збираємо вхідні дані ===
        // Використовуємо parseFloat, щоб перетворити текст з полів на числа
        const fanPower_W = parseFloat(document.getElementById('fanPower_W').value) || 0;
        const fanCount = parseFloat(document.getElementById('fanCount').value) || 0;
        const otherLoad_W = parseFloat(document.getElementById('otherLoad_W').value) || 0;
        const hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value);
        const autonomyDays = parseFloat(document.getElementById('autonomyDays').value) || 0;
        const capacityFactor = parseFloat(document.getElementById('capacityFactor').value);
        const systemLossPercent = parseFloat(document.getElementById('systemLossPercent').value);

        // === КРОК 2: Валідація (перевірка) ===
        // Перевіряємо, чи заповнені ключові поля
        if (!hoursPerDay || !capacityFactor || !systemLossPercent || (fanPower_W === 0 && otherLoad_W === 0)) {
            calcResults.innerHTML = `
                <p class="results-placeholder" style="color: red;">
                    Будь ласка, заповніть всі поля з навантаженням (Вт), годинами роботи та параметрами системи.
                </p>`;
            return; // Зупиняємо функцію
        }
        
        // === КРОК 3: Виконуємо розрахунки (за твоїм ТЗ) ===

        // P_total_W = P_fans_W + P_other_W
        const P_total_W = (fanPower_W * fanCount) + otherLoad_W;

        // E_daily_kWh = (P_total_W * H) / 1000
        const E_daily_kWh = (P_total_W * hoursPerDay) / 1000;

        // Loss_factor = 1 + system_losses_percent/100
        const Loss_factor = 1 + (systemLossPercent / 100);

        // Total_energy_needed_kWh = E_daily_kWh * Autonomy_days * Loss_factor
        // *Якщо автономія = 0, ми все одно маємо покрити ДОБОВЕ споживання*
        // *Тому замість Autonomy_days ставимо 1, якщо воно 0*
        const daysToCover = autonomyDays > 0 ? autonomyDays : 1;
        const Total_energy_needed_kWh = E_daily_kWh * daysToCover * Loss_factor;
        
        // Energy_per_1kW_per_day_kWh = 24 * CF
        const Energy_per_1kW_per_day_kWh = 24 * capacityFactor;

        // Required_kW = Total_energy_needed_kWh / (24 * CF)
        const Required_kW = Total_energy_needed_kWh / Energy_per_1kW_per_day_kWh;
        
        // === КРОК 4: Округлення та вибір турбін (за твоїм ТЗ) ===
        
        // Округлимо до однієї цифри після коми
        const required_kW_rounded = Math.ceil(Required_kW * 10) / 10;
        
        // Логіка для підбору турбін (як у твоєму прикладі з 9.6 -> 10)
        let recommended_kW = 0;
        let turbines_count = 0;
        let turbine_model = 0;

        if (required_kW_rounded <= 5) {
            recommended_kW = 5;
            turbines_count = 1;
            turbine_model = 5;
        } else if (required_kW_rounded <= 10) {
            recommended_kW = 10;
            turbines_count = 1; // або 2 по 5
            turbine_model = 10; // (або 2 x 5 кВт)
        } else {
            // Якщо потрібно більше 10, рахуємо кількість 10кВт турбін
            recommended_kW = Math.ceil(required_kW_rounded / 10) * 10;
            turbines_count = recommended_kW / 10;
            turbine_model = 10;
        }


        // === КРОК 5: Виводимо результат у HTML ===
        // Ми генеруємо новий HTML-код і вставляємо його в блок результатів
        
        calcResults.innerHTML = `
            <style>
                .result-item {
                    margin-bottom: var(--spacing-lg);
                    border-bottom: 1px dashed var(--color-border);
                    padding-bottom: var(--spacing-md);
                }
                .result-item:last-child {
                    border-bottom: none;
                }
                .result-item strong {
                    font-size: 1.1rem;
                    color: var(--color-text-secondary);
                    display: block;
                }
                .result-item span {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--color-primary-dark);
                }
                .result-item span.highlight {
                    color: var(--color-accent); /* Зелений акцент */
                    font-size: 2.2rem;
                }
            </style>

            <div class="result-item">
                <strong>Добове споживання (E_daily_kWh):</strong>
                <span>${E_daily_kWh.toFixed(2)} кВт·год</span>
            </div>
            
            <div class="result-item">
                <strong>Потрібна потужність (Required_kW):</strong>
                <span>${required_kW_rounded.toFixed(1)} кВт</span>
            </div>
            
            <div class="result-item">
                <strong>Рекомендована система:</strong>
                <span class="highlight">${turbines_count} x ${turbine_model} кВт</span>
            </div>
        `;
    }
});
