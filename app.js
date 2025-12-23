// Полный список неправильных глаголов
const ALL_VERBS = [
    {infinitive: "be", past: "was/were", participle: "been", translation: "быть"},
    {infinitive: "have", past: "had", participle: "had", translation: "иметь"},
    {infinitive: "do", past: "did", participle: "done", translation: "делать"},
    {infinitive: "go", past: "went", participle: "gone", translation: "идти"},
    {infinitive: "see", past: "saw", participle: "seen", translation: "видеть"},
    {infinitive: "come", past: "came", participle: "come", translation: "приходить"},
    {infinitive: "take", past: "took", participle: "taken", translation: "брать"},
    {infinitive: "make", past: "made", participle: "made", translation: "делать"},
    {infinitive: "know", past: "knew", participle: "known", translation: "знать"},
    {infinitive: "get", past: "got", participle: "got/gotten", translation: "получать"},
    {infinitive: "think", past: "thought", participle: "thought", translation: "думать"},
    {infinitive: "find", past: "found", participle: "found", translation: "находить"},
    {infinitive: "tell", past: "told", participle: "told", translation: "рассказывать"},
    {infinitive: "become", past: "became", participle: "become", translation: "становиться"},
    {infinitive: "show", past: "showed", participle: "shown/showed", translation: "показывать"},
    {infinitive: "leave", past: "left", participle: "left", translation: "оставлять"},
    {infinitive: "feel", past: "felt", participle: "felt", translation: "чувствовать"},
    {infinitive: "put", past: "put", participle: "put", translation: "класть"},
    {infinitive: "bring", past: "brought", participle: "brought", translation: "приносить"},
    {infinitive: "begin", past: "began", participle: "begun", translation: "начинать"},
    {infinitive: "keep", past: "kept", participle: "kept", translation: "хранить"},
    {infinitive: "hold", past: "held", participle: "held", translation: "держать"},
    {infinitive: "write", past: "wrote", participle: "written", translation: "писать"},
    {infinitive: "stand", past: "stood", participle: "stood", translation: "стоять"},
    {infinitive: "hear", past: "heard", participle: "heard", translation: "слышать"},
    {infinitive: "grow", past: "grew", participle: "grown", translation: "расти"},
    {infinitive: "draw", past: "drew", participle: "drawn", translation: "рисовать"},
    {infinitive: "mean", past: "meant", participle: "meant", translation: "означать"},
    {infinitive: "meet", past: "met", participle: "met", translation: "встречать"},
    {infinitive: "read", past: "read", participle: "read", translation: "читать"}
];

// Состояние игры
const GameState = {
    mode: 'practice', // 'practice' или 'test'
    testMode: 'allColumns',
    selectedVerbs: [],
    usedInTest: [],
    startTime: null,
    timerInterval: null,
    currentScreen: 'setup'
};

// DOM элементы
const screens = {
    setup: document.getElementById('setupScreen'),
    game: document.getElementById('gameScreen'),
    results: document.getElementById('resultsScreen')
};

// Элементы управления
const elements = {
    // Настройки
    gameMode: document.getElementById('gameMode'),
    verbCount: document.getElementById('verbCount'),
    testModeGroup: document.getElementById('testModeGroup'),
    testMode: document.getElementById('testMode'),
    startBtn: document.getElementById('startBtn'),
    
    // Игровой экран
    gameTitle: document.getElementById('gameTitle'),
    testModeInfo: document.getElementById('testModeInfo'),
    testModeText: document.getElementById('testModeText'),
    verbsTableBody: document.getElementById('verbsTableBody'),
    checkBtn: document.getElementById('checkBtn'),
    restartBtn: document.getElementById('restartBtn'),
    newGameBtn: document.getElementById('newGameBtn'),
    backBtn: document.getElementById('backBtn'),
    timer: document.getElementById('timer'),
    timeDisplay: document.getElementById('timeDisplay'),
    
    // Результаты
    scoreDisplay: document.getElementById('scoreDisplay'),
    resultMessage: document.getElementById('resultMessage'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    correctCount: document.getElementById('correctCount'),
    totalCount: document.getElementById('totalCount'),
    percentage: document.getElementById('percentage'),
    timeResult: document.getElementById('timeResult'),
    restartFromResultsBtn: document.getElementById('restartFromResultsBtn'),
    newGameFromResultsBtn: document.getElementById('newGameFromResultsBtn'),
    backFromResultsBtn: document.getElementById('backFromResultsBtn')
};

// Инициализация игры
function initGame() {
    console.log('Игра инициализирована');
    
    // Обработчики на экране настроек
    elements.gameMode.addEventListener('change', handleGameModeChange);
    elements.startBtn.addEventListener('click', startGame);
    
    // Обработчики на игровом экране
    elements.checkBtn.addEventListener('click', checkAnswers);
    elements.restartBtn.addEventListener('click', restartGame);
    elements.newGameBtn.addEventListener('click', newGame);
    elements.backBtn.addEventListener('click', function() {
        showScreen('setup');
    });
    
    // Обработчики на экране результатов
    elements.restartFromResultsBtn.addEventListener('click', restartGame);
    elements.newGameFromResultsBtn.addEventListener('click', newGame);
    elements.backFromResultsBtn.addEventListener('click', function() {
        showScreen('setup');
    });
    
    // Установить начальный экран
    showScreen('setup');
}

// Обработка изменения режима игры
function handleGameModeChange() {
    if (elements.gameMode.value === 'test') {
        elements.testModeGroup.classList.remove('hidden');
    } else {
        elements.testModeGroup.classList.add('hidden');
    }
}

// Показать экран
function showScreen(screenName) {
    GameState.currentScreen = screenName;
    
    // Скрыть все экраны
    for (const key in screens) {
        screens[key].classList.remove('active');
    }
    
    // Показать нужный экран
    screens[screenName].classList.add('active');
    
    // Остановить таймер если уходим с игрового экрана
    if (screenName !== 'game' && GameState.timerInterval) {
        clearInterval(GameState.timerInterval);
        GameState.timerInterval = null;
    }
    
    console.log('Переключились на экран:', screenName);
}

// Начать игру
function startGame() {
    console.log('Начинаем игру');
    
    // Получить настройки
    GameState.mode = elements.gameMode.value;
    const verbCount = elements.verbCount.value;
    GameState.testMode = elements.testMode.value;
    
    // Обновить UI
    elements.gameTitle.textContent = GameState.mode === 'test' ? '📝 Зачёт' : '🎮 Тренировка';
    
    if (GameState.mode === 'test') {
        elements.testModeInfo.classList.remove('hidden');
        elements.testModeText.textContent = 'Режим зачёта: ' + 
            elements.testMode.options[elements.testMode.selectedIndex].text;
    } else {
        elements.testModeInfo.classList.add('hidden');
    }
    
    // Выбрать глаголы
    selectVerbs(verbCount);
    
    // Заполнить таблицу
    fillTable();
    
    // Показать игровой экран
    showScreen('game');
    
    // Запустить таймер
    startTimer();
}

// Выбрать глаголы
function selectVerbs(verbCount) {
    console.log('Выбираем глаголы. Режим:', GameState.mode);
    
    if (GameState.mode === 'test') {
        // Режим зачета - 5 неповторяющихся глаголов
        const availableVerbs = ALL_VERBS.filter(function(verb) {
            return !GameState.usedInTest.includes(verb.infinitive);
        });
        
        // Если все глаголы использованы - сбросить
        if (availableVerbs.length === 0) {
            console.log('Все глаголы использованы, сбрасываем историю');
            GameState.usedInTest = [];
            selectVerbs(verbCount); // Рекурсивно вызвать снова
            return;
        }
        
        // Выбрать 5 случайных глаголов
        GameState.selectedVerbs = [];
        const verbsToSelect = Math.min(5, availableVerbs.length);
        
        for (let i = 0; i < verbsToSelect; i++) {
            const randomIndex = Math.floor(Math.random() * availableVerbs.length);
            GameState.selectedVerbs.push(availableVerbs[randomIndex]);
            GameState.usedInTest.push(availableVerbs[randomIndex].infinitive);
            
            // Удалить выбранный глагол из доступных
            availableVerbs.splice(randomIndex, 1);
        }
        
        console.log('Выбрано для зачета:', GameState.selectedVerbs.length, 'глаголов');
    } else {
        // Режим тренировки
        if (verbCount === 'all') {
            GameState.selectedVerbs = ALL_VERBS.slice();
        } else {
            const count = parseInt(verbCount);
            const shuffled = ALL_VERBS.slice().sort(function() {
                return 0.5 - Math.random();
            });
            GameState.selectedVerbs = shuffled.slice(0, Math.min(count, shuffled.length));
        }
        console.log('Выбрано для тренировки:', GameState.selectedVerbs.length, 'глаголов');
    }
    
    // Отсортировать по алфавиту
    GameState.selectedVerbs.sort(function(a, b) {
        return a.infinitive.localeCompare(b.infinitive);
    });
}

// Заполнить таблицу
function fillTable() {
    console.log('Заполняем таблицу');
    elements.verbsTableBody.innerHTML = '';
    
    GameState.selectedVerbs.forEach(function(verb, index) {
        const row = document.createElement('tr');
        
        // Определить какие поля показывать
        let showPast = true;
        let showParticiple = true;
        let pastValue = '';
        let participleValue = '';
        
        if (GameState.mode === 'test') {
            const random = Math.random();
            
            switch (GameState.testMode) {
                case 'firstColumn':
                    // Только Past Simple
                    showParticiple = false;
                    participleValue = verb.participle;
                    break;
                case 'secondColumn':
                    // Только Past Participle
                    showPast = false;
                    pastValue = verb.past;
                    break;
                case 'firstColumnMore':
                    // Чаще Past Simple (70%)
                    showPast = random < 0.7;
                    showParticiple = !showPast;
                    if (!showPast) pastValue = verb.past;
                    if (!showParticiple) participleValue = verb.participle;
                    break;
                case 'secondColumnMore':
                    // Чаще Past Participle (70%)
                    showParticiple = random < 0.7;
                    showPast = !showParticiple;
                    if (!showPast) pastValue = verb.past;
                    if (!showParticiple) participleValue = verb.participle;
                    break;
                // Для 'allColumns' обе формы пустые
            }
        }
        
        // Ячейка Infinitive
        const cell1 = document.createElement('td');
        cell1.innerHTML = `
            <div style="font-weight: 600; font-size: 1.2rem; color: #2c3e50;">${verb.infinitive}</div>
            <div style="color: #7f8c8d; font-size: 0.9rem; margin-top: 5px;">${verb.translation}</div>
        `;
        
        // Ячейка Past Simple
        const cell2 = document.createElement('td');
        if (showPast) {
            cell2.innerHTML = `<input type="text" class="input-field" id="past-${index}" placeholder="Введите Past Simple" data-correct="${verb.past}">`;
        } else {
            cell2.innerHTML = `<div style="color: #27ae60; font-weight: 600; font-size: 1.2rem; padding: 10px 0;">${pastValue}</div>`;
        }
        
        // Ячейка Past Participle
        const cell3 = document.createElement('td');
        if (showParticiple) {
            cell3.innerHTML = `<input type="text" class="input-field" id="participle-${index}" placeholder="Введите Past Participle" data-correct="${verb.participle}">`;
        } else {
            cell3.innerHTML = `<div style="color: #27ae60; font-weight: 600; font-size: 1.2rem; padding: 10px 0;">${participleValue}</div>`;
        }
        
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        elements.verbsTableBody.appendChild(row);
    });
}

// Запустить таймер
function startTimer() {
    GameState.startTime = Date.now();
    elements.timer.classList.remove('hidden');
    
    GameState.timerInterval = setInterval(function() {
        const elapsed = Math.floor((Date.now() - GameState.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        elements.timeDisplay.textContent = 
            minutes.toString().padStart(2, '0') + ':' + 
            seconds.toString().padStart(2, '0');
    }, 1000);
}

// Проверить ответы
function checkAnswers() {
    console.log('Проверяем ответы');
    
    // Остановить таймер
    if (GameState.timerInterval) {
        clearInterval(GameState.timerInterval);
        GameState.timerInterval = null;
    }
    
    let correct = 0;
    let total = 0;
    
    // Проверить каждый глагол
    GameState.selectedVerbs.forEach(function(verb, index) {
        // Проверить Past Simple
        const pastInput = document.getElementById('past-' + index);
        if (pastInput) {
            total++;
            const userAnswer = pastInput.value.trim().toLowerCase();
            const correctAnswer = pastInput.getAttribute('data-correct').toLowerCase();
            const variants = correctAnswer.split('/');
            
            let isCorrect = false;
            for (let i = 0; i < variants.length; i++) {
                if (variants[i].trim() === userAnswer) {
                    isCorrect = true;
                    break;
                }
            }
            
            if (isCorrect) {
                correct++;
                pastInput.classList.add('correct');
                pastInput.classList.remove('incorrect');
            } else {
                pastInput.classList.add('incorrect');
                pastInput.classList.remove('correct');
            }
        }
        
        // Проверить Past Participle
        const participleInput = document.getElementById('participle-' + index);
        if (participleInput) {
            total++;
            const userAnswer = participleInput.value.trim().toLowerCase();
            const correctAnswer = participleInput.getAttribute('data-correct').toLowerCase();
            const variants = correctAnswer.split('/');
            
            let isCorrect = false;
            for (let i = 0; i < variants.length; i++) {
                if (variants[i].trim() === userAnswer) {
                    isCorrect = true;
                    break;
                }
            }
            
            if (isCorrect) {
                correct++;
                participleInput.classList.add('correct');
                participleInput.classList.remove('incorrect');
            } else {
                participleInput.classList.add('incorrect');
                participleInput.classList.remove('correct');
            }
        }
    });
    
    // Показать результаты
    showResults(correct, total);
}

// Показать результаты
function showResults(correct, total) {
    const percentage = Math.round((correct / total) * 100);
    const timeElapsed = Math.floor((Date.now() - GameState.startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    
    // Обновить данные
    elements.scoreDisplay.textContent = `${correct}/${total}`;
    elements.correctCount.textContent = correct;
    elements.totalCount.textContent = total;
    elements.percentage.textContent = `${percentage}%`;
    elements.timeResult.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    elements.progressText.textContent = `${percentage}%`;
    
    // Анимировать прогресс бар
    setTimeout(function() {
        elements.progressBar.style.width = percentage + '%';
    }, 100);
    
    // Установить сообщение
    if (percentage >= 90) {
        elements.resultMessage.innerHTML = '🎉 <strong>Отлично!</strong> Вы прекрасно знаете глаголы!';
        elements.resultMessage.style.color = '#27ae60';
    } else if (percentage >= 70) {
        elements.resultMessage.innerHTML = '👍 <strong>Хорошо!</strong> Вы хорошо знаете глаголы!';
        elements.resultMessage.style.color = '#f39c12';
    } else if (percentage >= 50) {
        elements.resultMessage.innerHTML = '✅ <strong>Неплохо!</strong> Но есть куда расти!';
        elements.resultMessage.style.color = '#3498db';
    } else {
        elements.resultMessage.innerHTML = '📚 <strong>Попробуйте еще!</strong> Нужно больше практики!';
        elements.resultMessage.style.color = '#e74c3c';
    }
    
    // Показать экран результатов
    showScreen('results');
}

// Заново (те же глаголы)
function restartGame() {
    console.log('Начинаем заново с теми же глаголами');
    
    // Очистить предыдущий таймер
    if (GameState.timerInterval) {
        clearInterval(GameState.timerInterval);
        GameState.timerInterval = null;
    }
    
    // Заполнить таблицу заново
    fillTable();
    
    // Показать игровой экран
    showScreen('game');
    
    // Запустить таймер
    startTimer();
}

// Новая игра (новые глаголы)
function newGame() {
    console.log('Начинаем новую игру');
    console.log('GameState.mode:', GameState.mode);
    console.log('GameState.usedInTest:', GameState.usedInTest);
    
    // Очистить предыдущий таймер
    if (GameState.timerInterval) {
        clearInterval(GameState.timerInterval);
        GameState.timerInterval = null;
    }
    
    // Если это режим зачета, НЕ сбрасываем usedInTest
    // Глаголы будут добавляться к уже использованным
    
    // Начать игру заново
    startGame();
}

// Запустить игру при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем игру');
    initGame();
});

// Для Render.com - экспортируем функции если нужно
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGame,
        startGame,
        checkAnswers,
        restartGame,
        newGame
    };
}