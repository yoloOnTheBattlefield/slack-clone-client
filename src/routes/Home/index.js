import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const Home = ({ data: { loading, allUsers } }) =>
  (loading ? (
    <div>Loading...</div>
  ) : (
    allUsers.map(u => (
      <div key={u.id}>
        {u.id}
        {u.email}
      </div>
    ))
  ));

const allUsersQuery = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

export default graphql(allUsersQuery)(Home);
