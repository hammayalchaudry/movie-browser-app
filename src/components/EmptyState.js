import React from 'react';

export const EmptyState = ({ message, icon = '🎬' }) => {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>{icon}</div>
      <h3 style={styles.text}>{message}</h3>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '60px 20px',
    gridColumn: '1 / -1',
    color: '#94a3b8',
    backgroundColor: '#0f172a',
    borderRadius: '12px',
    border: '1px dashed #334155',
  },
  icon: {
    fontSize: '52px',
    marginBottom: '12px',
  },
  text: {
    fontSize: '18px',
    fontWeight: '500',
  },
};
