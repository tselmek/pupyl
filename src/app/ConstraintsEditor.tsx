import styles from "./page.module.css";

import { DistanceConstraintData, RowConstraintData } from "./Constraint";

interface ConstraintsEditorProps {
  pupils: string[];
  availableRows: number[];
  distanceConstraints: DistanceConstraintData[];
  rowConstraints: RowConstraintData[];
  onAddDistanceConstraint: (pupil1: string, pupil2: string) => void;
  onRemoveDistanceConstraint: (pupil1: string, pupil2: string) => void;
  onAddRowConstraint: (pupil: string, position: number) => void;
  onRemoveRowConstraint: (pupil: string, position: number) => void;
}

export const ConstraintsEditor = ({
  pupils,
  availableRows,
  rowConstraints,
  distanceConstraints,
  onAddDistanceConstraint,
  onRemoveDistanceConstraint,
  onAddRowConstraint,
  onRemoveRowConstraint
}: ConstraintsEditorProps) => {
  return (
    <table className={styles.constraintsEditor}>
      <thead>
        <tr>
          <th scope="col"/>
          <th scope="col">Row</th>
          {[...pupils].reverse().slice(0, -1).map((pupil, index) => (
            <th key={index} scope="col">{pupil}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {pupils.map((pupil1, index1) => (
          <tr key={index1}>
            <th scope="row">{pupil1}</th>
            <td>
              <select
                value={rowConstraints.find(c => c.pupil === pupil1)?.position ?? ''}
                onChange={e => {
                  const position = parseInt(e.target.value);
                  if (isNaN(position)) {
                    onRemoveRowConstraint(pupil1, position);
                  } else {
                    onAddRowConstraint(pupil1, position);
                  }
                }}
              >
                <option value={undefined}></option>
                {availableRows.map((row: number) => (
                  <option key={row} value={row}>{row}</option>
                ))}
              </select>
            </td>
            {[...pupils].reverse().slice(0, -1).map((pupil2, index2) => (
              <td key={index2}>
                {pupils.length - index1 - 1 > index2 && (
                  <input
                    type="checkbox"
                    checked={!!distanceConstraints.find(c => c.pupil1 === pupil1 && c.pupil2 === pupil2)}
                    onChange={e => {
                      if (e.target.checked) {
                        onAddDistanceConstraint(pupil1, pupil2);
                      } else {
                        onRemoveDistanceConstraint(pupil1, pupil2);
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