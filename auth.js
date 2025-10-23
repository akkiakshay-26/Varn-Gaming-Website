// ===== SIGNUP =====
const signupForm = document.querySelector("#signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();
    const confirmPassword = document.querySelector("#confirmPassword").value.trim();

    // Frontend validation
    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.status === 200) {
        window.location.href = "/login.html"; // redirect to login after signup
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  });
}

// ===== LOGIN =====
const loginForm = document.querySelector("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.status === 200) {
        window.location.href = "/dashboard/dashboard.html"; // redirect after login
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  });
}
