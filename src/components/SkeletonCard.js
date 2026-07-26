import React from 'react';

export const SkeletonCard = () => {
  return (
    <div style={styles.card}>
      <div style={styles.posterPlaceholder}></div>
      <div style={styles.content}>
        <div style={styles.titleLine}></div>
        <div style={styles.subLine}></div>
        <div style={styles.btnLine}></div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
  },
  posterPlaceholder: {
    height: '320px',
    backgroundColor: '#334155',
    opacity: 0.6,
  },
  content: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  titleLine: { height: '18px', backgroundColor: '#334155', borderRadius: '6px', width: '85%' },
  subLine: { height: '14px', backgroundColor: '#334155', borderRadius: '4px', width: '45%' },
  btnLine: { height: '36px', backgroundColor: '#334155', borderRadius: '8px', marginTop: '10px' },
};
