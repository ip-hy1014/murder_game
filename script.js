const gameState = {
    currentScene: 'start',
    inventory: [],
    suspectInterviewed: false,
    cluesFound: 0,
    timeRemaining: 0
};

const characters = {
    victim: {
        name: "ジョン・スミス",
        description: "40代の成功した実業家。複数の企業の社長を務めていた。",
        image: "https://dummyimage.com/100x100/000/fff&text=John+Smith"
    },
    suspect1: {
        name: "メアリー・ジョンソン",
        description: "被害者の秘書。仕事に忠実だが、最近昇進を拒否されていた。",
        image: "https://dummyimage.com/100x100/000/fff&text=Mary+Johnson"
    },
    suspect2: {
        name: "トム・ブラウン",
        description: "被害者のビジネスパートナー。最近の取引で大きな損失を出していた。",
        image: "https://dummyimage.com/100x100/000/fff&text=Tom+Brown"
    },
    witness: {
        name: "サラ・デイビス",
        description: "隣に住む主婦。事件当夜、物音を聞いたと証言している。",
        image: "https://dummyimage.com/100x100/000/fff&text=Sara+Davis"
    }
};

const scenes = {
    start: {
        text: '豪華な邸宅で殺人事件が起きました。被害者はジョン・スミス、40代の成功した実業家です。あなたは探偵として事件を解決するために呼ばれました。',
        image: "https://dummyimage.com/800x300/000/fff&text=Crime+Scene",
        choices: [
            { text: '現場を調査する', nextScene: 'crimeScene' },
            { text: '目撃者に話を聞く', nextScene: 'witness' }
        ],
        onEnter: () => {
            showCharacterInfo(characters.victim);
            startTimer(300); // 5分のタイマーを開始
        }
    },
    crimeScene: {
        text: '犯行現場には血痕と散らかった書類があります。また、壊れた花瓶も見つかりました。',
        image: "https://dummyimage.com/800x300/000/fff&text=Crime+Scene+Details",
        choices: [
            { text: '血痕を調べる', nextScene: 'examineBlood' },
            { text: '書類を調べる', nextScene: 'examinePapers' },
            { text: '花瓶を調べる', nextScene: 'examineVase' },
            { text: '目撃者に話を聞く', nextScene: 'witness' }
        ]
    },
    examineBlood: {
        text: '血痕のパターンから、被害者は立っている時に後ろから攻撃されたことがわかります。',
        image: "https://dummyimage.com/800x300/000/fff&text=Blood+Pattern",
        choices: [
            { text: '書類を調べる', nextScene: 'examinePapers' },
            { text: '花瓶を調べる', nextScene: 'examineVase' },
            { text: '目撃者に話を聞く', nextScene: 'witness' }
        ],
        onEnter: () => {
            gameState.cluesFound++;
            updateInventory('血痕パターンの分析');
        }
    },
    examinePapers: {
        text: '書類の中に、被害者と容疑者の間で交わされた脅迫状が見つかりました。差出人はトム・ブラウンのようです。',
        image: "https://dummyimage.com/800x300/000/fff&text=Threatening+Letter",
        choices: [
            { text: '血痕を調べる', nextScene: 'examineBlood' },
            { text: '花瓶を調べる', nextScene: 'examineVase' },
            { text: '目撃者に話を聞く', nextScene: 'witness' }
        ],
        onEnter: () => {
            gameState.cluesFound++;
            updateInventory('脅迫状');
            showCharacterInfo(characters.suspect2);
        }
    },
    examineVase: {
        text: '壊れた花瓶には見覚えのある香水の香りがします。被害者の秘書が使っていた香水のようです。',
        image: "https://dummyimage.com/800x300/000/fff&text=Broken+Vase",
        choices: [
            { text: '血痕を調べる', nextScene: 'examineBlood' },
            { text: '書類を調べる', nextScene: 'examinePapers' },
            { text: '目撃者に話を聞く', nextScene: 'witness' }
        ],
        onEnter: () => {
            gameState.cluesFound++;
            updateInventory('香水の匂いのする花瓶の破片');
            showCharacterInfo(characters.suspect1);
        }
    },
    witness: {
        text: '目撃者のサラ・デイビスは、事件当夜に怒鳴り声と物が割れる音を聞いたと証言しています。また、誰かが慌てて去っていく足音も聞こえたそうです。',
        image: "https://dummyimage.com/800x300/000/fff&text=Witness+Interview",
        choices: [
            { text: '現場に戻る', nextScene: 'crimeScene' },
            { text: 'メアリー・ジョンソンを尋問する', nextScene: 'interrogateMary' },
            { text: 'トム・ブラウンを尋問する', nextScene: 'interrogateTom' }
        ],
        onEnter: () => {
            gameState.suspectInterviewed = true;
            showCharacterInfo(characters.witness);
        }
    },
    interrogateMary: {
        text: 'メアリー・ジョンソンは、事件当夜は自宅にいたと主張していますが、アリバイを証明できる人はいないようです。',
        image: "https://dummyimage.com/800x300/000/fff&text=Mary+Johnson+Interview",
        choices: [
            { text: '脅迫状について聞く', nextScene: 'askMaryAboutThreat', condition: () => gameState.inventory.includes('脅迫状') },
            { text: '花瓶について聞く', nextScene: 'askMaryAboutVase', condition: () => gameState.inventory.includes('香水の匂いのする花瓶の破片') },
            { text: 'トム・ブラウンを尋問する', nextScene: 'interrogateTom' },
            { text: '容疑者を逮捕する', nextScene: 'arrest' }
        ],
        onEnter: () => showCharacterInfo(characters.suspect1)
    },
    interrogateTom: {
        text: 'トム・ブラウンは、事件当夜は仕事のミーティングがあったと主張しています。その日のスケジュールを提示されましたが、信憑性は不明です。',
        image: "https://dummyimage.com/800x300/000/fff&text=Tom+Brown+Interview",
        choices: [
            { text: '脅迫状について聞く', nextScene: 'askTomAboutThreat', condition: () => gameState.inventory.includes('脅迫状') },
            { text: '花瓶について聞く', nextScene: 'askTomAboutVase', condition: () => gameState.inventory.includes('香水の匂いのする花瓶の破片') },
            { text: 'メアリー・ジョンソンを尋問する', nextScene: 'interrogateMary' },
            { text: '容疑者を逮捕する', nextScene: 'arrest' }
        ],
        onEnter: () => showCharacterInfo(characters.suspect2)
    },
    askMaryAboutThreat: {
        text: 'メアリーは脅迫状のことを知らないと言っていますが、明らかに動揺しています。',
        image: "https://dummyimage.com/800x300/000/fff&text=Mary+Reacts+to+Threat",
        choices: [
            { text: '花瓶について聞く', nextScene: 'askMaryAboutVase', condition: () => gameState.inventory.includes('香水の匂いのする花瓶の破片') },
            { text: 'トム・ブラウンを尋問する', nextScene: 'interrogateTom' },
            { text: '容疑者を逮捕する', nextScene: 'arrest' }
        ]
    },
    askMaryAboutVase: {
        text: 'メアリーは花瓶のことを聞くと顔色を変え、その日オフィスに行ったことを認めました。しかし、殺人については否定しています。',
        image: "https://dummyimage.com/800x300/000/fff&text=Mary+Admits+Being+There",
        choices: [
            { text: '脅迫状について聞く', nextScene: 'askMaryAboutThreat', condition: () => gameState.inventory.includes('脅迫状') },
            { text: 'トム・ブラウンを尋問する', nextScene: 'interrogateTom' },
            { text: '容疑者を逮捕する', nextScene: 'arrest' }
        ]
    },
    askTomAboutThreat: {
        text: 'トムは脅迫状を送ったことを認めましたが、それは単なる取引の交渉の一環だったと主張しています。殺人については強く否定しています。',
        image: "https://dummyimage.com/800x300/000/fff&text=Tom+Explains+Threat",
        choices: [
            { text: '花瓶について聞く', nextScene: 'askTomAboutVase', condition: () => gameState.inventory.includes('香水の匂いのする花瓶の破片') },
            { text: 'メアリー・ジョンソンを尋問する', nextScene: 'interrogateMary' },
            { text: '容疑者を逮捕する', nextScene: 'arrest' }
        ]
    },
    askTomAboutVase: {
        text: 'トムは花瓶のことについて何も知らないと言っています。彼の反応は落ち着いているように見えます。',
        image: "https://dummyimage.com/800x300/000/fff&text=Tom+Knows+Nothing+About+Vase",
        choices: [
            { text: '脅迫状について聞く', nextScene: 'askTomAboutThreat', condition: () => gameState.inventory.includes('脅迫状') },
            { text: 'メアリー・ジョンソンを尋問する', nextScene: 'interrogateMary' },
            { text: '容疑者を逮捕する', nextScene: 'arrest' }
        ]
    },
    arrest: {
        text: '十分な証拠が集まりました。誰を逮捕しますか？',
        image: "https://dummyimage.com/800x300/000/fff&text=Make+Your+Choice",
        choices: [
            { text: 'メアリー・ジョンソンを逮捕する', nextScene: 'arrestMary' },
            { text: 'トム・ブラウンを逮捕する', nextScene: 'arrestTom' }
        ]
    },
    arrestMary: {
        text: 'メアリー・ジョンソンを逮捕しました。彼女は最終的に罪を認め、昇進を拒否されたことへの恨みから殺人を犯したと白状しました。事件は解決し、あなたは称賛を浴びました。おめでとうございます！',
        image: "https://dummyimage.com/800x300/000/fff&text=Case+Solved",
        choices: [
            { text: 'もう一度プレイする', nextScene: 'start' }
        ],
        onEnter: resetGame
    },
    arrestTom: {
        text: 'トム・ブラウンを逮捕しましたが、彼のアリバイが確認され、無実であることが判明しました。真犯人を取り逃がしてしまい、あなたは批判を浴びることになりました。',
        image: "https://dummyimage.com/800x300/000/fff&text=Wrong+Culprit",
        choices: [
            { text: 'もう一度プレイする', nextScene: 'start' }
        ],
        onEnter: resetGame
    },
    timeUp: {
        text: '時間切れです。事件を解決できませんでした。',
        image: "https://dummyimage.com/800x300/000/fff&text=Time+Up",
        choices: [
            { text: 'もう一度プレイする', nextScene: 'start' }
        ],
        onEnter: resetGame
    }
};

function updateScene(sceneName) {
    const scene = scenes[sceneName];
    document.getElementById('story').innerText = scene.text;
    document.getElementById('scene-image').style.backgroundImage = `url(${scene.image})`;
    
    const choicesElement = document.getElementById('choices');
    choicesElement.innerHTML = '';
    
    scene.choices.forEach(choice => {
        if (!choice.condition || choice.condition()) {
            const button = document.createElement('button');
            button.innerText = choice.text;
            button.onclick = () => updateScene(choice.nextScene);
            choicesElement.appendChild(button);
        }
    });

    if (scene.onEnter) {
        scene.onEnter();
    }

    gameState.currentScene = sceneName;
}

function updateInventory(item) {
    if (!gameState.inventory.includes(item)) {
        gameState.inventory.push(item);
    }
    const inventoryElement = document.getElementById('inventory');
    inventoryElement.innerText = gameState.inventory.length > 0 
        ? `インベントリ: ${gameState.inventory.join(', ')}` 
        : '';
}

function showCharacterInfo(character) {
    const characterInfoElement = document.getElementById('character-info');
    characterInfoElement.innerHTML = `
        <h3>${character.name}</h3>
        <img src="${character.image}" alt="${character.name}" style="width:100px;height:100px;">
        <p>${character.description}</p>
    `;
}

function startTimer(duration) {
    gameState.timeRemaining = duration;
    const timerElement = document.getElementById('timer');
    
    const timerInterval = setInterval(() => {
        const minutes = Math.floor(gameState.timeRemaining / 60);
        const seconds = gameState.timeRemaining % 60;
        
        timerElement.innerText = `残り時間: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        if (--gameState.timeRemaining < 0) {
            clearInterval(timerInterval);
            updateScene('timeUp');
        }
    }, 1000);
}

function resetGame() {
    gameState.inventory = [];
    gameState.suspectInterviewed = false;
    gameState.cluesFound = 0;
    document.getElementById('inventory').innerText = '';
    document.getElementById('character-info').innerHTML = '';
}

updateScene('start');