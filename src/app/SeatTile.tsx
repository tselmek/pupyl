import React, { useState } from 'react';
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

const computeTileContent = (selected: boolean, pupil: string | undefined, hovered: boolean) => {
  const displayIcon = !pupil && (selected || hovered);

  if (displayIcon) {
    return <MdTableRestaurant size={24}/>
  } 

  const displayName = pupil && selected;
  
  if (displayName) {
    return pupil;
  }

  return '';
}

export default function SeatTile({row, column, selected, onClick, pupil}: SeatTileProps) {
  const [hovered, setHovered] = useState(false);
  const tileContent = computeTileContent(!!selected, pupil, hovered);

  return (
    <div
      className={classNames([styles.seatTile, selected && styles.selectedSeatTile])}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tileContent}
    </div>
  )
}