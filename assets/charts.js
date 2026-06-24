(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var success = style.getPropertyValue('--success').trim();

  // --- Chart 1: Token Growth Trend ---
  var chart1 = echarts.init(document.getElementById('chart-token-growth'), null, { renderer: 'svg' });
  chart1.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      formatter: function(params) {
        var p = params[0];
        return p.name + '<br/>日均Token调用量: <strong>' + p.value + '</strong>';
      }
    },
    grid: { top: 40, right: 30, bottom: 50, left: 70 },
    xAxis: {
      type: 'category',
      data: ['2024.06', '2024.12', '2025.06', '2025.12', '2026.06'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      name: '日均Token（万亿）',
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLabel: { color: muted, fontSize: 12 }
    },
    series: [{
      type: 'line',
      data: [0.18, 4, 18, 90, 180],
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: accent, width: 3 },
      itemStyle: { color: accent },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: accent + '33' },
            { offset: 1, color: accent + '05' }
          ]
        }
      },
      label: {
        show: true,
        position: 'top',
        color: ink,
        fontSize: 12,
        fontWeight: 600,
        formatter: function(params) {
          if (params.value >= 100) return params.value + '万亿';
          if (params.value >= 10) return params.value + '万亿';
          return params.value + '万亿';
        }
      },
      markPoint: {
        symbol: 'pin',
        symbolSize: 50,
        data: [{ name: '千倍增长', value: '180万亿', xAxis: 4, yAxis: 180 }],
        itemStyle: { color: accent2 },
        label: { color: '#fff', fontSize: 10 }
      }
    }]
  });
  window.addEventListener('resize', function() { chart1.resize(); });

  // --- Chart 2: Industry Penetration ---
  var chart2 = echarts.init(document.getElementById('chart-industry-penetration'), null, { renderer: 'svg' });
  chart2.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var p = params[0];
        return p.name + '<br/>头部企业接入率: <strong>' + p.value + '%</strong>';
      }
    },
    grid: { top: 30, right: 30, bottom: 40, left: 100 },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLabel: { color: muted, fontSize: 12, formatter: '{value}%' }
    },
    yAxis: {
      type: 'category',
      data: ['大型银行', '主流车企', '头部手机厂商'],
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      axisLabel: { color: ink, fontSize: 13, fontWeight: 600 }
    },
    series: [{
      type: 'bar',
      data: [
        { value: 70, itemStyle: { color: success } },
        { value: 80, itemStyle: { color: accent2 } },
        { value: 90, itemStyle: { color: accent } }
      ],
      barWidth: 32,
      label: {
        show: true,
        position: 'right',
        color: ink,
        fontSize: 13,
        fontWeight: 600,
        formatter: '{c}%'
      },
      itemStyle: { borderRadius: [0, 6, 6, 0] }
    }]
  });
  window.addEventListener('resize', function() { chart2.resize(); });

  // --- Chart 3: Cost Comparison ---
  var chart3 = echarts.init(document.getElementById('chart-cost-comparison'), null, { renderer: 'svg' });
  chart3.setOption({
    animation: false,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var html = params[0].name + '<br/>';
        params.forEach(function(p) {
          html += p.marker + p.seriesName + ': <strong>' + p.value + ' 元</strong><br/>';
        });
        return html;
      }
    },
    legend: {
      data: ['输入价格', '输出价格', '缓存命中'],
      top: 0,
      right: 0,
      textStyle: { color: muted, fontSize: 12 }
    },
    grid: { top: 40, right: 30, bottom: 40, left: 60 },
    xAxis: {
      type: 'category',
      data: ['豆包 2.1 Turbo', '豆包 2.1 Pro', 'Claude Opus 4.6'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 11, interval: 0 }
    },
    yAxis: {
      type: 'value',
      name: '元 / 百万Token',
      nameTextStyle: { color: muted, fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLabel: { color: muted, fontSize: 12 }
    },
    series: [
      {
        name: '输入价格',
        type: 'bar',
        data: [3, 6, 30],
        barWidth: 20,
        itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] }
      },
      {
        name: '输出价格',
        type: 'bar',
        data: [15, 30, 150],
        barWidth: 20,
        itemStyle: { color: accent2, borderRadius: [4, 4, 0, 0] }
      },
      {
        name: '缓存命中',
        type: 'bar',
        data: [0.6, 1.2, 6],
        barWidth: 20,
        itemStyle: { color: success, borderRadius: [4, 4, 0, 0] }
      }
    ]
  });
  window.addEventListener('resize', function() { chart3.resize(); });

})();
