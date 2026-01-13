export default function StarRating({
  value,
  onRate,
}: {
  value: number;
  onRate: (v: number) => void;
}) {
  return (
    <div style={{ display: "inline-flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRate(v);
          }}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          {v <= value ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}
