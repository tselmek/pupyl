import { BsTrashFill } from 'react-icons/bs';
import { ChangeEvent, useState } from 'react';

import styles from './page.module.css';
import { DistanceConstraintData, RowConstraintData } from './Constraint';

interface PupilCardProps {
  pupil: string;
  onRemove: () => void;
  allPupils: string[];
  rows: number;
  selfRowConstraint: RowConstraintData | undefined;
  selfDistanceConstraints: DistanceConstraintData[] | undefined;
  onAddRowConstraint: (pupil: string, row: number) => void;
  onRemoveRowConstraint: (pupil: string) => void;
}

export const PupilCard = ({
  pupil,
  onRemove,
  rows,
  allPupils,
  selfDistanceConstraints,
  selfRowConstraint,
  onAddRowConstraint,
  onRemoveRowConstraint
}: PupilCardProps) => {

  const [enableRowConstraint, setEnableRowConstraint] = useState<boolean>(false);

  const handleSelectRowOption = (event: ChangeEvent<HTMLSelectElement>) => {
    const { options } = event.target;

    for (let i = 0, l = options.length; i < l; i += 1) {
      const row = parseInt(options[i].value);

      if (options[i].selected) {
        onAddRowConstraint(pupil, row);
        return;
      }
    }
  };

  const handleToggleRowConstraint = () => {
    if (selfRowConstraint) {
      onRemoveRowConstraint(pupil);
    }
    setEnableRowConstraint(!enableRowConstraint)
  };

  return (
    <div className={styles.pupilCard}>
      <div className={styles.pupilLine}>
        <div className={styles.pupilInfos}>
          <span className={styles.pupilName}>{pupil}</span>

          <label htmlFor="row-constraint">Row constraint</label>
          <input type="checkbox" id="row-constraint" checked={enableRowConstraint} onClick={handleToggleRowConstraint}/>
        </div>
        <div className={styles.pupilActions}>
          <button onClick={onRemove}>
            <BsTrashFill />
          </button>
        </div>
      </div>

      {selfDistanceConstraints && selfDistanceConstraints.length > 0 && (
        <div className={styles.pupilLine}>
          Must be far from: {selfDistanceConstraints.map(constraint => pupil === constraint.pupil1 ? constraint.pupil2 : constraint.pupil1).join(', ')}
        </div>
      )}


      {enableRowConstraint && (
        <div className={styles.pupilLine}>
          <label htmlFor="row-constraint">Must be on row</label>
          <select id="row-constraint" onChange={handleSelectRowOption} value={selfRowConstraint?.position}>
            {Array.from({length: rows}, (_, rowIndex) => (
              <option key={rowIndex} value={rowIndex}>{rowIndex}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}