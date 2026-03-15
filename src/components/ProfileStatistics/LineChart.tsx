export interface ChartDataPoint {
    label: string;
    value: number;
}

interface LineChartProps {
    data: ChartDataPoint[];
    title: string;
}

const W = 460;
const H = 330;
const PAD = { top: 24, right: 16, bottom: 40, left: 44 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

const LineChart = ({ data, title }: LineChartProps) => {
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

    const getX = (i: number) =>
        PAD.left + (data.length > 1 ? (i / (data.length - 1)) * INNER_W : INNER_W / 2);
    const getY = (v: number) => PAD.top + INNER_H - (v / maxVal) * INNER_H;

    const polylinePoints = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');

    return (
        <div className="chart-wrapper" data-testid="line-chart">
            <p className="chart-title">{title}</p>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="line-chart"
                role="img"
                aria-label={`Line chart: ${title}`}
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
                    <text
                        key={i}
                        x={getX(i)}
                        y={H - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fill="var(--text-secondary)"
                    >
                        {d.label}
                    </text>
                ))}

                <polyline
                    points={polylinePoints}
                    fill="none"
                    stroke="var(--surface-1s)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {data.map((d, i) => {
                    const isLast = i === data.length - 1;
                    return (
                        <>
                            <circle
                                key={i}
                                cx={getX(i)}
                                cy={getY(d.value)}
                                r={isLast ? 5 : 3}
                                fill={isLast ? 'var(--white, #fff)' : 'none'}
                                stroke={isLast ? 'var(--surface-1)' : 'none'}
                                strokeWidth={isLast ? 2 : 0}
                                data-testid="chart-point"
                            />
                            {isLast && (
                                <circle
                                    key={i + 'out'}
                                    cx={getX(i)}
                                    cy={getY(d.value)}
                                    r={22}
                                    fill="var(--text-primary)"
                                    opacity={0.08}
                                />
                            )}
                        </>
                    );
                })}
            </svg>
        </div>
    );
};

export default LineChart;
