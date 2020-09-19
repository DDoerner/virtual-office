import { GameState, Player, Position, ROOM_WIDTH, TILE_HEIGHT, TILE_STATE, TILE_WIDTH } from './gamestate';
import { TILE_DEFINITION } from './tile-definitions';

export class SimCreator {
    private rooms = 1;

    public drawCharacter(scene: Phaser.Scene, grid_x, grid_y, id = "") {
        const x = grid_x * TILE_WIDTH;
        const y = grid_y * TILE_HEIGHT + TILE_HEIGHT / 4;
        const character = scene.add.sprite(x, y, 'character1');
        const textBanner = scene.add.text(x - 29, y - 40, " " + id + " ", { align: "center", backgroundColor: "rgba(0, 0, 0, 0.5)"})

        // scene.anims.create({
        //     key: 'up',
        //     frames: [0],
        // });

        // scene.anims.create({
        //     key: 'down',
        //     frames: [3],
        // });

        // scene.anims.create({
        //     key: 'left',
        //     frames: [6],
        // });

        // scene.anims.create({
        //     key: 'right',
        //     frames: [9],
        // });

        return [character, textBanner];
    }

    public drawObject(scene: Phaser.Scene, grid_x, grid_y, indentifier, offset_y_half_tile = false, rigid = true, wall = false, override = false) {

        const x = grid_x * TILE_WIDTH;
        const y = grid_y * TILE_HEIGHT;

        const tileDefinition = TILE_DEFINITION[indentifier];
        const half_tile_offset = (offset_y_half_tile) ? TILE_HEIGHT / 2 : 0;


        const tile_state = (rigid && !wall) ? TILE_STATE.OBJECT : (rigid) ? TILE_STATE.WALL : TILE_STATE.FREE;

        const gameObjects = [];
        for (let y_i = 0; y_i < tileDefinition.spriteDefinition.length; y_i++) {
            for (let x_i = 0; x_i < tileDefinition.spriteDefinition[0].length; x_i++) {
                if (y_i === 0) {
                    GameState.instance.setTileState(grid_x + x_i, grid_y - 1, tile_state, override);
                }

                gameObjects.push(scene.add.sprite(
                    x + x_i * TILE_WIDTH + tileDefinition.x_offset * TILE_WIDTH,
                    y + y_i * TILE_HEIGHT + tileDefinition.y_offset * TILE_HEIGHT - half_tile_offset,
                    'spritesheet',
                    tileDefinition.spriteDefinition[y_i][x_i]
                ));
            }
        }
        return (gameObjects as any).flat();
    }

    public drawTileArea(scene: Phaser.Scene, grid_x, grid_y, grid_width, grid_height) {
        const gameObjects = [];
        for (let i = 0; i < grid_width; i++) {
            for (let j = 0; j < grid_height; j++) {
                gameObjects.push(this.drawObject(scene, grid_x + i, grid_y + j, 'TILE_SIMPLE', false, false, false));
            }
        }
        return (gameObjects as any).flat(1);
    }


    public drawBalconyArea(scene: Phaser.Scene, grid_x, grid_y, grid_width, grid_height) {
        var gameObjects = [];
        for (var i = 0; i < grid_width; i++) {
            for (var j = 0; j < grid_height; j++) {
                gameObjects.push(this.drawObject(scene, grid_x + i, grid_y + j, 'TILE_BALCONY', false, false, false));
            }
        }
        return (gameObjects as any).flat(1);
    }

    public drawHorizontalWall(scene: Phaser.Scene, grid_x, grid_y, grid_width, endWallLeft = false, endWallRight = false, lowered = false) {
        const gameObjects = [];
        for (let i = 0; i < grid_width; i++) {
            if (i === 0 && endWallLeft) {
                gameObjects.push(this.drawObject(scene, grid_x + i, grid_y, 'WALL_HIGH_LEFT', undefined, true, true));
            } else if (i === grid_width - 1 && endWallRight) {
                gameObjects.push(this.drawObject(scene, grid_x + i, grid_y, 'WALL_HIGH_RIGHT', undefined, true, true));
            } else if (!lowered) {
                gameObjects.push(this.drawObject(scene, grid_x + i, grid_y, 'WALL_HIGH_CENTER', undefined, true, true));
            } else {
                if (i === grid_width - 2) {
                    gameObjects.push(this.drawObject(scene, grid_x + i, grid_y, 'WALL_LOWER_RIGHT', undefined, true, true));
                } else if (i === 1) {
                    gameObjects.push(this.drawObject(scene, grid_x + i, grid_y, 'WALL_LOWER_LEFT', undefined, true, true));
                } else if (i === 0 || i === grid_width - 1) {
                    gameObjects.push(this.drawObject(scene, grid_x + i, grid_y, 'WALL_HIGH_CENTER', undefined, true, true));
                } else {
                    gameObjects.push(this.drawObject(scene, grid_x + i, grid_y, 'WALL_LOWER', undefined, true, true));
                }
            }
        }
        return (gameObjects as any).flat();
    }

    public drawRoom(scene: Phaser.Scene, grid_x, grid_y, grid_width, grid_height, title = '') {
        const gameObjects = [];

        if (grid_width <= 0 || grid_height <= 0) {
            throw new Error('Invalid tile configuration.');
        }

        // draw tiles
        gameObjects.push(this.drawTileArea(scene, grid_x, grid_y, grid_width, grid_height));

        // draw walls
        gameObjects.push(this.drawHorizontalWall(scene, grid_x, grid_y, grid_width, false, false, true));

        const tables = ['TABLE'];
        const shelf = ['SIDEBOARD_SMALL', 'BOOKSHELF', 'CLOSET', 'SIDEBOARD'];

        const table = Math.floor(Math.random() * 3);
        gameObjects.push(this.drawObject(scene, grid_x + table, grid_y - 1, tables[0], false, true, true));
        let shelfIndex1 = (table === 1) ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4);
        let shelfIndex2 = (table === 1) ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4);
        // gameObjects.push(drawObject(scene, grid_x + table, grid_y - 1, shelf[shelfIndex1], false, true, true));
        if ((table === 2 || table === 0) && shelf[shelfIndex1] === 'SIDEBOARD') {
            if (table === 2) {
                gameObjects.push(this.drawObject(scene, grid_x, grid_y, shelf[shelfIndex1], true, true, true));
            } else if (table === 0) {
                gameObjects.push(this.drawObject(scene, grid_x + 3, grid_y, shelf[shelfIndex1], true, true, true));
            }
        } else {
            if (shelf[shelfIndex2] === 'SIDEBOARD') {
                shelfIndex2 = Math.floor(Math.random() * 3);
            }
            if (shelf[shelfIndex1] === 'SIDEBOARD') {
                shelfIndex1 = Math.floor(Math.random() * 3);
            }
            if (table === 1) {
                gameObjects.push(this.drawObject(scene, grid_x, grid_y, shelf[shelfIndex1], true, true, true));
                gameObjects.push(this.drawObject(scene, grid_x + 4, grid_y, shelf[shelfIndex2], true, true, true));
            } else if (table === 2) {
                gameObjects.push(this.drawObject(scene, grid_x, grid_y, shelf[shelfIndex1], true, true, true));
                gameObjects.push(this.drawObject(scene, grid_x + 1, grid_y, shelf[shelfIndex2], true, true, true));
            } else if (table === 0) {
                gameObjects.push(this.drawObject(scene, grid_x + 3, grid_y, shelf[shelfIndex1], true, true, true));
                gameObjects.push(this.drawObject(scene, grid_x + 4, grid_y, shelf[shelfIndex2], true, true, true));
            }
        }

        for (let j = 0; j < grid_height + 1; j++) {
            for (let i = 0; i < grid_width; i++) {
                if (i === 0 && j !== 0) {
                    gameObjects.push(this.drawObject(scene, grid_x + i - 1, grid_y + j, 'WALL_LEFT'));
                }

                if (i === grid_width - 1 && j !== 0) {
                    gameObjects.push(this.drawObject(scene, grid_x + i + 1, grid_y + j, 'WALL_RIGHT'));
                }

                if (i === 0 && j === 0) {
                    gameObjects.push(this.drawObject(scene, grid_x - 1, grid_y + j, 'CORNER_UP_RIGHT'));
                } else if (i === grid_width - 1 && j === 0) {
                    gameObjects.push(this.drawObject(scene, grid_x + i + 1, grid_y + j, 'CORNER_UP_LEFT'));
                }
            }
        }

        const door = Math.round(Math.random());
        if (door === 0) {
            gameObjects.push(this.drawHorizontalWall(scene, grid_x - 1, grid_y + 5, 2, false, true));
            gameObjects.push(this.drawHorizontalWall(scene, grid_x + grid_width - 2, grid_y + 5, 3, true, false));
        } else {
            gameObjects.push(this.drawHorizontalWall(scene, grid_x - 1, grid_y + 5, 3, false, true));
            gameObjects.push(this.drawHorizontalWall(scene, grid_x + grid_width - 1, grid_y + 5, 2, true, false));
        }

        gameObjects.push(scene.add.text(
            (grid_x + ((door === 0) ? 4 : 4)) * TILE_WIDTH - ((door === 0) ? 32 : 0),
            (grid_y + grid_height - 2) * TILE_HEIGHT,
            ' ' + title + ' ',
            { fontFamily: 'Verdana, "Goudy Bookletter 1911", Times, serif', backgroundColor: 'white', fontSize: 10, color: 'black', }
        ));

        return (gameObjects as any).flat();
    }

    public drawKitchen(scene: Phaser.Scene, grid_x, grid_y, grid_width, grid_height) {
        this.drawCommunityRoom(scene, grid_x, grid_y, grid_width, grid_height);
        this.drawObject(scene, grid_x, grid_y, 'COUNTERTOP_UPPER', true);
        this.drawObject(scene, grid_x, grid_y + 1, 'COUNTERTOP_LOWER', true);
        this.drawObject(scene, grid_x, grid_y - 2, 'COUNTERTOP_HIGH', true);
        this.drawObject(scene, grid_x + 1, grid_y - 2, 'COUNTERTOP_HIGH', true, false, false);
        this.drawObject(scene, grid_x + 1, grid_y + 4, "PLANTS_WIDE", false, false, false);
        this.drawObject(scene, grid_x + 6, grid_y + 4, "PLANTS_WIDE", false, false, false);


        this.drawObject(scene, grid_x + 6, grid_y - 1, "COUCH_BLACK", false, false, false);
    }

    public drawMeetingRoom(game, grid_x, grid_y, grid_width, grid_height) {
        this.drawCommunityRoom(game, grid_x, grid_y, grid_width, grid_height)
        this.drawObject(game, grid_x, grid_y + 1, "CHAIR_DOWN", true, false, false);
        this.drawObject(game, grid_x + 6, grid_y + 1, "CHAIR_DOWN", true, false, false);
        this.drawObject(game, grid_x + 2, grid_y + 1, "CHAIR_DOWN", true, false, false);
        this.drawObject(game, grid_x + 4, grid_y + 1, "CHAIR_DOWN", true, false, false);

        this.drawObject(game, grid_x, grid_y + 4, "CHAIR_UP", false, false, false);
        this.drawObject(game, grid_x + 6, grid_y + 4, "CHAIR_UP", false, false, false);
        this.drawObject(game, grid_x + 2, grid_y + 4, "CHAIR_UP", false, false, false);
        this.drawObject(game, grid_x + 4, grid_y + 4, "CHAIR_UP", false, false, false);
    }

    public drawCommunityRoom(scene: Phaser.Scene, grid_x, grid_y, grid_width, grid_height) {
        this.drawHorizontalWall(scene, grid_x, grid_y, 4, false, true);
        this.drawHorizontalWall(scene, grid_x + grid_width - 4, grid_y, grid_width - 6, true, false);

        this.drawTileArea(scene, grid_x, grid_y, grid_width, grid_height);
        for (let j = 0; j < grid_height + 1; j++) {
            for (let i = 0; i < grid_width; i++) {
                if (i === 0 && j !== 0) {
                    this.drawObject(scene, grid_x + i - 1, grid_y + j, 'WALL_LEFT');
                }

                if (i === grid_width - 1 && j !== 0) {
                    this.drawObject(scene, grid_x + i + 1, grid_y + j, 'WALL_RIGHT');
                }

                if (i === 0 && j === 0) {
                    this.drawObject(scene, grid_x - 1, grid_y + j, 'CORNER_UP_RIGHT');
                } else if (i === grid_width - 1 && j === 0) {
                    this.drawObject(scene, grid_x + i + 1, grid_y + j, 'CORNER_UP_LEFT');
                }
            }
        }

        this.drawHorizontalWall(scene, grid_x - 1, grid_y + grid_height, grid_width + 2, false, false, true);
    }

    public create(scene: Phaser.Scene) {
        this.drawTileArea(scene, 0, 10, this.rooms * (ROOM_WIDTH + 1) + 70, 5);
        
        for (var i = 0; i < 8; i++) {
            this.drawObject(scene, 76, 11+i, 'WALL_RIGHT', true);
        }

        
        // some meta stuff
        
        this.drawObject(scene, 6, 10, 'SIDEBOARD', true).forEach(element => {
            element.setDepth(1);
        });

        this.drawKitchen(scene, 1, 15, 10, 6);
        scene.add.text(7 * TILE_WIDTH + 19, 13 * TILE_HEIGHT - 25, " EATING ", { fontFamily: '"Fredoka One", cursive', backgroundColor: "#bad4d5", fontSize: 14, color: "black", })
        this.drawBalconyArea(scene, 0, 21, 12, 4);
        scene.add.text(0 * TILE_WIDTH + 10, 24 * TILE_HEIGHT - 10, " AWAY FROM KEYBOARD ", { fontFamily: '"Fredoka One", cursive', backgroundColor: "#bad4d5", fontSize: 14, color: "black", })
        this.drawMeetingRoom(scene, 12, 15, 12, 10)
        scene.add.text(12 * TILE_WIDTH + 19, 13 * TILE_HEIGHT - 25, " IN CALL ", { fontFamily: '"Fredoka One", cursive', backgroundColor: "#bad4d5", fontSize: 14, color: "black", })
        this.drawHorizontalWall(scene, 26, 15, 51, false, false);

    }
}

