import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    autoLogin();
  }, []);

  const autoLogin = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);

    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      window.location.reload();

    } catch {
      alert("Invalid Login");
    }
  };

  const registerUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/register",
        { name, email, password }
      );

      alert("Registered Successfully. Verify email first.");
      setIsLogin(true);

    } catch {
      alert("Registration Failed");
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (loading) return <h1 style={styles.loading}>Loading...</h1>;

  // LOGIN / REGISTER PAGE
  if (!data) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBox}>
          <h1>AI Student Platform 💀</h1>

          {!isLogin && (
            <input
              style={styles.input}
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isLogin ? (
            <button style={styles.button} onClick={loginUser}>
              Login
            </button>
          ) : (
            <button style={styles.button} onClick={registerUser}>
              Register
            </button>
          )}

          <p
            style={styles.switchText}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "New user? Register"
              : "Already have account? Login"}
          </p>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <h2>🚀 ASP</h2>

        <p style={styles.menu} onClick={() => setActivePage("dashboard")}>🏠 Dashboard</p>

        <p style={styles.menu} onClick={() => setActivePage("profile")}>👤 Profile</p>

        <p style={styles.menu} onClick={() => setActivePage("analytics")}>📊 Analytics</p>
        <button style={styles.logout} onClick={logoutUser}>
          Logout
        </button>
      </div>

      <div style={styles.main}>

        {activePage === "dashboard" && (
          <>
            <div style={styles.hero}>
              <h1>{data.welcomeMessage}</h1>
              <p>Your coding dashboard</p>
            </div>

            <div style={styles.grid}>
              <div style={styles.card}>
                <h3>🔥 LeetCode</h3>
                <p>{data.liveStats.leetcode.totalSolved}</p>
              </div>

              <div style={styles.card}>
                <h3>⚔️ Codeforces</h3>
                <p>{data.liveStats.codeforces.rating}</p>
              </div>
            </div>
          </>
        )}

        {activePage === "profile" && (
          <div style={styles.card}>
            <h2>👤 Profile</h2>
            <p>Name: {data.profile.name}</p>
            <p>Email: {data.profile.email}</p>
            <p>Verified: {data.profile.verified ? "Yes" : "No"}</p>
          </div>
        )}

        {activePage === "analytics" && (
          <div style={styles.card}>
            <h2>📊 Analytics</h2>
            <p>LeetCode Solved: {data.liveStats.leetcode.totalSolved}</p>
            <p>Codeforces Rating: {data.liveStats.codeforces.rating}</p>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  loginBox: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "330px",
    color: "white",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#38bdf8",
    fontWeight: "bold",
    cursor: "pointer",
  },

  switchText: {
    cursor: "pointer",
    color: "#38bdf8",
    textAlign: "center",
  },

  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "230px",
    background: "#111827",
    padding: "25px",
  },

  menu: {
    background: "#1f2937",
    padding: "10px",
    borderRadius: "10px",
    marginTop: "10px",
  },

  logout: {
    marginTop: "20px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "30px",
  },

  hero: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  },

  loading: {
    color: "white",
    padding: "40px",
    background: "#0f172a",
    minHeight: "100vh",
  },
};

export default App;