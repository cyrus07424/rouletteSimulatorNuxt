import { RouletteContext, RouletteType, SpotGenerateType, Spot, Strategy, SimulationResult } from '~/types';
import { SpotHelper } from '~/utils/spotHelper';
import { BetHelper } from '~/utils/betHelper';

export class RouletteSimulator {
  private context: RouletteContext;

  constructor(
    rouletteType: RouletteType = RouletteType.EUROPEAN_STYLE,
    spotGenerateType: SpotGenerateType = SpotGenerateType.RANDOM,
    initialBalance: number = 1000
  ) {
    this.context = {
      rouletteType,
      spotGenerateType,
      initialBalance,
      currentLoopCount: 0,
      spotHistory: [],
      getLastSpot: () => {
        const history = this.context.spotHistory;
        return history.length > 0 ? history[history.length - 1] : null;
      },
    };
  }

  simulateRound(strategy: Strategy): SimulationResult {
    // Get next bets from strategy
    const bets = strategy.getNextBetList(this.context);
    
    // Generate next spot
    const spot = SpotHelper.getRandomNextSpot(this.context);
    
    // Calculate results
    const totalBet = BetHelper.getTotalBetValue(bets);
    const totalPayout = BetHelper.getTotalPayout(bets, spot);
    const won = BetHelper.hasWin(bets, spot);
    
    // Update strategy
    strategy.updateStrategyParameter(bets, spot);
    
    // Update context
    this.context.spotHistory.push(spot);
    this.context.currentLoopCount++;
    
    // Keep only recent history
    if (this.context.spotHistory.length > 100) {
      this.context.spotHistory.shift();
    }

    return {
      spot,
      bets,
      totalBet,
      totalPayout,
      balance: strategy.getStats().currentBalance,
      won,
    };
  }

  simulateMultipleRounds(strategy: Strategy, rounds: number): SimulationResult[] {
    const results: SimulationResult[] = [];
    
    for (let i = 0; i < rounds && strategy.isLive(); i++) {
      results.push(this.simulateRound(strategy));
    }
    
    return results;
  }

  getContext(): RouletteContext {
    return { ...this.context };
  }

  reset(): void {
    this.context.currentLoopCount = 0;
    this.context.spotHistory = [];
  }
}