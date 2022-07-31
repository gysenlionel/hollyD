import * as React from "react";
import { Link } from "react-router-dom";
interface IPublicProps {}

const Public: React.FunctionComponent<IPublicProps> = (props) => {
  return (
    <section className="public">
      <main>home</main>
      <footer>
        <Link to="/login">Login</Link>
      </footer>
    </section>
  );
};

export default Public;
