import React from 'react';
import {
  Container,
  Form,
  Header,
  Input,
  Button,
  Message
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      errorList: []
    };
  }

  onChange = ({ target }) => this.setState({ [target.name]: target.value });

  onSubmit = async () => {
    this.setState({ usernameError: '', emailError: '', passwordError: '' });
    const { username, email, password } = this.state;
    const response = await this.props.mutate({
      variables: { username, email, password }
    });
    const { ok, errors } = response.data.register;
    if (ok) {
      Object.keys(this.state).map(key => this.setState({ [key]: '' }));
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.setState({ ...err, errorList: errors.map(e => e.message) });
    }
  };

  render() {
    const {
      username,
      usernameError,
      email,
      emailError,
      password,
      passwordError,
      errorList
    } = this.state;

    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Form>
          <Form.Field error={!!usernameError}>
            <Input
              fluid
              onChange={this.onChange}
              name="username"
              value={username}
              placeholder="Username"
            />
          </Form.Field>
          <Form.Field error={!!emailError}>
            <Input
              fluid
              onChange={this.onChange}
              name="email"
              value={email}
              placeholder="Email"
            />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input
              fluid
              onChange={this.onChange}
              name="password"
              value={password}
              placeholder="Password"
              type="password"
            />
          </Form.Field>

          <Button fluid onClick={this.onSubmit}>
            Submit
          </Button>
        </Form>
        {errorList.length ? (
          <Message
            error
            header="There were some errors with your submission"
            list={errorList}
          />
        ) : null}
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerMutation)(Register);
