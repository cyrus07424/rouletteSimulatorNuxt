<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
          Roulette Strategy Simulator
        </h1>
        
        <div class="text-center">
          <p class="text-gray-600 mb-8">
            Configure your simulation settings and start testing roulette strategies
          </p>
          
          <UButton
              @click="goToSetup"
              color="primary"
              size="lg"
          >
            Setup Simulation
          </UButton>
        </div>
      </div>
    </div>
    <footer class="text-center text-gray-400 mt-8">
      &copy; 2025 <a href="https://github.com/cyrus07424" target="_blank">cyrus</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
const goToSetup = () => {
  navigateTo('/setup');
};
</script>