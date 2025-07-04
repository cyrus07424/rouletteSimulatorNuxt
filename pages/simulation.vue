<template>
  <div class="min-h-screen bg-gray-100 py-4">
    <div class="max-w-7xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">
            Roulette Simulation
          </h1>
          
          <div class="flex gap-3 items-center">
            <!-- Simulation Speed Slider -->
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 whitespace-nowrap">Speed:</span>
              <input
                  v-model.number="simulationSpeed"
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  class="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-sm text-gray-600 min-w-0">{{ simulationSpeed }}ms</span>
            </div>
            
            <UButton
                @click="toggleSimulation"
                :color="isRunning ? 'warning' : 'success'"
            >
              {{ isRunning ? 'Pause' : 'Resume' }}
            </UButton>
            
            <UButton
                @click="endSimulation"
                color="error"
                variant="outline"
            >
              End
            </UButton>
          </div>
        </div>

        <!-- Simulation Info -->
        <div class="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
          <div class="bg-blue-50 p-3 rounded-lg">
            <div class="text-lg font-bold text-blue-600">{{ totalRounds }}</div>
            <div class="text-sm text-blue-500">Total Rounds</div>
          </div>
          
          <div class="bg-purple-50 p-3 rounded-lg">
            <div class="text-lg font-bold text-purple-600">{{ simulationSpeed }}ms</div>
            <div class="text-sm text-purple-500">Round Speed</div>
          </div>
          
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-lg font-bold text-gray-600">{{ lastSpotDisplay }}</div>
            <div class="text-sm text-gray-500">Last Result</div>
          </div>
          
          <div class="bg-green-50 p-3 rounded-lg">
            <div class="text-lg font-bold text-green-600">{{ strategyCount }}</div>
            <div class="text-sm text-green-500">Active Strategies</div>
          </div>
          
          <!-- Color Percentages from Recent 100 Loops -->
          <div class="bg-red-50 p-3 rounded-lg">
            <div class="text-lg font-bold text-red-600">{{ colorPercentages.red }}%</div>
            <div class="text-sm text-red-500">Red (Recent 100)</div>
          </div>
          
          <div class="bg-slate-50 p-3 rounded-lg">
            <div class="text-lg font-bold text-slate-800">{{ colorPercentages.black }}%</div>
            <div class="text-sm text-slate-600">Black (Recent 100)</div>
          </div>
          
          <div class="bg-emerald-50 p-3 rounded-lg">
            <div class="text-lg font-bold text-emerald-600">{{ colorPercentages.green }}%</div>
            <div class="text-sm text-emerald-500">Green (Recent 100)</div>
          </div>
        </div>

        <!-- Strategy Statistics -->
        <div class="space-y-6 mb-6">
          <div v-for="(strategyResult, strategyName) in strategyResults" :key="strategyName" 
               class="border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4 capitalize">{{ getStrategyDisplayName(strategyName) }}</h3>
            
            <!-- Strategy Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
              <div class="bg-blue-50 p-3 rounded">
                <div class="text-lg font-bold text-blue-600">{{ formatCurrency(strategyResult.stats.currentBalance) }}</div>
                <div class="text-xs text-blue-500">Current Balance</div>
              </div>
              
              <div class="bg-green-50 p-3 rounded">
                <div class="text-lg font-bold" :class="balanceDifferenceClass(strategyResult.stats.currentBalance)">
                  {{ formatCurrency(strategyResult.stats.currentBalance - (config?.initialBalance || 1000)) }}
                </div>
                <div class="text-xs text-gray-500">Difference</div>
              </div>
              
              <div class="bg-indigo-50 p-3 rounded">
                <div class="text-lg font-bold text-indigo-600">{{ formatCurrency(strategyResult.stats.maximumBalance) }}</div>
                <div class="text-xs text-indigo-500">Max Balance</div>
              </div>
              
              <div class="bg-red-50 p-3 rounded">
                <div class="text-lg font-bold text-red-600">{{ formatCurrency(strategyResult.stats.minimumBalance) }}</div>
                <div class="text-xs text-red-500">Min Balance</div>
              </div>
              
              <div class="bg-orange-50 p-3 rounded">
                <div class="text-lg font-bold text-orange-600">{{ formatCurrency(strategyResult.lastBetAmount) }}</div>
                <div class="text-xs text-orange-500">Last Bet</div>
              </div>
              
              <div class="bg-yellow-50 p-3 rounded">
                <div class="text-lg font-bold text-yellow-600">{{ formatCurrency(strategyResult.stats.maximumTotalBetValue) }}</div>
                <div class="text-xs text-yellow-500">Max Bet</div>
              </div>
              
              <div class="bg-purple-50 p-3 rounded">
                <div class="text-lg font-bold text-purple-600">
                  {{ (strategyResult.stats.betCount > 0 ? (strategyResult.stats.wonCount / strategyResult.stats.betCount * 100).toFixed(1) : 0) }}%
                </div>
                <div class="text-xs text-purple-500">Win Rate</div>
              </div>
              
              <div class="bg-teal-50 p-3 rounded">
                <div class="text-lg font-bold text-teal-600">{{ formatCurrency(strategyResult.stats.wholeTotalBetValue) }}</div>
                <div class="text-xs text-teal-500">Total Bet</div>
              </div>
              
              <div class="bg-emerald-50 p-3 rounded">
                <div class="text-lg font-bold text-emerald-600">{{ formatCurrency(strategyResult.stats.wholeTotalPayoutValue) }}</div>
                <div class="text-xs text-emerald-500">Total Payout</div>
              </div>
              
              <div class="bg-cyan-50 p-3 rounded">
                <div class="text-lg font-bold text-cyan-600">{{ formatCurrency(getAverageBet(strategyResult.stats)) }}</div>
                <div class="text-xs text-cyan-500">Avg Bet</div>
              </div>
              
              <div class="bg-lime-50 p-3 rounded">
                <div class="text-lg font-bold text-lime-600">{{ formatCurrency(getAveragePayout(strategyResult.stats)) }}</div>
                <div class="text-xs text-lime-500">Avg Payout</div>
              </div>
            </div>
            
            <!-- Balance Chart -->
            <div v-if="strategyResult.stats.balanceHistory.length > 1" class="h-32 bg-gray-50 rounded p-2">
              <canvas :ref="el => setChartRef(strategyName, el)" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>

        <!-- Spot History -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Spots -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Recent Results</h3>
            <div class="bg-gray-50 rounded-lg p-4 h-48 overflow-y-auto">
              <div class="flex flex-wrap gap-2">
                <span v-for="(spot, index) in recentSpots.slice().reverse().slice(0, 50)" :key="index"
                      class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                      :class="getSpotColorClass(spot)">
                  {{ getSpotDisplay(spot) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Spot Heatmap -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Spot Frequency Heatmap</h3>
            <div class="bg-gray-50 rounded-lg p-4 h-48">
              <div class="grid grid-cols-8 gap-1 h-full">
                <div v-for="spot in availableSpots" :key="spot"
                     class="flex items-center justify-center text-xs font-medium rounded"
                     :class="getHeatmapColorClass(spot)"
                     :title="`${getSpotDisplay(spot)}: ${spotFrequency[spot] || 0} times`">
                  {{ getSpotDisplay(spot) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="text-center text-gray-400 mt-8">
      &copy; 2025 <a href="https://github.com/cyrus07424" target="_blank">cyrus</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type {SimulationResult, Spot, Strategy, StrategyStats} from '~/types';
import {RouletteType, SpotGenerateType} from '~/types';
import {RouletteSimulator} from '~/composables/rouletteSimulator';
import {MartingaleStrategy} from '~/composables/strategies/martingaleStrategy';
import {FixedBetStrategy} from '~/composables/strategies/fixedBetStrategy';
import {CocomoStrategy} from '~/composables/strategies/cocomoStrategy';
import {ONE_TO_36_WHEEL, EUROPEAN_WHEEL, AMERICAN_WHEEL, SpotHelper} from '~/utils/spotHelper';
import {drawBalanceChart} from '~/utils/chartHelper';
import type {SimulationConfig} from '~/composables/useSimulationConfig';

interface StrategyResult {
  strategy: Strategy;
  stats: StrategyStats;
  lastBetAmount: number;
}

// Get configuration
const simulationConfig = useSimulationConfig();
const config = simulationConfig.config;

// Reactive state
const isRunning = ref(true);
const totalRounds = ref(0);
const simulationTimer = ref<NodeJS.Timeout | null>(null);
const chartRefs = ref<Record<string, HTMLCanvasElement>>({});

// シミュレーションスピードをローカルrefで管理
const simulationSpeed = ref(config.value.simulationSpeed);

// configのsimulationSpeedが変わったらローカルにも反映
watch(() => config.value.simulationSpeed, (val) => {
  simulationSpeed.value = val;
});
// ローカルのsimulationSpeedが変わったらsetConfigで反映
const { setConfig } = useSimulationConfig();
watch(simulationSpeed, (val) => {
  setConfig({
    ...config.value,
    simulationSpeed: val,
    selectedStrategies: Array.from(config.value.selectedStrategies),
  });
});

// Simulation data
const simulator = ref<RouletteSimulator>();
const strategyResults = ref<Record<string, StrategyResult>>({});
const recentSpots = ref<Spot[]>([]);
const spotFrequency = ref<Record<number, number>>({});

// Computed values
const lastSpotDisplay = computed(() => {
  const lastSpot = recentSpots.value[recentSpots.value.length - 1];
  return lastSpot !== undefined ? getSpotDisplay(lastSpot) : '-';
});

const strategyCount = computed(() => Object.keys(strategyResults.value).length);

// Color percentage calculations based on recent 100 spots
const colorPercentages = computed(() => {
  const recent100 = recentSpots.value.slice(-100); // Get last 100 spots
  if (recent100.length === 0) {
    return { red: 0, black: 0, green: 0 };
  }
  
  let redCount = 0;
  let blackCount = 0;
  let greenCount = 0;
  
  recent100.forEach(spot => {
    if (SpotHelper.isRed(spot)) {
      redCount++;
    } else if (SpotHelper.isBlack(spot)) {
      blackCount++;
    } else {
      greenCount++;
    }
  });
  
  const total = recent100.length;
  return {
    red: Math.round((redCount / total) * 100),
    black: Math.round((blackCount / total) * 100),
    green: Math.round((greenCount / total) * 100)
  };
});

const availableSpots = computed(() => {
  if (config.value.rouletteType === RouletteType.EUROPEAN_STYLE) {
    return EUROPEAN_WHEEL;
  } else if (config.value.rouletteType === RouletteType.AMERICAN_STYLE) {
    return AMERICAN_WHEEL;
  } else {
    return ONE_TO_36_WHEEL;
  }
});

// Initialize simulation
const initializeSimulation = () => {
  simulator.value = new RouletteSimulator(
    config.value.rouletteType,
    config.value.spotGenerateType,
    config.value.initialBalance
  );

  strategyResults.value = {};
  
  // Initialize each selected strategy
  config.value.selectedStrategies.forEach(strategyName => {
    let strategy: Strategy;
    
    switch (strategyName) {
      case 'martingale':
        strategy = new MartingaleStrategy(config.value.initialBalance, config.value.minBetAmount, config.value.maxBetAmount);
        break;
      case 'fixed':
        strategy = new FixedBetStrategy(config.value.initialBalance, config.value.minBetAmount, config.value.maxBetAmount);
        break;
      case 'cocomo':
        strategy = new CocomoStrategy(config.value.initialBalance, config.value.minBetAmount, config.value.maxBetAmount);
        break;
      default:
        strategy = new FixedBetStrategy(config.value.initialBalance, config.value.minBetAmount, config.value.maxBetAmount);
    }
    
    strategyResults.value[strategyName] = {
      strategy,
      stats: strategy.getStats(),
      lastBetAmount: 0,
    };
  });
  
  recentSpots.value = [];
  spotFrequency.value = {};
  totalRounds.value = 0;
};

// Simulation loop
const runSimulationRound = () => {
  if (!simulator.value || !isRunning.value) return;
  
  let hasLiveStrategy = false;
  
  // Run simulation for each strategy
  Object.entries(strategyResults.value).forEach(([strategyName, strategyResult]) => {
    if (strategyResult.strategy.isLive()) {
      hasLiveStrategy = true;
      const result = simulator.value!.simulateRound(strategyResult.strategy);
      
      // Update strategy result
      strategyResult.stats = strategyResult.strategy.getStats();
      strategyResult.lastBetAmount = result.totalBet;
      
      // Update spot data (only once per round, not per strategy)
      if (strategyName === config.value.selectedStrategies[0]) {
        recentSpots.value.push(result.spot);
        spotFrequency.value[result.spot] = (spotFrequency.value[result.spot] || 0) + 1;
        
        // Keep only recent spots
        if (recentSpots.value.length > 1000) {
          const removedSpot = recentSpots.value.shift()!;
          spotFrequency.value[removedSpot]--;
          if (spotFrequency.value[removedSpot] === 0) {
            delete spotFrequency.value[removedSpot];
          }
        }
      }
    }
  });
  
  if (hasLiveStrategy) {
    totalRounds.value++;
    updateCharts();
    
    // Schedule next round
    simulationTimer.value = setTimeout(runSimulationRound, config.value.simulationSpeed);
  } else {
    // All strategies are dead, pause simulation
    isRunning.value = false;
  }
};

// Control functions
const toggleSimulation = () => {
  isRunning.value = !isRunning.value;
  
  if (isRunning.value) {
    runSimulationRound();
  } else if (simulationTimer.value) {
    clearTimeout(simulationTimer.value);
    simulationTimer.value = null;
  }
};

const endSimulation = () => {
  isRunning.value = false;
  if (simulationTimer.value) {
    clearTimeout(simulationTimer.value);
    simulationTimer.value = null;
  }
  navigateTo('/');
};

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getSpotDisplay = (spot: Spot) => {
  return SpotHelper.getDisplayName(spot);
};

const getSpotColorClass = (spot: Spot) => {
  const color = SpotHelper.getColor(spot);
  switch (color) {
    case 'red':
      return 'bg-red-100 text-red-800';
    case 'black':
      return 'bg-gray-100 text-gray-800';
    case 'green':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getHeatmapColorClass = (spot: Spot) => {
  const frequency = spotFrequency.value[spot] || 0;
  const maxFrequency = Math.max(...Object.values(spotFrequency.value));

  if (frequency === 0) return 'bg-white border border-gray-200';

  const intensity = frequency / maxFrequency;
  const color = SpotHelper.getColor(spot);
  if (color === 'red') {
    if (intensity > 0.8) return 'bg-red-500 text-white';
    if (intensity > 0.6) return 'bg-red-400 text-white';
    if (intensity > 0.4) return 'bg-red-300';
    if (intensity > 0.2) return 'bg-red-200';
    return 'bg-red-100';
  } else if (color === 'black') {
    if (intensity > 0.8) return 'bg-gray-500 text-white';
    if (intensity > 0.6) return 'bg-gray-400 text-white';
    if (intensity > 0.4) return 'bg-gray-300 text-white';
    if (intensity > 0.2) return 'bg-gray-200';
    return 'bg-gray-100';
  } else if (color === 'green') {
    if (intensity > 0.8) return 'bg-green-500 text-white';
    if (intensity > 0.6) return 'bg-green-400 text-white';
    if (intensity > 0.4) return 'bg-green-300';
    if (intensity > 0.2) return 'bg-green-200';
    return 'bg-green-100';
  }
  return 'bg-gray-100 text-gray-800';
};

const balanceDifferenceClass = (currentBalance: number) => {
  const difference = currentBalance - config.value.initialBalance;
  if (difference > 0) return 'text-green-600';
  if (difference < 0) return 'text-red-600';
  return 'text-gray-600';
};

const getStrategyDisplayName = (strategyName: string) => {
  switch (strategyName) {
    case 'martingale': return 'Martingale Strategy';
    case 'fixed': return 'Fixed Bet Strategy';
    case 'cocomo': return 'Cocomo Strategy';
    default: return strategyName;
  }
};

const getAverageBet = (stats: StrategyStats) => {
  return stats.betCount > 0 ? stats.wholeTotalBetValue / stats.betCount : 0;
};

const getAveragePayout = (stats: StrategyStats) => {
  return stats.betCount > 0 ? stats.wholeTotalPayoutValue / stats.betCount : 0;
};

const setChartRef = (strategyName: string, el: Element | ComponentPublicInstance | null) => {
  if (el instanceof HTMLCanvasElement) {
    chartRefs.value[strategyName] = el;
  }
};

const updateCharts = () => {
  nextTick(() => {
    Object.entries(strategyResults.value).forEach(([strategyName, strategyResult]) => {
      const canvas = chartRefs.value[strategyName];
      if (canvas && strategyResult.stats.balanceHistory.length > 1) {
        drawBalanceChart(canvas, strategyResult.stats.balanceHistory);
      }
    });
  });
};

// Lifecycle
onMounted(() => {
  initializeSimulation();
  runSimulationRound();
});

onUnmounted(() => {
  if (simulationTimer.value) {
    clearTimeout(simulationTimer.value);
  }
});

// Redirect to index if no configuration
if (!config.value || !config.value.selectedStrategies.length) {
  navigateTo('/');
}

// Setup page meta
useHead({
  title: 'Roulette Strategy Simulator - Roulette Simulation'
})
</script>