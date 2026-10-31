<!-- Read-only, filling a flush card: `flush` drops the editor's own border. -->
<script setup lang="ts">
const code = `[DbModel("Catalog")]
public partial class Product : DbModel
{
    [Required]
    public string Name { get; set; } = "";

    public decimal Price { get; set; }

    public int Stock { get; set; }
}`
</script>

<template>
  <TCard flush>
    <template #header>
      <h3 class="card-title font-monospace small">Catalog/Product.cs</h3>
    </template>
    <template #actions>
      <span class="small text-secondary">Read-only</span>
    </template>
    <TCodeEditor :model-value="code" language="csharp" read-only flush label="Generated code" style="height: 14rem" />
  </TCard>
</template>
