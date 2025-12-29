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

const SQUIRREL_SHEET_PATH = 'assets/松鼠/松鼠.png';
const SQUIRREL_FRAME_COUNT = 4;
const SQUIRREL_REACT_SHEET_PATH = 'assets/松鼠/1.png';
const SQUIRREL_REACT_FRAME_COUNT = 1;

const QUESTION_BANK_PATH = 'math_question_bank.csv';

const CROCODILE_SHEET_PATH = 'assets/鱷魚/鱷魚.png';
const CROCODILE_ALT_IMAGE_PATH = 'assets/鱷魚/20.png';
const CROCODILE_JUMP_IMAGE_PATH = 'assets/鱷魚/17.png';
const CROCODILE_FRAME_COUNT = 21;
const CROCODILE_WALK_FRAME_COUNT = 20;
const CROCODILE_WALK_FRAME_DIR = 'assets/鱷魚/walk';

const ANIM_FRAMES_PER_IMAGE = 6; // 越小越快

function preload() {
  squirrelSheet = loadImage(SQUIRREL_SHEET_PATH);
  squirrelReactSheet = loadImage(SQUIRREL_REACT_SHEET_PATH);
  bgImage = loadImage(BG_IMAGE_PATH);
  heroSheet = loadImage(HERO_SHEET_PATH);
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
  crocodileFrames = sliceSpriteSheet(crocodileSheet, CROCODILE_FRAME_COUNT);
  crocodileX = width / 2; // 螢幕上的固定位置（相機跟著世界移動）
  crocodileY = height / 2;
  imageMode(CORNER);
  noSmooth();

  crocodileAnswerInputEl = document.createElement('input');
  crocodileAnswerInputEl.type = 'text';
  crocodileAnswerInputEl.placeholder = '輸入答案…';
  crocodileAnswerInputEl.inputMode = 'numeric';
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
      submitAnswer();
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

        // 每次「剛碰到」時，換一題
        if (colliding && !wasColliding) {
          pickNewQuestion();
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
          focusedOnCollision = false;
        }
      } else {
        squirrelIsReacting = false;
        squirrelWasNear = false;
        wasColliding = false;
        answeredCorrectly = false;
        focusedOnCollision = false;
        nextQuestionAtFrame = 0;
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

        const padding = 12;
        const boxW = textWidth(message) + padding * 2;
        const boxH = textAscent() + textDescent() + padding * 2;

        const desiredX = squirrelBounds.cx - boxW / 2;
        const desiredY = squirrelBounds.y - boxH - 12;
        const boxX = constrain(desiredX, 8, width - boxW - 8);
        const boxY = constrain(desiredY, 8, height - boxH - 8);

        stroke(0);
        strokeWeight(2);
        fill(255);
        rect(boxX, boxY, boxW, boxH, 8);

        noStroke();
        fill(0);
        text(message, boxX + padding, boxY + padding);
        pop();
      }
    }
  }

  // 答對時放煙花
  updateAndDrawFireworks();

  // 當鱷魚與松鼠碰面時：紫色超人顯示外框與提示對話框
  if (crocSquirrelColliding && heroBounds) {
    const message = '提示詞：請回答松鼠所提問的問題。';
    push();

    // 對話框（放在紫色超人右上方）
    textFont('sans-serif');
    textSize(20);
    textAlign(LEFT, TOP);

    const padding = 12;
    const boxW = Math.min(width - 16, textWidth(message) + padding * 2);
    const boxH = textAscent() + textDescent() + padding * 2;

    const desiredX = heroBounds.x + heroBounds.w + 16;
    const desiredY = heroBounds.y;
    const boxX = constrain(desiredX, 8, width - boxW - 8);
    const boxY = constrain(desiredY, 8, height - boxH - 8);

    stroke(0);
    strokeWeight(2);
    fill(255);
    rect(boxX, boxY, boxW, boxH, 8);

    noStroke();
    fill(0);
    text(message, boxX + padding, boxY + padding);
    pop();
  }
}

function keyPressed() {
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

  // 只在碰撞狀態下作答
  if (!isCollidingNow) return;

  const expectedRaw = (currentAnswerText || '').trim();

  const valueNum = Number(valueRaw);
  const expectedNum = Number(expectedRaw);
  const bothNumeric = Number.isFinite(valueNum) && Number.isFinite(expectedNum) && valueRaw !== '' && expectedRaw !== '';
  const isCorrect = bothNumeric ? valueNum === expectedNum : valueRaw === expectedRaw;

  if (isCorrect) {
    squirrelSpeechText = currentCorrectFeedback || '答對了！';
    answeredCorrectly = true;
    showCrocodileAnswerInput(false);
    crocodileAnswerInputEl.blur();

    startFireworks();
    playFireworkSound();

    // 約 1 秒後自動換下一題
    nextQuestionAtFrame = frameCount + 60;
  } else {
    squirrelSpeechText = `${currentWrongFeedback || '再試一次～'} 加油！`;
    // 若需要提示，可改成：squirrelSpeechText = `${currentWrongFeedback || '再試一次～'} ${currentHintText || ''}`;
    crocodileAnswerInputEl.select();
  }
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
