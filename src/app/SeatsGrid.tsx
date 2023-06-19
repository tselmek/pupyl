import React from 'react';
import styles from './page.module.css';
import classNames from 'classnames';
import SeatTile from './SeatTile';

interface SeatGridProps {
  rows: number;
  columns: number;
  selectedSeats: Set<string>;
  onClick: (row: number, column: number) => void;
}

export default function SeatsGrid({rows, columns, selectedSeats, onClick}: SeatGridProps) {
  return (
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
              onClick={() => onClick(rowIndex, columnIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}