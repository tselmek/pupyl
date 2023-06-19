import { useState } from "react";

interface AddConstraintFormProps {
  pupils: string[];
  rows: number;
  onClick: (pupil: string) => void;
}

export default function AddRowConstraintForm({pupils, rows, onClick}: AddConstraintFormProps) {

  const [selectedPupil, setSelectedPupil] = useState<string>('');

  return (
    <form>
      <label htmlFor="pupil">Pupil</label>
      <select id="pupil" onChange={(e) => setSelectedPupil(e.target.value)}>
        {pupils.map(pupil => (
          <option key={pupil} value={pupil}>{pupil}</option>
        ))} 
      </select> 
      
      <label htmlFor="position">Position</label>
      <select id="position">
        {Array.from({length: rows}, (_, rowIndex) => rowIndex).map((row: number) => (
          <option key={row} value={row}>{row}</option>
        ))} 
      </select> 

      <button
        onClick={() => onClick(selectedPupil)}
      >
        Add row constraint
      </button>
    </form>
  );
}