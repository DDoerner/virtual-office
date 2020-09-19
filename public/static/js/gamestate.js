class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

class Room {
    constructor(gameObjects, player, grid_x, grid_y, grid_width, grid_height) {
        this.gameObjects = gameObjects;
        this.owner = player;
        this.grid_x = grid_x;
        this.grid_y = grid_y;
        this.grid_width = grid_width;
        this.grid_height = grid_height;
    }

    destroy() {
        this.gameObjects.forEach((x) => {
            x.destroy();
        });

        gameState.movePlayer(DIRECTION.DOWN)
    }
}



class Player {
    constructor(id, gameObject, position, state, isSelf = false) {
        this.id = id;
        this.gameObject = gameObject;
        this.position = position;
        this.state = state;
        this.isSelf = isSelf;
    }

    setPosition(p) {
        this.position = p;

        if (gameState.getGrid()[this.position.x][this.position.y + 3] === TILE_STATE.WALL
            || gameState.getGrid()[this.position.x][this.position.y + 2] === TILE_STATE.WALL
            || gameState.getGrid()[this.position.x][this.position.y + 1] === TILE_STATE.WALL
            || gameState.getGrid()[this.position.x][this.position.y] === TILE_STATE.WALL) {
            this.gameObject.alpha = 0.5;
        } else {
            this.gameObject.alpha = 1;
        }
        this.gameObject.x = p.getX() * TILE_WIDTH;
        this.gameObject.y = p.getY() * TILE_HEIGHT;
    }

    getPosition() {
        return this.position;
    }

    getId() {
        return this.id;
    }
}


class GameState {
    constructor(grid_width, grid_height) {
        if (!GameState.instance) {
            this.grid = zeros([grid_width, grid_height]);
            this.players = []
            this.rooms = new Array(12)
            this.game = undefined;
            GameState.instance = this;
        }

    }

    removePlayer(id) {
        // TODO:
    }

    addPlayer(player) {
        this.players.push(player);
    }

    addRoom(room) {
        var index =  this.getAvailableRoom();
        this.rooms[index] = room;
    };

    getAvailableRoom() {
        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i] === undefined) {
                return i;
            }
        }
    }

    removeRoomsOfPlayer(id) {
        for (var i = 0; i < this.rooms.length; i++) {
            
            if (this.rooms[i] === undefined) {
                console.log(i)
                continue
            } else if (this.rooms[i].owner !== undefined && this.rooms[i].owner.getId() === id) {
                console.log("destroying")
                this.rooms[i].destroy();
                gameState.freeGrid(this.rooms[i].grid_x - 1, this.rooms[i].grid_y, this.rooms[i].grid_width + 2, this.rooms[i].grid_height)
                this.rooms[i] = undefined;
            }
            
        }
    }

    // expect tile x, y and a TILE_STATE
    setTileState(x, y, state) {
        console.log(x + " - " + y + " - " + state)
        if (this.grid[x][y] > state) {
            return;
        }

        this.grid[x][y] = state;
    }

    movePlayer(direction) {
        console.log("moving: " + direction)
        var player = this.players.filter((x) => x.isSelf)[0];

        var x_diff = 0;
        var y_diff = 0;

        if (direction === DIRECTION.UP) {
            y_diff = -1;
        } else if (direction === DIRECTION.DOWN) {
            y_diff = 1;
        } else if (direction === DIRECTION.LEFT) {
            x_diff = -1;
        } else if (direction === DIRECTION.RIGHT) {
            x_diff = 1;
        }

        var p_x = player.getPosition().getX() + x_diff;
        var p_y = player.getPosition().getY() + y_diff;

        console.log(p_x)
        console.log(this.grid[p_x][p_y])
        if (p_x  < 0 || p_y < 0) {
            console.log("walking out of bounds")
            return; // out of bounds
        } else if (p_x >= this.grid.length || p_y >= this.grid[0].length) {
            console.log("walking out of bounds")
            return; // out of bounds
        } else if (this.grid[p_x][p_y] === TILE_STATE.FREE) {
            player.setPosition(new Position(player.getPosition().getX() + x_diff, player.getPosition().getY() + y_diff));
        } else {
            console.log("path is blocked")
        }

        player.gameObject.setDepth(1);
    }

    getGrid() {
        return this.grid;
    }

    setGame(game) {
        this.game = game;
        Object.freeze(this)
    }

    freeGrid(grid_x, grid_y, grid_width, grid_height) {
        for (var i = 0; i < grid_width; i++) {
            for (var j = 0; j < grid_height; j++) {
                this.grid[grid_x + i][grid_y + j] = TILE_STATE.FREE;
            }
        }
    }
}

const gameState = new GameState(200, 200, []);



var ACTIVITY = {
    CALLING: "CALLING",
    IDLE: "IDLE",
    EATING: "EATING"
}

var TILE_STATE = {
    FREE: 0,
    OBJECT: 1,
    CHARACTER: 2,
    WALL: 3,
}

var DIRECTION = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
}


















function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}
