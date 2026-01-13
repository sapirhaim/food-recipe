// ליצור כפתור לב

export default function FavoriteButton({
  isFavorite,
  onToggle,
}: {
  isFavorite: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button" // ✅ קריטי: שלא יהיה submit
      onClick={(e) => {
        e.preventDefault();   // ✅ לא נותן לדפדפן להתערב
        e.stopPropagation(); // ✅ עוצר את הקליק שלא יגיע ל-li
        onToggle();
      }}
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: 20,
      }}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
}
