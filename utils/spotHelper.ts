import type {RouletteContext} from '~/types';
import {RouletteType, Spot, SpotGenerateType} from '~/types';

// Wheel layouts based on the original Java implementation
export const ONE_TO_36_WHEEL: Spot[] = [
    Spot.SPOT_01, Spot.SPOT_02, Spot.SPOT_03, Spot.SPOT_04, Spot.SPOT_05, Spot.SPOT_06, Spot.SPOT_07, Spot.SPOT_08, Spot.SPOT_09,
    Spot.SPOT_10, Spot.SPOT_11, Spot.SPOT_12, Spot.SPOT_13, Spot.SPOT_14, Spot.SPOT_15, Spot.SPOT_16, Spot.SPOT_17, Spot.SPOT_18,
    Spot.SPOT_19, Spot.SPOT_20, Spot.SPOT_21, Spot.SPOT_22, Spot.SPOT_23, Spot.SPOT_24, Spot.SPOT_25, Spot.SPOT_26, Spot.SPOT_27,
    Spot.SPOT_28, Spot.SPOT_29, Spot.SPOT_30, Spot.SPOT_31, Spot.SPOT_32, Spot.SPOT_33, Spot.SPOT_34, Spot.SPOT_35, Spot.SPOT_36,
];

export const EUROPEAN_WHEEL: Spot[] = [
    Spot.SPOT_0, Spot.SPOT_32, Spot.SPOT_15, Spot.SPOT_19, Spot.SPOT_04, Spot.SPOT_21, Spot.SPOT_02, Spot.SPOT_25,
    Spot.SPOT_17, Spot.SPOT_34, Spot.SPOT_06, Spot.SPOT_27, Spot.SPOT_13, Spot.SPOT_36, Spot.SPOT_11, Spot.SPOT_30, Spot.SPOT_08,
    Spot.SPOT_23, Spot.SPOT_10, Spot.SPOT_05, Spot.SPOT_24, Spot.SPOT_16, Spot.SPOT_33, Spot.SPOT_01, Spot.SPOT_20, Spot.SPOT_14,
    Spot.SPOT_31, Spot.SPOT_09, Spot.SPOT_22, Spot.SPOT_18, Spot.SPOT_29, Spot.SPOT_07, Spot.SPOT_28, Spot.SPOT_12, Spot.SPOT_35,
    Spot.SPOT_03, Spot.SPOT_26,
];

export const AMERICAN_WHEEL: Spot[] = [
    Spot.SPOT_0, Spot.SPOT_28, Spot.SPOT_09, Spot.SPOT_26, Spot.SPOT_30, Spot.SPOT_11, Spot.SPOT_07, Spot.SPOT_20, Spot.SPOT_32, Spot.SPOT_17,
    Spot.SPOT_05, Spot.SPOT_22, Spot.SPOT_34, Spot.SPOT_15, Spot.SPOT_03, Spot.SPOT_24, Spot.SPOT_36, Spot.SPOT_13, Spot.SPOT_01, Spot.SPOT_00,
    Spot.SPOT_27, Spot.SPOT_10, Spot.SPOT_25, Spot.SPOT_29, Spot.SPOT_12, Spot.SPOT_08, Spot.SPOT_19, Spot.SPOT_31, Spot.SPOT_18, Spot.SPOT_06,
    Spot.SPOT_21, Spot.SPOT_33, Spot.SPOT_16, Spot.SPOT_04, Spot.SPOT_23, Spot.SPOT_35, Spot.SPOT_14, Spot.SPOT_02,
];

export class SpotHelper {
    static getByNumber(number: number): Spot {
        if (number === -1) return Spot.SPOT_00;
        if (number >= 0 && number <= 36) {
            return number as Spot;
        }
        throw new Error(`Invalid spot number: ${number}`);
    }

    static getAvailableList(rouletteType: RouletteType): Spot[] {
        const availableSpots: Spot[] = [];

        for (const spot of Object.values(Spot).filter(v => typeof v === 'number') as Spot[]) {
            if ((rouletteType === RouletteType.ONE_TO_36 && (spot === Spot.SPOT_0 || spot === Spot.SPOT_00)) ||
                (rouletteType === RouletteType.EUROPEAN_STYLE && spot === Spot.SPOT_00)) {
                continue;
            }
            availableSpots.push(spot);
        }

        return availableSpots;
    }

    static getRandomNextSpot(context: RouletteContext): Spot {
        const availableSpots = this.getAvailableList(context.rouletteType);

        switch (context.spotGenerateType) {
            case SpotGenerateType.RANDOM:
                return availableSpots[Math.floor(Math.random() * availableSpots.length)];

            case SpotGenerateType.ROTATION_NUMBER:
                return availableSpots[context.currentLoopCount % availableSpots.length];

            case SpotGenerateType.ROTATION_WHEEL:
                switch (context.rouletteType) {
                    case RouletteType.ONE_TO_36:
                        return ONE_TO_36_WHEEL[context.currentLoopCount % ONE_TO_36_WHEEL.length];
                    case RouletteType.EUROPEAN_STYLE:
                        return EUROPEAN_WHEEL[context.currentLoopCount % EUROPEAN_WHEEL.length];
                    case RouletteType.AMERICAN_STYLE:
                        return AMERICAN_WHEEL[context.currentLoopCount % AMERICAN_WHEEL.length];
                    default:
                        throw new Error('Unsupported roulette type');
                }

            case SpotGenerateType.RANDOM_RED_ONLY:
                const redSpots = availableSpots.filter(spot => this.isRed(spot));
                return redSpots[Math.floor(Math.random() * redSpots.length)];

            case SpotGenerateType.RANDOM_BLACK_ONLY:
                const blackSpots = availableSpots.filter(spot => this.isBlack(spot));
                return blackSpots[Math.floor(Math.random() * blackSpots.length)];

            case SpotGenerateType.RANDOM_EXCEPT_ONE:
                const exceptOneSpots = availableSpots.filter(spot => spot !== Spot.SPOT_01);
                return exceptOneSpots[Math.floor(Math.random() * exceptOneSpots.length)];

            default:
                throw new Error('Unsupported spot generate type');
        }
    }

    static getNumber(spot: Spot): number {
        return spot === Spot.SPOT_00 ? -1 : spot;
    }

    static isRed(spot: Spot): boolean {
        const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        return redNumbers.includes(this.getNumber(spot));
    }

    static isBlack(spot: Spot): boolean {
        const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
        return blackNumbers.includes(this.getNumber(spot));
    }

    static isGreen(spot: Spot): boolean {
        return !this.isRed(spot) && !this.isBlack(spot);
    }

    static isEven(spot: Spot): boolean {
        const number = this.getNumber(spot);
        return number > 0 && number % 2 === 0;
    }

    static isOdd(spot: Spot): boolean {
        const number = this.getNumber(spot);
        return number > 0 && number % 2 === 1;
    }

    static isFirstDozen(spot: Spot): boolean {
        const number = this.getNumber(spot);
        return number >= 1 && number <= 12;
    }

    static isSecondDozen(spot: Spot): boolean {
        const number = this.getNumber(spot);
        return number >= 13 && number <= 24;
    }

    static isThirdDozen(spot: Spot): boolean {
        const number = this.getNumber(spot);
        return number >= 25 && number <= 36;
    }

    static isFirstColumn(spot: Spot): boolean {
        const firstColumnNumbers = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
        return firstColumnNumbers.includes(this.getNumber(spot));
    }

    static isSecondColumn(spot: Spot): boolean {
        const secondColumnNumbers = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
        return secondColumnNumbers.includes(this.getNumber(spot));
    }

    static isThirdColumn(spot: Spot): boolean {
        const thirdColumnNumbers = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
        return thirdColumnNumbers.includes(this.getNumber(spot));
    }

    static is1To18(spot: Spot): boolean {
        const number = this.getNumber(spot);
        return number >= 1 && number <= 18;
    }

    static is19To36(spot: Spot): boolean {
        const number = this.getNumber(spot);
        return number >= 19 && number <= 36;
    }

    static getDisplayName(spot: Spot): string {
        return spot === Spot.SPOT_00 ? '00' : this.getNumber(spot).toString();
    }

    static getColor(spot: Spot): string {
        if (this.isRed(spot)) return 'red';
        if (this.isBlack(spot)) return 'black';
        return 'green';
    }
}