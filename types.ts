
export enum Rarity {
  COMMON = 'Common',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic'
}

export interface Player {
  userId: string;
  username: string;
  level: number;
  xp: number;
  coins: number;
  hp: number;
  maxHp: number;
  damage: number;
  crit: number;
  heal: number;
  inventory: string[];
  equippedWeapon: string;
  equippedArmor: string;
  equippedAccessory: string;
  pets: string[];
  activePet: string;
  guild: string;
  rank: string;
  vip: boolean;
  dailyClaimed: boolean;
  dailyDate: string;
  registerDate: string;
  lastUpdated: string;
}

export interface Item {
  name: string;
  category: string;
  damage?: number;
  crit?: number;
  hp?: number;
  heal?: number;
  price: number;
  rarity: Rarity;
}

export interface Monster {
  name: string;
  level: number;
  hp: number;
  damage: number;
  xp: number;
  dropItem: string;
}

export interface Pet {
  name: string;
  damage: number;
  evolveLevel: number;
  nextForm: string;
  owner: string;
}

export interface Dungeon {
  name: string;
  levelReq: number;
  boss: string;
  rewardXp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GameState {
  player: Player[];
  items: Item[];
  monsters: Monster[];
  pets: Pet[];
  dungeons: Dungeon[];
}
