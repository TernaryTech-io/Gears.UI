<!-- What's missing, why it matters, and the action that fills it. -->
<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TCard>
        <TEmpty icon="box" title="No models yet" description="Models describe your data. Add one to start building the project.">
          <TButton icon="plus" label="New model" />
        </TEmpty>
      </TCard>
    </div>
    <div class="col-md-6">
      <TCard>
        <TEmpty icon="search" title="No matches" description="Nothing matches “invoice”. Try another word.">
          <TButton color="neutral" label="Clear the search" />
        </TEmpty>
      </TCard>
    </div>
  </div>
</template>
