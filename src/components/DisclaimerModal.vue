<script setup lang="ts">
  import { onMounted, ref } from "vue";

  const isVisible = ref(false);
  const STORAGE_KEY = "elekti-disclaimer-accepted";

  onMounted(() => {
    const hasAccepted = localStorage.getItem(STORAGE_KEY);
    if (!hasAccepted) {
      isVisible.value = true;
    }
  });

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    isVisible.value = false;
  };
</script>

<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-backdrop" @click.self="handleAccept">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
      >
        <div class="modal__header">
          <h2 id="disclaimer-title" class="modal__title">
            {{ $t("disclaimer.title") }}
          </h2>
        </div>

        <div class="modal__content">
          <p class="modal__paragraph modal__paragraph--emphasis">
            {{ $t("disclaimer.educational") }}
          </p>
          <p class="modal__paragraph modal__paragraph--warning">
            {{ $t("disclaimer.alpha") }}
          </p>
          <p class="modal__paragraph">
            {{ $t("disclaimer.research") }}
          </p>
        </div>

        <div class="modal__footer">
          <button @click="handleAccept" class="modal__button">
            {{ $t("disclaimer.understand") }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: var(--space-md);
    backdrop-filter: blur(4px);
  }

  .modal {
    background-color: var(--color-surface-elevated);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    max-width: var(--max-width-sm);
    width: 100%;
    max-height: calc(100vh - var(--space-xl));
    overflow-y: auto;
    border: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
  }

  .modal__header {
    padding: var(--space-xl) var(--space-xl) var(--space-lg);
    border-bottom: 2px solid var(--color-border);
    background: linear-gradient(
      to bottom,
      var(--color-surface-elevated),
      var(--color-surface)
    );
  }

  .modal__title {
    margin: 0;
    font-size: var(--font-size-2xl);
    color: var(--color-primary);
    font-weight: var(--font-weight-bold);
  }

  .modal__content {
    padding: var(--space-xl);
    overflow-y: auto;
    flex: 1;
  }

  .modal__paragraph {
    margin-bottom: var(--space-lg);
    line-height: var(--line-height-relaxed);
    color: var(--color-text-secondary);
  }

  .modal__paragraph:last-child {
    margin-bottom: 0;
  }

  .modal__paragraph--emphasis {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }

  .modal__paragraph--warning {
    padding: var(--space-md);
    background-color: var(--color-warning);
    color: var(--color-primary-dark);
    border-radius: var(--radius-md);
    border-left: 4px solid var(--color-accent-dark);
    font-weight: var(--font-weight-medium);
  }

  @media (prefers-color-scheme: dark) {
    .modal__paragraph--warning {
      background-color: rgba(212, 165, 32, 0.15);
      color: var(--color-accent-light);
      border-left-color: var(--color-accent);
    }
  }

  .modal__footer {
    padding: var(--space-lg) var(--space-xl) var(--space-xl);
    display: flex;
    justify-content: flex-end;
    background-color: var(--color-surface);
    padding-bottom: max(var(--space-xl), env(safe-area-inset-bottom));
  }

  .modal__button {
    background-color: var(--color-primary);
    color: white;
    padding: var(--space-md) var(--space-xl);
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-base);
    transition:
      background-color var(--transition-fast),
      transform var(--transition-fast);
    cursor: pointer;
    border: none;
  }

  .modal__button:hover {
    background-color: var(--color-primary-light);
    transform: translateY(-1px);
  }

  .modal__button:active {
    transform: translateY(0);
  }

  .modal__button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: opacity var(--transition-base);
  }

  .modal-enter-active .modal,
  .modal-leave-active .modal {
    transition:
      opacity var(--transition-base),
      transform var(--transition-base);
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-from .modal,
  .modal-leave-to .modal {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }

  @media (max-width: 640px) {
    .modal-backdrop {
      padding: 0;
    }

    .modal {
      max-width: 100%;
      max-height: 100vh;
      height: 100vh;
      border-radius: 0;
    }

    .modal__header {
      padding: var(--space-lg);
    }

    .modal__content {
      padding: var(--space-lg);
    }

    .modal__footer {
      padding: var(--space-lg);
      padding-bottom: max(
        var(--space-lg),
        calc(env(safe-area-inset-bottom) + var(--space-md))
      );
    }

    .modal__title {
      font-size: var(--font-size-xl);
    }

    .modal-enter-from .modal,
    .modal-leave-to .modal {
      transform: translateX(100%);
    }
  }
</style>
