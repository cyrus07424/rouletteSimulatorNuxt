import { Bet, RouletteContext, Spot } from '~/types';
import { BetHelper } from '~/utils/betHelper';
import { BaseStrategy } from './baseStrategy';

export class FixedBetStrategy extends BaseStrategy {
  private betAmount: number;

  get name(): string {
    return 'Fixed Bet Strategy';
  }

  constructor(initialBalance: number, betAmount: number = 1) {
    super(initialBalance);
    this.betAmount = betAmount;
  }

  protected getNextBetListImpl(context: RouletteContext): Bet[] {
    const bets: Bet[] = [];

    // Check if we have enough balance for the bet
    if (this.currentBalance >= this.betAmount) {
      // Always place a red bet with fixed amount
      bets.push(BetHelper.createRedBet(this.betAmount));
    }

    return bets;
  }
}