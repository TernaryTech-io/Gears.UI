<!-- `trend` shows the change in percent beside the value, green when it's good (up, unless `trend-good` is down) and red when it isn't. `sparkline` draws recent values under it, as a line or bars. -->
<template>
  <div class="row row-cards">
    <div class="col-sm-6 col-lg-3">
      <TStatCard label="Revenue" value="$48.2k" :trend="12.4" trend-label="vs last month" :sparkline="[31, 40, 28, 51, 42, 60, 72]" />
    </div>
    <div class="col-sm-6 col-lg-3">
      <TStatCard label="Open cases" :value="128" :trend="-8" trend-good="down" trend-label="vs last week" icon="lifebuoy" color="info" />
    </div>
    <div class="col-sm-6 col-lg-3">
      <TStatCard label="Errors" :value="17" :trend="23" trend-good="down" trend-label="vs yesterday" color="error"
        :sparkline="[3, 5, 2, 8, 6, 12, 17]" sparkline-type="bar" />
    </div>
    <div class="col-sm-6 col-lg-3">
      <TStatCard label="Response time" value="1.8 h" :trend="0" trend-label="No change" icon="clock" color="success" />
    </div>
  </div>
</template>
