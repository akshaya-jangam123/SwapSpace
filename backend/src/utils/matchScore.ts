/**
 * Smart Matching Helper for SwapSpace
 * Computes matching percentage between two users or between two listings.
 */

// Normalize string for token comparison (lowercase, trimmed, strip special chars)
export const normalizeText = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
};

// Check if two search strings have significant word overlap
export const hasOverlap = (textA: string, textB: string): boolean => {
  if (!textA || !textB) return false;
  const normA = normalizeText(textA);
  const normB = normalizeText(textB);

  if (normA === normB || normA.includes(normB) || normB.includes(normA)) {
    return true;
  }

  const wordsA = normA.split(' ').filter(w => w.length > 2);
  const wordsB = normB.split(' ').filter(w => w.length > 2);

  return wordsA.some(word => wordsB.includes(word));
};

// Calculate match between User A and User B based on profile offerings and wants
export interface MatchResult {
  user: any;
  score: number;
  matchType: 'perfect' | 'one-way' | 'partial';
  userAWantsUserBOffers: string[];
  userBWantsUserAOffers: string[];
}

export const calculateUserMatch = (userA: any, userB: any): MatchResult => {
  const aWants = [...(userA.skillsWanted || []), ...(userA.itemsWanted || [])];
  const aOffers = [...(userA.skillsOffered || []), ...(userA.itemsOffered || [])];

  const bWants = [...(userB.skillsWanted || []), ...(userB.itemsWanted || [])];
  const bOffers = [...(userB.skillsOffered || []), ...(userB.itemsOffered || [])];

  const userAWantsUserBOffers: string[] = [];
  const userBWantsUserAOffers: string[] = [];

  // Check what A wants that B offers
  for (const want of aWants) {
    for (const offer of bOffers) {
      if (hasOverlap(want, offer)) {
        userAWantsUserBOffers.push(`${offer} (you want ${want})`);
        break;
      }
    }
  }

  // Check what B wants that A offers
  for (const want of bWants) {
    for (const offer of aOffers) {
      if (hasOverlap(want, offer)) {
        userBWantsUserAOffers.push(`${offer} (they want ${want})`);
        break;
      }
    }
  }

  const mutualMatch = userAWantsUserBOffers.length > 0 && userBWantsUserAOffers.length > 0;
  const oneWayAtoB = userAWantsUserBOffers.length > 0;
  const oneWayBtoA = userBWantsUserAOffers.length > 0;

  let score = 0;
  let matchType: 'perfect' | 'one-way' | 'partial' = 'partial';

  if (mutualMatch) {
    matchType = 'perfect';
    // Score between 85% and 98%
    score = Math.min(98, 85 + (userAWantsUserBOffers.length + userBWantsUserAOffers.length) * 4);
  } else if (oneWayAtoB) {
    matchType = 'one-way';
    // Score between 65% and 75%
    score = Math.min(75, 60 + userAWantsUserBOffers.length * 5);
  } else if (oneWayBtoA) {
    matchType = 'one-way';
    // Score between 50% and 60%
    score = Math.min(60, 50 + userBWantsUserAOffers.length * 5);
  } else {
    // Same college bonus
    if (userA.college && userB.college && normalizeText(userA.college) === normalizeText(userB.college)) {
      score = 35;
    } else {
      score = 20;
    }
  }

  return {
    user: userB,
    score,
    matchType,
    userAWantsUserBOffers,
    userBWantsUserAOffers,
  };
};
