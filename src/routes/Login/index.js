import React from 'react';
import {
  Container,
  Message,
  Header,
  Form,
  Input,
  Button
} from 'semantic-ui-react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Login extends React.Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      email: '',
      password: '',
      errors: {}
    });
  }

  onChange = ({ target: { name, value } }) => {
    this[name] = value;
  };
  onSubmit = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({
      variables: { email, password }
    });
    const { ok, refreshToken, token, errors } = response.data.login;
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.errors = { ...err };
      console.log(errors);
      // this.errorList = errors.map(e => e.message);
    }
  };
  render() {
    const { email, password, errors: { emailError, passwordError } } = this;
    const errorList = [];
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }
    return (
      <Container text>
        <Header as="h2">Login</Header>
        <Form>
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
          <Button fluid color="green" onClick={this.onSubmit}>
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

const LoginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(LoginMutation)(observer(Login));
