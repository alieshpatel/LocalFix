import { GoogleLogin } from "@react-oauth/google";

function Login() {

  const handleGoogleLogin = async (credentialResponse) => {

    const res = await fetch("http://localhost:3000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: credentialResponse.credential
      })
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);

    console.log("Logged in:", data);
  };

  return (
    <div>

      <h2>Login</h2>

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.log("Login Failed")}
      />

    </div>
  );
}

export default Login;