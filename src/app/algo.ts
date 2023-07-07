import { Constraint, DistanceConstraint, RowConstraint } from "./Constraint";
import { Dictionary, keyBy, last, range, remove, sample, sampleSize, sortBy, sumBy } from "lodash";

type Name = string;
type Pupil = Name;

export type Id = number;
export type Row = number;
export type Column = number;

type PupilObject = {
  id: Id,
  name: Name,
  seat: SeatObject | null,
};

export type InputSeat = [Row, Column];
export type Seat = `R${Row}C${Column}`;

export type SeatObject = {
  id: Seat,
  row: Row,
  column: Column,
  pupil: PupilObject | null,
};

function parsePupils(pupils: Pupil[]): Dictionary<PupilObject> {
  const parsedPupils: PupilObject[] = pupils.map((pupil: Pupil, index: number) => (
    {
      id: index,
      name: pupil,
      seat: null
    } satisfies PupilObject
  ));

  return keyBy(parsedPupils, "id");
}

function parseSeats(seats: InputSeat[]): Dictionary<SeatObject> {
  const parsedSeats: SeatObject[] = seats.map((seat: InputSeat) => (
    {
      id: `R${seat[0]}C${seat[1]}`,
      row: seat[0],
      column: seat[1],
      pupil: null,
    } satisfies SeatObject
  ));

  return keyBy(parsedSeats, "id");
}


type ParsedRowConstraint = {
  type: "row",
  pupil: PupilObject | undefined,
  position: Row,
};

const parseRowConstraint = (
  constraint: RowConstraint,
  pupils: Dictionary<PupilObject>
): ParsedRowConstraint => {
  const pupilName: Name = constraint.data.pupil;
  const seatPosition: Row = constraint.data.position;

  const pupil: PupilObject | undefined = Object.values(pupils).find(
    (pupil: PupilObject) => pupil.name === pupilName
  );

  return {
    type: "row",
    pupil,
    position: seatPosition,
  };
}

type ParsedDistanceConstraint = {
  type: "distance",
  pupil1: PupilObject | undefined,
  pupil2: PupilObject | undefined,
};

const parseDistanceConstraint = (
  constraint: DistanceConstraint,
  pupils: Dictionary<PupilObject>
): ParsedDistanceConstraint => {
  const pupil1Name: string = constraint.data.pupil1;
  const pupil2Name: string = constraint.data.pupil2;

  const pupil1: PupilObject | undefined = Object.values(pupils).find(
    (pupil: PupilObject) => pupil.name === pupil1Name
  );

  const pupil2: PupilObject | undefined = Object.values(pupils).find(
    (pupil: PupilObject) => pupil.name === pupil2Name
  );

  return {
    type: "distance",
    pupil1,
    pupil2,
  };
}

type ParsedConstraint = ParsedRowConstraint | ParsedDistanceConstraint;

const parseConstraints = (
  constraints: Constraint[],
  pupils: Dictionary<PupilObject>
): ParsedConstraint[] => {
  const parsedConstraints = constraints.map(constraint => {
    switch (constraint.type) {
      case "row":
        return parseRowConstraint(constraint, pupils);
      case "distance":
        return parseDistanceConstraint(constraint, pupils);
      default: 
        throw new Error("Unknown constraint type");
    }
  });

  return parsedConstraints;
}

const link = (pupil: PupilObject, seat: SeatObject) => {
  pupil.seat = seat;
  seat.pupil = pupil;
}

const swap = (pupil1: PupilObject, pupil2: PupilObject) => {
  const seat1 = pupil1.seat;
  const seat2 = pupil2.seat;

  if (seat1 === null || seat2 === null) {
    throw new Error("Cannot swap pupils without seats");
  }

  link(pupil1, seat2);
  link(pupil2, seat1);
}

const seatDistance = (seat1: SeatObject, seat2: SeatObject): number => {
  const rowDistance = Math.abs(seat1.row - seat2.row);
  const columnDistance = Math.abs(seat1.column - seat2.column);

  return rowDistance + columnDistance;
}

const buildFirstSolution = (
  constraints: ParsedConstraint[],
  pupils: Dictionary<PupilObject>,
  seats: Dictionary<SeatObject>
): [Dictionary<PupilObject>, Dictionary<SeatObject>] => {
  const rowConstraints = constraints.filter(constraint => constraint.type === "row") as ParsedRowConstraint[];

  rowConstraints.forEach((constraint: ParsedRowConstraint) => {
    const pupil = constraint.pupil;
    const seatRow = constraint.position;

    if (pupil === undefined) {
      throw new Error(`Pupil not found on constraint ${constraint}`);
    }

    if (pupil.seat !== null) { // Pupil already has a seat
      return;
    }

    const possibleSeats = Object.values(seats).filter(seat => seat.row === seatRow && seat.pupil === null);

    if (possibleSeats.length === 0) {
      throw new Error(`No possible seats for pupil ${pupil.name} on row ${seatRow}`);
    }

    const seat = sample(possibleSeats)!;

    link(pupil, seat);
  });

  const distanceConstraints = constraints.filter(constraint => constraint.type === "distance") as ParsedDistanceConstraint[];
  const freeSeats = Object.values(seats).filter(seat => seat.pupil === null);

  distanceConstraints.forEach((constraint: ParsedDistanceConstraint) => {
    const pupil1 = constraint.pupil1;
    const pupil2 = constraint.pupil2;

    if (pupil1 === undefined || pupil2 === undefined) {
      throw new Error(`Pupil not found on constraint ${constraint}`);
    }

    // Both pupils are not seated: can't apply distance constraint
    if (!pupil1.seat && !pupil2.seat) {
      return;
    }

    // Pupil 1 is seated, pupil 2 is not: place pupil 2 based on distance
    if (pupil1.seat && !pupil2.seat) {
      const seat1 = pupil1.seat;
      const seat2 = sortBy(freeSeats, (seat: SeatObject) => seatDistance(seat1, seat))[0];

      if (seat2 === undefined) {
        throw new Error(`No free seat found for pupil ${pupil2.name}`);
      }

      remove(freeSeats, seat2);
      link(pupil2, seat2);
    }

    // Pupil 2 is seated, pupil 1 is not: place pupil 1 based on distance
    if (!pupil1.seat && pupil2.seat) {
      const seat2 = pupil2.seat;
      const seat1 = sortBy(freeSeats, (seat: SeatObject) => seatDistance(seat2, seat))[0];

      if (seat1 === undefined) {
        throw new Error(`No free seat found for pupil ${pupil1.name}`);
      }
      
      remove(freeSeats, seat1);
      link(pupil1, seat1);
    }

    // Both pupils are seated: do nothing
    if (pupil1.seat && pupil2.seat) {
      return;
    }
  });

  // For all non seated pupils, place them randomly
  const nonSeatedPupils = Object.values(pupils).filter(pupil => pupil.seat === null);
  nonSeatedPupils.forEach((pupil: PupilObject) => {
    const seat = sample(freeSeats)!;

    remove(freeSeats, seat);
    link(pupil, seat);
  });

  return [pupils, seats]
}

const evaluateConstraint = (constraint: ParsedConstraint): number => {
  switch (constraint.type) {
    case "row":
      return 20 * +(constraint.pupil!.seat!.row === constraint.position);
    case "distance":
      return 3 * seatDistance(constraint.pupil1!.seat!, constraint.pupil2!.seat!);
    default:
      throw new Error("Unknown constraint type");
  }
}

type Variation = [PupilObject, PupilObject, number];

const generateVariation = (
  constraints: ParsedConstraint[],
  pupils: Dictionary<PupilObject>,
): Variation => {
  const [pupil1, pupil2] = sampleSize(Object.values(pupils), 2);

  swap(pupil1, pupil2);

  const score = sumBy(constraints, evaluateConstraint);

  swap(pupil1, pupil2);

  return [pupil1, pupil2, score];
}

const ITERATIONS = 20;
const VARIATIONS = 300;

const testVariations = (
  constraints: ParsedConstraint[],
  pupils: Dictionary<PupilObject>
): void => {
  for (let i = 0; i < ITERATIONS; i++) {
    const variations: Variation[] = range(VARIATIONS).map(() => generateVariation(constraints, pupils));
    const [pupil1, pupil2, score]: Variation = last(sortBy(variations, ([pupil1, pupil2, score]) => score))!;

    console.log("Best variation", pupil1, pupil2, score);

    swap(pupil1, pupil2);
  }
}


export const generatePlan = (
  inputPupils: Pupil[],
  inputSeats: InputSeat[],
  inputConstraints: Constraint[]
): [Dictionary<PupilObject>, Dictionary<SeatObject>] => {
  const pupils = parsePupils(inputPupils);
  const seats = parseSeats(inputSeats);
  const constraints = parseConstraints(inputConstraints, pupils);

  console.log("Pupils", pupils);
  console.log("Seats", seats);
  console.log("Constraints", constraints);

  buildFirstSolution(constraints, pupils, seats);

  console.log("Pupils", pupils);
  console.log("Seats", seats);

  testVariations(constraints, pupils);

  return [pupils, seats];
}
