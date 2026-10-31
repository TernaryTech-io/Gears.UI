<!-- The icon follows the color. Say what happened, then what to do about it. -->
<template>
  <div class="vstack gap-2">
    <TAlert color="info" title="Building" description="The project builds in the background; this takes a minute or two." />
    <TAlert color="success" title="Saved" description="The model was saved and the database is up to date." />
    <TAlert color="warning" title="Check-ins failing" description="The license server can't be reached. Gears keeps working for 14 days." />
    <TAlert color="error" title="Couldn't build" description="Product.cs has an error on line 12. Fix it in the code view, then build again." />
  </div>
</template>
