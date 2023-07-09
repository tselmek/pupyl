import React from 'react';
import styles from './page.module.css';
import classNames from 'classnames';
import { MdTableRestaurant } from 'react-icons/md';

interface SeatTileProps {
  row: number;
  column: number;
  selected?: boolean;
  onClick?: () => void;
  pupil?: string;
}

export default function SeatTile({row, column, selected, onClick, pupil}: SeatTileProps) {
  return (
    <div
      className={classNames([styles.seatTile, selected && styles.selectedSeatTile])}
      onClick={onClick}
    >
      {selected
        ? !pupil
          ? <MdTableRestaurant size={24}/>
          : pupil
        : ''
      }
    </div>
  )
}