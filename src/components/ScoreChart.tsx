import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import type { Player } from '../types';

interface ScoreChartProps {
    players: Player[];
    currentPlayerName?: string | null;
}

export function ScoreChart({ players, currentPlayerName }: ScoreChartProps) {
    if (players.length === 0) return null;

    // Transform data: Simple array of { name, score }
    const data = players.map(p => ({
        name: p.name,
        score: p.totalScore
    }));

    // Sort data: highest score first
    data.sort((a, b) => b.score - a.score);

    return (
        <div className="card" style={{ height: '400px', marginTop: '20px' }}>
            <h3>Total Score Ranking</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 20, right: 80, left: 20, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" horizontal={false} />
                    <XAxis type="number" stroke="#555" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#000"
                        width={100}
                        tick={{ fontSize: 14, fontWeight: 'bold' }}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        contentStyle={{ backgroundColor: '#FFF', border: '2px solid #000', color: '#000', borderRadius: '8px' }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={30}>
                        <LabelList dataKey="score" position="right" fill="#000" fontSize={14} fontWeight="bold" />
                        {
                            data.map((entry, index) => {
                                const isCurrentPlayer = entry.name === currentPlayerName;
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={isCurrentPlayer ? '#F4D03F' : '#34495E'}
                                        stroke={isCurrentPlayer ? '#000' : 'none'}
                                        strokeWidth={2}
                                    />
                                );
                            })
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
