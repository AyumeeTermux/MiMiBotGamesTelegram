
import { Rarity, Item, Monster, Pet, Dungeon, Player } from './types';

export const INITIAL_PLAYER: Player = {
  userId: "777000",
  username: "MimiMaster",
  level: 1,
  xp: 0,
  coins: 100,
  hp: 100,
  maxHp: 100,
  damage: 10,
  crit: 5,
  heal: 0,
  inventory: ["🪵 Wood Sword", "🧪 Small Potion"],
  equippedWeapon: "🪵 Wood Sword",
  equippedArmor: "🛡️ Iron Armor",
  equippedAccessory: "💍 Ring of Luck",
  pets: ["🐰 Forest Bunny"],
  activePet: "🐰 Forest Bunny",
  guild: "DragonSlayers",
  rank: "Bronze",
  vip: false,
  dailyClaimed: false,
  dailyDate: new Date().toISOString(),
  registerDate: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

export const ITEMS: Item[] = [
  { name: "🪵 Wood Sword", category: "Weapon", damage: 5, price: 100, rarity: Rarity.COMMON },
  { name: "🔥 Flame Katana", category: "Weapon", damage: 30, price: 1200, rarity: Rarity.RARE },
  { name: "⚡ Thunder Spear", category: "Weapon", damage: 55, price: 2500, rarity: Rarity.EPIC },
  { name: "💀 Soul Reaper", category: "Weapon", damage: 80, price: 5000, rarity: Rarity.LEGENDARY },
  { name: "🛡️ Iron Armor", category: "Armor", hp: 50, price: 300, rarity: Rarity.COMMON },
  { name: "🧪 Small Potion", category: "Potion", heal: 20, price: 50, rarity: Rarity.COMMON },
];

export const MONSTERS: Monster[] = [
  { name: "👹 Goblin", level: 1, hp: 50, damage: 5, xp: 10, dropItem: "👂 Goblin Ear" },
  { name: "🐺 Wolf", level: 3, hp: 120, damage: 15, xp: 25, dropItem: "🦷 Wolf Fang" },
  { name: "🐉 Dragon", level: 15, hp: 1000, damage: 80, xp: 200, dropItem: "🐲 Dragon Scale" },
];

export const PETS: Pet[] = [
  { name: "🐰 Forest Bunny", damage: 5, evolveLevel: 10, nextForm: "🌑 Shadow Bunny", owner: "System" },
];

export const DUNGEONS: Dungeon[] = [
  { name: "🕳️ Dark Cave", levelReq: 5, boss: "Cave Troll", rewardXp: 100 },
];
