import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState<any>();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const userData = await login({ username, password }).unwrap();

      dispatch(setCredentials({ ...userData, username }));
      setUsername("");
      setPassword("");
      navigate("/");
      console.log("logg");
    } catch (err: any) {
      if (!err?.data) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.data.message);
      }
    }
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  return (
    <div>
      {isLoading ? (
        "...Loading"
      ) : (
        <section className="login">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>

          <h1>Employee Login</h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              value={username}
              onChange={handleUserInput}
              autoComplete="off"
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={handlePwdInput}
              value={password}
              required
            />
            <button>Sign In</button>
          </form>
        </section>
      )}
    </div>
  );
};

export default App;
