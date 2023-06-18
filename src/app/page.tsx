"use client";

import Image from 'next/image'
import styles from './page.module.css'
import SeatTile from './SeatTile';
import { useState } from 'react';

const ROWS = 4;
const COLUMNS = 10;

export default function Home() {

  const [rows, setRows] = useState(ROWS);
  const [columns, setColumns] = useState(COLUMNS);

  const [selectedSeats, setSelectedSeats] = useState(new Set());

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
      <div>
        <label htmlFor="rows">Rows</label>
        <input
          id="rows"
          type="number"
          value={rows}
          onChange={e => setRows(parseInt(e.target.value))}
        />

        <label htmlFor="columns">Columns</label>
        <input
          id="columns"
          type="number"
          value={columns}
          onChange={e => setColumns(parseInt(e.target.value))}
        />
      </div>

      <span>
        selectedSeats: {Array.from(selectedSeats).join(', ')}
      </span>

      <div className={styles.seatGrid}>
        <div className={styles.blackboardTile}>Blackboard</div>
        {Array.from({length: rows}, (_, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {Array.from({length: columns}, (_, columnIndex) => (
              <SeatTile
                key={columnIndex}
                row={rowIndex}
                column={columnIndex}
                selected={selectedSeats.has(`${rowIndex}-${columnIndex}`)}
                onClick={() => handleClick(rowIndex, columnIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  )
}
