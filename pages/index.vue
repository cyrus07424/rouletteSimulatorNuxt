<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
          Roulette Strategy Simulator
        </h1>

        <!-- Controls -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
            <USelect
                v-model="selectedStrategy"
                :items="strategyOptions"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Roulette Type</label>
            <USelect
                v-model="rouletteType"
                :items="rouletteTypeOptions"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Initial Balance</label>
            <UInput
                v-model.number="initialBalance"
                type="number"
                min="1"
                step="1"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rounds to Run</label>
            <USelect
                v-model="roundsToRun"
                :items="roundsOptions"
            />
          </div>
        </div>

        <!-- Simulation Controls -->
        <div class="flex gap-4 mb-8">
          <UButton
              @click="runSingleRound"
              :disabled="!isStrategyLive"
              color="primary"
          >
            Run Single Round
          </UButton>

          <UButton
              @click="runMultipleRounds"
              :disabled="!isStrategyLive"
              color="primary"
              variant="outline"
          >
            Run {{ roundsToRun }} Rounds
          </UButton>

          <UButton
              @click="resetSimulation"
              color="secondary"
              variant="outline"
          >
            Reset
          </UButton>
        </div>

        <!-- Statistics -->
        <div v-if="strategy" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(stats.currentBalance) }}</div>
            <div class="text-sm text-blue-500">Current Balance</div>
          </div>

          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ stats.wonCount }}</div>
            <div class="text-sm text-green-500">Wins</div>
          </div>

          <div class="bg-red-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ stats.lostCount }}</div>
            <div class="text-sm text-red-500">Losses</div>
          </div>

          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">
              {{ (stats.betCount > 0 ? (stats.wonCount / stats.betCount * 100).toFixed(1) : 0) }}%
            </div>
            <div class="text-sm text-purple-500">Win Rate</div>
          </div>
        </div>

        <!-- Recent Results -->
        <div v-if="recentResults.length > 0" class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Recent Results</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Round</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bet</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(result, index) in recentResults.slice().reverse().slice(0, 10)" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ recentResults.length - index }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getSpotColorClass(result.spot)"
                    >
                      {{ getSpotDisplay(result.spot) }}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(result.totalBet) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="result.won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ result.won ? 'Win' : 'Loss' }} {{
                        result.won ? '+' : ''
                      }}{{ formatCurrency(result.totalPayout - result.totalBet) }}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(result.balance) }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Balance Chart -->
        <div v-if="stats.balanceHistory.length > 1" class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Balance History</h2>
          <div class="h-64 bg-gray-50 rounded-lg p-4">
            <canvas ref="chartCanvas" class="w-full h-full"></canvas>
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
import {SpotHelper} from '~/utils/spotHelper';
import {drawBalanceChart} from '~/utils/chartHelper';

const selectedStrategy = ref('martingale');
const rouletteType = ref(RouletteType.EUROPEAN_STYLE);
const initialBalance = ref(1000);
const roundsToRun = ref(100);

const simulator = ref<RouletteSimulator>();
const strategy = ref<Strategy>();
const recentResults = ref<SimulationResult[]>([]);
const chartCanvas = ref<HTMLCanvasElement>();
const stats = ref<StrategyStats>({
  currentBalance: 0,
  maximumBalance: 0,
  minimumBalance: 0,
  maximumTotalBetValue: 0,
  wonCount: 0,
  lostCount: 0,
  betCount: 0,
  wholeTotalBetValue: 0,
  wholeTotalPayoutValue: 0,
  balanceHistory: [],
});

const strategyOptions = [
  {label: 'Martingale Strategy', value: 'martingale'},
  {label: 'Fixed Bet Strategy', value: 'fixed'},
  {label: 'Cocomo Strategy', value: 'cocomo'},
];

const roundsOptions = [
  {label: '10 Rounds', value: 10},
  {label: '50 Rounds', value: 50},
  {label: '100 Rounds', value: 100},
  {label: '500 Rounds', value: 500},
  {label: '1000 Rounds', value: 1000},
];

const rouletteTypeOptions = [
  {label: 'European Roulette', value: RouletteType.EUROPEAN_STYLE},
  {label: 'American Roulette', value: RouletteType.AMERICAN_STYLE},
  {label: 'Numbers 1-36 Only', value: RouletteType.ONE_TO_36},
];

const isStrategyLive = computed(() => strategy.value?.isLive() ?? false);

const initializeSimulation = () => {
  simulator.value = new RouletteSimulator(rouletteType.value, SpotGenerateType.RANDOM, initialBalance.value);

  switch (selectedStrategy.value) {
    case 'martingale':
      strategy.value = new MartingaleStrategy(initialBalance.value, 1);
      break;
    case 'fixed':
      strategy.value = new FixedBetStrategy(initialBalance.value, 1);
      break;
    case 'cocomo':
      strategy.value = new CocomoStrategy(initialBalance.value, 1);
      break;
    default:
      strategy.value = new FixedBetStrategy(initialBalance.value, 1);
  }

  updateStats();
  recentResults.value = [];
};

const updateStats = () => {
  if (strategy.value) {
    stats.value = strategy.value.getStats();
    updateChart();
  }
};

const updateChart = () => {
  if (chartCanvas.value && stats.value.balanceHistory.length > 1) {
    nextTick(() => {
      drawBalanceChart(chartCanvas.value!, stats.value.balanceHistory);
    });
  }
};

const runSingleRound = () => {
  if (!simulator.value || !strategy.value) return;

  const result = simulator.value.simulateRound(strategy.value);
  recentResults.value.push(result);
  updateStats();
};

const runMultipleRounds = () => {
  if (!simulator.value || !strategy.value) return;

  const results = simulator.value.simulateMultipleRounds(strategy.value, roundsToRun.value);
  recentResults.value.push(...results);
  updateStats();
};

const resetSimulation = () => {
  initializeSimulation();
  if (simulator.value) {
    simulator.value.reset();
  }
};

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

// Watch for changes in settings
watch([selectedStrategy, rouletteType, initialBalance], () => {
  initializeSimulation();
});

// Initialize on mount
onMounted(() => {
  initializeSimulation();
});

// Update chart when window resizes
onMounted(() => {
  const handleResize = () => updateChart();
  window.addEventListener('resize', handleResize);
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>