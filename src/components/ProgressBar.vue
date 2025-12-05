<template>
  <div class="progress-bar">
    <div
      class="progress-bar__track"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="progress-bar__fill" :style="{ width: `${progress}%` }" />
    </div>
    <div v-if="$slots.default" class="progress-bar__label">
      <slot />
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
    height: 6px;
    background-color: var(--color-border-light);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: var(--space-md);
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

  .progress-bar__label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-medium);
    text-align: center;
  }
</style>
