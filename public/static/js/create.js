var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;

var WALL_HIGH_HEIGHT = 4;

var character = undefined;


function drawCharacter(game, grid_x, grid_y) {
    var x = grid_x * TILE_WIDTH;
    var y = grid_y * TILE_HEIGHT + TILE_HEIGHT / 4;
    character = game.add.sprite(x, y, 'character1');

    game.anims.create({
        key: 'up',
        frames: [0],
    });

    game.anims.create({
        key: 'down',
        frames: [3],
    });

    game.anims.create({
        key: 'left',
        frames: [6],
    });

    game.anims.create({
        key: 'right',
        frames: [9],
    });

    gameState.addPlayer(new Player(-1, character, new Position(grid_x, grid_y), ACTIVITY.IDLE, true));

    return character;
}

function drawObject(game, grid_x, grid_y, indentifier, offset_y_half_tile = false, rigid = true, wall = false) {
    
    var x = grid_x * TILE_WIDTH;
    var y = grid_y * TILE_HEIGHT;

    var tileDefinition = TILE_DEFINITION[indentifier];
    var half_tile_offset = (offset_y_half_tile) ? TILE_HEIGHT / 2 : 0;


    var tile_state = (rigid && !wall) ? TILE_STATE.OBJECT : (rigid) ? TILE_STATE.WALL : TILE_STATE.FREE

    var gameObjects = []
    for (var y_i = 0; y_i < tileDefinition.spriteDefinition.length; y_i++) {
        for (var x_i = 0; x_i < tileDefinition.spriteDefinition[0].length; x_i++) {
            if (y_i === 0) {
                gameState.setTileState(grid_x + x_i, grid_y - 1, tile_state);
            }
            
            gameObjects.push(game.add.sprite(x + x_i * TILE_WIDTH + tileDefinition.x_offset * TILE_WIDTH, y + y_i * TILE_HEIGHT + tileDefinition.y_offset * TILE_HEIGHT - half_tile_offset, 'spritesheet', tileDefinition.spriteDefinition[y_i][x_i]));
        }
    }
    return gameObjects.flat();
}

function drawTileArea(game, grid_x, grid_y, grid_width, grid_height) {
    var gameObjects = [];
    for (var i = 0; i < grid_width; i++) {
        for (var j = 0; j < grid_height; j++) {
            gameObjects.push(drawObject(game, grid_x + i, grid_y + j, 'TILE_SIMPLE', false, false, false));
        }
    }
    return gameObjects.flat(1)
}

function drawHorizontalWall(game, grid_x, grid_y, grid_width, endWallLeft = false, endWallRight=false) {
    var gameObjects = []
    for (var i = 0; i < grid_width; i++) {
        if (i === 0 && endWallLeft) {
            gameObjects.push(drawObject(game, grid_x + i, grid_y, 'WALL_HIGH_LEFT', undefined, true, true));
        } else if (i === grid_width - 1 && endWallRight) {
            gameObjects.push(drawObject(game, grid_x + i, grid_y, 'WALL_HIGH_RIGHT', undefined, true, true));
        } else {
            gameObjects.push(drawObject(game, grid_x + i, grid_y, 'WALL_HIGH_CENTER', undefined, true, true));
        }
    }
    return gameObjects.flat();
}

function drawRoom(game, grid_x, grid_y, grid_width, grid_height) {
    var gameObjects = []

    if (grid_width <= 0 || grid_height <= 0) {
        throw new Error("Invalid tile configuration.")
    }

  

    // draw tiles
    gameObjects.push(drawTileArea(game, grid_x, grid_y, grid_width, grid_height, false, false));
    

    // draw walls
    gameObjects.push(drawHorizontalWall(game, grid_x, grid_y, grid_width, false, true, true));

    

    var tables = ["TABLE"]
    var shelf = ["SIDEBOARD_SMALL", "BOOKSHELF", "CLOSET", "SIDEBOARD"]

    var table = Math.floor(Math.random() * 3); 
    gameObjects.push(drawObject(game, grid_x + table, grid_y - 1, tables[0], false, true, true));
    var shelfIndex1 = (table === 1) ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4);
    var shelfIndex2 = (table === 1) ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4);
    //gameObjects.push(drawObject(game, grid_x + table, grid_y - 1, shelf[shelfIndex1], false, true, true));
    if ((table === 2 || table === 0) && shelf[shelfIndex1] === "SIDEBOARD") {
        if (table === 2) {
            gameObjects.push(drawObject(game, grid_x, grid_y, shelf[shelfIndex1], true, true, true));
        } else if (table === 0) {
            gameObjects.push(drawObject(game, grid_x + 3, grid_y, shelf[shelfIndex1], true, true, true));
        }  
    } else {
        if (shelf[shelfIndex2] === "SIDEBOARD") {
            shelfIndex2 = Math.floor(Math.random() * 3);
        }
        if (shelf[shelfIndex1] === "SIDEBOARD") {
            shelfIndex1 = Math.floor(Math.random() * 3);
        }
        if (table === 1) {
            gameObjects.push(drawObject(game, grid_x, grid_y, shelf[shelfIndex1], true, true, true));
            gameObjects.push(drawObject(game, grid_x + 4, grid_y, shelf[shelfIndex2], true, true, true));
        } else if (table === 2) {
            gameObjects.push(drawObject(game, grid_x, grid_y, shelf[shelfIndex1], true, true, true));
            gameObjects.push(drawObject(game, grid_x + 1, grid_y, shelf[shelfIndex2], true, true, true));
        }  else if (table === 0) {
            gameObjects.push(drawObject(game, grid_x + 3, grid_y, shelf[shelfIndex1], true, true, true));
            gameObjects.push(drawObject(game, grid_x + 4, grid_y, shelf[shelfIndex2], true, true, true));
        }
       
    }
    

    for (var j = 0; j < grid_height + 1; j++) {
        for (var i = 0; i < grid_width; i++) {
            if (i === 0 && j !== 0) {
                gameObjects.push(drawObject(game, grid_x + i - 1, grid_y + j, 'WALL_LEFT'));
            }

            if (i === grid_width - 1 && j !== 0) {
                gameObjects.push(drawObject(game, grid_x + i + 1, grid_y + j, 'WALL_RIGHT'));
            }

            if (i === 0 && j === 0) {
                gameObjects.push(drawObject(game, grid_x - 1, grid_y + j, 'CORNER_UP_RIGHT'));
            } else if (i === grid_width - 1 && j === 0) {
                gameObjects.push(drawObject(game, grid_x + i + 1, grid_y + j, 'CORNER_UP_LEFT'));
            }
        }
    }

    var door = Math.round(Math.random()); 
    if (door === 0) {
        gameObjects.push(drawHorizontalWall(game, grid_x - 1, grid_y + 5, 2, false, true));
        gameObjects.push(drawHorizontalWall(game, grid_x + grid_width - 2, grid_y + 5, 3, true, false));
    } else {
        gameObjects.push(drawHorizontalWall(game, grid_x - 1, grid_y + 5, 3, false, true));
        gameObjects.push(drawHorizontalWall(game, grid_x + grid_width - 1, grid_y + 5, 2, true, false));
    }
    
   

    return gameObjects.flat();
}

var rooms = 1;
var room_width = 5;
var room_height = 5;

function create() {
    gameState.setGame(this);

    

    for (var i = 0; i < rooms; i++) {
        var room = drawRoom(this, 2 + (i * (room_width + 2)), 5, 5, 5);
        gameState.addRoom(room);
    }

    // some meta stuff
    drawTileArea(this, 0, 10, rooms * (room_width +1 ) + 55, 5, false, false);
    drawObject(this, 6, 10, 'SIDEBOARD', true)
   

    character = drawCharacter(this, 5, 10)


    // register key press handlers
    this.input.keyboard.on('keydown_W', moveUp, this);
    this.input.keyboard.on('keydown_UP', moveUp, this);
    this.input.keyboard.on('keydown_A', moveLeft, this);
    this.input.keyboard.on('keydown_LEFT', moveLeft, this);
    this.input.keyboard.on('keydown_S', moveDown, this);
    this.input.keyboard.on('keydown_DOWN', moveDown, this);
    this.input.keyboard.on('keydown_D', moveRight, this);
    this.input.keyboard.on('keydown_RIGHT', moveRight, this);
}
