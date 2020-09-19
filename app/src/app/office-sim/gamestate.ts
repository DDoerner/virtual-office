export const TILE_WIDTH = 32;
export const TILE_HEIGHT = 32;
export const WALL_HIGH_HEIGHT = 4;
export const ROOM_WIDTH = 5;
export const ROOM_HEIGHT = 5;

export class Position {
    constructor(private x, private y) {
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

export class Room {
    constructor(
        private gameObjects,
        private player,
        private grid_x,
        private grid_y,
        private grid_width,
        private grid_height
    ) {
    }

    destroy() {
        this.gameObjects.forEach((x) => {
            x.destroy();
        });

        GameState.instance.movePlayer(DIRECTION.DOWN);
    }
}

export class Player {
    constructor(
        private id: string,
        public gameObject,
        private position,
        private state: string,
        public isSelf = false
    ) {
    }

    setPosition(p) {
        this.position = p;

        if (GameState.instance.getGrid()[this.position.x][this.position.y + 3] === TILE_STATE.WALL
            || GameState.instance.getGrid()[this.position.x][this.position.y + 2] === TILE_STATE.WALL
            || GameState.instance.getGrid()[this.position.x][this.position.y + 1] === TILE_STATE.WALL
            || GameState.instance.getGrid()[this.position.x][this.position.y] === TILE_STATE.WALL) {
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


export class GameState {

    public static instance: GameState;

    grid: any[];
    players: Player[];
    rooms: any[];
    game: Phaser.Game;
    scene: Phaser.Scene;

    constructor(grid_width, grid_height) {
        if (!GameState.instance) {
            this.grid = this.zeros([grid_width, grid_height]);
            this.players = [];
            this.rooms = new Array(12);
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
        const index =  this.getAvailableRoom();
        this.rooms[index] = room;
    }

    getAvailableRoom() {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i] === undefined) {
                return i;
            }
        }
    }

    removeRoomsOfPlayer(id) {
        for (let i = 0; i < this.rooms.length; i++) {

            if (this.rooms[i] === undefined) {
                console.log(i);
                continue;
            } else if (this.rooms[i].owner !== undefined && this.rooms[i].owner.getId() === id) {
                console.log('destroying');
                this.rooms[i].destroy();
                GameState.instance.freeGrid(
                    this.rooms[i].grid_x - 1,
                    this.rooms[i].grid_y,
                    this.rooms[i].grid_width + 2,
                    this.rooms[i].grid_height
                );
                this.rooms[i] = undefined;
            }

        }
    }

    // expect tile x, y and a TILE_STATE
    setTileState(x, y, state) {
        // console.log(x + ' - ' + y + ' - ' + state);
        if (this.grid[x][y] > state) {
            return;
        }

        this.grid[x][y] = state;
    }

    movePlayer(direction) {
        console.log('moving: ' + direction);
        const player = this.players.filter((x) => x.isSelf)[0];

        let x_diff = 0;
        let y_diff = 0;

        if (direction === DIRECTION.UP) {
            y_diff = -1;
        } else if (direction === DIRECTION.DOWN) {
            y_diff = 1;
        } else if (direction === DIRECTION.LEFT) {
            x_diff = -1;
        } else if (direction === DIRECTION.RIGHT) {
            x_diff = 1;
        }

        const p_x = player.getPosition().getX() + x_diff;
        const p_y = player.getPosition().getY() + y_diff;

        console.log(p_x);
        console.log(this.grid[p_x][p_y]);
        if (p_x  < 0 || p_y < 0) {
            console.log('walking out of bounds');
            return; // out of bounds
        } else if (p_x >= this.grid.length || p_y >= this.grid[0].length) {
            console.log('walking out of bounds');
            return; // out of bounds
        } else if (this.grid[p_x][p_y] === TILE_STATE.FREE) {
            player.setPosition(new Position(player.getPosition().getX() + x_diff, player.getPosition().getY() + y_diff));
        } else {
            console.log('path is blocked');
        }

        player.gameObject.setDepth(1);
    }

    getGrid() {
        return this.grid;
    }

    setGame(game) {
        this.game = game;
        // Object.freeze(this);
    }

    setScene(scene: Phaser.Scene) {
        this.scene = scene;
    }

    freeGrid(grid_x, grid_y, grid_width, grid_height) {
        for (let i = 0; i < grid_width; i++) {
            for (let j = 0; j < grid_height; j++) {
                this.grid[grid_x + i][grid_y + j] = TILE_STATE.FREE;
            }
        }
    }

    zeros(dimensions) {
        const array = [];

        for (let i = 0; i < dimensions[0]; ++i) {
            array.push(dimensions.length === 1 ? 0 : this.zeros(dimensions.slice(1)));
        }

        return array;
    }

}

export const ACTIVITY = {
    CALLING: 'CALLING',
    IDLE: 'IDLE',
    EATING: 'EATING'
};

export const TILE_STATE = {
    FREE: 0,
    OBJECT: 1,
    CHARACTER: 2,
    WALL: 3,
};

export const DIRECTION = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};
