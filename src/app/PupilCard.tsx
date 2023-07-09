import { BsTrashFill } from 'react-icons/bs';

import styles from './page.module.css';
import { DistanceConstraintData, RowConstraintData } from './Constraint';

interface PupilCardProps {
  pupil: string;
  onRemove: () => void;
  selfRowConstraint: RowConstraintData | undefined;
  selfDistanceConstraints: DistanceConstraintData[] | undefined;
}

export const PupilCard = ({
  pupil,
  onRemove,
  selfDistanceConstraints,
  selfRowConstraint
}: PupilCardProps) => {

  return (
    <div className={styles.pupilCard}>
      <div className={styles.pupilLine}>
        <div className={styles.pupilInfos}>
          <span className={styles.pupilName}>{pupil}</span>
        </div>
        <div className={styles.pupilActions}>
          <button onClick={onRemove}>
            <BsTrashFill/>
          </button>
        </div>
      </div>

      {selfDistanceConstraints && selfDistanceConstraints.length > 0 && (
        <span className={styles.pupilLine}>
          Must be far from: {selfDistanceConstraints.map(constraint => pupil === constraint.pupil1 ? constraint.pupil2 : constraint.pupil1).join(', ')}
        </span>
      )}


      {selfRowConstraint && (
        <span className={styles.pupilLine}>
          Must be on row {selfRowConstraint.position}
        </span>
      )}
    </div>
  );
}