let squirrelSheet;
let squirrelFrames = [];
let squirrelReactSheet;
let squirrelReactFrames = [];
let squirrelIsReacting = false;
let squirrelWasNear = false;

let heroSheet;
let heroFrames = [];
const HERO_SHEET_PATH = 'assets/紫色超人/ALL.png';
const HERO_FRAME_COUNT = 12;
let heroWalkFrames = [];
const HERO_WALK_FRAME_COUNT = 12;
const HERO_WALK_FRAME_DIR = 'assets/紫色超人/walk';
let heroBounds = null;
let crocSquirrelColliding = false;

// 關卡二角色（右側動畫）
let level2NpcSheet;
let level2NpcFrames = [];
const LEVEL_2_NPC_SHEET_PATH = 'png/level2/1all.png';
const LEVEL_2_NPC_FRAME_COUNT = 12;
let level2NpcX = null;
let level2NpcVX = -2;

// 關卡二新增角色（左側動畫）
let level2LeftNpcSheet;
let level2LeftNpcFrames = [];
const LEVEL_2_LEFT_NPC_SHEET_PATH = 'png/level2/walkall.png';
const LEVEL_2_LEFT_NPC_FRAME_COUNT = 26;

let bgImage;
const BG_IMAGE_PATH = 'assets/bg/City1.png';
let squirrelWorldX = null;
let cameraX = 0;
let crocodileWorldX = 0;
let questionTable;
let currentQuestionText = '';
let currentAnswerText = '';
let currentCorrectFeedback = '';
let currentWrongFeedback = '';
let currentHintText = '';
let squirrelSpeechText = '';
let wasColliding = false;
let answeredCorrectly = false;
let nextQuestionAtFrame = 0;
let pendingNextQuestion = false;

// 關卡二：1all NPC 題目狀態
let level2QuestionText = '';
let level2AnswerText = '';
let level2SpeechText = '';
let level2WasColliding = false;
let level2Answered = false;
let level2NextQuestionAtFrame = 0;
let level2PendingNextQuestion = false;
let level2FocusedOnCollision = false;
let level2IsCollidingNow = false;
let level2QuestionOrder = [];
let level2QuestionOrderPos = 0;
let level2CorrectCount = 0;
const LEVEL_2_CLEAR_COUNT = 5;
let level2Completed = false;

let level1QuestionOrder = [];
let level1QuestionOrderPos = 0;

let lastSquirrelBubbleRect = null;
let isCollidingNow = false;

let fireworks = [];
let fireworksEndFrame = 0;

let fireworkNoise;
let fireworkFilter;
let fireworkEnv;
let fireworkSoundTimer = null;

let jumpOsc;
let jumpEnv;

let crocodileSheet;
let crocodileFrames = [];
let crocodileAltImage;
let crocodileWalkFrames = [];
let crocodileJumpImage;
let crocodileX;
let crocodileY;
let crocodileAnswerInputEl;
let focusedOnCollision = false;
let crocodileFacing = 1;

let crocodileBaseY = 0;
let crocodileIsJumping = false;
let crocodileJumpVY = 0;
const CROCODILE_JUMP_SPEED = -14;
const CROCODILE_GRAVITY = 0.9;

let gameStarted = false;
let currentLevel = 1;
let level1CorrectCount = 0;
const LEVEL_1_CLEAR_COUNT = 5;
let startButtonEl;
let startHintEl;
let retryButtonEl;

const SQUIRREL_SHEET_PATH = 'assets/松鼠/松鼠.png';
const SQUIRREL_FRAME_COUNT = 4;
const SQUIRREL_REACT_SHEET_PATH = 'assets/松鼠/1.png';
const SQUIRREL_REACT_FRAME_COUNT = 1;

const QUESTION_BANK_PATH = 'math_question_bank.csv';

// 關卡一題庫（隨機提問、但不重複）
const LEVEL_1_QUESTIONS = [
  {
    question: '每天刷牙的主要原因是什麼？',
    choices: ['A. 讓牙刷不生鏽', 'B. 保護牙齒，預防蛀牙', 'C. 打發時間'],
    answer: 'B',
  },
  {
    question: '上課時專心聽講，對我們最大的幫助是？',
    choices: ['A. 比較不無聊', 'B. 可以更快學會新知識', 'C. 老師會比較開心'],
    answer: 'B',
  },
  {
    question: '看到地上有垃圾，你最好的做法是？',
    choices: ['A. 當作沒看到', 'B. 等別人撿', 'C. 主動撿起來丟進垃圾桶'],
    answer: 'C',
  },
  {
    question: '和同學吵架時，哪一個方式最能解決問題？',
    choices: ['A. 不理對方', 'B. 找機會好好溝通', 'C. 找更多人吵架'],
    answer: 'B',
  },
  {
    question: '遇到不會的題目時，應該怎麼做比較好？',
    choices: ['A. 直接放棄', 'B. 嘗試思考或請教他人', 'C. 抄別人的答案'],
    answer: 'B',
  },
];

// 關卡二題庫（鱷魚碰到 1all.png 時出題）
const LEVEL_2_QUESTIONS = [
  {
    question: '為什麼要遵守交通規則？',
    choices: ['A. 因為警察會開罰單', 'B. 因為可以保護自己和他人的安全', 'C. 因為大家都這樣做'],
    answer: 'B',
  },
  {
    question: '別人說話時，我們應該怎麼做比較有禮貌？',
    choices: ['A. 插嘴', 'B. 認真聽對方說完', 'C. 做自己的事'],
    answer: 'B',
  },
  {
    question: '如果不小心做錯事，最好的態度是？',
    choices: ['A. 裝作不知道', 'B. 推給別人', 'C. 承認錯誤並改進'],
    answer: 'C',
  },
  {
    question: '每天運動的好處是什麼？',
    choices: ['A. 會變得很累', 'B. 身體更健康、有精神', 'C. 浪費時間'],
    answer: 'B',
  },
  {
    question: '當朋友心情不好時，你可以怎麼做？',
    choices: ['A. 嘲笑他', 'B. 不理他', 'C. 關心並陪伴他'],
    answer: 'C',
  },
];

function resetLevel1QuestionOrder() {
  const n = LEVEL_1_QUESTIONS.length;
  level1QuestionOrder = Array.from({ length: n }, (_, i) => i);
  // Fisher–Yates shuffle
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [level1QuestionOrder[i], level1QuestionOrder[j]] = [level1QuestionOrder[j], level1QuestionOrder[i]];
  }
  level1QuestionOrderPos = 0;
}

function resetLevel2QuestionOrder() {
  const n = LEVEL_2_QUESTIONS.length;
  level2QuestionOrder = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [level2QuestionOrder[i], level2QuestionOrder[j]] = [level2QuestionOrder[j], level2QuestionOrder[i]];
  }
  level2QuestionOrderPos = 0;
  level2CorrectCount = 0;
  level2Completed = false;
}

const CROCODILE_SHEET_PATH = 'assets/鱷魚/鱷魚.png';
const CROCODILE_ALT_IMAGE_PATH = 'assets/鱷魚/20.png';
const CROCODILE_JUMP_IMAGE_PATH = 'assets/鱷魚/17.png';
const CROCODILE_FRAME_COUNT = 21;
const CROCODILE_WALK_FRAME_COUNT = 20;
const CROCODILE_WALK_FRAME_DIR = 'assets/鱷魚/walk';

const ANIM_FRAMES_PER_IMAGE = 6; // 越小越快

function drawLevelBanner(label = '關卡一') {

  push();
  textFont('sans-serif');
  textSize(28);
  textAlign(CENTER, TOP);

  const paddingX = 18;
  const paddingY = 10;
  const boxW = textWidth(label) + paddingX * 2;
  const boxH = textAscent() + textDescent() + paddingY * 2;

  const boxX = width / 2 - boxW / 2;
  const boxY = 16;

  noStroke();
  fill(255, 0, 0);
  rect(boxX, boxY, boxW, boxH, 10);

  fill(255);
  text(label, width / 2, boxY + paddingY);
  pop();
}

function showStartButton(visible) {
  if (!startButtonEl) return;
  startButtonEl.style.display = visible ? 'block' : 'none';
}

function showStartHint(visible) {
  if (!startHintEl) return;
  startHintEl.style.display = visible ? 'block' : 'none';
}

function showRetryButton(visible) {
  if (!retryButtonEl) return;
  retryButtonEl.style.display = visible ? 'block' : 'none';
}

function positionStartButton() {
  if (!startButtonEl) return;
  const canvasRect = document.querySelector('canvas')?.getBoundingClientRect();
  if (!canvasRect) return;
  startButtonEl.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
  startButtonEl.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
}

function positionStartHint() {
  if (!startHintEl) return;
  const canvasRect = document.querySelector('canvas')?.getBoundingClientRect();
  if (!canvasRect) return;
  startHintEl.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
  startHintEl.style.top = `${canvasRect.top + canvasRect.height / 2 + 70}px`;
}

function positionRetryButton() {
  if (!retryButtonEl) return;
  const canvasRect = document.querySelector('canvas')?.getBoundingClientRect();
  if (!canvasRect) return;
  retryButtonEl.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
  retryButtonEl.style.top = `${canvasRect.top + canvasRect.height - 28}px`;
}

function preload() {
  squirrelSheet = loadImage(SQUIRREL_SHEET_PATH);
  squirrelReactSheet = loadImage(SQUIRREL_REACT_SHEET_PATH);
  bgImage = loadImage(BG_IMAGE_PATH);
  heroSheet = loadImage(HERO_SHEET_PATH);
  level2NpcSheet = loadImage(LEVEL_2_NPC_SHEET_PATH);
  level2LeftNpcSheet = loadImage(LEVEL_2_LEFT_NPC_SHEET_PATH);
  crocodileSheet = loadImage(CROCODILE_SHEET_PATH);
  crocodileAltImage = loadImage(CROCODILE_ALT_IMAGE_PATH);
  crocodileJumpImage = loadImage(CROCODILE_JUMP_IMAGE_PATH);

  questionTable = loadTable(QUESTION_BANK_PATH, 'csv', 'header');

  crocodileWalkFrames = [];
  for (let i = 0; i < CROCODILE_WALK_FRAME_COUNT; i++) {
    crocodileWalkFrames.push(loadImage(`${CROCODILE_WALK_FRAME_DIR}/${i}.png`));
  }

  heroWalkFrames = [];
  for (let i = 0; i < HERO_WALK_FRAME_COUNT; i++) {
    heroWalkFrames.push(loadImage(`${HERO_WALK_FRAME_DIR}/${i}.png`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  squirrelFrames = sliceSpriteSheet(squirrelSheet, SQUIRREL_FRAME_COUNT);
  squirrelReactFrames = sliceSpriteSheet(squirrelReactSheet, SQUIRREL_REACT_FRAME_COUNT);
  heroFrames = sliceSpriteSheet(heroSheet, HERO_FRAME_COUNT);
  level2NpcFrames = sliceSpriteSheet(level2NpcSheet, LEVEL_2_NPC_FRAME_COUNT);
  level2LeftNpcFrames = sliceSpriteSheet(level2LeftNpcSheet, LEVEL_2_LEFT_NPC_FRAME_COUNT);
  crocodileFrames = sliceSpriteSheet(crocodileSheet, CROCODILE_FRAME_COUNT);
  crocodileX = width / 2; // 螢幕上的固定位置（相機跟著世界移動）
  crocodileY = height / 2;
  imageMode(CORNER);
  noSmooth();

  // 第一畫面：遊戲開始按鈕
  startButtonEl = document.createElement('button');
  startButtonEl.type = 'button';
  startButtonEl.textContent = '遊戲開始';
  startButtonEl.style.position = 'absolute';
  startButtonEl.style.transform = 'translate(-50%, -50%)';
  startButtonEl.style.zIndex = '20';
  startButtonEl.style.fontSize = '28px';
  startButtonEl.style.padding = '12px 28px';
  document.body.appendChild(startButtonEl);

  startHintEl = document.createElement('div');
  startHintEl.textContent = '遊戲說明：請按左右鍵即空白鍵，想辦法讓鱷魚遇到松鼠。';
  startHintEl.style.position = 'absolute';
  startHintEl.style.transform = 'translate(-50%, -50%)';
  startHintEl.style.zIndex = '20';
  startHintEl.style.fontSize = '18px';
  startHintEl.style.color = '#000';
  startHintEl.style.background = 'rgba(255,255,255,0.75)';
  startHintEl.style.padding = '10px 14px';
  startHintEl.style.borderRadius = '10px';
  startHintEl.style.maxWidth = 'min(560px, 92vw)';
  startHintEl.style.textAlign = 'center';
  document.body.appendChild(startHintEl);

  // 關卡一：重新作答按鈕（畫面下方）
  retryButtonEl = document.createElement('button');
  retryButtonEl.type = 'button';
  retryButtonEl.textContent = '重新作答';
  retryButtonEl.style.position = 'absolute';
  retryButtonEl.style.transform = 'translate(-50%, -50%)';
  retryButtonEl.style.zIndex = '20';
  retryButtonEl.style.fontSize = '18px';
  retryButtonEl.style.padding = '10px 18px';
  retryButtonEl.style.display = 'none';
  document.body.appendChild(retryButtonEl);

  startButtonEl.addEventListener('click', () => {
    gameStarted = true;
    currentLevel = 1;
    level1CorrectCount = 0;
    answeredCorrectly = false;
    nextQuestionAtFrame = 0;
    lastSquirrelBubbleRect = null;
    showStartButton(false);
    showStartHint(false);
    showRetryButton(false);
    try {
      userStartAudio();
    } catch (_) {
      // ignore
    }
  });

  retryButtonEl.addEventListener('click', () => {
    if (!gameStarted) return;
    if (currentLevel !== 1) return;
    if (!crocSquirrelColliding) return;
    if (!currentQuestionText) return;
    if (nextQuestionAtFrame > 0 || pendingNextQuestion) return;

    answeredCorrectly = false;
    nextQuestionAtFrame = 0;
    pendingNextQuestion = false;
    if (crocodileAnswerInputEl) {
      crocodileAnswerInputEl.value = '';
      showCrocodileAnswerInput(true);
      crocodileAnswerInputEl.focus();
    }
  });

  showStartButton(true);
  showStartHint(true);
  positionStartButton();
  positionStartHint();
  positionRetryButton();

  crocodileAnswerInputEl = document.createElement('input');
  crocodileAnswerInputEl.type = 'text';
  crocodileAnswerInputEl.placeholder = '輸入 A/B/C…';
  crocodileAnswerInputEl.inputMode = 'text';
  crocodileAnswerInputEl.autocapitalize = 'characters';
  crocodileAnswerInputEl.autocomplete = 'off';
  crocodileAnswerInputEl.spellcheck = false;
  crocodileAnswerInputEl.style.position = 'absolute';
  crocodileAnswerInputEl.style.display = 'none';
  crocodileAnswerInputEl.style.border = 'none';
  crocodileAnswerInputEl.style.outline = 'none';
  crocodileAnswerInputEl.style.background = 'transparent';
  crocodileAnswerInputEl.style.color = '#000';
  crocodileAnswerInputEl.style.fontSize = '20px';
  crocodileAnswerInputEl.style.lineHeight = '24px';
  crocodileAnswerInputEl.style.zIndex = '10';
  document.body.appendChild(crocodileAnswerInputEl);

  crocodileAnswerInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentLevel === 1) {
        submitAnswer();
      } else if (currentLevel === 2) {
        submitLevel2Answer();
      }
    }
  });

  // 煙火音效（不需外部音檔）
  fireworkNoise = new p5.Noise('white');
  fireworkFilter = new p5.HighPass();
  fireworkNoise.disconnect();
  fireworkNoise.connect(fireworkFilter);
  fireworkFilter.freq(900);
  fireworkFilter.res(12);
  fireworkNoise.start();
  fireworkNoise.amp(0);

  fireworkEnv = new p5.Envelope();
  fireworkEnv.setADSR(0.001, 0.05, 0, 0.12);
  fireworkEnv.setRange(0.6, 0);

  // 跳躍音效（不需外部音檔）
  jumpOsc = new p5.Oscillator('triangle');
  jumpOsc.start();
  jumpOsc.amp(0);

  jumpEnv = new p5.Envelope();
  jumpEnv.setADSR(0.001, 0.05, 0, 0.12);
  jumpEnv.setRange(0.4, 0);
}

function draw() {
  // 第一畫面：按下「遊戲開始」後才開始後面的任務
  if (!gameStarted) {
    cameraX = 0;
    drawScrollingBackground();
    showCrocodileAnswerInput(false);
    showStartButton(true);
    showStartHint(true);
    showRetryButton(false);
    return;
  }

  // 第三畫面：關卡二（通關後顯示）
  if (currentLevel === 2) {
    isCollidingNow = false;
    crocSquirrelColliding = false;
    heroBounds = null;

    // 關卡二也保留鱷魚同樣的移動/背景捲動
    const walkingLeftInput = keyIsDown(LEFT_ARROW);
    const walkingRightInput = keyIsDown(RIGHT_ARROW);

    if (walkingLeftInput) crocodileFacing = -1;
    if (walkingRightInput) crocodileFacing = 1;

    // 背景捲動：跟按鍵同步（不依賴走路幀是否載入）
    if (!crocodileIsJumping) {
      if (walkingLeftInput) {
        crocodileWorldX += 4;
      } else if (walkingRightInput) {
        crocodileWorldX -= 4;
      }
    }

    cameraX = crocodileWorldX - crocodileX;
    drawScrollingBackground();
    drawLevelBanner('關卡二');
    showRetryButton(false);

    // 關卡二提示詞
    {
      const message = '提示：最後五題了，回答完就闖關成功了！！';
      push();
      textFont('sans-serif');
      textSize(20);
      textAlign(LEFT, TOP);

      const padding = 12;
      const contentMaxW = Math.min(520, width - 24 - padding * 2);
      const leading = 26;
      textLeading(leading);

      const wrapByChar = (textStr, maxW) => {
        const chars = Array.from(String(textStr || ''));
        const lines = [];
        let current = '';
        for (const ch of chars) {
          const next = current + ch;
          if (current && textWidth(next) > maxW) {
            lines.push(current);
            current = ch;
          } else {
            current = next;
          }
        }
        if (current) lines.push(current);
        return lines;
      };

      const lines = wrapByChar(message, contentMaxW);
      let maxLineW = 0;
      for (const line of lines) maxLineW = Math.max(maxLineW, textWidth(line));
      const boxW = Math.min(contentMaxW, maxLineW) + padding * 2;
      const boxH = lines.length * leading + padding * 2;

      const boxX = 12;
      const boxY = 60;

      stroke(0);
      strokeWeight(2);
      fill(255);
      rect(boxX, boxY, boxW, boxH, 10);

      noStroke();
      fill(0);
      text(lines.join('\n'), boxX + padding, boxY + padding);
      pop();
    }

    // 關卡二：鱷魚站在地面基準線
    crocodileBaseY = height * 0.7;
    if (!crocodileIsJumping) {
      crocodileY = crocodileBaseY;
    }

    // 鱷魚動畫（沿用關卡一的邏輯）
    let cImg = null;
    if (crocodileIsJumping && crocodileJumpImage) {
      cImg = crocodileJumpImage;
    }

    if (!cImg && walkingLeftInput && crocodileWalkFrames.length) {
      const cIndex = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % crocodileWalkFrames.length;
      cImg = crocodileWalkFrames[cIndex];
    } else if (!cImg && walkingRightInput && crocodileWalkFrames.length) {
      const cIndex = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % crocodileWalkFrames.length;
      cImg = crocodileWalkFrames[cIndex];
    } else if (!cImg && crocodileAltImage) {
      cImg = crocodileAltImage;
    } else if (!cImg && crocodileFrames.length) {
      const cIndex = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % crocodileFrames.length;
      cImg = crocodileFrames[cIndex];
    }

    // 跳躍物理：往上跳、重力落下
    if (crocodileIsJumping) {
      crocodileY += crocodileJumpVY;
      crocodileJumpVY += CROCODILE_GRAVITY;

      if (crocodileY >= crocodileBaseY) {
        crocodileY = crocodileBaseY;
        crocodileIsJumping = false;
        crocodileJumpVY = 0;
      }
    }

    let crocRect = null;
    if (cImg) {
      const cTargetH = height * 0.5;
      const cScale = Math.min(3, cTargetH / cImg.height);
      const cW = cImg.width * cScale;
      const cH = cImg.height * cScale;

      crocodileX = width / 2;
      crocodileY = constrain(crocodileY, cH / 2, height - cH / 2);

      push();
      imageMode(CENTER);
      if (crocodileFacing === -1) {
        translate(crocodileX, crocodileY);
        scale(-1, 1);
        image(cImg, 0, 0, cW, cH);
      } else {
        image(cImg, crocodileX, crocodileY, cW, cH);
      }
      pop();

      crocRect = {
        x: crocodileX - cW / 2,
        y: crocodileY - cH / 2,
        w: cW,
        h: cH,
      };
    }

    // 關卡二新增角色：walkall.png（26 幀）固定在最左邊
    if (level2LeftNpcFrames.length) {
      const baseImg = level2LeftNpcFrames[0];
      const idx = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % level2LeftNpcFrames.length;
      const img = level2LeftNpcFrames[idx];

      const targetH = height * 0.6;
      const scale = Math.min(3, targetH / baseImg.height);
      const w = baseImg.width * scale;
      const h = baseImg.height * scale;
      const x = 24;
      const y = constrain(height * 0.7 - h / 2, 8, height - h - 8);

      push();
      imageMode(CORNER);
      image(img, x, y, w, h);
      pop();
    }

    // 關卡二角色：1all.png 用「第一幀」當基準算固定大小與位置（跟松鼠一樣，避免抖動）
    // 另外：讓 1all NPC 在畫面中左右移動（碰到鱷魚時暫停）
    let npcRect = null;
    if (level2NpcFrames.length) {
      const baseImg = level2NpcFrames[0];
      const idx = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % level2NpcFrames.length;
      const img = level2NpcFrames[idx];

      const targetH = height * 0.6;
      const scale = Math.min(3, targetH / baseImg.height);
      const w = baseImg.width * scale;
      const h = baseImg.height * scale;
      const minX = 24;
      const maxX = width - w - 24;
      if (level2NpcX === null) {
        level2NpcX = maxX;
      }

      if (!level2IsCollidingNow && !level2Answered && !level2Completed) {
        level2NpcX += level2NpcVX;
      }

      level2NpcX = constrain(level2NpcX, minX, maxX);
      if (level2NpcX <= minX + 0.5) level2NpcVX = Math.abs(level2NpcVX);
      if (level2NpcX >= maxX - 0.5) level2NpcVX = -Math.abs(level2NpcVX);

      const x = level2NpcX;
      const y = constrain(height * 0.7 - h / 2, 8, height - h - 8);

      npcRect = { x, y, w, h };

      push();
      imageMode(CORNER);
      image(img, x, y, w, h);
      pop();
    }

    // 關卡二：鱷魚碰到 1all NPC 時出題
    level2IsCollidingNow =
      !!crocRect &&
      !!npcRect &&
      crocRect.x < npcRect.x + npcRect.w &&
      crocRect.x + crocRect.w > npcRect.x &&
      crocRect.y < npcRect.y + npcRect.h &&
      crocRect.y + crocRect.h > npcRect.y;

    if (level2IsCollidingNow && !level2WasColliding) {
      if (!level2QuestionText && !level2Completed) {
        if (!level2QuestionOrder.length || level2QuestionOrder.length !== LEVEL_2_QUESTIONS.length) {
          resetLevel2QuestionOrder();
        }
        pickNewLevel2Question();
      }
      level2Answered = false;
      level2NextQuestionAtFrame = 0;
      level2PendingNextQuestion = false;
      level2FocusedOnCollision = false;
    }
    level2WasColliding = level2IsCollidingNow;

    // 題目文字框（顯示在 NPC 左側附近）
    if (level2IsCollidingNow && (level2SpeechText || level2QuestionText || level2Completed) && npcRect) {
      const message = level2Completed ? (level2SpeechText || '你已完成五個問題！') : (level2SpeechText || level2QuestionText);
      push();
      textFont('sans-serif');
      textSize(22);
      textAlign(LEFT, TOP);

      const lines = String(message).split('\n');
      const leading = 28;
      let maxLineW = 0;
      for (const line of lines) maxLineW = Math.max(maxLineW, textWidth(line));
      const padding = 14;
      const bubbleW = maxLineW + padding * 2;
      const bubbleH = lines.length * leading + padding * 2;

      // 題目框優先往右邊靠（在 NPC 右側）；若右側放不下就改放左側
      const bxRight = npcRect.x + npcRect.w + 18;
      const bxLeft = npcRect.x - bubbleW - 18;
      let bx = bxRight + bubbleW <= width - 8 ? bxRight : bxLeft;
      let by = npcRect.y + 18;
      bx = constrain(bx, 8, width - bubbleW - 8);
      by = constrain(by, 8, height - bubbleH - 8);

      stroke(0);
      strokeWeight(2);
      fill(255);
      rect(bx, by, bubbleW, bubbleH, 12);

      noStroke();
      fill(0);
      let ty = by + padding;
      for (const line of lines) {
        text(line, bx + padding, ty);
        ty += leading;
      }
      pop();
    }

    // 輸入框：碰到 NPC 且尚未送出答案時顯示
    if (level2IsCollidingNow && !level2Completed && !level2Answered) {
      const boxW = 260;
      const boxH = 44;
      const desiredX = crocodileX - boxW / 2;
      const desiredY = crocodileY + height * 0.25;
      const boxX = constrain(desiredX, 8, width - boxW - 8);
      const boxY = constrain(desiredY, 8, height - boxH - 8);

      push();
      rectMode(CORNER);
      stroke(0);
      strokeWeight(2);
      fill(255);
      rect(boxX, boxY, boxW, boxH, 8);
      pop();

      showCrocodileAnswerInput(true);
      positionCrocodileAnswerInput(boxX + 12, boxY + 10, boxW - 24, boxH - 20);

      if (!level2FocusedOnCollision) {
        crocodileAnswerInputEl.focus();
        level2FocusedOnCollision = true;
      }
    } else {
      showCrocodileAnswerInput(false);
      level2FocusedOnCollision = false;
    }

    // 送出答案後：顯示回饋一段時間，再自動換下一題
    if (level2IsCollidingNow && level2NextQuestionAtFrame > 0 && frameCount >= level2NextQuestionAtFrame) {
      pickNewLevel2Question();
      level2Answered = false;
      level2NextQuestionAtFrame = 0;
      level2PendingNextQuestion = false;
      level2FocusedOnCollision = false;
    }

    // 若離開碰撞區，且剛好正在等待換題：清掉題目，避免回來後卡在回饋
    if (!level2IsCollidingNow) {
      if (level2PendingNextQuestion) {
        level2QuestionText = '';
        level2AnswerText = '';
        level2SpeechText = '';
        level2PendingNextQuestion = false;
        level2NextQuestionAtFrame = 0;
        level2Answered = false;
      }
    }

    return;
  }

  isCollidingNow = false;
  crocSquirrelColliding = false;
  heroBounds = null;

  // 先根據按鍵更新世界位移，再算相機與背景，避免背景/松鼠不同步
  const walkingLeftInput = keyIsDown(LEFT_ARROW);
  const walkingRightInput = keyIsDown(RIGHT_ARROW);

  if (walkingLeftInput) crocodileFacing = -1;
  if (walkingRightInput) crocodileFacing = 1;

  if (!crocodileIsJumping && crocodileWalkFrames.length) {
    if (walkingLeftInput) {
      crocodileWorldX += 4;
    } else if (walkingRightInput) {
      crocodileWorldX -= 4;
    }
  }

  cameraX = crocodileWorldX - crocodileX;
  drawScrollingBackground();

  // 畫面二：關卡標題（上方正中）
  drawLevelBanner('關卡一');

  // 關卡一：只有在碰撞中且有題目時才顯示「重新作答」
  showRetryButton(crocSquirrelColliding && !!currentQuestionText && !answeredCorrectly && nextQuestionAtFrame === 0);
  positionRetryButton();

  // 先算松鼠的位置（給「靠近」判斷用）
  let squirrelBounds = null;
  if (squirrelFrames.length) {
    // 位置與大小一律用「原本松鼠」的第一幀當基準，避免切換到 1.png 時跳動
    const sImgForBounds = squirrelFrames[0];

    const sTargetH = height * 0.6;
    const sScale = Math.min(3, sTargetH / sImgForBounds.height);
    const sW = sImgForBounds.width * sScale;
    const sH = sImgForBounds.height * sScale;

    const rightMargin = 30;
    const desiredScreenCenterX = (width - sW - rightMargin) + sW / 2;

    // 松鼠固定在「背景世界」某個位置（世界座標只設定一次）
    if (squirrelWorldX === null) {
      // 讓它一開始出現在原本右側位置，並且和鱷魚（螢幕固定）不同：它會跟背景一起捲動
      squirrelWorldX = cameraX + desiredScreenCenterX;
    }

    const squirrelScreenCenterX = squirrelWorldX - cameraX;
    const sx = squirrelScreenCenterX - sW / 2;

    const desiredCenterY = height * 0.7;
    const sy = constrain(desiredCenterY - sH / 2, 0, height - sH);

    squirrelBounds = {
      x: sx,
      y: sy,
      w: sW,
      h: sH,
      cx: sx + sW / 2,
      cy: sy + sH / 2,
    };

    // 讓鱷魚和松鼠在同一水平線（垂直中心對齊）
    crocodileBaseY = squirrelBounds.cy;
    if (!crocodileIsJumping) {
      crocodileY = crocodileBaseY;
    }
  }

  // 紫色超人：畫布最左邊，且高度高於鱷魚與松鼠
  if (heroFrames.length || heroWalkFrames.length) {
    const heroWalkingLeft = keyIsDown(LEFT_ARROW);
    const heroWalkingRight = keyIsDown(RIGHT_ARROW);
    const heroIsWalking = (heroWalkingLeft || heroWalkingRight) && heroWalkFrames.length;

    const sourceFrames = heroIsWalking ? heroWalkFrames : heroFrames;
    const hIndex = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % sourceFrames.length;
    const hImg = sourceFrames[hIndex];

    const hTargetH = height * 0.25;
    const hScale = Math.min(3, hTargetH / hImg.height);
    const hW = hImg.width * hScale;
    const hH = hImg.height * hScale;

    const leftMargin = 20;
    const baseY = Math.min(crocodileY, squirrelBounds ? squirrelBounds.y : height);
    const hy = constrain(baseY - hH - 20, 10, height - hH - 10);
    const hx = leftMargin;

    heroBounds = {
      x: hx,
      y: hy,
      w: hW,
      h: hH,
      cx: hx + hW / 2,
      cy: hy + hH / 2,
    };

    push();
    imageMode(CORNER);
    if (heroWalkingLeft && heroIsWalking) {
      // 轉向往左（水平翻轉），位置不移動
      translate(hx + hW, hy);
      scale(-1, 1);
      image(hImg, 0, 0, hW, hH);
    } else {
      // 往右（正常顯示）或待機
      image(hImg, hx, hy, hW, hH);
    }
    pop();
  }

  // 鱷魚：畫布正中間
  {
    let cImg = null;

    const walkingLeft = keyIsDown(LEFT_ARROW);
    const walkingRight = keyIsDown(RIGHT_ARROW);

    if (crocodileIsJumping && crocodileJumpImage) {
      cImg = crocodileJumpImage;
    }

    if (!cImg && walkingLeft && crocodileWalkFrames.length) {
      const cIndex = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % crocodileWalkFrames.length;
      cImg = crocodileWalkFrames[cIndex];
    } else if (!cImg && walkingRight && crocodileWalkFrames.length) {
      const cIndex = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % crocodileWalkFrames.length;
      cImg = crocodileWalkFrames[cIndex];
    } else if (!cImg && crocodileAltImage) {
      cImg = crocodileAltImage;
    } else if (!cImg && crocodileFrames.length) {
      const cIndex = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % crocodileFrames.length;
      cImg = crocodileFrames[cIndex];
    }

    // 跳躍物理：往上跳、重力落下
    if (crocodileIsJumping) {
      crocodileY += crocodileJumpVY;
      crocodileJumpVY += CROCODILE_GRAVITY;

      // 到達地面（基準線）就停止跳躍
      if (crocodileY >= crocodileBaseY) {
        crocodileY = crocodileBaseY;
        crocodileIsJumping = false;
        crocodileJumpVY = 0;
      }
    }

    if (cImg) {
      const cTargetH = height * 0.5;
      const cScale = Math.min(3, cTargetH / cImg.height);
      const cW = cImg.width * cScale;
      const cH = cImg.height * cScale;

      // 鱷魚螢幕位置固定，不要因走路而移動
      crocodileX = width / 2;
      crocodileY = constrain(crocodileY, cH / 2, height - cH / 2);

      push();
      imageMode(CENTER);
      if (crocodileFacing === -1) {
        translate(crocodileX, crocodileY);
        scale(-1, 1);
        image(cImg, 0, 0, cW, cH);
      } else {
        image(cImg, crocodileX, crocodileY, cW, cH);
      }
      pop();

      // 需求：當鱷魚「碰到」松鼠時，松鼠顯示題庫 CSV 的「題目」文字
      if (squirrelBounds && squirrelReactFrames.length) {
        const crocRect = {
          x: crocodileX - cW / 2,
          y: crocodileY - cH / 2,
          w: cW,
          h: cH,
        };

        const colliding =
          crocRect.x < squirrelBounds.x + squirrelBounds.w &&
          crocRect.x + crocRect.w > squirrelBounds.x &&
          crocRect.y < squirrelBounds.y + squirrelBounds.h &&
          crocRect.y + crocRect.h > squirrelBounds.y;

        squirrelIsReacting = colliding;
        squirrelWasNear = colliding;
        isCollidingNow = colliding;
        crocSquirrelColliding = colliding;

        // 每次「剛碰到」時：如果目前沒有題目，才出題（避免一直碰到就跳題、看起來像卡住）
        if (colliding && !wasColliding) {
          if (!currentQuestionText) pickNewQuestion();
          answeredCorrectly = false;
          focusedOnCollision = false;
        }
        wasColliding = colliding;

        // 鱷魚下方輸入框：碰到時顯示，輸入答案按 Enter 送出
        if (colliding && !answeredCorrectly) {
          const boxW = 260;
          const boxH = 44;
          const desiredX = crocodileX - boxW / 2;
          const desiredY = crocodileY + cH / 2 + 18;
          const boxX = constrain(desiredX, 8, width - boxW - 8);
          const boxY = constrain(desiredY, 8, height - boxH - 8);

          push();
          rectMode(CORNER);
          stroke(0);
          strokeWeight(2);
          fill(255);
          rect(boxX, boxY, boxW, boxH, 8);
          pop();

          showCrocodileAnswerInput(true);
          positionCrocodileAnswerInput(boxX + 12, boxY + 10, boxW - 24, boxH - 20);

          if (!focusedOnCollision) {
            crocodileAnswerInputEl.focus();
            focusedOnCollision = true;
          }
        } else {
          showCrocodileAnswerInput(false);
        }

        // 答對後：顯示回饋一段時間，再自動換下一題
        if (colliding && nextQuestionAtFrame > 0 && frameCount >= nextQuestionAtFrame) {
          pickNewQuestion();
          answeredCorrectly = false;
          nextQuestionAtFrame = 0;
          pendingNextQuestion = false;
          focusedOnCollision = false;
        }
      } else {
        squirrelIsReacting = false;
        squirrelWasNear = false;
        wasColliding = false;
        answeredCorrectly = false;
        focusedOnCollision = false;
        nextQuestionAtFrame = 0;
        if (pendingNextQuestion) {
          currentQuestionText = '';
          currentAnswerText = '';
          squirrelSpeechText = '';
          pendingNextQuestion = false;
        }
        showCrocodileAnswerInput(false);
        crocSquirrelColliding = false;
      }
    }
  }

  // 松鼠：維持在右邊（中下）
  if (squirrelFrames.length) {
    imageMode(CORNER);

    let sImg = null;
    if (squirrelIsReacting && squirrelReactFrames.length) {
      // 定格顯示 1.png 的第一張
      sImg = squirrelReactFrames[0];
    }

    if (!sImg) {
      const sIndex = Math.floor(frameCount / ANIM_FRAMES_PER_IMAGE) % squirrelFrames.length;
      sImg = squirrelFrames[sIndex];
    }

    if (squirrelBounds) {
      image(sImg, squirrelBounds.x, squirrelBounds.y, squirrelBounds.w, squirrelBounds.h);

      // 當松鼠顯示 1.png（定格）時，在上方顯示文字方框
      if (squirrelIsReacting) {
        const message = squirrelSpeechText || currentQuestionText || '請問你叫甚麽名字';
        push();
        textFont('sans-serif');
        textSize(24);
        textAlign(LEFT, TOP);

        const lines = String(message).split('\n');
        const leading = 30;
        textLeading(leading);

        const padding = 12;
        let maxLineW = 0;
        for (const line of lines) {
          maxLineW = Math.max(maxLineW, textWidth(line));
        }
        const boxW = maxLineW + padding * 2;
        const boxH = lines.length * leading + padding * 2;

        const desiredX = squirrelBounds.cx - boxW / 2;
        const desiredY = squirrelBounds.y - boxH - 12;
        const boxX = constrain(desiredX, 8, width - boxW - 8);
        const boxY = constrain(desiredY, 8, height - boxH - 8);

        lastSquirrelBubbleRect = { x: boxX, y: boxY, w: boxW, h: boxH };

        stroke(0);
        strokeWeight(2);
        fill(255);
        rect(boxX, boxY, boxW, boxH, 8);

        noStroke();
        fill(0);
        text(lines.join('\n'), boxX + padding, boxY + padding);
        pop();
      } else {
        lastSquirrelBubbleRect = null;
      }
    }
  }

  // 答對時放煙花
  updateAndDrawFireworks();

  // 當鱷魚與松鼠碰面時：紫色超人顯示外框與提示對話框
  if (crocSquirrelColliding && heroBounds) {
    const message = '提示：請回答松鼠所提問的五個問題並且順利答對就可通關';
    push();

    // 對話框（放在紫色超人右上方）
    textFont('sans-serif');
    textSize(20);
    textAlign(LEFT, TOP);

    const padding = 12;
    const contentMaxW = Math.min(360, width - 24 - padding * 2);
    const leading = 26;
    textLeading(leading);

    const wrapByChar = (textStr, maxW) => {
      const parts = String(textStr || '').split('\n');
      const lines = [];
      for (const part of parts) {
        const chars = Array.from(part);
        let current = '';
        for (const ch of chars) {
          const next = current + ch;
          if (current && textWidth(next) > maxW) {
            lines.push(current);
            current = ch;
          } else {
            current = next;
          }
        }
        if (current || part === '') lines.push(current);
      }
      return lines;
    };

    const lines = wrapByChar(message, contentMaxW);
    let maxLineW = 0;
    for (const line of lines) maxLineW = Math.max(maxLineW, textWidth(line));
    const contentW = Math.min(contentMaxW, maxLineW);
    const boxW = contentW + padding * 2;
    const boxH = lines.length * leading + padding * 2;

    const intersects = (a, b) =>
      !!a && !!b && a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    const nearHeroCandidates = [
      // 優先：靠近紫色超人
      { x: heroBounds.x + heroBounds.w + 10, y: heroBounds.y }, // 右側
      { x: heroBounds.x - boxW - 10, y: heroBounds.y }, // 左側
      { x: heroBounds.cx - boxW / 2, y: heroBounds.y - boxH - 10 }, // 上方
      { x: heroBounds.cx - boxW / 2, y: heroBounds.y + heroBounds.h + 10 }, // 下方
    ];

    const cornerCandidates = [
      { x: 12, y: 60 },
      { x: 12, y: height - boxH - 12 },
      { x: width - boxW - 12, y: 60 },
      { x: width - boxW - 12, y: height - boxH - 12 },
    ];

    const candidates = [...nearHeroCandidates, ...cornerCandidates];

    let boxX = 12;
    let boxY = 60;
    const squirrelRect = lastSquirrelBubbleRect;

    for (const c of candidates) {
      const cx = constrain(c.x, 8, width - boxW - 8);
      const cy = constrain(c.y, 8, height - boxH - 8);
      const candidateRect = { x: cx, y: cy, w: boxW, h: boxH };
      if (!intersects(candidateRect, squirrelRect)) {
        boxX = cx;
        boxY = cy;
        break;
      }
    }

    stroke(0);
    strokeWeight(2);
    fill(255);
    rect(boxX, boxY, boxW, boxH, 8);

    noStroke();
    fill(0);
    text(lines.join('\n'), boxX + padding, boxY + padding);
    pop();
  }
}

function keyPressed() {
  if (!gameStarted) return false;

  // 空白鍵：鱷魚跳躍並切換成 17.png
  if (keyCode === 32) {
    if (!crocodileIsJumping) {
      crocodileIsJumping = true;
      crocodileJumpVY = CROCODILE_JUMP_SPEED;

      playJumpSound();
    }
    return false;
  }
}

function playJumpSound() {
  try {
    userStartAudio();
  } catch (_) {
    // ignore
  }

  if (!jumpOsc || !jumpEnv) return;

  // 簡單的「啵」聲：先高頻再快速下降
  jumpOsc.freq(700);
  jumpOsc.freq(300, 0.12);
  jumpEnv.play(jumpOsc, 0, 0);
}

function drawScrollingBackground() {
  // 如果背景載不到，就退回粉紅色
  if (!bgImage || !bgImage.width) {
    background('pink');
    return;
  }

  push();
  imageMode(CORNER);

  const scale = height / bgImage.height;
  const tileW = bgImage.width * scale;
  const tileH = height;

  // 世界座標 cameraX 對應畫面捲動，做 3 張串接（左、中、右）
  let offset = (-cameraX) % tileW;
  if (offset < 0) offset += tileW;

  const startX = -offset - tileW;
  for (let i = 0; i < 4; i++) {
    const x = startX + i * tileW;
    image(bgImage, x, 0, tileW, tileH);
  }

  pop();
}

function pickNewQuestion() {
  // 關卡一：從題庫依序出題（先洗牌，確保不重複）
  const pool = LEVEL_1_QUESTIONS;
  if (pool && pool.length) {
    if (!level1QuestionOrder.length || level1QuestionOrder.length !== pool.length) {
      resetLevel1QuestionOrder();
    }
    if (level1QuestionOrderPos >= level1QuestionOrder.length) {
      // 保險：用完就再洗一次
      resetLevel1QuestionOrder();
    }

    const idx = level1QuestionOrder[level1QuestionOrderPos];
    level1QuestionOrderPos += 1;
    const item = pool[idx];

    currentQuestionText = [item.question, ...item.choices].join('\n');
    currentAnswerText = item.answer;
    currentCorrectFeedback = '答對了！';
    currentWrongFeedback = '答案錯誤。';
    currentHintText = '';
    squirrelSpeechText = currentQuestionText;

    if (crocodileAnswerInputEl) {
      crocodileAnswerInputEl.value = '';
    }
    return;
  }

  // 若未提供題庫才退回 CSV（目前不會走到）
  if (!questionTable || questionTable.getRowCount() === 0) {
    currentQuestionText = '';
    currentAnswerText = '';
    currentCorrectFeedback = '';
    currentWrongFeedback = '';
    currentHintText = '';
    squirrelSpeechText = '';
    return;
  }

  const row = questionTable.getRow(Math.floor(Math.random() * questionTable.getRowCount()));
  currentQuestionText = row.getString('題目') || '';
  currentAnswerText = row.getString('答案') || '';
  currentCorrectFeedback = row.getString('答對回饋') || '';
  currentWrongFeedback = row.getString('答錯回饋') || '';
  currentHintText = row.getString('提示') || '';
  squirrelSpeechText = currentQuestionText;

  if (crocodileAnswerInputEl) {
    crocodileAnswerInputEl.value = '';
  }
}

function submitAnswer() {
  if (!crocodileAnswerInputEl) return;
  const valueRaw = crocodileAnswerInputEl.value.trim();
  if (!valueRaw) return;

  // 只有關卡一可作答
  if (currentLevel !== 1) return;

  // 只在碰撞狀態下作答
  if (!isCollidingNow) return;

  const expectedRaw = (currentAnswerText || '').trim();

  const normalize = (s) => String(s || '').replace(/\s+/g, '').trim().toUpperCase();

  const valueNum = Number(valueRaw);
  const expectedNum = Number(expectedRaw);
  const bothNumeric = Number.isFinite(valueNum) && Number.isFinite(expectedNum) && valueRaw !== '' && expectedRaw !== '';
  const isCorrect = bothNumeric ? valueNum === expectedNum : normalize(valueRaw) === normalize(expectedRaw);

  if (isCorrect) {
    level1CorrectCount += 1;
    if (level1CorrectCount >= LEVEL_1_CLEAR_COUNT) {
      // 通關：切到第三畫面（關卡二）
      currentLevel = 2;
      squirrelSpeechText = '';
      squirrelIsReacting = false;
      answeredCorrectly = false;
      nextQuestionAtFrame = 0;
      showCrocodileAnswerInput(false);
      crocodileAnswerInputEl.blur();
      return;
    }

    squirrelSpeechText = currentCorrectFeedback || '答對了！';
    answeredCorrectly = true;
    showCrocodileAnswerInput(false);
    crocodileAnswerInputEl.blur();

    startFireworks();
    playFireworkSound();

    // 約 1 秒後自動換下一題
    nextQuestionAtFrame = frameCount + 60;
    pendingNextQuestion = true;
  } else {
    squirrelSpeechText = `${currentWrongFeedback || '再試一次～'} 加油！`;
    answeredCorrectly = true;
    showCrocodileAnswerInput(false);
    crocodileAnswerInputEl.blur();

    // 作答後不論對錯都換下一題（保留約 1 秒回饋）
    nextQuestionAtFrame = frameCount + 60;
    pendingNextQuestion = true;
  }
}

function pickNewLevel2Question() {
  const pool = LEVEL_2_QUESTIONS;
  if (!pool || !pool.length) {
    level2QuestionText = '';
    level2AnswerText = '';
    level2SpeechText = '';
    level2Completed = true;
    return;
  }

  if (!level2QuestionOrder.length || level2QuestionOrder.length !== pool.length) {
    resetLevel2QuestionOrder();
  }

  if (level2QuestionOrderPos >= level2QuestionOrder.length) {
    level2Completed = true;
    level2QuestionText = '';
    level2AnswerText = '';
    level2SpeechText = '你已完成五個問題！';
    return;
  }

  const idx = level2QuestionOrder[level2QuestionOrderPos];
  level2QuestionOrderPos += 1;
  const item = pool[idx];

  level2QuestionText = [item.question, ...item.choices].join('\n');
  level2AnswerText = item.answer;
  level2SpeechText = level2QuestionText;

  if (crocodileAnswerInputEl) {
    crocodileAnswerInputEl.value = '';
  }
}

function submitLevel2Answer() {
  if (!crocodileAnswerInputEl) return;
  const valueRaw = crocodileAnswerInputEl.value.trim();
  if (!valueRaw) return;
  if (currentLevel !== 2) return;
  if (!level2IsCollidingNow) return;
  if (level2Completed) return;
  if (!level2AnswerText) return;

  const normalize = (s) => String(s || '').replace(/\s+/g, '').trim().toUpperCase();
  const value = normalize(valueRaw);
  const expected = normalize(level2AnswerText);
  const isCorrect = value === expected;

  if (isCorrect) {
    level2CorrectCount += 1;
    level2SpeechText = '答對了！';
  } else {
    level2SpeechText = `答錯了！正確答案：${expected}`;
  }

  level2Answered = true;
  showCrocodileAnswerInput(false);
  crocodileAnswerInputEl.blur();

  level2NextQuestionAtFrame = frameCount + 60;
  level2PendingNextQuestion = true;
}

function playFireworkSound() {
  // iOS/Chrome 需要使用者互動後才允許播放；Enter 屬於互動
  try {
    userStartAudio();
  } catch (_) {
    // ignore
  }

  if (!fireworkNoise || !fireworkEnv) return;

  // 如果上一段還在播，先清掉計時器避免疊太多
  if (fireworkSoundTimer) {
    clearTimeout(fireworkSoundTimer);
    fireworkSoundTimer = null;
  }

  const bursts = 9;
  for (let i = 0; i < bursts; i++) {
    const delay = Math.random() * 900; // 0~0.9 秒內隨機爆裂
    setTimeout(() => {
      fireworkEnv.play(fireworkNoise, 0, 0.02);
    }, delay);
  }

  // 持續 1 秒後確保回到靜音
  fireworkSoundTimer = setTimeout(() => {
    fireworkNoise.amp(0, 0.05);
    fireworkSoundTimer = null;
  }, 1000);
}

function startFireworks() {
  fireworks = [];
  fireworksEndFrame = frameCount + 120; // 約 2 秒

  // 產生 5 次爆炸
  for (let b = 0; b < 5; b++) {
    const bx = random(width * 0.2, width * 0.8);
    const by = random(height * 0.15, height * 0.6);
    spawnFireworkBurst(bx, by);
  }
}

function spawnFireworkBurst(x, y) {
  const count = 60;
  for (let i = 0; i < count; i++) {
    const angle = random(TWO_PI);
    const speed = random(2, 6);
    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60,
      // 使用 HSB 做繽紛顏色
      hue: random(0, 360),
    });
  }
}

function updateAndDrawFireworks() {
  if (frameCount > fireworksEndFrame) {
    fireworks = [];
    return;
  }

  if (!fireworks.length) return;

  push();
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const p = fireworks[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06; // 重力
    p.vx *= 0.99;
    p.vy *= 0.99;
    p.life -= 1;

    const alpha = map(p.life, 0, 60, 0, 90);
    fill(p.hue, 90, 100, alpha);
    circle(p.x, p.y, 4);

    if (p.life <= 0) {
      fireworks.splice(i, 1);
    }
  }

  pop();
}

function showCrocodileAnswerInput(visible) {
  if (!crocodileAnswerInputEl) return;
  crocodileAnswerInputEl.style.display = visible ? 'block' : 'none';
}

function positionCrocodileAnswerInput(x, y, w, h) {
  if (!crocodileAnswerInputEl) return;
  const canvasRect = document.querySelector('canvas')?.getBoundingClientRect();
  if (!canvasRect) return;

  crocodileAnswerInputEl.style.left = `${canvasRect.left + x}px`;
  crocodileAnswerInputEl.style.top = `${canvasRect.top + y}px`;
  crocodileAnswerInputEl.style.width = `${w}px`;
  crocodileAnswerInputEl.style.height = `${h}px`;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionStartButton();
  positionStartHint();
  positionRetryButton();

  // 關卡二 NPC 位置需要重新約束
  if (level2NpcX !== null) {
    level2NpcX = constrain(level2NpcX, 24, windowWidth - 24);
  }
}

function sliceSpriteSheet(img, count) {
  const result = [];
  if (!img || !img.width || !img.height || count <= 0) return result;

  // 盡量自動判斷：橫向條、縱向條、或 2x2 格子（count=4）。
  const isHorizontalStrip = img.width >= img.height * count * 0.9;
  const isVerticalStrip = img.height >= img.width * count * 0.9;

  if (isHorizontalStrip) {
    const frameW = Math.floor(img.width / count);
    const frameH = img.height;
    for (let i = 0; i < count; i++) {
      result.push(img.get(i * frameW, 0, frameW, frameH));
    }
    return result;
  }

  if (isVerticalStrip) {
    const frameW = img.width;
    const frameH = Math.floor(img.height / count);
    for (let i = 0; i < count; i++) {
      result.push(img.get(0, i * frameH, frameW, frameH));
    }
    return result;
  }

  // count=4 常見是 2x2
  if (count === 4) {
    const cols = 2;
    const rows = 2;
    const frameW = Math.floor(img.width / cols);
    const frameH = Math.floor(img.height / rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        result.push(img.get(c * frameW, r * frameH, frameW, frameH));
      }
    }
    return result;
  }

  // 最後退回：當作橫向條
  const frameW = Math.floor(img.width / count);
  const frameH = img.height;
  for (let i = 0; i < count; i++) {
    result.push(img.get(i * frameW, 0, frameW, frameH));
  }
  return result;
}
