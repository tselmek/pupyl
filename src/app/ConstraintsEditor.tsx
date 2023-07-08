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
    <table>
      <thead>
        <tr>
          <th scope="col"></th>
          {pupils.map((pupil, index) => (
            <th key={index} scope="col">{pupil}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {pupils.map((pupil1, index1) => (
          <tr key={index1}>
            <th scope="row">{pupil1}</th>
            {pupils.map((pupil2, index2) => (
              <td key={index2}>
                {index1 < index2 && (
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