import { UserStatus } from '../analyzers/user-status';
import { TILE_DEFINITION } from './tile-definitions';

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
        private grid_height,
        private doors,
        private openend = true
    ) {

    }

    destroy() {
        this.gameObjects.forEach((x) => {
            x.destroy();
        });

        GameState.instance.movePlayer(DIRECTION.DOWN);
    }

    getPlayer() {
        return this.player;
    }

    getGridX() {
        return this.grid_x;
    }

    getGridY() {
        return this.grid_y;
    }

    setDoorState(opened) {
        console.log(this.openend)
        var definitionOpen = TILE_DEFINITION['DOOR_OPEN'].spriteDefinition;
        var definitionClose = TILE_DEFINITION['DOOR_CLOSED'].spriteDefinition;

        if (!opened) {
            for (var i = 0; i < definitionOpen.length; i++) {
                for (var j = 0; j < definitionOpen[0].length; j++) {
                    var tile = this.doors.filter(x => x.frame.name === definitionClose[i][j])[0];

                    if (tile !== undefined) {
                        tile.setTexture('spritesheet', definitionOpen[i][j])
                        if (i > 1) {
                            tile.tint = 0x00ff00
                        }
                    }

                }
            }
            this.openend = true;
        } else {
            for (var i = 0; i < definitionClose.length; i++) {
                for (var j = 0; j < definitionClose[0].length; j++) {
                    var tile = this.doors.filter(x => x.frame.name === definitionOpen[i][j])[0];


                    if (tile !== undefined) {
                        tile.setTexture('spritesheet', definitionClose[i][j])
                        if (i > 1) {
                            tile.tint = 0xee0000
                        }
                        
                    }
                    //this.doors[i * j + j].setTexture('spritesheet', definitionClose[i][j]);
                }
            }

            this.openend = false;
        }
    }
}

export class Player {
    constructor(
        private id: string,
        public gameObject,
        public text,
        public bubble,
        private position,
        private state: UserStatus,
        public isSelf = false
    ) {
    }

    setPosition(p) {
        this.position = p;

        if (GameState.instance.getGrid()[this.position.x][this.position.y + 3] === TILE_STATE.WALL
            || GameState.instance.getGrid()[this.position.x][this.position.y + 2] === TILE_STATE.WALL
            || GameState.instance.getGrid()[this.position.x][this.position.y + 1] === TILE_STATE.WALL
            || GameState.instance.getGrid()[this.position.x][this.position.y] === TILE_STATE.WALL
            || GameState.instance.getGrid()[this.position.x][this.position.y + 2] === TILE_STATE.TRANSPARENCY
            || GameState.instance.getGrid()[this.position.x][this.position.y + 3] === TILE_STATE.TRANSPARENCY) {
            this.gameObject.alpha = 0.4;
        } else {
            this.gameObject.alpha = 1;
        }
        this.gameObject.x = p.getX() * TILE_WIDTH;
        this.gameObject.y = p.getY() * TILE_HEIGHT;

        this.text.x = p.getX() * TILE_WIDTH - 29;
        this.text.y = p.getY() * TILE_HEIGHT + 26;

        this.bubble.x = p.getX() * TILE_WIDTH  + 30;
        this.bubble.y = p.getY() * TILE_HEIGHT - 30;
    }

    getPosition() {
        return this.position;
    }

    getId() {
        return this.id;
    }

    setState(state) {
        this.state = state;
    }

    getState() {
        return this.state;
    }

    public getIsSelf() {
        return this.isSelf;
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

    setBubble(player : Player) {
        if (player.getState() === UserStatus.WORKING) {
            player.bubble.setTexture('sprite_x32', Math.floor(72 + Math.random() * 8))
        } else if (player.getState() === UserStatus.AWAY) {
            player.bubble.setTexture('sprite_x32', 63)
        }  else if (player.getState() === UserStatus.EATING) {
            player.bubble.setTexture('sprite_x32', Math.floor(64 + Math.random() * 8))
        }   else if (player.getState() === UserStatus.PHONE) {
            player.bubble.setTexture('sprite_x32', Math.floor(80 + Math.random() * 8))
        }
    }

    updatePlayers() {
        this.players.forEach((x) => {
            var update = Math.random();
            if (update < 0.5) {
                this.setBubble(x);
            }
            
        })
        
    }

    setDND(enabled) {
        const player = this.players.filter((x) => x.getIsSelf())[0]
        const room = this.rooms.filter((x) => x.getPlayer().getId() === player.getId())[0];
        room.setDoorState(enabled)
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

    setPlayerState(id, state) {
        const player = this.players.filter((x) => x.getId() === id)[0];
        if (player === undefined) {
            return;
        }

        player.gameObject.setDepth(1);
        player.text.setDepth(2);

        player.setState(state);

        if (state == UserStatus.AWAY) {
            const x = Math.floor(2 + Math.random() * 8);
            const y = Math.floor(21 + Math.random() * 3);
            player.setPosition(new Position(x, y))
            player.gameObject.setTexture('character1', (1 + Math.floor(Math.random() * 3)) * 3)
        } else if (state == UserStatus.EATING) {
            const x = Math.floor(3 + Math.random() * 7);
            const y = Math.floor(14 + Math.random() * 2);
            player.setPosition(new Position(x, y))
            player.gameObject.setTexture('character1', (1 + Math.floor(Math.random() * 3)) * 3)
        } else if (state === UserStatus.WORKING) {
            const room = this.rooms.filter((x) => x.getPlayer().getId() === id)[0];
            if (player === undefined) {
                return;
            }

            player.setPosition(new Position(room.getGridX() + 2, room.getGridY()));
            player.gameObject.setTexture('character1', 0)
        }  else if (state === UserStatus.PHONE) {
            const x = Math.floor(20 + Math.random() * 4);
            const y = Math.floor(15 + Math.random() * 4);
            player.setPosition(new Position(x, y))
            player.gameObject.setTexture('character1', (1 + Math.floor(Math.random() * 3)) * 3)
        }
    }

    // expect tile x, y and a TILE_STATE
    setTileState(x, y, state, override = false) {
        if (this.grid[x][y] > state && !override) {
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
            player.gameObject.setTexture('character1', 0)
        } else if (direction === DIRECTION.DOWN) {
            y_diff = 1;
            player.gameObject.setTexture('character1', 3)
        } else if (direction === DIRECTION.LEFT) {
            x_diff = -1;
            player.gameObject.setTexture('character1', 6)
        } else if (direction === DIRECTION.RIGHT) {
            x_diff = 1;
            player.gameObject.setTexture('character1', 9)
        }

       

        const p_x = player.getPosition().getX() + x_diff;
        const p_y = player.getPosition().getY() + y_diff;


        console.log("Grid Score: " + this.grid[p_x][p_y]);
        if (p_x  < 0 || p_y < 0) {
            console.log('walking out of bounds');
            return; // out of bounds
        } else if (p_x >= this.grid.length || p_y >= this.grid[0].length) {
            console.log('walking out of bounds');
            return; // out of bounds
        } else if (this.grid[p_x][p_y] <= 1) {
            player.setPosition(new Position(player.getPosition().getX() + x_diff, player.getPosition().getY() + y_diff));
        } else {
            console.log('path is blocked');
        }

        player.gameObject.setDepth(2);
        player.text.setDepth(2);
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

export const TILE_STATE = {
    FREE: 0,
    TRANSPARENCY: 1,
    OBJECT: 2,
    CHARACTER: 3,
    WALL: 4,
    
};

export const DIRECTION = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};
