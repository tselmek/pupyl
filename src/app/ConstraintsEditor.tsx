import styles from "./page.module.css";

import { DistanceConstraintData } from "./Constraint";

interface ConstraintsEditorProps {
  pupils: string[];
  distanceConstraints: DistanceConstraintData[];
  onAddConstraint: (pupil1: string, pupil2: string) => void;
  onRemoveConstraint: (pupil1: string, pupil2: string) => void;
}

export const ConstraintsEditor = ({
  pupils,
  distanceConstraints,
  onAddConstraint,
  onRemoveConstraint
}: ConstraintsEditorProps) => {
  return (
    <table className={styles.constraintsEditor}>
      <thead>
        <tr>
          <th scope="col"/>
          {[...pupils].reverse().slice(0, -1).map((pupil, index) => (
            <th key={index} scope="col">{pupil}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {pupils.slice(0, -1).map((pupil1, index1) => (
          <tr key={index1}>
            <th scope="row">{pupil1}</th>
            {[...pupils].reverse().slice(0, -1).map((pupil2, index2) => (
              <td key={index2}>
                {pupils.length - index1 - 1 > index2 && (
                  <input
                    type="checkbox"
                    checked={!!distanceConstraints.find(c => c.pupil1 === pupil1 && c.pupil2 === pupil2)}
                    onChange={e => {
                      if (e.target.checked) {
                        onAddConstraint(pupil1, pupil2);
                      } else {
                        onRemoveConstraint(pupil1, pupil2);
                      }
                    }}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}