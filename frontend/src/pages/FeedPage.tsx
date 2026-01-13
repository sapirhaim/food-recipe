import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchStories } from "../api/stories";
import type { Story } from "../api/stories";

import StarRating from "../components/StarRating";
import FavoriteButton from "../components/FavoriteButton";

import { rateStory } from "../api/ratings";
import { fetchMyFavorites, toggleFavorite } from "../api/favorites";

import { useAuth } from "../context/AuthContext";

export default function FeedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [myRatings, setMyRatings] = useState<Record<string, number>>({});

  // ✅ Search + Filter states
  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<"new" | "top">("new");

  const params = useMemo(() => ({ q, cuisine, minRating, sort }), [q, cuisine, minRating, sort]);

  useEffect(() => {
    const t = setTimeout(() => {
      (async () => {
        setLoading(true);

        const data = await fetchStories(params);
        setStories(data);

        try {
          const favs = await fetchMyFavorites();
          const ids = new Set<string>((favs ?? []).map((s: any) => String(s._id)));
          setFavoriteIds(ids);
        } catch {}

        setLoading(false);
      })();
    }, 300); // debounce קטן כדי לא לירות מלא בקשות תוך כדי הקלדה

    return () => clearTimeout(t);
  }, [params]);

 return (
  <div className="page">
    {/* Header */}
    <header className="feedHeader">
      <div className="brand">
        <div className="brandMark" />
        <div>
          <div className="brandTitle">Food Stories</div>
          <div className="brandSub">Share, save & rate your favorite recipes</div>
        </div>
      </div>

      <div className="headerActions">
        {user ? (
          <>
            <div className="userPill" title={user.email}>
              <div className="avatar">{user.name?.slice(0, 1).toUpperCase()}</div>
              <div className="userText">
                <div className="userName">Hi, {user.name}</div>
                <div className="userHint">Welcome back</div>
              </div>
            </div>
            <button className="btn btnOutline" onClick={logout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </header>

    {/* Filters */}
    <section className="filtersCard">
      <div className="filtersGrid">
        <label className="field">
          <span className="label">Search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="title / body / cuisine..."
            className="input"
          />
        </label>

        <label className="field">
          <span className="label">Cuisine</span>
          <input
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="e.g. Italian"
            className="input"
          />
        </label>

        <label className="field">
          <span className="label">Min rating</span>
          <select
            value={String(minRating)}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="select"
          >
            <option value="0">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5</option>
          </select>
        </label>

        <label className="field">
          <span className="label">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="select">
            <option value="new">Newest</option>
            <option value="top">Top rated</option>
          </select>
        </label>

        <div className="field fieldActions">
          <span className="label">&nbsp;</span>
          <button
            className="btn btnGhost"
            onClick={() => {
              setQ("");
              setCuisine("");
              setMinRating(0);
              setSort("new");
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </section>

    {/* Loading */}
    {loading ? (
      <div className="skeletonList">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="storyCard skeletonCard">
            <div className="skeletonCover" />
            <div className="skeletonLine w60" />
            <div className="skeletonLine w90" />
            <div className="skeletonLine w80" />
          </div>
        ))}
      </div>
    ) : null}

    {/* Stories */}
    <ul className="storiesList">
      {stories.map((s) => {
        const cover = s.images?.[0]?.url;

        return (
          <li key={s._id} className="storyCard" onClick={() => navigate(`/stories/${s._id}`)}>
            {/* Cover */}
            {cover ? (
              <img
                src={cover}
                alt={s.title}
                className="storyCover"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="storyCover placeholder" />
            )}

            {/* Top row */}
            <div className="storyTop">
              <div className="storyTitleWrap">
                <h3 className="storyTitle">{s.title}</h3>
                <p className="storyExcerpt">{(s.body ?? "").slice(0, 140)}...</p>
              </div>

              <div
                className="storyFav"
                onClick={(e) => {
                  // שלא ינווט לעמוד הסיפור אם לוחצים על לב
                  e.stopPropagation();
                }}
              >
                <FavoriteButton
                  isFavorite={favoriteIds.has(s._id)}
                  onToggle={async () => {
                    try {
                      await toggleFavorite(s._id);
                      setFavoriteIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(s._id)) next.delete(s._id);
                        else next.add(s._id);
                        return next;
                      });
                    } catch (e: any) {
                      alert(e?.response?.data?.message || e.message || "Favorite failed");
                    }
                  }}
                />
              </div>
            </div>

            {/* Bottom row */}
            <div className="storyBottom">
              <div className="metaPill">
                Avg ⭐ <b>{s.ratingAvg ?? 0}</b> <span className="muted">({s.ratingCount ?? 0})</span>
              </div>

              <div
                onClick={(e) => {
                  // שלא ינווט לעמוד הסיפור כשמדורגים
                  e.stopPropagation();
                }}
              >
                <StarRating
                  value={myRatings[s._id] ?? 0}
                  onRate={async (v) => {
                    try {
                      const rating = Math.min(5, Math.max(1, v));
                      setMyRatings((prev) => ({ ...prev, [s._id]: rating }));
                      const res = await rateStory(s._id, rating);
                      setStories((prev) =>
                        prev.map((x) =>
                          x._id === s._id
                            ? { ...x, ratingAvg: res.ratingAvg ?? x.ratingAvg, ratingCount: res.ratingCount ?? x.ratingCount }
                            : x
                        )
                      );
                    } catch (e: any) {
                      alert(e?.response?.data?.message || e.message || "Rate failed");
                      setMyRatings((prev) => {
                        const copy = { ...prev };
                        delete copy[s._id];
                        return copy;
                      });
                    }
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);
}
