import type {Bet, RouletteContext, Spot} from '~/types';
import {BetHelper} from '~/utils/betHelper';
import {BaseStrategy} from './baseStrategy';

export class MartingaleStrategy extends BaseStrategy {
    private baseAmount: number;
    private currentAmount: number;

    get name(): string {
        return 'Martingale Strategy';
    }

    constructor(initialBalance: number, baseAmount: number = 1, maxBetAmount: number = Number.MAX_SAFE_INTEGER) {
        super(initialBalance, maxBetAmount);
        this.baseAmount = baseAmount;
        this.currentAmount = baseAmount;
    }

    protected getNextBetListImpl(context: RouletteContext): Bet[] {
        const bets: Bet[] = [];

        // Clamp bet amount to max allowed
        const betAmount = Math.min(this.currentAmount, this.maxBetAmount);

        // Check if we have enough balance for the bet amount
        if (this.currentBalance >= betAmount && betAmount > 0) {
            // Place a red bet with clamped amount
            bets.push(BetHelper.createRedBet(betAmount));
        }

        return bets;
    }

    override updateStrategyParameter(betList: Bet[], spot: Spot): void {
        super.updateStrategyParameter(betList, spot);

        // Update bet amount based on last result
        if (betList.length > 0) {
            if (this.wasLastBetWon({getLastSpot: () => spot} as RouletteContext)) {
                // Reset to base amount after win
                this.currentAmount = this.baseAmount;
            } else {
                // Double the amount after loss
                this.currentAmount *= 2;
            }
        }
    }
}