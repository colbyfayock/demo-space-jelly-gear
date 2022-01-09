import styles from './Marker.module.scss';

const Marker = ({ onClick }) => {
  return (
    <span className={styles.marker} aria-label="marker" onClick={onClick}>
      📍
    </span>
  );
}

export default Marker;