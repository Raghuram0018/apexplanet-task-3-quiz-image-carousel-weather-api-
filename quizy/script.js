document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const container = document.querySelector('.container');

    // Modals
    const modeSelectionModal = document.getElementById('mode-selection-modal');
    const avatarSelectionModal = document.getElementById('avatar-selection-modal');
    const playerSetupModal = document.getElementById('player-setup-modal');
    const preGameModal = document.getElementById('pre-game-modal');
    const resultsModal = document.getElementById('results-modal');

    // Buttons
    const singlePlayerBtn = document.getElementById('single-player-btn');
    const multiPlayerBtn = document.getElementById('multi-player-btn');
    const addPlayerBtn = document.getElementById('add-player-btn');
    const startMultiPlayerGameBtn = document.getElementById('start-multi-player-game-btn');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const answerButtonsElement = document.getElementById('answer-buttons');

    // Quiz Display
    const questionElement = document.getElementById('question');
    const roundText = document.getElementById('round-text');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const timerBar = document.getElementById('timer-bar');
    const scoreText = document.getElementById('score-text');
    const highscoreText = document.getElementById('highscore-text');
    const scoreContainer = document.getElementById('score-container');
    const multiplayerScoreboard = document.getElementById('multiplayer-scoreboard');
    const turnIndicator = document.getElementById('turn-indicator');
    const singlePlayerAvatarDisplay = document.getElementById('single-player-avatar');

    // Avatar Selection
    const avatarGrid = document.getElementById('avatar-grid');
    const avatarPlayerName = document.getElementById('avatar-player-name');
    const avatars = [
        'images/avatar1.png', 'images/avatar2.png', 'images/avatar3.png', 'images/avatar4.png',
        'images/avatar5.png', 'images/avatar6.png', 'images/avatar7.png', 'images/avatar8.png'
    ];

    // Results Display
    const resultsTitle = document.getElementById('results-title');
    const resultsMessage = document.getElementById('results-message');
    const singlePlayerResults = document.getElementById('single-player-results');
    const multiplayerResults = document.getElementById('multiplayer-results');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const correctAnswersSpan = document.getElementById('correct-answers');
    const wrongAnswersSpan = document.getElementById('wrong-answers');
    const accuracySpan = document.getElementById('accuracy');
    const finalScoreSpan = document.getElementById('final-score');
    const finalLeaderboard = document.getElementById('final-leaderboard');
    const winnerAnnouncement = document.getElementById('winner-announcement');
    const difficultySelector = document.getElementById('difficulty');
    
    // Player Inputs
    const playerInputsContainer = document.getElementById('player-inputs');

    // Sound Effects
    const correctSound = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
    const wrongSound = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');

    // Game State
    let questions = []; // Used for single player
    let currentQuestionIndex = 0; // Used for single player
    let score = 0; // Used for single player
    let highscore = localStorage.getItem('highscore') || 0;
    let timerInterval;
    const TIME_LIMIT = 30;
    let timeLeft = TIME_LIMIT;
    let isMultiplayer = false;
    let players = [];
    let currentPlayerIndex = 0;
    const TOTAL_QUESTIONS_PER_ROUND = 5;
    const TOTAL_ROUNDS = 3;
    const TOTAL_QUESTIONS = TOTAL_QUESTIONS_PER_ROUND * TOTAL_ROUNDS;
    let correctAnswersCount = 0; // Used for single player
    let avatarSelectionIndex = 0;
    let totalTurnsCompleted = 0; // Used for multiplayer progress

    const questionBank = {
        easy: {
            'General Knowledge (India)': [
                { question: 'What is the capital of India?', options: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'], answer: 'New Delhi' },
                { question: 'Which river is known as the Ganges in India?', options: ['Yamuna', 'Brahmaputra', 'Ganga', 'Godavari'], answer: 'Ganga' },
                { question: 'What is the national animal of India?', options: ['Lion', 'Tiger', 'Elephant', 'Leopard'], answer: 'Tiger' },
                { question: 'Who was the first Prime Minister of India?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Indira Gandhi'], answer: 'Jawaharlal Nehru' },
                { question: 'Which festival is known as the festival of lights in India?', options: ['Holi', 'Diwali', 'Eid', 'Christmas'], answer: 'Diwali' },
                { question: 'What is the currency of India?', options: ['Dollar', 'Rupee', 'Euro', 'Yen'], answer: 'Rupee' },
                { question: 'Which is the largest state in India by area?', options: ['Maharashtra', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh'], answer: 'Rajasthan' },
            ],
            'Aptitude': [
                { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4' },
                { question: 'If a car travels at 60 km/h, how far will it travel in 2 hours?', options: ['100 km', '120 km', '140 km', '160 km'], answer: '120 km' },
                { question: 'What comes next in the sequence: 2, 4, 6, 8, ...?', options: ['9', '10', '11', '12'], answer: '10' },
                { question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?', options: ['$0.05', '$0.10', '$0.15', '$1.00'], answer: '$0.05' },
                { question: 'How many months have 28 days?', options: ['1', '2', '6', 'All 12'], answer: 'All 12' },
                { question: 'What is half of 50?', options: ['25', '30', '20', '35'], answer: '25' },
                { question: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], answer: '3' },
            ],
            'Brain Teasers': [
                { question: 'What has to be broken before you can use it?', options: ['A promise', 'A secret', 'An egg', 'A window'], answer: 'An egg' },
                { question: 'I’m tall when I’m young, and I’m short when I’m old. What am I?', options: ['A person', 'A tree', 'A candle', 'A story'], answer: 'A candle' },
                { question: 'What is full of holes but still holds water?', options: ['A net', 'A sponge', 'A sieve', 'A shirt'], answer: 'A sponge' },
                { question: 'What question can you never answer yes to?', options: ['Are you asleep yet?', 'Are you lying?', 'Is this the last question?', 'All of the above'], answer: 'Are you asleep yet?' },
                { question: 'What is always in front of you but can’t be seen?', options: ['The past', 'The present', 'The future', 'Your nose'], answer: 'The future' },
                { question: 'What has a neck without a head?', options: ['A shirt', 'A bottle', 'A guitar', 'A person'], answer: 'A bottle' },
                { question: 'What gets wetter as it dries?', options: ['A towel', 'A sponge', 'A cloth', 'A mop'], answer: 'A towel' },
            ]
        },
        medium: {
            'General Knowledge (India)': [
                { question: 'Which state is known as the "Spice Garden of India"?', options: ['Kerala', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'], answer: 'Kerala' },
                { question: 'Who wrote the Indian National Anthem?', options: ['Bankim Chandra Chatterjee', 'Rabindranath Tagore', 'Sarojini Naidu', 'Subramania Bharati'], answer: 'Rabindranath Tagore' },
                { question: 'In which year did India win its first Cricket World Cup?', options: ['1983', '1987', '2003', '2011'], answer: '1983' },
                { question: 'What is the name of the highest civilian award in India?', options: ['Padma Vibhushan', 'Bharat Ratna', 'Padma Bhushan', 'Padma Shri'], answer: 'Bharat Ratna' },
                { question: 'Which Indian city is famous for its software industry and is called the "Silicon Valley of India"?', options: ['Hyderabad', 'Pune', 'Bengaluru', 'Chennai'], answer: 'Bengaluru' },
                { question: 'Where is the Taj Mahal located?', options: ['Delhi', 'Mumbai', 'Agra', 'Jaipur'], answer: 'Agra' },
                { question: 'Who is known as the "Father of the Nation" in India?', options: ['Jawaharlal Nehru', 'Sardar Patel', 'Mahatma Gandhi', 'B. R. Ambedkar'], answer: 'Mahatma Gandhi' },
            ],
            'Aptitude': [
                { question: 'If 5 men can build a house in 20 days, how many days will it take for 10 men to build the same house?', options: ['5', '10', '15', '20'], answer: '10' },
                { question: 'Find the average of 10, 20, 30, 40, 50.', options: ['25', '30', '35', '40'], answer: '30' },
                { question: 'A train 100m long is running at a speed of 30 km/hr. Find the time taken by it to pass a man standing near the railway line.', options: ['10 seconds', '12 seconds', '15 seconds', '20 seconds'], answer: '12 seconds' },
                { question: 'What is 30% of 200?', options: ['40', '50', '60', '70'], answer: '60' },
                { question: 'If PRICE is coded as QSJDF, how is COST coded?', options: ['DP TU', 'DPTU', 'DQTV', 'DQUT'], answer: 'DPTU' },
                { question: 'What is the square root of 144?', options: ['10', '11', '12', '13'], answer: '12' },
                { question: 'A shopkeeper buys a toy for $10 and sells it for $12. What is his profit percentage?', options: ['10%', '15%', '20%', '25%'], answer: '20%' },
            ],
            'Brain Teasers': [
                { question: 'What has an eye, but cannot see?', options: ['A storm', 'A needle', 'A potato', 'A hurricane'], answer: 'A needle' },
                { question: 'A man who was outside in the rain without an umbrella or hat didn’t get a single hair on his head wet. Why?', options: ['He was bald', 'He was in a car', 'He was under a tree', 'It was not raining hard'], answer: 'He was bald' },
                { question: 'What can travel all around the world while staying in a corner?', options: ['A thought', 'A letter', 'A stamp', 'An idea'], answer: 'A stamp' },
                { question: 'What has one head, one foot, and four legs?', options: ['A monster', 'A chair', 'A bed', 'A table'], answer: 'A bed' },
                { question: 'What building has the most stories?', options: ['A skyscraper', 'A library', 'A school', 'A museum'], answer: 'A library' },
                { question: 'What has cities, but no houses; forests, but no trees; and water, but no fish?', options: ['A globe', 'A map', 'A book', 'A dream'], answer: 'A map' },
                { question: 'What is so fragile that saying its name breaks it?', options: ['Silence', 'Glass', 'A secret', 'A promise'], answer: 'Silence' },
            ]
        },
        hard: {
            'General Knowledge (India)': [
                { question: 'Who was the chairman of the Drafting Committee of the Indian Constitution?', options: ['B. R. Ambedkar', 'Jawaharlal Nehru', 'Rajendra Prasad', 'Sardar Patel'], answer: 'B. R. Ambedkar' },
                { question: 'The "Dandi March" is also known as the:', options: ['Salt Satyagraha', 'Quit India Movement', 'Non-Cooperation Movement', 'Civil Disobedience Movement'], answer: 'Salt Satyagraha' },
                { question: 'Which Indian scientist won the Nobel Prize in Physics in 1930?', options: ['C. V. Raman', 'Homi J. Bhabha', 'S. Chandrasekhar', 'Meghnad Saha'], answer: 'C. V. Raman' },
                { question: 'The ancient university of Nalanda was located in which present-day Indian state?', options: ['Uttar Pradesh', 'Bihar', 'Odisha', 'West Bengal'], answer: 'Bihar' },
                { question: 'Who is known as the "Father of the Indian Space Program"?', options: ['A. P. J. Abdul Kalam', 'Vikram Sarabhai', 'Satish Dhawan', 'C. V. Raman'], answer: 'Vikram Sarabhai' },
                { question: 'In which year was the Reserve Bank of India established?', options: ['1935', '1947', '1950', '1962'], answer: '1935' },
                { question: 'Which is the highest mountain peak in India?', options: ['K2', 'Nanda Devi', 'Kangchenjunga', 'Mount Everest'], answer: 'Kangchenjunga' },
            ],
            'Aptitude': [
                { question: 'A can do a piece of work in 10 days, and B can do it in 15 days. How long will they take if they work together?', options: ['5 days', '6 days', '7 days', '8 days'], answer: '6 days' },
                { question: 'The sum of the ages of a father and son is 60 years. Six years ago, the father\'s age was five times the age of the son. What will be the son\'s age after 6 years?', options: ['14 years', '20 years', '22 years', '24 years'], answer: '20 years' },
                { question: 'A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.', options: ['3 hours', '4 hours', '5 hours', '6 hours'], answer: '4 hours' },
                { question: 'In a mixture of 60 litres, the ratio of milk and water is 2:1. If this ratio is to be 1:2, then the quantity of water to be further added is:', options: ['20 litres', '30 litres', '40 litres', '60 litres'], answer: '60 litres' },
                { question: 'What is the next number in the series: 7, 10, 8, 11, 9, 12, ...?', options: ['7', '10', '13', '14'], answer: '10' },
                { question: 'If a clock strikes once at 1 o\'clock, twice at 2 o\'clock, and so on, how many times will it strike in 24 hours?', options: ['78', '156', '180', '196'], answer: '156' },
                { question: 'Find the value of x if 2x + 5 = 15.', options: ['3', '4', '5', '6'], answer: '5' },
            ],
            'Brain Teasers': [
                { question: 'What is it that is bought by the yard and worn by the foot?', options: ['Socks', 'Shoes', 'Carpet', 'A ruler'], answer: 'Carpet' },
                { question: 'What can you hold in your left hand but not in your right?', options: ['A pen', 'Your right elbow', 'A coin', 'A map'], answer: 'Your right elbow' },
                { question: 'What has keys, but opens no locks; has a space, but no room; and you can enter, but not go outside?', options: ['A map', 'A piano', 'A keyboard', 'A book'], answer: 'A keyboard' },
                { question: 'The person who makes it has no need of it; the person who buys it has no use for it. The person who uses it can neither see nor feel it. What is it?', options: ['A secret', 'A coffin', 'A wig', 'A poison'], answer: 'A coffin' },
                { question: 'What English word has three consecutive double letters?', options: ['Mississippi', 'Bookkeeper', 'Committee', 'Success'], answer: 'Bookkeeper' },
                { question: 'I have branches, but no fruit, trunk or leaves. What am I?', options: ['A bank', 'A river', 'A family tree', 'A car'], answer: 'A bank' },
                { question: 'What is seen in the middle of March and April that can’t be seen at the beginning or end of either month?', options: ['The sun', 'The letter R', 'The rain', 'The flowers'], answer: 'The letter R' },
            ]
        }
    };

    // --- Event Listeners ---

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light-theme');
        }
    });

    singlePlayerBtn.addEventListener('click', () => {
        isMultiplayer = false;
        players = [{ name: 'Player 1', score: 0, avatar: '', correctAnswers: 0 }];
        modeSelectionModal.classList.remove('show');
        showAvatarSelection();
    });

    multiPlayerBtn.addEventListener('click', () => {
        isMultiplayer = true;
        modeSelectionModal.classList.remove('show');
        playerSetupModal.classList.add('show');
    });

    addPlayerBtn.addEventListener('click', () => {
        const playerCount = playerInputsContainer.querySelectorAll('.player-name-input').length;
        if (playerCount < 4) {
            const newPlayerGroup = document.createElement('div');
            newPlayerGroup.className = 'player-input-group';
            newPlayerGroup.innerHTML = `
                <i class="fas fa-user-edit"></i>
                <input type="text" placeholder="Player ${playerCount + 1} Name" class="player-name-input">
            `;
            playerInputsContainer.appendChild(newPlayerGroup);
        }
        if (playerInputsContainer.querySelectorAll('.player-name-input').length >= 4) {
            addPlayerBtn.style.display = 'none';
        }
    });

    startMultiPlayerGameBtn.addEventListener('click', () => {
        const nameInputs = playerInputsContainer.querySelectorAll('.player-name-input');
        players = Array.from(nameInputs).map((input, index) => ({
            name: input.value.trim() || `Player ${index + 1}`,
            score: 0,
            avatar: '',
            correctAnswers: 0,
            questionIndex: 0, 
            questions: [] 
        }));
        if (players.length > 0) {
            playerSetupModal.classList.remove('show');
            showAvatarSelection();
        }
    });

    startQuizBtn.addEventListener('click', () => {
        preGameModal.classList.remove('show');
        startGame();
    });
    
    playAgainBtn.addEventListener('click', () => {
        resultsModal.classList.remove('show');
        resetUIForNewGame();
        modeSelectionModal.classList.add('show');
    });

    // --- Game Setup ---

    function showAvatarSelection() {
        avatarSelectionIndex = 0;
        avatarGrid.innerHTML = '';
        avatars.forEach(avatarSrc => {
            const avatarEl = document.createElement('div');
            avatarEl.className = 'avatar-option';
            
            const imgEl = document.createElement('img');
            imgEl.src = avatarSrc;
            imgEl.alt = 'Avatar';
            imgEl.onerror = () => { imgEl.src = 'https://placehold.co/80x80/cccccc/ffffff?text=Error'; };
            
            avatarEl.appendChild(imgEl);
            avatarEl.addEventListener('click', () => selectAvatar(avatarSrc, avatarEl));
            avatarGrid.appendChild(avatarEl);
        });
        updateAvatarPlayerName();
        avatarSelectionModal.classList.add('show');
    }

    function selectAvatar(avatarSrc, selectedEl) {
        players[avatarSelectionIndex].avatar = avatarSrc;
        avatarSelectionIndex++;
        
        document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
        selectedEl.classList.add('selected');

        if (avatarSelectionIndex < players.length) {
            setTimeout(() => {
                updateAvatarPlayerName();
                selectedEl.classList.remove('selected');
            }, 400);
        } else {
            setTimeout(() => {
                avatarSelectionModal.classList.remove('show');
                preGameModal.classList.add('show');
            }, 400);
        }
    }
    
    function updateAvatarPlayerName() {
        if (isMultiplayer && players[avatarSelectionIndex]) {
            avatarPlayerName.innerText = `${players[avatarSelectionIndex].name}, choose your avatar.`;
        } else {
            avatarPlayerName.innerText = 'Choose your avatar.';
        }
    }

    function startGame() {
        container.style.display = 'block';
        const difficulty = difficultySelector.value;
        const categories = Object.keys(questionBank[difficulty]);

        if (isMultiplayer) {
            totalTurnsCompleted = 0;
            currentPlayerIndex = 0;
            
            const masterQuestionPool = [];
            categories.forEach(category => {
                masterQuestionPool.push(...questionBank[difficulty][category]);
            });

            const shuffledMasterPool = shuffleArray(masterQuestionPool);

            if (shuffledMasterPool.length < players.length * TOTAL_QUESTIONS) {
                console.error("Not enough unique questions for all players! Some questions may be repeated.");
            }

            let questionPoolPointer = 0;
            players.forEach(player => {
                player.score = 0;
                player.correctAnswers = 0;
                player.questionIndex = 0;
                
                const playerQuestions = shuffledMasterPool.slice(questionPoolPointer, questionPoolPointer + TOTAL_QUESTIONS);
                player.questions = playerQuestions;
                questionPoolPointer += TOTAL_QUESTIONS;

                while (player.questions.length < TOTAL_QUESTIONS) {
                    player.questions.push(...shuffleArray(masterQuestionPool).slice(0, TOTAL_QUESTIONS - player.questions.length));
                }
            });

        } else { // Single player logic
            score = 0;
            correctAnswersCount = 0;
            currentQuestionIndex = 0;
            const selectedQuestions = [];
            categories.forEach(category => {
                const categoryQuestions = shuffleArray([...questionBank[difficulty][category]]);
                selectedQuestions.push(...categoryQuestions.slice(0, TOTAL_QUESTIONS_PER_ROUND));
            });
            questions = shuffleArray(selectedQuestions);
        }

        updateUIForMode();
        setNextQuestion();
    }

    // --- Core Gameplay ---

    function setNextQuestion() {
        resetState();
        const gameNotOver = isMultiplayer ? totalTurnsCompleted < players.length * TOTAL_QUESTIONS : currentQuestionIndex < TOTAL_QUESTIONS;

        if (gameNotOver) {
            let questionData;
            if (isMultiplayer) {
                const currentPlayer = players[currentPlayerIndex];
                if (currentPlayer.questionIndex < currentPlayer.questions.length) {
                    questionData = currentPlayer.questions[currentPlayer.questionIndex];
                } else {
                    endGame();
                    return;
                }
            } else {
                questionData = questions[currentQuestionIndex];
            }
            showQuestion(questionData);
            updateProgress();
            startTimer();
            if (isMultiplayer) updateTurnIndicator();
        } else {
            endGame();
        }
    }

    function showQuestion(questionData) {
        questionElement.innerText = questionData.question;
        const shuffledOptions = shuffleArray([...questionData.options]);
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('btn');
            if (option === questionData.answer) {
                button.dataset.correct = true;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }
    
    function selectAnswer(e) {
        clearInterval(timerInterval);
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === 'true';

        updateScore(correct);
        
        Array.from(answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === 'true');
            button.disabled = true;
        });

        if (correct) {
            correctSound.play();
            if (isMultiplayer) {
                players[currentPlayerIndex].correctAnswers++;
            } else {
                correctAnswersCount++;
            }
        } else {
            wrongSound.play();
        }

        setTimeout(() => {
            if (isMultiplayer) {
                players[currentPlayerIndex].questionIndex++;
                totalTurnsCompleted++;
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            } else {
                currentQuestionIndex++;
            }
            setNextQuestion();
        }, 1500);
    }
    
    function updateScore(correct) {
        const points = correct ? 15 : -5;
        if(isMultiplayer) {
            players[currentPlayerIndex].score += points;
            updateMultiplayerScoreboard();
        } else {
            score += points;
            scoreText.innerText = `Score: ${score}`;
        }
    }

    function endGame() {
        clearInterval(timerInterval);
        container.style.display = 'none';
        resultsModal.classList.add('show');

        if (isMultiplayer) {
            displayMultiplayerResults();
        } else {
            displaySinglePlayerResults();
        }
    }

    // --- UI & State Updates ---
    
    function updateUIForMode() {
        if (isMultiplayer) {
            scoreContainer.style.display = 'none';
            multiplayerScoreboard.style.display = 'flex';
            turnIndicator.style.display = 'block';
            updateMultiplayerScoreboard();
        } else {
            scoreContainer.style.display = 'flex';
            multiplayerScoreboard.style.display = 'none';
            turnIndicator.style.display = 'none';
            highscoreText.innerText = `High Score: ${highscore}`;
            scoreText.innerText = `Score: 0`;
            singlePlayerAvatarDisplay.innerHTML = `<img src="${players[0].avatar}" alt="Player Avatar">`;
        }
    }

    function updateMultiplayerScoreboard() {
        multiplayerScoreboard.innerHTML = '';
        players.forEach((player, index) => {
            const card = document.createElement('div');
            card.className = 'player-score-card';
            card.id = `player-card-${index}`;
            card.innerHTML = `<div class="avatar-display"><img src="${player.avatar}" alt="${player.name} Avatar"></div> <div>${player.name}: <span>${player.score}</span></div>`;
            multiplayerScoreboard.appendChild(card);
        });
        highlightActivePlayer();
    }
    
    function highlightActivePlayer() {
        document.querySelectorAll('.player-score-card').forEach(card => card.classList.remove('active-turn'));
        const activeCard = document.getElementById(`player-card-${currentPlayerIndex}`);
        if(activeCard) activeCard.classList.add('active-turn');
    }
    
    function updateTurnIndicator() {
        if (players.length > 0 && players[currentPlayerIndex]) {
            turnIndicator.innerText = `${players[currentPlayerIndex].name}'s Turn`;
            highlightActivePlayer();
        }
    }

    function getScoreBasedTitle(finalScore) {
        if (finalScore > 120) {
            return { 
                title: "Pro as Master",
                message: "🔥 You’re not just smart — you’re Quizy royalty 👑. Absolute domination. Come back anytime to keep flexin’ that elite brain. Quizy’s throne awaits!"
            };
        } else if (finalScore > 90) {
            return {
                title: "Good as God",
                message: "⚡ Certified genius alert 🚨 That was divine-level thinking! Quizy’s impressed. Don’t forget to drop by again — legends like you deserve a rematch!"
            };
        } else if (finalScore > 60) {
            return {
                title: "Average as Avenger",
                message: "🛡️ Respect! You fought hard, avenged the basics, and survived. Come back stronger — Quizy’s got more missions lined up for your brain."
            };
        } else {
            return {
                title: "Use your evil brain next time",
                message: "💀 Oof. That was brutal. But hey, even villains get a second shot. Sharpen that evil brain and hit up Quizy again — redemption awaits 😈🧠"
            };
        }
    }

    function displaySinglePlayerResults() {
        singlePlayerResults.style.display = 'block';
        multiplayerResults.style.display = 'none';
        
        const wrongAnswers = TOTAL_QUESTIONS - correctAnswersCount;
        const accuracy = TOTAL_QUESTIONS > 0 ? (correctAnswersCount / TOTAL_QUESTIONS * 100).toFixed(1) : 0;

        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
        }

        const { title, message } = getScoreBasedTitle(score);
        resultsTitle.innerText = title;
        resultsMessage.innerText = message;

        totalQuestionsSpan.innerText = TOTAL_QUESTIONS;
        correctAnswersSpan.innerText = correctAnswersCount;
        wrongAnswersSpan.innerText = wrongAnswers;
        accuracySpan.innerText = accuracy;
        finalScoreSpan.innerText = score;
    }
    
    function displayMultiplayerResults() {
        singlePlayerResults.style.display = 'none';
        multiplayerResults.style.display = 'block';
        
        players.sort((a, b) => b.score - a.score);
        
        finalLeaderboard.innerHTML = ''; 
        winnerAnnouncement.innerHTML = ''; // Clear previous winner announcement

        const winner = players[0];
        const winners = players.filter(p => p.score === winner.score);

        // Create and display the winner card first
        const winnerCard = document.createElement('div');
        if (winners.length > 1) {
            // It's a tie
            winnerCard.className = 'winner-card tie';
            winnerCard.innerHTML = `
                <div class="winner-symbol">🤝</div>
                <div class="winner-info">
                    <h4>It's a Tie!</h4>
                    <p>${winners.map(p => p.name).join(' and ')}</p>
                </div>
                <div class="winner-score">Score: ${winner.score}</div>
            `;
        } else {
            // Single winner
            winnerCard.className = 'winner-card';
            winnerCard.innerHTML = `
                <div class="winner-symbol">🏆</div>
                <div class="winner-info">
                    <h4>WINNER</h4>
                    <p>${winner.name}</p>
                </div>
                <div class="winner-score">Score: ${winner.score}</div>
            `;
        }
        winnerAnnouncement.appendChild(winnerCard);


        // Display individual scorecards for all players
        players.forEach(player => {
            const wrongAnswers = TOTAL_QUESTIONS - player.correctAnswers;
            const accuracy = TOTAL_QUESTIONS > 0 ? (player.correctAnswers / TOTAL_QUESTIONS * 100).toFixed(1) : 0;
            const { title: playerTitle } = getScoreBasedTitle(player.score);

            const scorecard = document.createElement('div');
            scorecard.className = 'player-result-card';
            scorecard.innerHTML = `
                <div class="player-result-header">
                    <div class="avatar-display"><img src="${player.avatar}" alt="${player.name} Avatar"></div>
                    <div>
                        <h4 class="player-result-title">${playerTitle}</h4>
                        <p class="player-result-name">${player.name}</p>
                    </div>
                </div>
                <div class="player-result-body">
                    <p>Final Score: <span>${player.score}</span></p>
                    <p>Correct: <span>${player.correctAnswers}</span></p>
                    <p>Wrong: <span>${wrongAnswers}</span></p>
                    <p>Accuracy: <span>${accuracy}%</span></p>
                </div>
            `;
            finalLeaderboard.appendChild(scorecard);
        });

        const { message } = getScoreBasedTitle(winner.score);
        resultsTitle.innerText = "Final Results";
        resultsMessage.innerText = message;
    }

    function startTimer() {
        timeLeft = TIME_LIMIT;
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        void timerBar.offsetWidth; 
        
        timerBar.style.transition = `width ${TIME_LIMIT}s linear`;
        timerBar.style.width = '0%';

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                timeUp();
            }
        }, 1000);
    }

    function timeUp() {
        wrongSound.play();
        updateScore(false);
        Array.from(answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === 'true');
            button.disabled = true;
        });
        setTimeout(() => {
            if (isMultiplayer) {
                players[currentPlayerIndex].questionIndex++;
                totalTurnsCompleted++;
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            } else {
                currentQuestionIndex++;
            }
            setNextQuestion();
        }, 1500);
    }

    function updateProgress() {
        if (isMultiplayer) {
            const currentPlayer = players[currentPlayerIndex];
            const currentRound = Math.floor(currentPlayer.questionIndex / TOTAL_QUESTIONS_PER_ROUND) + 1;
            roundText.innerText = `${currentPlayer.name}'s Turn - Round ${currentRound}`;
            progressText.innerText = `Question ${currentPlayer.questionIndex + 1} of ${TOTAL_QUESTIONS}`;
            const totalTurns = players.length * TOTAL_QUESTIONS;
            progressBar.style.width = `${(totalTurnsCompleted / totalTurns) * 100}%`;
        } else {
            const currentRound = Math.floor(currentQuestionIndex / TOTAL_QUESTIONS_PER_ROUND) + 1;
            roundText.innerText = `Round ${currentRound}`;
            progressText.innerText = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
            progressBar.style.width = `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%`;
        }
    }

    function resetState() {
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }
    
    function resetUIForNewGame() {
        playerInputsContainer.innerHTML = `
            <div class="player-input-group">
                <i class="fas fa-user-edit"></i>
                <input type="text" placeholder="Player 1 Name" class="player-name-input">
            </div>
            <div class="player-input-group">
                <i class="fas fa-user-edit"></i>
                <input type="text" placeholder="Player 2 Name" class="player-name-input">
            </div>
        `;
        addPlayerBtn.style.display = 'inline-block';
        players = [];
        score = 0;
        highscore = localStorage.getItem('highscore') || 0;
        scoreText.innerText = `Score: 0`;
        highscoreText.innerText = `High Score: ${highscore}`;
    }

    function setStatusClass(element, correct) {
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('wrong');
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- Initial Setup ---
    function initialize() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark-theme') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            themeToggle.checked = true;
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
        highscoreText.innerText = `High Score: ${highscore}`;
        modeSelectionModal.classList.add('show');
    }

    initialize();
});
