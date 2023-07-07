import React from 'react';
import {BiArrowFromLeft, BiArrowFromTop, BiArrowToLeft, BiArrowToRight, BiArrowToTop} from 'react-icons/bi';

import styles from './page.module.css';

import SeatTile from './SeatTile';
import { Seat, SeatObject } from './algo';
import { Dictionary } from 'lodash';


const noop = () => {};

interface SeatGridProps {
  rows: number;
  columns: number;
  selectedSeats: Set<Seat>;
  onClick: (row: number, column: number) => void;
  onAddRow?: () => void;
  onRemoveRow?: () => void;
  onAddColumn?: () => void;
  onRemoveColumn?: () => void;
  planSeats?: Dictionary<SeatObject>;
}

export default function SeatsGrid({
  rows,
  columns,
  selectedSeats,
  onClick,
  onAddColumn = noop,
  onAddRow = noop,
  onRemoveColumn = noop,
  onRemoveRow = noop,
  planSeats
}: SeatGridProps) {
  return (
    <div className={styles.seatGrid}>

      <div className={styles.blackboardTile}>Blackboard</div>

      <div className={styles.gridContainer}>
        <div className={styles.columnButtons}>
          {Array.from({length: rows}, (_, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              <Indicator content={rowIndex} />
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          <div className={styles.row}>
            {Array.from({length: columns}, (_, columnIndex) => (
              <Indicator key={columnIndex} content={columnIndex} />
            ))}
          </div>

          {Array.from({length: rows}, (_, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {Array.from({length: columns}, (_, columnIndex) => (
                <SeatTile
                  key={columnIndex}
                  row={rowIndex}
                  column={columnIndex}
                  selected={selectedSeats.has(`R${rowIndex}C${columnIndex}`)}
                  pupil={planSeats?.[`R${rowIndex}C${columnIndex}`]?.pupil?.name}
                  onClick={() => onClick(rowIndex, columnIndex)}
                />
              ))}
            </div>
          ))}

          <div className={styles.row}>
            {rows > 1 && (
              <button className={styles.addRow} onClick={() => onRemoveRow()}>
                <BiArrowToTop />
              </button> 
            )}
            <button className={styles.addRow} onClick={() => onAddRow()}>
              <BiArrowFromTop />
            </button> 
          </div>
        </div>

        <div className={styles.columnButtons}>
          {columns > 1 && (
            <button className={styles.addColumn} onClick={() => onRemoveColumn()}>
              <BiArrowToLeft />
            </button>
          )}
          <button className={styles.addColumn} onClick={() => onAddColumn()}>
            <BiArrowFromLeft />
          </button>
        </div>
      </div>

    </div>
  )
}

const Indicator = ({content}: {content: number | string}) => (
  <div className={styles.indicator}>{content}</div>
);