export default function SkeletonLoader({ lines = 3, className = '' }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton--text${i === 0 ? ' skeleton--title' : ''}`}
          style={i === lines - 1 ? { width: '40%' } : undefined}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return <div className="skeleton skeleton--card" />;
}
