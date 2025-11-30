let Trocci;

let startBG, backstoryBG, vaultBG, workshopExtBG, workshopBG, sewerBG, sewerEndBG;

let backgroundMusic;

let state;

let vaultBeginText;
let vaultBeginChoice;
let talkedMayor, talkedNephew, talkedGuard, talkedLocksmith, exploredVault;

let workshopText;
let enteredWorkshop, puzzleTime, puzzleSolved;
let TL, TM, TR, ML, MM, MR, BL, BM, BR;
let xTL, yTL;
let xTM, yTM;
let xTR, yTR;
let xML, yML;
let xMM, yMM;
let xMR, yMR;
let xBL, yBL;
let xBM, yBM;
let xBR, yBR;
let isDraggingTL, isDraggingTM, isDraggingTR;
let isDraggingML, isDraggingMM, isDraggingMR;
let isDraggingBL, isDraggingBM, isDraggingBR;
let activePiece;

let mazeTime, mazeSolved;
let gridSize = 15;
let mazeTile = [];
let playerX, playerY;
let mazeTileCoords;
let mazeImg;

let vaultEndText;
let hasAccused, accusedCulprit;

function preload() {
  
  // program font
  Trocci = loadFont('fonts/Trocchi.ttf');
  
  // background images
  startBG = loadImage('images/startBG.png');
  backstoryBG = loadImage('images/backstoryBG.png');
  vaultBG = loadImage('images/vaultBG.png');
  workshopExtBG = loadImage('images/workshopExtBG.png');
  workshopBG = loadImage('images/workshopBG.png');
  sewerBG = loadImage('images/sewerBG.png');
  sewerEndBG = loadImage('images/sewerEndBG.png');
  
  // background music
  backgroundMusic = loadSound('audio/backgroundMusic.m4a');
  
  // individual map tiles for puzzle
  TL = loadImage('images/TL.png');
  TM = loadImage('images/TM.png');
  TR = loadImage('images/TR.png');
  
  ML = loadImage('images/ML.png');
  MM = loadImage('images/MM.png');
  MR = loadImage('images/MR.png');
  
  BL = loadImage('images/BL.png');
  BM = loadImage('images/BM.png');
  BR = loadImage('images/BR.png');
  
  // full map for maze
  mazeImg = loadImage('images/fullMaze.png');
}

function setup() {
  createCanvas(800, 500);
  
  initialize();
}

// initializes/resets all variables for game to start
function initialize() {
  state = "start";
  
  vaultBeginText = "You arrive at the vault. The mayor, his nephew, the guard, and the locksmith are there.";
  workshopText = "You head over to the Locksmith’s workshop and the key works. You enter the workshop.";
  vaultEndText = "";
  
  vaultBeginChoice = "";
  talkedMayor = talkedNephew = talkedGuard = talkedLocksmith = exploredVault = false;
  
  enteredWorkshop = puzzleTime = puzzleSolved = false;
  
  isDraggingTL = false;
  isDraggingTM = false;
  isDraggingTR = false;
  isDraggingML = false;
  isDraggingMM = false;
  isDraggingMR = false;
  isDraggingBL = false;
  isDraggingBM = false;
  isDraggingBR = false;
  activePiece = null;
  
  // randomize tile placement on page --> different each time
  xTL = random(425,700);
  yTL = random(150,350);
  
  xTM = random(425,700);
  yTM = random(150,350);
  
  xTR = random(425,700);
  yTR = random(150,350);
  
  xML = random(425,700);
  yML = random(150,350);
  
  xMM = random(425,700);
  yMM = random(150,350);
  
  xMR = random(425,700);
  yMR = random(150,350);
  
  xBL = random(425,700);
  yBL = random(150,350);
  
  xBM = random(425,700);
  yBM = random(150,350);
  
  xBR = random(425,700);
  yBR = random(150,350);
  
  // initialize mazeTile array
  for (let y = 100; y <= 400; y += 20) {
    mazeTile[y] = [];
    for (let x = 250; x <= 550; x += 20) { 
      mazeTile[y][x] = false;
    } 
  }
  
  // x & y of maze tiles
  mazeTileCoords = [
    [250,120],[270,120],[290,120],[310,120],[330,120],[350,120],[390,120],[410,120],[430,120],[450,120],[470,120],[510,120],
    [270,140],[310,140],[390,140],[450,140],[510,140],
    [270,160],[310,160],[350,160],[370,160],[390,160],[410,160],[450,160],[490,160],[510,160],
    [270,180],[350,180],[490,180],
    [270,200],[290,200],[310,200],[330,200],[350,200],[370,200],[390,200],[430,200],[450,200],[490,200],[510,200], 
    [270,220],[390,220],[450,220],[510,220],
    [270,240],[290,240],[310,240],[330,240],[390,240],[450,240],[470,240],[490,240],[510,240],
    [290,260],[330,260],[370,260],[390,260],[410,260],[450,260],
    [270,280],[290,280],[450,280],[470,280],[490,280],[510,280],
    [270,300],[330,300],[350,300],[370,300],[390,300],[410,300],[430,300],[450,300],[510,300],
    [270,320],[290,320],[310,320],[330,320],[510,320],
    [270,340],[370,340],[410,340],[430,340],[450,340],[510,340],
    [270,360],[290,360],[310,360],[330,360],[350,360],[370,360],[390,360],[410,360],[450,360],[470,360],[510,360],[530,360],
  ];
  
  // player start position
  playerX = 260;
  playerY = 130;
  
  mazeTime = mazeSolved = false;
  
  hasAccused = false;
  accusedCulprit = "";
}

function draw() {
  background("black");
  
  // switch statement for game states
  switch (state) {
    case "start":
      start();
      break;
    case "backstory":
      backstory();
      break;
    case "vaultBegin":
      vaultBegin();
      break;
    case "workshop":
      workshop();
      break;
    case "sewer":
      sewer();
      break;
    case "vaultEnd":
      vaultEnd();
      break;
  }
}

function keyPressed() {
  if(state === "start") {
    
    // press enter to start the game --> go to backstory
    if (keyCode === ENTER) {
      state = "backstory";
      
      // start playing background music on loop
      if (!backgroundMusic.isPlaying()) {
        backgroundMusic.loop();
      }
    }
  }
  else if (state === "backstory") {
    
    // click enter to go to vault
    if (keyCode === ENTER) {
      state = "vaultBegin";
    }
  }
  else if (state === "vaultBegin") {
    
    // press '1' to talk to mayor
    if (!talkedMayor && keyCode === 49) {
      vaultBeginText = "You try to talk to the mayor. He says, “I can't believe this happened... This is the town's most valuable treasure. Please solve this case!!!”";
      vaultBeginChoice = "mayor";
      talkedMayor = true;
    }
    
    // press '2' to talk to nephew
    else if (!talkedNephew && keyCode === 50) {
      vaultBeginText = "You tell the mayor's nephew that someone spotted him near the vault last night and asks him to explain. He answers, “I was on my way back from my Uncle’s and I saw the guard asleep. The cheese was already gone when I woke him up!”";
      vaultBeginChoice = "nephew";
      talkedNephew = true;
    }
    
    // press '3' to talk to guard
    else if (!talkedGuard && keyCode === 51) {
      vaultBeginText = "You question the guard about falling asleep on the job. The guard says “I… I might have dozed off. I didn’t touch the cheese! When I woke up, the cheese was already gone.”";
      vaultBeginChoice = "guard";
      talkedGuard = true;
    }
    
    // press '4' to talk to locksmith
    else if (!talkedLocksmith && keyCode === 52) {
      vaultBeginText = "You ask the locksmith if he saw anything. The Locksmith says “I was doing some work across town last night, so I didn’t see anything…”. You ask if you can check out his workshop to see if there are any clues. He responded “Usually I would say yes, but I seem to have lost my key… Ironic, isn't it.”";
      vaultBeginChoice = "locksmith";
      talkedLocksmith = true;
    }
    
    // press '5' to explore vault
    else if (!exploredVault && keyCode === 53) {
      vaultBeginText = "You explore the area around the vault. You find a key that appears to be for the locksmith's workshop...";
      vaultBeginChoice = "explore";
      exploredVault = true; // also means key is found
    }
    
    // press enter to go to workshop (only if player talked to locksmith)
    else if (talkedLocksmith && keyCode === ENTER) {
      state = "workshop";
    }
  }
  else if (state === "workshop") {
    
    // start at workshop exterior
    if (!enteredWorkshop) {
      
      // press '1' to return to vault to get key
      if (keyCode === 49) {
        state = "vaultBegin";
      }
      // press '2' to use key and enter workshop (only available if key was collected)
      else if(exploredVault && keyCode === 50) {
        enteredWorkshop = true;
      }
    }
    // once inside workshop, press enter to solve puzzle
    else if (enteredWorkshop && keyCode === ENTER) {
      puzzleTime = true;
    }
    
    // once puzzle is completed, press enter to go to sewers
    if (puzzleTime && puzzleSolved && keyCode === ENTER) {
      puzzleTime = false;
      state = "sewer";
    }
  }
  else if (state === "sewer") {
    
    // press enter to start maze
    if (keyCode === ENTER) {
      mazeTime = true;
    }
    
    // during maze, click arrows to control player location
    if (mazeTime) {
      if (keyCode === UP_ARROW) { 
        if (playerY > 130 && mazeTile[playerY - 30][playerX - 10]) { 
          playerY = playerY - 20; 
        } 
      } else if (keyCode === RIGHT_ARROW) {
        if (playerX < 540 && mazeTile[playerY - 10][playerX + 10]) { 
          playerX = playerX + 20; 
        } 
      } else if (keyCode === DOWN_ARROW) {
        if (playerY < 370 && mazeTile[playerY + 10][playerX - 10]) {
          playerY = playerY + 20;
        }
      } else if (keyCode === LEFT_ARROW) {
        if (playerX > 260 && mazeTile[playerY - 10][playerX - 30]) {
          playerX = playerX - 20;
        }
      }
    }
    
    // once maze is completed, press enter to go back to vault
    if (mazeTime && mazeSolved && keyCode === ENTER) {
      mazeTime = false;
      state = "vaultEnd";
    }
  }
  else if (state === "vaultEnd") {
    
    // press '1' to accuse the guard
    if (!hasAccused && keyCode === 49) {
      hasAccused = true;
      accusedCulprit = "guard";
    }
    
    // press '2' to accuse the nephew
    else if (!hasAccused && keyCode === 50) {
      hasAccused = true;
      accusedCulprit = "nephew";
    }
    
    // press '3' to accuse the locksmith
    else if (!hasAccused && keyCode === 51) {
      hasAccused = true;
      accusedCulprit = "locksmith";
    }
    
    // once the player has accused someone, press enter to restart the game
    if (hasAccused && keyCode === ENTER) {
      initialize();
      
      // stop playing background music at start scene
      if (backgroundMusic.isPlaying()) {
        backgroundMusic.stop();
      }
    }
  }
}

function mousePressed() {
  if (puzzleTime) {
    
    // reset activePiece and flags first
    activePiece = null;
    isDraggingTL = isDraggingTM = isDraggingTR =
    isDraggingML = isDraggingMM = isDraggingMR =
    isDraggingBL = isDraggingBM = isDraggingBR = false;

    // check pieces in reverse draw order so the topmost piece is chosen first
    // order: BR, BM, BL, MR, MM, ML, TR, TM, TL
    
    // check the distance between image edge and cursor to pick up a tile
    let dBR = dist(mouseX, mouseY, xBR, yBR);
    
    if (dBR < 50) {
      isDraggingBR = true;
      activePiece = 'BR';
      return;
    }

    let dBM = dist(mouseX, mouseY, xBM, yBM);
    if (dBM < 50) {
      isDraggingBM = true;
      activePiece = 'BM';
      return;
    }

    let dBL = dist(mouseX, mouseY, xBL, yBL);
    if (dBL < 50) {
      isDraggingBL = true;
      activePiece = 'BL';
      return;
    }

    let dMR = dist(mouseX, mouseY, xMR, yMR);
    if (dMR < 50) {
      isDraggingMR = true;
      activePiece = 'MR';
      return;
    }

    let dMM = dist(mouseX, mouseY, xMM, yMM);
    if (dMM < 50) {
      isDraggingMM = true;
      activePiece = 'MM';
      return;
    }

    let dML = dist(mouseX, mouseY, xML, yML);
    if (dML < 50) {
      isDraggingML = true;
      activePiece = 'ML';
      return;
    }

    let dTR = dist(mouseX, mouseY, xTR, yTR);
    if (dTR < 50) {
      isDraggingTR = true;
      activePiece = 'TR';
      return;
    }

    let dTM = dist(mouseX, mouseY, xTM, yTM);
    if (dTM < 50) {
      isDraggingTM = true;
      activePiece = 'TM';
      return;
    }

    let dTL = dist(mouseX, mouseY, xTL, yTL);
    if (dTL < 50) {
      isDraggingTL = true;
      activePiece = 'TL';
      return;
    }
  }
}

function mouseDragged() {
  if (puzzleTime) {
    
    // only the active piece will move.
    if (isDraggingTL) {
      xTL = mouseX;
      yTL = mouseY;
    } else if (isDraggingTM) {
      xTM = mouseX;
      yTM = mouseY;
    } else if (isDraggingTR) {
      xTR = mouseX;
      yTR = mouseY;
    } else if (isDraggingML) {
      xML = mouseX;
      yML = mouseY;
    } else if (isDraggingMM) {
      xMM = mouseX;
      yMM = mouseY;
    } else if (isDraggingMR) {
      xMR = mouseX;
      yMR = mouseY;
    } else if (isDraggingBL) {
      xBL = mouseX;
      yBL = mouseY;
    } else if (isDraggingBM) {
      xBM = mouseX;
      yBM = mouseY;
    } else if (isDraggingBR) {
      xBR = mouseX;
      yBR = mouseY;
    }
  }
}

function mouseReleased() {
  if (puzzleTime) {
    
    // when the mouse is released, dragging is turned to false
    isDraggingTL = false;
    isDraggingTM = false;
    isDraggingTR = false;

    isDraggingML = false;
    isDraggingMM = false;
    isDraggingMR = false;

    isDraggingBL = false;
    isDraggingBM = false;
    isDraggingBR = false;

    activePiece = null;
  }
}

// start scene = title screen
function start() {
  imageMode(CORNER);
  background(startBG);
  
  fill("white");
  textFont(Trocci);
  
  textSize(72);
  text("Ratlock\nHolmes", 50, 100, width-100);
  
  textSize(14);
  text("How to play: Press the key shown in parentheses to select an option.", 50, 235, width/2);
  
  textSize(20);
  text("(ENTER) Start the Game", 50, height-40, width-100);
}

// backstory scene
function backstory() {
  imageMode(CORNER);
  background(backstoryBG);
  
  textSize(14);
  
  text("Last night, the Cheese Vault was broken into. There was no damage to the locks or doors… yet the Golden Cheese inside is gone.", 50, 50, width/2-50);
  
  text("The suspects:", 50, 115, width/2-50);
  text("The guard - Claims he “fell asleep”", 75, 135, width/2-50);
  text("The mayor's nephew - Seen near the vault last night", 75, 155, width/2-50);
  text("The locksmith - Only one who knows how to open the lock properly", 75, 193, width/2-50);
  
  text("It is up to you, Ratlock Holmes, to solve the case!", 50, 241, width/2-50);
  
  text("(ENTER) Head to the vault", width/2+50, 50, width/2-50);
}

// beginning vault scene
function vaultBegin() {
  imageMode(CORNER);
  background(vaultBG);
  
  textSize(14);
  
  // text changes based on selection
  text(vaultBeginText, 50, 50, width/2-50);
      
  if (!talkedMayor) {
    text("(1) Talk to the mayor", width/2+50, 50, width/2-50);
  }
  if (!talkedNephew) {
    text("(2) Talk to the nephew", width/2+50, 75, width/2-50);
  }
  if (!talkedGuard) {
    text("(3) Talk to the guard", width/2+50, 100, width/2-50);
  }
  if (!talkedLocksmith) {
    text("(4) Talk to the locksmith", width/2+50, 125, width/2-50);
  }
  if (!exploredVault) {
    text("(5) Explore the area", width/2+50, 150, width/2-50);
  }
  
  if (talkedLocksmith) {
    text("(ENTER) Go to locksmith's workshop", width/2+50, 200, width/2-50);
  }
  
  if (exploredVault ) {
    text("You collected a key!", 50, 250, width-100);
  }
}

// workshop scene
function workshop() {
  if(!enteredWorkshop) {
    imageMode(CORNER);
    background(workshopExtBG);
  
    textSize(14);
    
    text("You get to the Locksmith’s workshop, but the door is locked...", 50, 50, width/2-50);
    
    text("(1) Go back to vault", width/2+50, 50, width/2-50);
    
    
    if (exploredVault) {
      text("(2) Use key", width/2+50, 75, width/2-50);
    }
  }
  else {
    imageMode(CORNER);
    background(workshopBG);
  
    textSize(14);
    
    text("The key worked! You start looking around the locksmith's workshop for any clues. As you are exploring, you find shredded pieces of paper in a trashcan. Maybe you can put it back together...", 50, 50, width/2-50);
    text("(ENTER) Assemble pieces of paper", width/2+50, 50, width/2-50);
  }
  
  if (puzzleTime) {
    puzzle();
  }
}

// puzzle scene
function puzzle() {
  background("black");
  strokeWeight(0);
  
  textSize(14);
  
  if (!puzzleSolved) {
    fill("white");
    textAlign(CENTER);
    text("Drag and drop the tiles into the box to solve the puzzle.", 50, 50, width-100);
  }
  
  
  // puzzle board
  noFill();
  strokeWeight(2);
  stroke("white");
  rect(50, 100, 300, 300);

  // puzzle pieces
  imageMode(CENTER);

  image(TL, xTL, yTL, 100, 100);
  image(TM, xTM, yTM, 100, 100);
  image(TR, xTR, yTR, 100, 100);
  image(ML, xML, yML, 100, 100);
  image(MM, xMM, yMM, 100, 100);
  image(MR, xMR, yMR, 100, 100);
  image(BL, xBL, yBL, 100, 100);
  image(BM, xBM, yBM, 100, 100);
  image(BR, xBR, yBR, 100, 100);

  // snaps tiles to place (within +-10)
  if ((xTL >= 90 && xTL <= 110) && (yTL >= 140 && yTL <= 160)) {
    xTL = 100;
    yTL = 150;
  }

  if ((xTM >= 190 && xTM <= 210) && (yTM >= 140 && yTM <= 160)) {
    xTM = 200;
    yTM = 150;
  }

  if ((xTR >= 290 && xTR <= 310) && (yTR >= 140 && yTR <= 160)) {
    xTR = 300;
    yTR = 150;
  }

  if ((xML >= 90 && xML <= 110) && (yML >= 240 && yML <= 260)) {
    xML = 100;
    yML = 250;
  }

  if ((xMM >= 190 && xMM <= 210) && (yMM >= 240 && yMM <= 260)) {
    xMM = 200;
    yMM = 250;
  }

  if ((xMR >= 290 && xMR <= 310) && (yMR >= 240 && yMR <= 260)) {
    xMR = 300;
    yMR = 250;
  }

  if ((xBL >= 90 && xBL <= 110) && (yBL >= 340 && yBL <= 360)) {
    xBL = 100;
    yBL = 350;
  }

  if ((xBM >= 190 && xBM <= 210) && (yBM >= 340 && yBM <= 360)) {
    xBM = 200;
    yBM = 350;
  }

  if ((xBR >= 290 && xBR <= 310) && (yBR >= 340 && yBR <= 360)) {
    xBR = 300;
    yBR = 350;
  }

  // puzzle is solved --> all tiles are at correct place
  if ((xTL == 100 && yTL == 150) && 
      (xTM == 200 && yTM == 150) &&
      (xTR == 300 && yTR == 150) &&
      (xML == 100 && yML == 250) && 
      (xMM == 200 && yMM == 250) &&
      (xMR == 300 && yMR == 250) &&
      (xBL == 100 && yBL == 350) && 
      (xBM == 200 && yBM == 350) &&
      (xBR == 300 && yBR == 350)) {
    puzzleSolved = true;
    
    fill("white");
    strokeWeight(0);
    textAlign(LEFT);
    text("You successfully put the paper back together! It seems to be a map of the sewers... You should definitely follow it.", 400, height/2-75, width/2-50);

    text("(ENTER) Go to sewers", 400, height/2, width/2-50);
  }
  else {
    puzzleSolved = false;
  }
}

// sewer scene
function sewer() {
  imageMode(CORNER);
  background(sewerBG);
  
  textSize(14);
  
  text("Yuck, sewers... It's a complete maze down here. Good thing I have this map.", 50, 50, width/2-50);
  
  text("(ENTER) Follow the map", width/2+50, 50, width/2-50);
  
  if (mazeTime) {
    maze();
  }
}

// maze scene
function maze() {
  background("black");
  
  textSize(14);
  
  fill("white");
  textAlign(CENTER);
  text("Use your arrow keys to navigate through the maze to reach the end.", 50, 50, width-100);
  
  imageMode(CENTER);
  
  image(mazeImg, width/2, height/2, 300, 300);
  
  // draw 15x15 grid
  let xPos = 250; 
  let yPos = 100; 
  
  for (let i = 0; i < gridSize; i++) { 
    for (let j = 0; j < gridSize; j++) { 
      noFill();
      strokeWeight(0);
      rect(xPos, yPos, 20);
      
      xPos = xPos + 20; 
    } 
    xPos = 250; 
    yPos = yPos + 20; 
  }
  
  drawMaze(); 
  
  // draw player position
  fill("red");
  circle(playerX, playerY, 10)
  
  // maze is solved --> player reached end position
  if (playerX === 540 && playerY === 370) {
    mazeSolved = true;
    
    imageMode(CORNER);
    background(sewerEndBG);
    
    textAlign(LEFT);
    fill("white");
    text("You made it through the sewers and it led you right to the Golden Cheese! You have to get back to the vault and report your findings.", 50, 50, width/2-50);
    
    text("(ENTER) Return to the vault", width/2+50, 50, width/2-50);
  }
}

// draws all maze tiles that player can move on
function drawMaze() {
  for (let coord of mazeTileCoords) {
    setMazeTile(coord[0], coord[1]);
  }
} 

// draws each tile called from drawMaze() & sets that tile at x,y coord in array to be true so player can move on it
function setMazeTile(x, y) { 
  noFill();
  strokeWeight(0); 
  rect(x, y, 20); 
  
  mazeTile[y][x] = true; 
}

// ending vault scene
function vaultEnd() {
  imageMode(CORNER);
  background(vaultBG);
  
  textSize(14);
  
  fill("white");
  
  text("You make it back to the vault, with the Golden Cheese. The mayor is ecstatic! There is one last thing to do...", 50, 50, width/2-50);
  
  text("(1) Accuse the guard", width/2+50, 50, width/2-50);
  text("(2) Accuse the mayor's nephew", width/2+50, 75, width/2-50);
  text("(3) Accuse the locksmith", width/2+50, 100, width/2-50);
  
  if (accusedCulprit === "guard") {
    background(vaultBG);
    
    text("Wrong!", 50, 50, width/2-50);
    
    text("How can a guard sleep through a crime like this? He must just be a deep sleeper... He may have been innocent from committing this crime, but maybe he needs to rethink his career choice.", 50, 100, width/2-50);
    text("(ENTER) Try Again", width/2+50, 50, width/2-50);
  }
  if (accusedCulprit === "nephew") {
    background(vaultBG);
    
    text("Wrong!", 50, 50, width/2-50);
    
    text("It seems too suspicious that he was seen near the vault that night. However, the mayor interrupted that his nephew was with him minutes before the crime and the guard confirmed that he was woken up by the nephew. There was no time for him to commit this crime, so he must be innocent.", 50, 100, width/2-50);
    
    text("(ENTER) Try Again", width/2+50, 50, width/2-50);
  }
  if (accusedCulprit === "locksmith") {
    background(vaultBG);
    
    text("You solved the crime!", 50, 50, width/2-50);
    
    text("The Locksmith exclaims, “I was next in line for mayor, detective. They passed me over… so I took what the town treasures most. And I would have gotten away with it too, if it weren't for your meddling paws!”", 50, 100, width/2-50);
    text("(ENTER) Replay", width/2+50, 50, width/2-50);
  }
}