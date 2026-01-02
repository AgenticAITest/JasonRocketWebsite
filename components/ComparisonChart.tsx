import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Car } from '../types';

interface ComparisonChartProps {
  car1: Car;
  car2: Car;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ car1, car2 }) => {
  // Normalize data for regular cars
  
  // Speed: 160mph is a good max for normal cars
  const normalizeSpeed = (speed: number) => Math.min((speed / 160) * 100, 100);
  
  // HP: 500hp is a good max for normal cars (Mustang GT is ~460)
  const normalizeHP = (hp: number) => Math.min((hp / 500) * 100, 100);
  
  // Accel: 0-60. 
  // 3s = 100, 10s = 0.
  const normalizeAccel = (sec: number) => {
    // Inverse scale: lower is better
    const minSec = 3; 
    const maxSec = 11; 
    const score = ((maxSec - sec) / (maxSec - minSec)) * 100;
    return Math.max(0, Math.min(score, 100));
  };

  // MPG: Max 60 (for hybrids/phevs/rough EV equivalent scaling)
  const normalizeMPG = (mpg: number = 20) => Math.min((mpg / 60) * 100, 100);

  const data = [
    {
      subject: 'Speed',
      A: normalizeSpeed(car1.specs.topSpeedMph),
      B: normalizeSpeed(car2.specs.topSpeedMph),
      fullMark: 100,
    },
    {
      subject: 'Power',
      A: normalizeHP(car1.specs.horsepower),
      B: normalizeHP(car2.specs.horsepower),
      fullMark: 100,
    },
    {
      subject: 'Accel',
      A: normalizeAccel(car1.specs.zeroToSixty),
      B: normalizeAccel(car2.specs.zeroToSixty),
      fullMark: 100,
    },
    {
      subject: 'Economy',
      A: normalizeMPG(car1.specs.mpgCity),
      B: normalizeMPG(car2.specs.mpgCity),
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full h-[300px] sm:h-[400px] bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" /> {/* Slate 700 */}
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} /> {/* Slate 400 */}
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={car1.model}
            dataKey="A"
            stroke="#b4914b"
            strokeWidth={2}
            fill="#b4914b"
            fillOpacity={0.4}
          />
          <Radar
            name={car2.model}
            dataKey="B"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="#0ea5e9"
            fillOpacity={0.4}
          />
          <Legend wrapperStyle={{ color: '#94a3b8' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;