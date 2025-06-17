<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
          Roulette Strategy Simulator
        </h1>

        <!-- Configuration Form -->
        <div class="space-y-8">
          <!-- Basic Settings -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Roulette Type</label>
              <USelect
                  v-model="rouletteType"
                  :items="rouletteTypeOptions"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Spot Generation Method</label>
              <USelect
                  v-model="spotGenerateType"
                  :items="spotGenerateTypeOptions"
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Simulation Speed: {{ simulationSpeed }}ms</label>
              <input
                  v-model.number="simulationSpeed"
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>Fast (0ms)</span>
                <span>Slow (1000ms)</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Time between rounds (lower = faster)</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Bet Amount</label>
              <UInput
                  v-model.number="minBetAmount"
                  type="number"
                  min="1"
                  step="1"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Bet Amount</label>
              <UInput
                  v-model.number="maxBetAmount"
                  type="number"
                  min="1"
                  step="1"
              />
            </div>
          </div>

          <!-- Strategy Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-4">Select Strategies</label>
            <div class="space-y-3">
              <div v-for="strategy in availableStrategies" :key="strategy.value" class="flex items-center">
                <input
                    :id="strategy.value"
                    v-model="selectedStrategies"
                    :value="strategy.value"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label :for="strategy.value" class="ml-2 text-sm text-gray-700">
                  {{ strategy.label }}
                </label>
              </div>
            </div>
            <p v-if="selectedStrategies.length === 0" class="text-red-500 text-sm mt-2">
              Please select at least one strategy
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center gap-4 pt-6">
            <UButton
                @click="startSimulation"
                :disabled="!canStartSimulation"
                color="primary"
                size="lg"
            >
              Start Simulation
            </UButton>
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
import {RouletteType, SpotGenerateType} from '~/types';

const { config, setConfig } = useSimulationConfig();

// ローカル変数でフォーム値を管理
const rouletteType = ref(config.value.rouletteType);
const spotGenerateType = ref(config.value.spotGenerateType);
const initialBalance = ref(config.value.initialBalance);
const minBetAmount = ref(config.value.minBetAmount);
const maxBetAmount = ref(config.value.maxBetAmount);
const simulationSpeed = ref(config.value.simulationSpeed);
const selectedStrategies = ref([...config.value.selectedStrategies]);

// minBetAmount変更時にmaxBetAmountを自動調整
watch(minBetAmount, (newMinBet) => {
  if (maxBetAmount.value < newMinBet) {
    maxBetAmount.value = newMinBet;
  }
});

const rouletteTypeOptions = [
  {label: 'European Roulette', value: RouletteType.EUROPEAN_STYLE},
  {label: 'American Roulette', value: RouletteType.AMERICAN_STYLE},
  {label: 'Numbers 1-36 Only', value: RouletteType.ONE_TO_36},
];

const spotGenerateTypeOptions = [
  {label: 'Random', value: SpotGenerateType.RANDOM},
  {label: 'Rotation by Number', value: SpotGenerateType.ROTATION_NUMBER},
  {label: 'Rotation by Wheel', value: SpotGenerateType.ROTATION_WHEEL},
  {label: 'Random Red Only', value: SpotGenerateType.RANDOM_RED_ONLY},
  {label: 'Random Black Only', value: SpotGenerateType.RANDOM_BLACK_ONLY},
  {label: 'Random Except One', value: SpotGenerateType.RANDOM_EXCEPT_ONE},
];

const availableStrategies = [
  {label: 'Martingale Strategy', value: 'martingale'},
  {label: 'Fixed Bet Strategy', value: 'fixed'},
  {label: 'Cocomo Strategy', value: 'cocomo'},
];

const canStartSimulation = computed(() => {
  return selectedStrategies.value.length > 0 &&
         initialBalance.value > 0 &&
         minBetAmount.value > 0 &&
         maxBetAmount.value >= minBetAmount.value &&
         simulationSpeed.value >= 0;
});

const startSimulation = () => {
  if (!canStartSimulation.value) return;
  setConfig({
    rouletteType: rouletteType.value,
    spotGenerateType: spotGenerateType.value,
    initialBalance: initialBalance.value,
    minBetAmount: minBetAmount.value,
    maxBetAmount: maxBetAmount.value,
    simulationSpeed: simulationSpeed.value,
    selectedStrategies: Array.from(selectedStrategies.value),
  });
  navigateTo('/simulation');
};
</script>