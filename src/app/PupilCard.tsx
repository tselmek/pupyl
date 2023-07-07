import { BsTrashFill } from 'react-icons/bs';
import { ChangeEvent, useState } from 'react';

import styles from './page.module.css';
import { DistanceConstraintData, RowConstraintData, rowConstraintFrom } from './Constraint';
import { on } from 'events';

interface PupilCardProps {
  pupil: string;
  onRemove: () => void;
  allPupils: string[];
  rows: number;
  selfRowConstraint: RowConstraintData | undefined;
  selfDistanceConstraints: DistanceConstraintData[] | undefined;
  onAddRowConstraint: (pupil: string, row: number) => void;
  onRemoveRowConstraint: (pupil: string) => void;
  onAddDistanceConstraint: (pupil: string, otherPupil: string) => void;
  onRemoveDistanceConstraint: (pupil: string, otherPupil: string) => void;
}

export const PupilCard = ({
  pupil,
  onRemove,
  rows,
  allPupils,
  selfDistanceConstraints,
  selfRowConstraint,
  onAddDistanceConstraint,
  onAddRowConstraint,
  onRemoveDistanceConstraint,
  onRemoveRowConstraint
}: PupilCardProps) => {

  const [enableRowConstraint, setEnableRowConstraint] = useState<boolean>(false);
  const [enableDistanceConstraint, setEnableDistanceConstraint] = useState<boolean>(false);
  const [distancePupils, setDistancePupils] = useState<Set<string>>(new Set());

  const handleSelectDistanceOption = (event: ChangeEvent<HTMLSelectElement>) => {
    const { options } = event.target;

    const newDistancePupils = new Set<string>(distancePupils);
    
    for (let i = 0, l = options.length; i < l; i += 1) {
      const otherPupil = options[i].value;

      if (options[i].selected) {
        if (distancePupils.has(otherPupil)) {
          newDistancePupils.delete(otherPupil);
          onRemoveDistanceConstraint(pupil, otherPupil);
        } else {
          newDistancePupils.add(otherPupil);
          onAddDistanceConstraint(pupil, otherPupil);
        }
      }
    }
    setDistancePupils(newDistancePupils);
  };

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

  const handleToggleDistanceConstraint = () => {
    if (selfDistanceConstraints) {
      selfDistanceConstraints.forEach(({pupil1, pupil2}) => {
        onRemoveDistanceConstraint(pupil1, pupil2);
      });
      setDistancePupils(new Set());
    }
    setEnableDistanceConstraint(!enableDistanceConstraint)
  };

  console.log('render', pupil, selfRowConstraint, selfDistanceConstraints);

  return (
    <div className={styles.pupilCard}>
      <div className={styles.pupilLine}>
        <div className={styles.pupilInfos}>
          <span className={styles.pupilName}>{pupil}</span>

          <label htmlFor="row-constraint">Row constraint</label>
          <input type="checkbox" id="row-constraint" checked={enableRowConstraint} onClick={handleToggleRowConstraint}/>

          <label htmlFor="distance-constraint">Distance constraint</label>
          <input type="checkbox" id="distance-constraint" checked={enableDistanceConstraint} onClick={handleToggleDistanceConstraint}/>
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

      {enableDistanceConstraint && (
        <div className={styles.pupilLine}>
          <label htmlFor="distance-constraint">Must be far away from</label>
          <select id="distance-constraint" multiple value={Array.from(distancePupils)} onChange={handleSelectDistanceOption}>
            {allPupils.filter(otherPupil => otherPupil !== pupil).map(otherPupil => (
              <option key={otherPupil} value={otherPupil}>{otherPupil}</option>
            ))} 
          </select> 
          <span>
            {Array.from(distancePupils).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}