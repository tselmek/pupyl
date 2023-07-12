import React from 'react';
import {BiArrowFromLeft, BiArrowFromTop, BiArrowToLeft, BiArrowToTop} from 'react-icons/bi';

import styles from './page.module.css';

import SeatTile from './SeatTile';
import { Seat, SeatObject } from './algo';
import { Dictionary, range } from 'lodash';
import Image from 'next/image';


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

      <Image src="/icons8-pushpin.png" alt="Pushpin" width={50} height={50} className={styles.pushpinLeft}/>
      <Image src="/icons8-pushpin.png" alt="Pushpin" width={50} height={50} className={styles.pushpinRight}/>

      <div className={styles.blackboardTile}>Blackboard</div>

      <div className={styles.gridContainer}>
        <div className={styles.columnButtons}>
          {range(1, rows + 1).map((row) => (
            <div key={row} className={styles.row}>
              <Indicator content={row} />
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          <div className={styles.row}>
            {range(1, columns + 1).map((column) => (
              <Indicator key={column} content={column} />
            ))}
          </div>

          {range(1, rows + 1).map((row) => (
            <div key={row} className={styles.row}>
              {range(1, columns + 1).map((column) => (
                <SeatTile
                  key={column}
                  row={row}
                  column={column}
                  selected={selectedSeats.has(`R${row}C${column}`)}
                  pupil={planSeats?.[`R${row}C${column}`]?.pupil?.name}
                  onClick={() => onClick(row, column)}
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