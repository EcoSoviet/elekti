<template>
  <div class="progress-bar">
    <div class="progress-bar__track">
      <div
        class="progress-bar__fill"
        :style="{ width: `${progress}%` }"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
    <div class="progress-bar__text">
      <slot>{{ Math.round(progress) }}%</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    progress: number;
  }>();
</script>

<style scoped>
  .progress-bar {
    width: 100%;
  }

  .progress-bar__track {
    width: 100%;
    height: 8px;
    background-color: var(--color-border-light);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-bar__fill {
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--color-primary),
      var(--color-primary-light)
    );
    transition: width var(--transition-base);
    border-radius: var(--radius-full);
  }

  .progress-bar__text {
    margin-top: var(--space-sm);
    text-align: center;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
</style>
