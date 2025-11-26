import { Fighter } from '../types';
import { MOCK_FIGHTERS } from '../constants';

// Helper to generate a random integer within a range
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to pick a random element from an array
const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Expanded name generation
const FIRST_NAMES = ['Big', 'Lil\'', 'Crazy', 'Angry', 'Screaming', 'Rabid', 'Quiet', 'Sleepy', 'Greasy', 'Slick'];
const LAST_NAMES = ['Joe', 'Larry', 'Brenda', 'Karen', 'Chad', 'Kyle', 'Stacy', 'Steve', 'Gary', 'Debra'];
const NICKNAMES = ['the Mauler', 'the Brawler', 'the Wall', 'the Nightmare', 'the Menace', 'the Ghost', 'the Machine', 'the Animal', 'the Butcher', 'the Saint'];

// Expanded locations
const LOCATIONS = ['Waffle House', 'Denny\'s Parking Lot', '7-Eleven', 'Walmart', 'Planet Fitness', 'The DMV', 'Post Office', 'Your Mom\'s House', 'The Library', 'Applebee\'s'];

/**
 * Generates a list of randomized mock fighters to ensure a dynamic
 * experience even without a Gemini API key.
 * @param count The number of mock fighters to generate.
 * @returns A list of generated mock fighters.
 */
export const generateMockFighters = (count: number = 10): Fighter[] => {
  const fighters: Fighter[] = [];

  for (let i = 0; i < count; i++) {
    const template = pick(MOCK_FIGHTERS);
    const id = `mock_${Date.now()}_${i}`;
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)} \"${pick(NICKNAMES)}\"`;

    const fighter: Fighter = {
      ...template, // Start with a template
      id,
      name,
      age: randInt(18, 65),
      location: pick(LOCATIONS),
      distance: parseFloat((Math.random() * 10).toFixed(1)),
      stats: {
        strength: randInt(30, 100),
        speed: randInt(30, 100),
        anger: randInt(50, 100),
        durability: randInt(40, 100),
        crazy: randInt(20, 100),
      },
      wins: randInt(0, 50),
      losses: randInt(0, 30),
      winStreak: randInt(0, 10),
      // Ensure a unique image for each generated fighter
      imageUrl: `https://picsum.photos/400/600?random=${id}`,
      compatibility: randInt(30, 99),
    };

    fighters.push(fighter);
  }

  return fighters;
};