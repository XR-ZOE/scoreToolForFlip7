import { useState } from 'react';

interface AddScoreFormProps {
  round: number;
  playerName: string;
  onScoreAdd: (score: number) => void;
}

export function AddScoreForm({ round, playerName, onScoreAdd }: AddScoreFormProps) {
  const [score, setScore] = useState('');

  // Calculator State
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [selectedModifiers, setSelectedModifiers] = useState<Set<number>>(new Set());
  const [hasMultiplier, setHasMultiplier] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreValue = parseInt(score, 10);
    if (!isNaN(scoreValue)) {
      onScoreAdd(scoreValue);
      setScore('');
      clearCalculator();
      setShowCalculator(false);
    }
  };

  const clearCalculator = () => {
    setSelectedNumbers(new Set());
    setSelectedModifiers(new Set());
    setHasMultiplier(false);
  };

  const calculateAndSetScore = (nums: Set<number>, mods: Set<number>, mult: boolean) => {
    let numSum = 0;
    nums.forEach(n => numSum += n);

    let modSum = 0;
    mods.forEach(m => modSum += m);

    const total = (numSum * (mult ? 2 : 1)) + modSum;

    if (nums.size === 0 && mods.size === 0 && !mult) {
      setScore('');
    } else {
      setScore(total.toString());
    }
  };

  const toggleNumber = (num: number) => {
    const newSet = new Set(selectedNumbers);
    if (newSet.has(num)) {
      newSet.delete(num);
    } else {
      newSet.add(num);
    }
    setSelectedNumbers(newSet);
    calculateAndSetScore(newSet, selectedModifiers, hasMultiplier);
  };

  const toggleModifier = (mod: number) => {
    const newSet = new Set(selectedModifiers);
    if (newSet.has(mod)) {
      newSet.delete(mod);
    } else {
      newSet.add(mod);
    }
    setSelectedModifiers(newSet);
    calculateAndSetScore(selectedNumbers, newSet, hasMultiplier);
  };

  const toggleMultiplier = () => {
    const newVal = !hasMultiplier;
    setHasMultiplier(newVal);
    calculateAndSetScore(selectedNumbers, selectedModifiers, newVal);
  };

  const handleManualInput = (val: string) => {
    setScore(val);
    if (selectedNumbers.size > 0 || selectedModifiers.size > 0 || hasMultiplier) {
      setSelectedNumbers(new Set());
      setSelectedModifiers(new Set());
      setHasMultiplier(false);
    }
  };

  const btnStyle = (isSelected: boolean, color: string = '#646cff') => ({
    padding: '8px 4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    backgroundColor: isSelected ? color : '#f0f0f0',
    color: isSelected ? 'white' : '#333',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontWeight: isSelected ? 'bold' : 'normal',
    transition: 'all 0.2s'
  });

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>{playerName}, Round {round}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'nowrap', marginBottom: '15px' }}>
        <input
          type="number"
          value={score}
          onChange={(e) => handleManualInput(e.target.value)}
          placeholder="Score"
          required
          style={{ width: '110px', padding: '8px', fontSize: '1.2rem', textAlign: 'center' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add</button>
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <div
          onClick={() => setShowCalculator(!showCalculator)}
          style={{
            fontSize: '0.9rem',
            color: '#666',
            marginBottom: '10px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            userSelect: 'none'
          }}
        >
          <span style={{ fontSize: '0.8rem', display: 'inline-block', transform: showCalculator ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>▼</span>
          <span>Card Calculator</span>
        </div>

        {showCalculator && (
          <>
            {/* Numbers 1-12 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                <div
                  key={num}
                  onClick={() => toggleNumber(num)}
                  style={btnStyle(selectedNumbers.has(num))}
                >
                  {num}
                </div>
              ))}
            </div>

            {/* Modifiers & Multiplier */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[2, 4, 6, 8, 10].map(mod => (
                <div
                  key={`mod-${mod}`}
                  onClick={() => toggleModifier(mod)}
                  style={btnStyle(selectedModifiers.has(mod), '#ff6b6b')} // Red-ish for modifiers
                >
                  +{mod}
                </div>
              ))}
              <div
                onClick={toggleMultiplier}
                style={btnStyle(hasMultiplier, '#ffd700')} // Gold for x2. Note: text color might need adjustment
              >
                <span style={{ color: hasMultiplier ? 'black' : '#333' }}>x2</span>
              </div>
            </div>

            {(selectedNumbers.size > 0 || selectedModifiers.size > 0 || hasMultiplier) && (
              <div
                onClick={clearCalculator}
                style={{
                  marginTop: '10px',
                  fontSize: '0.8rem',
                  color: '#888',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Clear Selections
              </div>
            )}
          </>
        )}
      </div>
    </form>
  );
}