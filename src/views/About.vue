<template>
  <div class="about">
    <div class="about__container">
      <h1 class="about__title">{{ $t("about.title") }}</h1>

      <section class="about__section">
        <h2 class="about__section-title">
          <BookOpen :size="24" />
          {{ $t("about.methodology") }}
        </h2>
        <p class="about__text">{{ $t("about.methodologyText") }}</p>
      </section>

      <section class="about__section">
        <h2 class="about__section-title">
          <Lock :size="24" />
          {{ $t("about.privacy") }}
        </h2>
        <p class="about__text">{{ $t("about.privacyText") }}</p>
      </section>

      <section class="about__section">
        <h2 class="about__section-title">
          <Users :size="24" />
          {{ $t("about.parties") }}
        </h2>
        <p class="about__text">{{ $t("about.partiesText") }}</p>

        <div class="about__parties">
          <div v-for="party in parties" :key="party.id" class="about__party">
            <span
              class="about__party-badge"
              :style="{ backgroundColor: party.colour }"
            >
              {{ party.short }}
            </span>
            <span class="about__party-name">{{ party.name }}</span>
          </div>
        </div>
      </section>

      <section class="about__section">
        <h2 class="about__section-title">
          <AlertCircle :size="24" />
          {{ $t("about.disclaimer") }}
        </h2>
        <p class="about__text">{{ $t("about.disclaimerText") }}</p>
      </section>

      <section class="about__section">
        <h2 class="about__section-title">
          <FileText :size="24" />
          {{ $t("about.dataSources") }}
        </h2>
        <p class="about__text">{{ $t("about.dataSourcesText") }}</p>
      </section>

      <div class="about__actions">
        <router-link to="/" class="about__button">
          <Home :size="20" />
          {{ $t("nav.home") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    AlertCircle,
    BookOpen,
    FileText,
    Home,
    Lock,
    Users,
  } from "lucide-vue-next";
  import { useQuizStore } from "../stores/quizStore";

  const quizStore = useQuizStore();
  const parties = quizStore.parties;
</script>

<style scoped>
  .about {
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
    padding: var(--space-xl);
  }

  .about__container {
    max-width: var(--max-width-md);
    margin: 0 auto;
  }

  .about__title {
    text-align: center;
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-3xl);
  }

  .about__section {
    margin-bottom: var(--space-3xl);
    padding: var(--space-xl);
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .about__section-title {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-lg);
  }

  .about__text {
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    color: var(--color-text-secondary);
  }

  .about__parties {
    margin-top: var(--space-lg);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-md);
  }

  .about__party {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background-color: var(--color-background);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-light);
  }

  .about__party-badge {
    display: inline-block;
    padding: var(--space-xs) var(--space-sm);
    color: white;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    border-radius: var(--radius-sm);
    white-space: nowrap;
  }

  .about__party-name {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
  }

  .about__actions {
    display: flex;
    justify-content: center;
    margin-top: var(--space-2xl);
  }

  .about__button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-xl);
    background-color: var(--color-primary);
    color: white;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .about__button:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 640px) {
    .about {
      padding: var(--space-lg);
    }

    .about__title {
      font-size: var(--font-size-3xl);
    }

    .about__section {
      padding: var(--space-lg);
    }

    .about__section-title {
      font-size: var(--font-size-xl);
    }

    .about__parties {
      grid-template-columns: 1fr;
    }
  }
</style>
