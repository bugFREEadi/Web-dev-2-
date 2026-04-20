// Skeleton loader components for better perceived performance
export function CardSkeleton() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton-box" style={{ height: '24px', width: '60%', marginBottom: '16px' }} />
      <div className="skeleton-box" style={{ height: '14px', width: '90%', marginBottom: '8px' }} />
      <div className="skeleton-box" style={{ height: '14px', width: '80%', marginBottom: '24px' }} />
      <div className="skeleton-footer">
        <div className="skeleton-box" style={{ height: '32px', width: '32px', borderRadius: '50%' }} />
        <div className="skeleton-box" style={{ height: '20px', width: '100px' }} />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="stat-card skeleton-card">
      <div className="skeleton-box" style={{ height: '40px', width: '40px', borderRadius: '12px', marginBottom: '12px' }} />
      <div className="skeleton-box" style={{ height: '12px', width: '50%', marginBottom: '8px' }} />
      <div className="skeleton-box" style={{ height: '28px', width: '30%' }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="skeleton-table">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="skeleton-row" style={{ height: '56px', marginBottom: '8px', borderRadius: '8px' }} />
      ))}
    </div>
  );
}
