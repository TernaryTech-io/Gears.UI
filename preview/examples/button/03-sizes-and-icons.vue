<!-- Four sizes. An icon alone makes a square button, which needs an aria-label. -->
<template>
  <div class="vstack gap-3">
    <div class="btn-list align-items-center">
      <TButton size="xs" icon="plus" label="Extra small" />
      <TButton size="sm" icon="plus" label="Small" />
      <TButton icon="plus" label="Medium" />
      <TButton size="lg" icon="plus" label="Large" />
    </div>
    <div class="btn-list align-items-center">
      <TButton icon="player-play" color="success" aria-label="Run" />
      <TButton icon="pencil" color="neutral" variant="outline" aria-label="Edit" />
      <TButton icon="trash" color="error" variant="ghost" aria-label="Delete" />
      <TButton icon="dots-vertical" color="neutral" variant="ghost" size="sm" aria-label="More" />
      <TButton label="Next" trailing-icon="arrow-right" />
      <TButton label="Open the app" trailing-icon="external-link" color="neutral" />
    </div>
  </div>
</template>
