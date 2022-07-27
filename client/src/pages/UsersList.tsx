import * as React from "react";
import { useGetUsersQuery } from "../features/users/usersApiSlice";
import { Link } from "react-router-dom";

interface IUsersListProps {}

interface IUser {
  username: string;
}

const UsersList: React.FunctionComponent<IUsersListProps> = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
    // @ts-ignore
  } = useGetUsersQuery();

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = (
      <section className="users">
        <h1>Users List</h1>
        <ul>
          {users.map((user: IUser, i: number) => {
            return <li key={i}>{user.username}</li>;
          })}
        </ul>
        <Link to="/protected">Back to Welcome</Link>
      </section>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return <>{content}</>;
};

export default UsersList;
