import type {Bet} from '~/types';
import {BetType, Spot} from '~/types';
import {SpotHelper} from './spotHelper';

export class BetHelper {
    static getTotalBetValue(bets: Bet[]): number {
        return bets.reduce((total, bet) => total + bet.amount, 0);
    }

    static getTotalPayout(bets: Bet[], spot: Spot): number {
        return bets.reduce((total, bet) => {
            if (this.doesBetWin(bet, spot)) {
                return total + bet.amount * bet.payout;
            }
            return total;
        }, 0);
    }

    static hasWin(bets: Bet[], spot: Spot): boolean {
        return bets.some(bet => this.doesBetWin(bet, spot));
    }

    static doesBetWin(bet: Bet, spot: Spot): boolean {
        switch (bet.type) {
            case BetType.STRAIGHT:
                return bet.spots.includes(spot);

            case BetType.RED:
                return SpotHelper.isRed(spot);

            case BetType.BLACK:
                return SpotHelper.isBlack(spot);

            case BetType.EVEN:
                return SpotHelper.isEven(spot);

            case BetType.ODD:
                return SpotHelper.isOdd(spot);

            case BetType.LOW: // 1-18
                return SpotHelper.is1To18(spot);

            case BetType.HIGH: // 19-36
                return SpotHelper.is19To36(spot);

            case BetType.FIRST_DOZEN:
                return SpotHelper.isFirstDozen(spot);

            case BetType.SECOND_DOZEN:
                return SpotHelper.isSecondDozen(spot);

            case BetType.THIRD_DOZEN:
                return SpotHelper.isThirdDozen(spot);

            case BetType.FIRST_COLUMN:
                return SpotHelper.isFirstColumn(spot);

            case BetType.SECOND_COLUMN:
                return SpotHelper.isSecondColumn(spot);

            case BetType.THIRD_COLUMN:
                return SpotHelper.isThirdColumn(spot);

            case BetType.SPLIT:
            case BetType.STREET:
            case BetType.CORNER:
            case BetType.BASKET:
            case BetType.SIXLINE:
                return bet.spots.includes(spot);

            default:
                return false;
        }
    }

    static getStandardPayout(betType: BetType): number {
        switch (betType) {
            case BetType.STRAIGHT:
                return 35;
            case BetType.SPLIT:
                return 17;
            case BetType.STREET:
                return 11;
            case BetType.CORNER:
                return 8;
            case BetType.BASKET:
                return 6;
            case BetType.SIXLINE:
                return 5;
            case BetType.RED:
            case BetType.BLACK:
            case BetType.EVEN:
            case BetType.ODD:
            case BetType.LOW:
            case BetType.HIGH:
                return 1;
            case BetType.FIRST_DOZEN:
            case BetType.SECOND_DOZEN:
            case BetType.THIRD_DOZEN:
            case BetType.FIRST_COLUMN:
            case BetType.SECOND_COLUMN:
            case BetType.THIRD_COLUMN:
                return 2;
            default:
                return 1;
        }
    }

    static createBet(type: BetType, spots: Spot[], amount: number): Bet {
        return {
            type,
            spots,
            amount,
            payout: this.getStandardPayout(type),
        };
    }

    static createRedBet(amount: number): Bet {
        return this.createBet(BetType.RED, [], amount);
    }

    static createBlackBet(amount: number): Bet {
        return this.createBet(BetType.BLACK, [], amount);
    }

    static createEvenBet(amount: number): Bet {
        return this.createBet(BetType.EVEN, [], amount);
    }

    static createOddBet(amount: number): Bet {
        return this.createBet(BetType.ODD, [], amount);
    }

    static createLowBet(amount: number): Bet {
        return this.createBet(BetType.LOW, [], amount);
    }

    static createHighBet(amount: number): Bet {
        return this.createBet(BetType.HIGH, [], amount);
    }

    static createFirstDozenBet(amount: number): Bet {
        return this.createBet(BetType.FIRST_DOZEN, [], amount);
    }

    static createSecondDozenBet(amount: number): Bet {
        return this.createBet(BetType.SECOND_DOZEN, [], amount);
    }

    static createThirdDozenBet(amount: number): Bet {
        return this.createBet(BetType.THIRD_DOZEN, [], amount);
    }

    static createStraightBet(spot: Spot, amount: number): Bet {
        return this.createBet(BetType.STRAIGHT, [spot], amount);
    }

    static getBetTypeName(betType: BetType): string {
        switch (betType) {
            case BetType.STRAIGHT:
                return 'Straight';
            case BetType.SPLIT:
                return 'Split';
            case BetType.STREET:
                return 'Street';
            case BetType.CORNER:
                return 'Corner';
            case BetType.BASKET:
                return 'Basket';
            case BetType.SIXLINE:
                return 'Six Line';
            case BetType.RED:
                return 'Red';
            case BetType.BLACK:
                return 'Black';
            case BetType.EVEN:
                return 'Even';
            case BetType.ODD:
                return 'Odd';
            case BetType.LOW:
                return '1-18';
            case BetType.HIGH:
                return '19-36';
            case BetType.FIRST_DOZEN:
                return '1st Dozen';
            case BetType.SECOND_DOZEN:
                return '2nd Dozen';
            case BetType.THIRD_DOZEN:
                return '3rd Dozen';
            case BetType.FIRST_COLUMN:
                return '1st Column';
            case BetType.SECOND_COLUMN:
                return '2nd Column';
            case BetType.THIRD_COLUMN:
                return '3rd Column';
            default:
                return betType;
        }
    }
}