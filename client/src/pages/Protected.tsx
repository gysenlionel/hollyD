import * as React from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import { Link } from "react-router-dom";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const welcome = user ? `Welcome ${user}!` : `Welcome !`;
  const tokenAbbr = `${token.slice(0, 9)}...`;
  return (
    <section>
      <div>Welcome</div>
      <p>{welcome}</p>
      <p>Token: {tokenAbbr}</p>
      <p>
        <Link to="/userslist">Go to the Users List</Link>
      </p>
    </section>
  );
};

export default App;
