<!-- Initials on a tint when there's no picture. Sizes run from xs to xl. -->
<template>
  <div class="vstack gap-3">
    <div class="d-flex align-items-center gap-2">
      <TAvatar size="xs" text="JD" />
      <TAvatar size="sm" text="JD" />
      <TAvatar text="JD" />
      <TAvatar size="lg" text="JD" />
      <TAvatar size="xl" text="JD" />
    </div>
    <div class="d-flex align-items-center gap-2">
      <TAvatar text="AB" color="success" />
      <TAvatar text="CD" color="warning" />
      <TAvatar text="EF" color="error" />
      <TAvatar icon="user" color="neutral" />
      <TAvatar icon="box" shape="square" />
      <TAvatar src="/gears-logo.png" alt="Gears" shape="square" />
    </div>
    <div class="avatar-list avatar-list-stacked">
      <TAvatar text="JD" />
      <TAvatar text="AB" color="success" />
      <TAvatar text="CD" color="warning" />
      <TAvatar text="+3" color="neutral" />
    </div>
  </div>
</template>
