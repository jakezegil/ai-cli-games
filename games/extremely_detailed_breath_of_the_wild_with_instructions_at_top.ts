//generated with gpt-4o


interface Player {
  hp: number;
  inventory: Item[];
  position: Position;
  coins: number;
  equippedWeapon: Item | null;
}

interface Position {
  x: number;
  y: number;
}

interface Enemy {
  name: string;
  hp: number;
  position: Position;
  loot: Item[];
}

interface Item {
  name: string;
  type: 'weapon' | 'consumable' | 'other';
  position?: Position;
  damage?: number;
  healing?: number;
  price?: number;
}

interface Environment {
  description: string;
  position: Position;
}

const readline = require('readline');

class Game {
  player: Player;
  enemies: Enemy[];
  items: Item[];
  isRunning: boolean;
  environments: Environment[];

  constructor() {
    this.player = {
      hp: 100,
      inventory: [],
      position: { x: 0, y: 0 },
      coins: 50,
      equippedWeapon: null,
    };

    this.enemies = this.spawnEnemies();
    this.items = this.spawnItems();
    this.environments = this.spawnEnvironments();
    this.isRunning = true;
    this.renderWelcomeMessage();
    this.mainLoop();
  }

  spawnEnemies(): Enemy[] {
    return [
      {
        name: 'Bokoblin',
        hp: 30,
        position: { x: 1, y: 0 },
        loot: [{ name: 'Bokoblin Fang', type: 'other' }],
      },
      {
        name: 'Chuchu',
        hp: 20,
        position: { x: -1, y: 1 },
        loot: [{ name: 'Chuchu Jelly', type: 'consumable', healing: 5 }],
      },
    ];
  }

  spawnItems(): Item[] {
    return [
      { name: 'Ancient Screw', type: 'other', position: { x: 0, y: 1 }, price: 10 },
      { name: 'Apple', type: 'consumable', position: { x: -1, y: 0 }, healing: 10, price: 5 },
      { name: 'Traveler’s Sword', type: 'weapon', damage: 10, price: 30 },
    ];
  }

  spawnEnvironments(): Environment[] {
    return [
      { description: 'A serene meadow with wildflowers', position: { x: 2, y: 2 } },
      { description: 'A dark and haunted forest', position: { x: -2, y: -2 } },
    ];
  }

  renderWelcomeMessage() {
    console.log(`Welcome to the CLI version of an extremely detailed Breath of the Wild-inspired game!
    Instructions:
      - move <direction>: Move north, south, east, or west
      - look: Look around your current location
      - inventory: Check your inventory
      - equip <item_name>: Equip a weapon from your inventory
      - use <item_name>: Use a consumable item from your inventory
      - attack: Attack an enemy if present
      - shop: View items available for purchase
      - buy <item_name>: Purchase an item from the shop
      - help: Show instructions
      - quit: Exit the game\n`);
  }

  mainLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> ',
    });

    rl.prompt();

    rl.on('line', (line: string) => {
      const args = line.trim().split(' ');
      const command = args[0];
      const argument = args[1];

      switch (command) {
        case 'move':
          this.movePlayer(argument);
          break;
        case 'look':
          this.lookAround();
          break;
        case 'inventory':
          this.showInventory();
          break;
        case 'equip':
          this.equipItem(argument);
          break;
        case 'use':
          this.useItem(argument);
          break;
        case 'attack':
          this.attack();
          break;
        case 'shop':
          this.showShop();
          break;
        case 'buy':
          this.buyItem(argument);
          break;
        case 'help':
          this.renderWelcomeMessage();
          break;
        case 'quit':
          this.isRunning = false;
          rl.close();
          break;
        default:
          console.log('Unknown command. Type "help" for a list of commands.');
      }
      
      if (this.isRunning) rl.prompt();
    }).on('close', () => {
      console.log('Thanks for playing!');
      process.exit(0);
    });
  }

  movePlayer(direction: string) {
    let dx = 0, dy = 0;
    switch (direction) {
      case 'north': dy = 1; break;
      case 'south': dy = -1; break;
      case 'east': dx = 1; break;
      case 'west': dx = -1; break;
      default:
        console.log('Invalid direction. Use north, south, east, or west.');
        return;
    }
    this.player.position.x += dx;
    this.player.position.y += dy;
    console.log(`You move ${direction}.`);
    this.checkForEncounter();
    this.checkForItem();
    this.checkForEnvironment();
  }

  lookAround() {
    console.log(`You are at position (${this.player.position.x}, ${this.player.position.y}).`);
    const enemy = this.enemies.find(e => this.samePosition(e.position, this.player.position));
    if (enemy) {
      console.log(`An enemy ${enemy.name} is here!`);
    }
    const item = this.items.find(i => this.samePosition(i.position, this.player.position));
    if (item) {
      console.log(`You see a ${item.name} on the ground.`);
    }
    const environment = this.environments.find(env => this.samePosition(env.position, this.player.position));
    if (environment) {
      console.log(environment.description);
    } else {
      console.log('The area is peaceful.');
    }
  }

  showInventory() {
    if (this.player.inventory.length > 0) {
      console.log('You are carrying:');
      this.player.inventory.forEach(item => console.log(`- ${item.name} (${item.type})`));
    } else {
      console.log('Your inventory is empty.');
    }
  }

  equipItem(itemName: string) {
    const item = this.player.inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase() && i.type === 'weapon');
    if (item) {
      this.player.equippedWeapon = item;
      console.log(`You have equipped the ${item.name}.`);
    } else {
      console.log('You do not have this weapon in your inventory.');
    }
  }

  useItem(itemName: string) {
    const item = this.player.inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase() && i.type === 'consumable');
    if (item) {
      this.player.hp += item.healing || 0;
      this.player.inventory = this.player.inventory.filter(i => i !== item);
      console.log(`You used the ${item.name}. You have ${this.player.hp} HP.`);
    } else {
      console.log('You do not have this consumable item in your inventory.');
    }
  }

  attack() {
    const enemy = this.enemies.find(e => this.samePosition(e.position, this.player.position));
    if (enemy) {
      if (this.player.equippedWeapon) {
        enemy.hp -= this.player.equippedWeapon.damage || 0;
        console.log(`You attack the ${enemy.name} with your ${this.player.equippedWeapon.name}. It has ${enemy.hp} HP left.`);
      } else {
        console.log(`You have no weapon equipped. You punch the ${enemy.name}, dealing minimal damage.`);
        enemy.hp -= 5;
      }

      if (enemy.hp <= 0) {
        console.log(`You have defeated the ${enemy.name}!`);
        this.enemies = this.enemies.filter(e => e !== enemy);
        this.collectLoot(enemy.loot);
      } else {
        this.enemyAttack(enemy);
      }
    } else {
      console.log('There is nothing to attack here.');
    }
  }

  enemyAttack(enemy: Enemy) {
    this.player.hp -= 10;
    console.log(`The ${enemy.name} attacks you! You have ${this.player.hp} HP left.`);
    if (this.player.hp <= 0) {
      console.log('You have been defeated...');
      this.isRunning = false;
      process.exit(0);
    }
  }

  showShop() {
    console.log('Welcome to the shop! You have ' + this.player.coins + ' coins.');
    console.log('Available items:');
    this.items.forEach(item => {
      if (item.price) {
        console.log(`- ${item.name} (Type: ${item.type}, Price: ${item.price} coins)`);
      }
    });
  }

  buyItem(itemName: string) {
    const item = this.items.find(i => i.name.toLowerCase() === itemName.toLowerCase() && i.price != null);
    if (item) {
      if (this.player.coins >= item.price!) {
        this.player.coins -= item.price!;
        this.player.inventory.push(item);
        console.log(`You bought a ${item.name}. You have ${this.player.coins} coins left.`);
      } else {
        console.log('You do not have enough coins to buy this item.');
      }
    } else {
      console.log('This item is not available in the shop.');
    }
  }

  collectLoot(loot: Item[]) {
    loot.forEach(item => {
      this.player.inventory.push(item);
      console.log(`You collected a ${item.name}.`);
    });
  }

  checkForEncounter() {
    const enemy = this.enemies.find(e => this.samePosition(e.position, this.player.position));
    if (enemy) {
      console.log(`You encounter a ${enemy.name}!`);
    }
  }

  checkForItem() {
    const item = this.items.find(i => this.samePosition(i.position, this.player.position));
    if (item) {
      console.log(`You found a ${item.name}! It has been added to your inventory.`);
      this.player.inventory.push(item);
      this.items = this.items.filter(i => i !== item);
    }
  }

  checkForEnvironment() {
    const environment = this.environments.find(env => this.samePosition(env.position, this.player.position));
    if (environment) {
      console.log(`You entered a new area: ${environment.description}`);
    }
  }

  samePosition(pos1: Position, pos2: Position): boolean {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }
}

new Game();
