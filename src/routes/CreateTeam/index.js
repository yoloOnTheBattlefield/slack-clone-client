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

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      name: '',
      errors: {}
    });
  }

  onChange = ({ target: { name, value } }) => {
    this[name] = value;
  };
  onSubmit = async () => {
    const { name } = this;
    const response = await this.props.mutate({
      variables: { name }
    });
    const { ok, errors } = response.data.createTeam;
    if (ok) {
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.errors = { ...err };
    }
  };
  render() {
    const { name, errors: { nameError } } = this;
    const errorList = [];
    if (nameError) {
      errorList.push(nameError);
    }
    return (
      <Container text>
        <Header as="h2">Create team</Header>
        <Form>
          <Form.Field error={!!nameError}>
            <Input
              fluid
              onChange={this.onChange}
              name="name"
              value={name}
              placeholder="Team name"
            />
          </Form.Field>

          <Button fluid onClick={this.onSubmit}>
            Create team
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

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
