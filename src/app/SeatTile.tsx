import React from 'react';
import styles from './page.module.css';
import classNames from 'classnames';

interface SeatTileProps {
  row: number;
  column: number;
  selected?: boolean;
  onClick?: () => void;
}

export default function SeatTile({row, column, selected, onClick}: SeatTileProps) {
  return (
    <div
      className={classNames([styles.seatTile, selected && styles.selectedSeatTile])}
      onClick={onClick}
    >
      {selected ? '🧒' : ''}
    </div>
  )
}