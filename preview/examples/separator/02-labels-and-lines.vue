<!-- A label at the start, center or end; the line's color (the border color by default), style and thickness. -->
<template>
  <div>
    <TSeparator label="Start" position="start" />
    <TSeparator label="Center" />
    <TSeparator label="End" position="end" />
    <TSeparator label="Primary, dashed" color="primary" variant="dashed" />
    <TSeparator color="success" variant="dotted" :thickness="3" />
    <TSeparator color="#d63939" :thickness="2" spacing="none" />
  </div>
</template>
