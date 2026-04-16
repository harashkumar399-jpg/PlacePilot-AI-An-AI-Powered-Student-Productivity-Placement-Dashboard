import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = prompt("Paste Login Token");
        localStorage.setItem("token", token);
      }

      const response = await axios.get(
        "http://localhost:5000/api/users/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);

    } catch (error) {
      localStorage.removeItem("token");
      alert("Login again");
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (loading) return <h1 style={styles.loading}>Loading...</h1>;
  if (!data) return <h1 style={styles.loading}>Login Again</h1>;

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <h1>AI Student Platform</h1>
        <button style={styles.button} onClick={logoutUser}>
          Logout
        </button>
      </div>

      <div style={styles.hero}>
        <h2>{data.welcomeMessage}</h2>
        <p>Track all coding progress in one place 🚀</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>👤 Profile</h3>
          <p>Name: {data.profile.name}</p>
          <p>Email: {data.profile.email}</p>
        </div>

        <div style={styles.card}>
          <h3>🔥 LeetCode</h3>
          <p>Total Solved: {data.liveStats.leetcode.totalSolved}</p>
          <p>Easy: {data.liveStats.leetcode.easySolved}</p>
          <p>Medium: {data.liveStats.leetcode.mediumSolved}</p>
          <p>Hard: {data.liveStats.leetcode.hardSolved}</p>
        </div>

        <div style={styles.card}>
          <h3>⚔️ Codeforces</h3>
          <p>Rating: {data.liveStats.codeforces.rating}</p>
          <p>Rank: {data.liveStats.codeforces.rank}</p>
        </div>

        <div style={styles.card}>
          <h3>🍛 CodeChef</h3>
          <p>
            {data.liveStats.codechef?.message ||
              data.liveStats.codechef?.error}
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "30px",
    fontFamily: "Arial",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  hero: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  },

  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#38bdf8",
    fontWeight: "bold",
  },

  loading: {
    color: "white",
    background: "#0f172a",
    minHeight: "100vh",
    padding: "40px",
  },
};

export default App;