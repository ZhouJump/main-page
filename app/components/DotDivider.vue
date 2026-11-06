<template>
  <div class="flex items-center gap-3" aria-hidden="true">
    <span class="h-px flex-1 bg-paper/10" />
    <span class="flex items-center gap-1.5">
      <span v-for="index in 5" :key="index" class="size-1 rounded-full bg-paper/25" />
    </span>
    <span class="h-px flex-1 bg-paper/10" />
  </div>
</template>
