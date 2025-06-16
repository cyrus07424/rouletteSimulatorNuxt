import type {Bet, RouletteContext, Spot, Strategy, StrategyStats} from '~/types';
import {BetHelper} from '~/utils/betHelper';

export abstract class BaseStrategy implements Strategy {
    public currentBalance: number;
    public maximumBalance: number = Number.MIN_SAFE_INTEGER;
    public minimumBalance: number = Number.MAX_SAFE_INTEGER;
    public maximumTotalBetValue: number = Number.MIN_SAFE_INTEGER;
    public wonCount: number = 0;
    public lostCount: number = 0;
    public betCount: number = 0;
    public wholeTotalBetValue: number = 0;
    public wholeTotalPayoutValue: number = 0;
    public balanceHistory: number[] = [];

    protected lastBetList: Bet[] = [];
    protected lastLive: boolean = false;

    abstract get name(): string;

    constructor(initialBalance: number) {
        this.currentBalance = initialBalance;
    }

    getNextBetList(context: RouletteContext): Bet[] {
        if (this.isLive()) {
            this.lastBetList = this.getNextBetListImpl(context);
        } else {
            this.lastBetList = [];
        }

        // Update maximum total bet value
        const totalBetValue = BetHelper.getTotalBetValue(this.lastBetList);
        if (this.maximumTotalBetValue < totalBetValue) {
            this.maximumTotalBetValue = totalBetValue;
        }

        return this.lastBetList;
    }

    protected abstract getNextBetListImpl(context: RouletteContext): Bet[];

    updateStrategyParameter(betList: Bet[], spot: Spot): void {
        // Update only if there are bets
        if (betList.length > 0) {
            // Subtract bet amount from balance
            const currentTotalBetValue = BetHelper.getTotalBetValue(betList);
            this.wholeTotalBetValue += currentTotalBetValue;
            this.currentBalance -= currentTotalBetValue;

            // Add payout to balance
            const currentTotalPayout = BetHelper.getTotalPayout(betList, spot);
            this.wholeTotalPayoutValue += currentTotalPayout;
            this.currentBalance += currentTotalPayout;

            // Update bet count
            this.betCount++;
            if (BetHelper.hasWin(betList, spot)) {
                this.wonCount++;
            } else {
                this.lostCount++;
            }
        }

        // Update maximum and minimum balance
        if (this.maximumBalance < this.currentBalance) {
            this.maximumBalance = this.currentBalance;
        }
        if (this.currentBalance < this.minimumBalance) {
            this.minimumBalance = this.currentBalance;
        }

        // Update balance history if currently live
        if (this.lastLive) {
            this.balanceHistory.push(this.currentBalance);
            // Keep only recent history
            if (this.balanceHistory.length > 1000) {
                this.balanceHistory.shift();
            }
        }

        // Update lastLive status
        this.lastLive = this.isLive();
    }

    isLive(): boolean {
        return this.currentBalance > 0;
    }

    getStats(): StrategyStats {
        return {
            currentBalance: this.currentBalance,
            maximumBalance: this.maximumBalance,
            minimumBalance: this.minimumBalance,
            maximumTotalBetValue: this.maximumTotalBetValue,
            wonCount: this.wonCount,
            lostCount: this.lostCount,
            betCount: this.betCount,
            wholeTotalBetValue: this.wholeTotalBetValue,
            wholeTotalPayoutValue: this.wholeTotalPayoutValue,
            balanceHistory: [...this.balanceHistory],
        };
    }

    protected wasLastBetWon(context: RouletteContext): boolean {
        const lastSpot = context.getLastSpot();
        return lastSpot !== null && BetHelper.hasWin(this.lastBetList, lastSpot);
    }

    protected hasLastBet(): boolean {
        return this.lastBetList.length > 0;
    }

    getWinningAverage(): number {
        if (this.betCount === 0) {
            return 0;
        } else {
            return this.wonCount / this.betCount;
        }
    }

    getAverageTotalBetValue(): number {
        if (this.betCount === 0) {
            return 0;
        } else {
            return this.wholeTotalBetValue / this.betCount;
        }
    }

    getAverageTotalPayoutValue(): number {
        if (this.betCount === 0) {
            return 0;
        } else {
            return this.wholeTotalPayoutValue / this.betCount;
        }
    }
}