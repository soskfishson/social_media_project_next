export interface ChartDataPoint {
    label: string;
    value: number;
}

interface BarChartProps {
    data: ChartDataPoint[];
    title: string;
}

const W = 460;
const H = 330;
const PAD = { top: 24, right: 16, bottom: 40, left: 44 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;
const BAR_GAP = 0.3;

const BarChart = ({ data, title }: BarChartProps) => {
    if (data.length === 0) {
        return (
            <div className="chart-wrapper">
                <p className="chart-title">{title}</p>
                <p className="chart-empty">No data available</p>
            </div>
        );
    }

    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const yTicks = 5;
    const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
        Math.round((maxVal / yTicks) * i),
    );

    const barWidth = (INNER_W / data.length) * (1 - BAR_GAP);
    const barSpacing = INNER_W / data.length;

    const getBarX = (i: number) => PAD.left + i * barSpacing + (barSpacing - barWidth) / 2;
    const getBarHeight = (v: number) => (v / maxVal) * INNER_H;
    const getBarY = (v: number) => PAD.top + INNER_H - getBarHeight(v);
    const getY = (v: number) => PAD.top + INNER_H - (v / maxVal) * INNER_H;

    return (
        <div className="chart-wrapper" data-testid="bar-chart">
            <p className="chart-title">{title}</p>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="bar-chart"
                role="img"
                aria-label={`Bar chart: ${title}`}
            >
                {yTickValues.map((tick, i) => (
                    <g key={i}>
                        <line
                            x1={PAD.left}
                            y1={getY(tick)}
                            x2={W - PAD.right}
                            y2={getY(tick)}
                            stroke="var(--surface-3)"
                            strokeWidth="1"
                        />
                        <text
                            x={PAD.left - 8}
                            y={getY(tick) + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="var(--text-secondary)"
                        >
                            {tick}
                        </text>
                    </g>
                ))}

                {data.map((d, i) => (
                    <g key={i}>
                        <rect
                            x={getBarX(i)}
                            y={getBarY(d.value)}
                            width={barWidth}
                            height={getBarHeight(d.value)}
                            fill="var(--surface-3)"
                            rx="2"
                            data-testid="chart-bar"
                        />
                        <text
                            x={getBarX(i) + barWidth / 2}
                            y={H - 8}
                            textAnchor="middle"
                            fontSize="9"
                            fill="var(--text-secondary)"
                        >
                            {d.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default BarChart;
