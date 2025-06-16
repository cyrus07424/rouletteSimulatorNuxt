// Core types for the roulette simulator

export enum Spot {
  SPOT_0 = 0,
  SPOT_00 = -1,  // American style double zero
  SPOT_01 = 1,
  SPOT_02 = 2,
  SPOT_03 = 3,
  SPOT_04 = 4,
  SPOT_05 = 5,
  SPOT_06 = 6,
  SPOT_07 = 7,
  SPOT_08 = 8,
  SPOT_09 = 9,
  SPOT_10 = 10,
  SPOT_11 = 11,
  SPOT_12 = 12,
  SPOT_13 = 13,
  SPOT_14 = 14,
  SPOT_15 = 15,
  SPOT_16 = 16,
  SPOT_17 = 17,
  SPOT_18 = 18,
  SPOT_19 = 19,
  SPOT_20 = 20,
  SPOT_21 = 21,
  SPOT_22 = 22,
  SPOT_23 = 23,
  SPOT_24 = 24,
  SPOT_25 = 25,
  SPOT_26 = 26,
  SPOT_27 = 27,
  SPOT_28 = 28,
  SPOT_29 = 29,
  SPOT_30 = 30,
  SPOT_31 = 31,
  SPOT_32 = 32,
  SPOT_33 = 33,
  SPOT_34 = 34,
  SPOT_35 = 35,
  SPOT_36 = 36,
}

export enum RouletteType {
  EUROPEAN_STYLE = 'EUROPEAN_STYLE',
  AMERICAN_STYLE = 'AMERICAN_STYLE',
  ONE_TO_36 = 'ONE_TO_36',
}

export enum SpotGenerateType {
  RANDOM = 'RANDOM',
  ROTATION_NUMBER = 'ROTATION_NUMBER',
  ROTATION_WHEEL = 'ROTATION_WHEEL',
  RANDOM_RED_ONLY = 'RANDOM_RED_ONLY',
  RANDOM_BLACK_ONLY = 'RANDOM_BLACK_ONLY',
  RANDOM_EXCEPT_ONE = 'RANDOM_EXCEPT_ONE',
}

export enum BetType {
  STRAIGHT = 'STRAIGHT',
  SPLIT = 'SPLIT',
  STREET = 'STREET',
  CORNER = 'CORNER',
  BASKET = 'BASKET',
  SIXLINE = 'SIXLINE',
  RED = 'RED',
  BLACK = 'BLACK',
  EVEN = 'EVEN',
  ODD = 'ODD',
  LOW = 'LOW',
  HIGH = 'HIGH',
  FIRST_DOZEN = 'FIRST_DOZEN',
  SECOND_DOZEN = 'SECOND_DOZEN',
  THIRD_DOZEN = 'THIRD_DOZEN',
  FIRST_COLUMN = 'FIRST_COLUMN',
  SECOND_COLUMN = 'SECOND_COLUMN',
  THIRD_COLUMN = 'THIRD_COLUMN',
}

export interface Bet {
  type: BetType;
  spots: Spot[];
  amount: number;
  payout: number;
}

export interface SimulationResult {
  spot: Spot;
  bets: Bet[];
  totalBet: number;
  totalPayout: number;
  balance: number;
  won: boolean;
}

export interface StrategyStats {
  currentBalance: number;
  maximumBalance: number;
  minimumBalance: number;
  maximumTotalBetValue: number;
  wonCount: number;
  lostCount: number;
  betCount: number;
  wholeTotalBetValue: number;
  wholeTotalPayoutValue: number;
  balanceHistory: number[];
}

export interface RouletteContext {
  rouletteType: RouletteType;
  spotGenerateType: SpotGenerateType;
  initialBalance: number;
  currentLoopCount: number;
  spotHistory: Spot[];
  getLastSpot(): Spot | null;
}

export interface Strategy {
  name: string;
  getNextBetList(context: RouletteContext): Bet[];
  updateStrategyParameter(betList: Bet[], spot: Spot): void;
  isLive(): boolean;
  getStats(): StrategyStats;
}