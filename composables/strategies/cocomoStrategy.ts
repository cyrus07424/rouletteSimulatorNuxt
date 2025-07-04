import type {Bet, RouletteContext, Spot} from '~/types';
import {BetHelper} from '~/utils/betHelper';
import {BaseStrategy} from './baseStrategy';
import {SpotHelper} from '~/utils/spotHelper';

/**
 * Cocomo Strategy - A variant where we bet on the opposite color of the last result
 */
export class CocomoStrategy extends BaseStrategy {
    private baseAmount: number;
    private currentAmount: number;
    private lastSpot: Spot | null = null;

    get name(): string {
        return 'Cocomo Strategy';
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
            const lastSpot = context.getLastSpot();

            if (!lastSpot) {
                // First round - bet on red
                bets.push(BetHelper.createRedBet(betAmount));
            } else {
                // Bet on the opposite color of the last result

                if (SpotHelper.isRed(lastSpot)) {
                    // Last was red, bet on black
                    bets.push(BetHelper.createBlackBet(betAmount));
                } else if (SpotHelper.isBlack(lastSpot)) {
                    // Last was black, bet on red
                    bets.push(BetHelper.createRedBet(betAmount));
                } else {
                    // Last was green (0 or 00), bet on red as default
                    bets.push(BetHelper.createRedBet(betAmount));
                }
            }
        }

        return bets;
    }

    override updateStrategyParameter(betList: Bet[], spot: Spot): void {
        super.updateStrategyParameter(betList, spot);

        // Update bet amount based on last result
        if (betList.length > 0) {
            const wasWin = this.wasLastBetWon({getLastSpot: () => spot} as RouletteContext);

            if (wasWin) {
                // Reset to base amount after win
                this.currentAmount = this.baseAmount;
            } else {
                // Increase amount after loss (like Martingale, but not necessarily doubling)
                this.currentAmount = Math.floor(this.currentAmount * 1.5);
            }
        }

        this.lastSpot = spot;
    }
}