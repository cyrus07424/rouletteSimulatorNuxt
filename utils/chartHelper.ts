export function drawBalanceChart(canvas: HTMLCanvasElement, balanceHistory: number[]) {
  if (!canvas || balanceHistory.length < 2) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate chart dimensions
  const padding = 40;
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = canvas.height - 2 * padding;

  // Find min and max values
  const minBalance = Math.min(...balanceHistory);
  const maxBalance = Math.max(...balanceHistory);
  const range = maxBalance - minBalance || 1;

  // Draw grid
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;

  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * chartHeight) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + chartWidth, y);
    ctx.stroke();
  }

  // Vertical grid lines
  for (let i = 0; i <= 10; i++) {
    const x = padding + (i * chartWidth) / 10;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, padding + chartHeight);
    ctx.stroke();
  }

  // Draw balance line
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();

  balanceHistory.forEach((balance, index) => {
    const x = padding + (index / (balanceHistory.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((balance - minBalance) / range) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw y-axis labels
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';

  for (let i = 0; i <= 5; i++) {
    const value = maxBalance - (i * range) / 5;
    const y = padding + (i * chartHeight) / 5;
    ctx.fillText(value.toFixed(0), padding - 10, y + 4);
  }

  // Draw x-axis label
  ctx.textAlign = 'center';
  ctx.fillText('Rounds', padding + chartWidth / 2, canvas.height - 10);

  // Draw title
  ctx.fillStyle = '#374151';
  ctx.font = '14px sans-serif';
  ctx.fillText('Balance Over Time', padding + chartWidth / 2, 25);
}