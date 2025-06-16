import { Bet, RouletteContext, Spot } from '~/types';
import { BetHelper } from '~/utils/betHelper';
import { BaseStrategy } from './baseStrategy';

export class MartingaleStrategy extends BaseStrategy {
  private baseAmount: number;
  private currentAmount: number;

  get name(): string {
    return 'Martingale Strategy';
  }

  constructor(initialBalance: number, baseAmount: number = 1) {
    super(initialBalance);
    this.baseAmount = baseAmount;
    this.currentAmount = baseAmount;
  }

  protected getNextBetListImpl(context: RouletteContext): Bet[] {
    const bets: Bet[] = [];

    // Check if we have enough balance for the current bet amount
    if (this.currentBalance >= this.currentAmount) {
      // Place a red bet with current amount
      bets.push(BetHelper.createRedBet(this.currentAmount));
    }

    return bets;
  }

  updateStrategyParameter(betList: Bet[], spot: Spot): void {
    super.updateStrategyParameter(betList, spot);

    // Update bet amount based on last result
    if (betList.length > 0) {
      if (this.wasLastBetWon({ getLastSpot: () => spot } as RouletteContext)) {
        // Reset to base amount after win
        this.currentAmount = this.baseAmount;
      } else {
        // Double the amount after loss
        this.currentAmount *= 2;
      }
    }
  }
}