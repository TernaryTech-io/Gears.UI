<!-- Drag the handle, or focus it and use the arrow keys. -->
<template>
  <div class="preview-frame" style="height: 16rem">
    <TSplitter :default-size="35" class="p-2">
      <template #start>
        <TCard title="Start" class="flex-fill mb-0"><TSkeleton :lines="3" /></TCard>
      </template>
      <template #end>
        <TCard title="End" class="flex-fill mb-0"><TSkeleton :lines="3" /></TCard>
      </template>
    </TSplitter>
  </div>
</template>
