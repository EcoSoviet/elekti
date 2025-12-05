<template>
  <div class="party-card" :style="{ borderLeftColor: party.colour }">
    <div class="party-card__header">
      <h3 class="party-card__name">{{ party.name }}</h3>
      <span
        class="party-card__short"
        :style="{ backgroundColor: party.colour }"
      >
        {{ party.short }}
      </span>
    </div>

    <p class="party-card__description">
      {{ $t(party.descriptionKey) }}
    </p>

    <div v-if="score !== undefined" class="party-card__score">
      <div class="party-card__score-bar">
        <div
          class="party-card__score-fill"
          :style="{ width: `${score * 100}%`, backgroundColor: party.colour }"
        />
      </div>
      <span class="party-card__score-text">{{ Math.round(score * 100) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Party {
    id: string;
    name: string;
    short: string;
    descriptionKey: string;
    colour: string;
    logo: string;
  }

  defineProps<{
    party: Party;
    score?: number;
  }>();
</script>

<style scoped>
  .party-card {
    background-color: var(--color-surface-elevated);
    border: 1px solid var(--color-border);
    border-left: 4px solid var(--color-primary);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    transition: all var(--transition-base);
  }

  .party-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .party-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
  }

  .party-card__name {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .party-card__short {
    display: inline-block;
    padding: var(--space-xs) var(--space-sm);
    background-color: var(--color-primary);
    color: white;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    border-radius: var(--radius-sm);
    white-space: nowrap;
  }

  .party-card__description {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-relaxed);
  }

  .party-card__score {
    margin-top: var(--space-md);
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .party-card__score-bar {
    flex: 1;
    height: 12px;
    background-color: var(--color-border-light);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .party-card__score-fill {
    height: 100%;
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
    transition: width var(--transition-base);
  }

  .party-card__score-text {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    min-width: 48px;
    text-align: right;
  }
</style>
