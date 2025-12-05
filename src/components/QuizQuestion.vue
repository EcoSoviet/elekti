<template>
  <div class="quiz-question">
    <h2 class="quiz-question__text">{{ question.text }}</h2>
    <p class="quiz-question__category">{{ question.category }}</p>

    <div
      class="quiz-question__options"
      role="radiogroup"
      :aria-labelledby="question.id"
    >
      <button
        v-for="(option, index) in optionLabels"
        :key="index"
        @click="selectOption(index)"
        class="quiz-question__option"
        :class="{ 'quiz-question__option--selected': selectedOption === index }"
        role="radio"
        :aria-checked="selectedOption === index"
      >
        <span class="quiz-question__option-circle" />
        <span class="quiz-question__option-text">{{ option }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { useI18n } from "vue-i18n";

  interface Question {
    id: string;
    text: string;
    category: string;
    options: string[];
  }

  const props = defineProps<{
    question: Question;
    modelValue?: number;
  }>();

  const emit = defineEmits<{
    "update:modelValue": [value: number];
  }>();

  const { t } = useI18n();
  const selectedOption = ref<number | undefined>(props.modelValue);

  const optionLabels = computed(() => [
    t("options.stronglyAgree"),
    t("options.agree"),
    t("options.neutral"),
    t("options.disagree"),
    t("options.stronglyDisagree"),
  ]);

  watch(
    () => props.modelValue,
    (newValue) => {
      selectedOption.value = newValue;
    }
  );

  function selectOption(index: number) {
    selectedOption.value = index;
    emit("update:modelValue", index);
  }
</script>

<style scoped>
  .quiz-question {
    width: 100%;
  }

  .quiz-question__text {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-sm);
    line-height: var(--line-height-tight);
  }

  .quiz-question__category {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-xl);
  }

  .quiz-question__options {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .quiz-question__option {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background-color: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .quiz-question__option:hover {
    border-color: var(--color-primary-light);
    background-color: var(--color-surface-elevated);
    transform: translateX(4px);
  }

  .quiz-question__option--selected {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
    color: white;
  }

  .quiz-question__option--selected:hover {
    border-color: var(--color-primary-dark);
    background-color: var(--color-primary-dark);
  }

  .quiz-question__option-circle {
    width: 24px;
    height: 24px;
    border: 2px solid currentColor;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    position: relative;
  }

  .quiz-question__option--selected .quiz-question__option-circle::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background-color: currentColor;
    border-radius: var(--radius-full);
  }

  .quiz-question__option-text {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
  }

  @media (max-width: 640px) {
    .quiz-question__text {
      font-size: var(--font-size-xl);
    }

    .quiz-question__option {
      padding: var(--space-md);
    }

    .quiz-question__option-text {
      font-size: var(--font-size-base);
    }
  }
</style>
