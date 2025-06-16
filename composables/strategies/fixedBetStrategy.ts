import type {Bet, RouletteContext} from '~/types';
import {BetHelper} from '~/utils/betHelper';
import {BaseStrategy} from './baseStrategy';

export class FixedBetStrategy extends BaseStrategy {
    private betAmount: number;

    get name(): string {
        return 'Fixed Bet Strategy';
    }

    constructor(initialBalance: number, betAmount: number = 1, maxBetAmount: number = Number.MAX_SAFE_INTEGER) {
        super(initialBalance, maxBetAmount);
        this.betAmount = betAmount;
    }

    protected getNextBetListImpl(context: RouletteContext): Bet[] {
        const bets: Bet[] = [];

        // Clamp bet amount to max allowed
        const effectiveBetAmount = Math.min(this.betAmount, this.maxBetAmount);

        // Check if we have enough balance for the bet
        if (this.currentBalance >= effectiveBetAmount && effectiveBetAmount > 0) {
            // Always place a red bet with effective amount
            bets.push(BetHelper.createRedBet(effectiveBetAmount));
        }

        return bets;
    }
}