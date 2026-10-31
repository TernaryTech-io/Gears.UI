<!-- A build run's status, as the Studio's History section shows it. -->
<template>
  <div class="d-flex flex-wrap gap-2">
    <TBadge color="neutral" icon="clock" label="Queued" />
    <TBadge color="info" icon="loader-2" label="Running" />
    <TBadge color="success" icon="check" label="Succeeded" />
    <TBadge color="error" icon="x" label="Failed" />
    <TBadge color="warning" icon="alert-triangle" label="Check-ins failing" />
    <TBadge color="primary" variant="solid" label="Owner" />
  </div>
</template>
