<!-- A page's header (pretitle, title, description, actions) and body. `narrow` suits forms, `wide` uses the whole width; `fill` and `flush` take the height left. -->
<template>
  <div class="preview-frame">
    <TPage pretitle="Online Shop" title="Environments" description="Each environment has its own database and app.">
      <template #actions>
        <TButton color="neutral" icon="refresh" label="Refresh" />
        <TButton icon="plus" label="New environment" />
      </template>
      <div class="row row-cards">
        <div class="col-md-6"><TCard title="Development"><TSkeleton :lines="2" /></TCard></div>
        <div class="col-md-6"><TCard title="Production"><TSkeleton :lines="2" /></TCard></div>
      </div>
    </TPage>
  </div>
</template>
