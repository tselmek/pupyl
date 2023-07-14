import { BsTrashFill } from 'react-icons/bs';

import styles from './page.module.css';
import { DistanceConstraintData, RowConstraintData } from './Constraint';
import { PupilObject } from './algo';
import { RiLayoutColumnFill, RiLayoutRowFill } from 'react-icons/ri';

interface PupilCardProps {
  pupil: string;
  pupilObject: PupilObject | undefined;
  onRemove: () => void;
  selfRowConstraint: RowConstraintData | undefined;
  selfDistanceConstraints: DistanceConstraintData[] | undefined;
}

export const PupilCard = ({
  pupil,
  pupilObject,
  onRemove,
  selfDistanceConstraints,
  selfRowConstraint
}: PupilCardProps) => {

  return (
    <div className={styles.pupilCard}>
      <div className={styles.pupilLine}>
        <div className={styles.pupilInfos}>
          <span className={styles.pupilName}>{pupil}</span>
          {pupilObject?.seat && (
            <span className={styles.pupilSeat}>
              <RiLayoutRowFill/> {pupilObject.seat.row} - <RiLayoutColumnFill/> {pupilObject.seat.column}
            </span>
          )}
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