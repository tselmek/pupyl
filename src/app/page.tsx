"use client";

import Image from 'next/image'
import styles from './page.module.css'
import { useState } from 'react';
import SeatsGrid from './SeatsGrid';
import { distanceConstraintFrom, type Constraint, rowConstraintFrom } from './Constraint';
import AddRowConstraintForm from './AddRowConstraintForm';
import { PythonScript } from './PythonScript';

const ROWS = 4;
const COLUMNS = 10;

export default function Home() {

  const [rows, setRows] = useState(ROWS);
  const [columns, setColumns] = useState(COLUMNS);

  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [pupils, setPupils] = useState<string[]>([]);

  const handleClick = (row: number, column: number) => {
    if (selectedSeats.has(`${row}-${column}`)) {
      selectedSeats.delete(`${row}-${column}`);
      setSelectedSeats(new Set(selectedSeats));
    } else {
      setSelectedSeats(new Set(selectedSeats).add(`${row}-${column}`));
    }
  } 

  return (
    <main className={styles.main}>
      <span>
        selectedSeats: {Array.from(selectedSeats).join(', ')}
      </span>

      <div>
        <label htmlFor="pupils">Pupils</label>
        <textarea id="pupils" onChange={e => setPupils(e.target.value.split(','))} />
      </div>

      <span>
        pupils: {pupils.join(', ')}
      </span>

      <section>
        <SeatsGrid
          rows={rows}
          columns={columns}
          selectedSeats={selectedSeats}
          onClick={handleClick}
          onAddColumn={() => setColumns(columns + 1)}
          onAddRow={() => setRows(rows + 1)}
          onRemoveColumn={() => setColumns(columns - 1)}
          onRemoveRow={() => setRows(rows - 1)}
        />
      </section>

      <div>
        <label htmlFor="pupil1">Pupil 1</label>
        <select id="pupil1">
          {pupils.map(pupil => (
            <option key={pupil} value={pupil}>{pupil}</option>
          ))} 
        </select> 
        
        <label htmlFor="pupil2">Pupil 2</label>
        <select id="pupil2">
          {pupils.map(pupil => (
            <option key={pupil} value={pupil}>{pupil}</option>
          ))} 
        </select> 

        <button
          onClick={() => {
            setConstraints([
              ...constraints,
              distanceConstraintFrom("pupil1", "pupil2"),
            ])
          }
        }>
          Add distance constraint
        </button>
      </div>

      <AddRowConstraintForm
        pupils={pupils}
        rows={rows}
        onClick={(pupil) => {
          setConstraints([
            ...constraints,
            rowConstraintFrom(pupil, 0),
          ])
        }} 
      />

      <div>
        <h2>Constraints</h2>
        <ul>
          {constraints.map((constraint, index) => (
            <li key={index}>
              {constraint.type}
            </li>
          ))}
        </ul>
      </div>

    </main>
  )
}
