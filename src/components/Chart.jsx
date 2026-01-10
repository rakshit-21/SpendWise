import React from "react";

export default function Chart() {
  const data = [15000, 10000, 14000, 11000, 16000, 12000, 8000, 14000, 11000, 12000, 23000, 12000];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const width = 800;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - min) / range) * chartHeight;
    return { x, y, value };
  });
  
  const pathD = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
  ).join(' ');
  
  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={padding}
            y1={padding + (i * chartHeight / 4)}
            x2={width - padding}
            y2={padding + (i * chartHeight / 4)}
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="1"
          />
        ))}
        
        <path d={areaD} fill="url(#chartGradient)" />
        
        <path
          d={pathD}
          fill="none"
          stroke="rgb(99, 102, 241)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgb(99, 102, 241)"
            className="hover:r-6 transition-all cursor-pointer"
          />
        ))}
        
        {labels.map((label, index) => (
          <text
            key={index}
            x={padding + (index / (data.length - 1)) * chartWidth}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#666"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}