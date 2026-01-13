import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import PublishPage from "./pages/PublishPage";
import FavoritesPage from "./pages/FavoritesPage";
import StoryDetailsPage from "./pages/StoryDetailsPage";

import { useAuth } from "./context/AuthContext";

import MyStoriesPage from "./pages/MyStoriesPage";

import EditStoryPage from "./pages/EditStoryPage";

import "./App.css";



function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <FeedPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/publish"
          element={
            <PrivateRoute>
              <PublishPage />
            </PrivateRoute>
          }
        />

        <Route
  path="/favorites"
  element={
    <PrivateRoute>
      <FavoritesPage />
    </PrivateRoute>
  }
/>

<Route
  path="/stories/:storyId"
  element={
    <PrivateRoute>
      <StoryDetailsPage />
    </PrivateRoute>
  }
/>
<Route
  path="/my-stories"
  element={
    <PrivateRoute>
      <MyStoriesPage />
    </PrivateRoute>
  }
/>

<Route
  path="/stories/:storyId/edit"
  element={
    <PrivateRoute>
      <EditStoryPage />
    </PrivateRoute>
  }
/>


        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
