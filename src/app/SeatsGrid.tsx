import React from 'react';
import styles from './page.module.css';
import classNames from 'classnames';
import SeatTile from './SeatTile';

const noop = () => {};

interface SeatGridProps {
  rows: number;
  columns: number;
  selectedSeats: Set<string>;
  onClick: (row: number, column: number) => void;
  onAddRow?: () => void;
  onRemoveRow?: () => void;
  onAddColumn?: () => void;
  onRemoveColumn?: () => void;
}

export default function SeatsGrid({
  rows,
  columns,
  selectedSeats,
  onClick,
  onAddColumn = noop,
  onAddRow = noop,
  onRemoveColumn = noop,
  onRemoveRow = noop
}: SeatGridProps) {
  return (
    <div className={styles.seatGrid}>

      <div className={styles.blackboardTile}>Blackboard</div>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
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
          <div className={styles.row}>
            {columns > 1 && (
              <button className={styles.addRow} onClick={() => onRemoveRow()}>
                -
              </button> 
            )}
            <button className={styles.addRow} onClick={() => onAddRow()}>
              +
            </button> 
          </div>
        </div>

        <div className={styles.columnButtons}>
          {rows > 1 && (
            <button className={styles.addColumn} onClick={() => onRemoveColumn()}>
              -
            </button>
          )}
          <button className={styles.addColumn} onClick={() => onAddColumn()}>
            +
          </button>
        </div>
      </div>

    </div>
  )
}