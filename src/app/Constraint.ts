
export interface RowConstraintData {
  pupil: string;
  position: number;
}

export interface RowConstraint {
  type: "row";
  data: RowConstraintData;
}

export interface DistanceConstraintData {
  pupil1: string;
  pupil2: string;
}

export interface DistanceConstraint {
  type: "distance";
  data: DistanceConstraintData;
}

export type Constraint = RowConstraint | DistanceConstraint;

export const rowConstraintFrom = (pupil: string, position: number): RowConstraint => ({
  type: "row",
  data: {
    pupil,
    position,
  },
});

export const distanceConstraintFrom = (pupil1: string, pupil2: string): DistanceConstraint => ({
  type: "distance",
  data: {
    pupil1,
    pupil2,
  },
});
