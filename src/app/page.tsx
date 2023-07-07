"use client";

import styles from './page.module.css'
import { useState } from 'react';
import SeatsGrid from './SeatsGrid';
import { type Constraint, DistanceConstraintData, RowConstraintData, rowConstraintFrom, distanceConstraintFrom } from './Constraint';
import { type InputSeat, generatePlan, Row, Column, Seat, SeatObject } from './algo';
import { PupilCard } from './PupilCard';
import { Dictionary } from 'lodash';

const ROWS = 4;
const COLUMNS = 10;

export default function Home() {

  const [rows, setRows] = useState(ROWS);
  const [columns, setColumns] = useState(COLUMNS);

  const [selectedSeats, setSelectedSeats] = useState<Set<Seat>>(new Set());
  const [rowConstraints, setRowConstraints] = useState<RowConstraintData[]>([]);
  const [distanceConstraints, setDistanceConstraints] = useState<DistanceConstraintData[]>([]);

  const [pupils, setPupils] = useState<string[]>([]);
  const [newPupil, setNewPupil] = useState<string>("");

  const [generatedPlanSeats, setGeneratedPlanSeats] = useState<Dictionary<SeatObject> | undefined>(undefined);

  const handleClick = (row: Row, column: Column) => {
    if (selectedSeats.has(`R${row}C${column}`)) {
      selectedSeats.delete(`R${row}C${column}`);
      setSelectedSeats(new Set(selectedSeats));
    } else {
      setSelectedSeats(new Set(selectedSeats).add(`R${row}C${column}`));
    }
  } 

  const handleGenerate = () => {
    const seats = Array.from(selectedSeats).map(seat => {
      const g = seat.match(/^R(\d+)C(\d+)$/)!;
      return [parseInt(g[1]), parseInt(g[2])] satisfies InputSeat;
    });

    const constraints: Constraint[] = [
      ...rowConstraints.map(({pupil, position}) => rowConstraintFrom(pupil, position)),
      ...distanceConstraints.map(({pupil1, pupil2}) => distanceConstraintFrom(pupil1, pupil2))
    ];

    const [planPupils, planSeats] = generatePlan(pupils, seats, constraints);

    setGeneratedPlanSeats(planSeats);
  }

  const handleAddRow = () => {
    setRows(rows + 1);
  }

  const handleRemoveRow = () => {
    const filteredSet = Array.from(selectedSeats).filter(seat => {
      const g = seat.match(/^R(\d+)C(\d+)$/)!;
      return parseInt(g[1]) < rows - 1;
    });
    setSelectedSeats(new Set(filteredSet));
    setRows(rows - 1);
  }

  const handleAddColumn = () => {
    setColumns(columns + 1);
  }

  const handleRemoveColumn = () => {
    const filteredSet = Array.from(selectedSeats).filter(seat => {
      const g = seat.match(/^R(\d+)C(\d+)$/)!;
      return parseInt(g[2]) < columns - 1;
    });
    setSelectedSeats(new Set(filteredSet));
    setColumns(columns - 1);
  }

  const handleAddRowConstraint = (pupil: string, row: Row) => {
    const existingConstraint = rowConstraints.find(c => c.pupil === pupil);

    if (existingConstraint) {
      setRowConstraints(rowConstraints.map(c => {
        if (c.pupil === pupil) {
          return { ...c, position: row };
        }
        return c;
      }));
    } else {
      setRowConstraints([...rowConstraints, { pupil, position: row }]);
    }
  }

  const handleRemoveRowConstraint = (pupil: string) => {
    setRowConstraints(rowConstraints.filter(c => c.pupil !== pupil));
  }

  const handleAddDistanceConstraint = (pupil: string, otherPupil: string) => {
    const existingConstraint = distanceConstraints.find(c => 
      (c.pupil1 === pupil && c.pupil2 === otherPupil) || (c.pupil1 === otherPupil && c.pupil2 === pupil)  
    );

    if (!existingConstraint) {
      setDistanceConstraints([...distanceConstraints, { pupil1: pupil, pupil2: otherPupil }]);
    }
  }

  const handleRemoveDistanceConstraint = (pupil: string, otherPupil: string) => {
    setDistanceConstraints(distanceConstraints.filter(c => 
      !(c.pupil1 === pupil && c.pupil2 === otherPupil) && !(c.pupil1 === otherPupil && c.pupil2 === pupil)  
    ));
  }

  return (
    <main className={styles.main}>
      <section>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (newPupil.trim() === "") return;
            setPupils([...pupils, newPupil]);
            setNewPupil("");
          }}
          className={styles.newPupilForm}
        >
          <label htmlFor="pupil">Add pupil</label>
          <input id="pupil" value={newPupil} onChange={e => setNewPupil(e.target.value)} type="text" placeholder="Pupil name"/>
          <input type="submit" hidden/>

          <button
            onClick={handleGenerate}
            disabled={pupils.length === 0 || selectedSeats.size === 0}
          >
            Generate plan
          </button>
        </form>

        <div className={styles.pupilContainer}>
          {pupils.map((pupil: string, index: number) => (
            <PupilCard
              key={index}
              pupil={pupil}
              onRemove={() => {
                setPupils(pupils.filter((p, i) => i !== index));
                setRowConstraints(rowConstraints.filter(c => c.pupil !== pupil));
                setDistanceConstraints(distanceConstraints.filter(c => c.pupil1 !== pupil && c.pupil2 !== pupil));
              }}
              rows={rows}
              allPupils={pupils}
              selfRowConstraint={rowConstraints.find(c => c.pupil === pupil)}
              selfDistanceConstraints={distanceConstraints.filter(c => c.pupil1 === pupil || c.pupil2 === pupil)}
              onAddRowConstraint={handleAddRowConstraint}
              onRemoveRowConstraint={handleRemoveRowConstraint}
              onAddDistanceConstraint={handleAddDistanceConstraint}
              onRemoveDistanceConstraint={handleRemoveDistanceConstraint}
            />
          ))}
        </div>
      </section>

      <section>
        <SeatsGrid
          rows={rows}
          columns={columns}
          selectedSeats={selectedSeats}
          planSeats={generatedPlanSeats}
          onClick={handleClick}
          onAddColumn={handleAddColumn}
          onAddRow={handleAddRow}
          onRemoveColumn={handleRemoveColumn}
          onRemoveRow={handleRemoveRow}
        />
      </section>

    </main>
  )
}
