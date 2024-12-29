import React from 'react';
import { Form, ButtonToolbar, Button, Input } from 'rsuite';
import './Form.css'; // Import the CSS file
 

const FormComponent = () => (
  <div className="form-container">
    <h2>Login</h2>
    <Form>
      <Form.Group controlId="name" className="form-group">
        <Form.ControlLabel>Username</Form.ControlLabel>
        <Form.Control name="name" />
        <Form.HelpText>Username is required</Form.HelpText>
      </Form.Group>
      <Form.Group controlId="email" className="form-group">
        <Form.ControlLabel>Email</Form.ControlLabel>
        <Form.Control name="email" type="email" />
        <Form.HelpText tooltip>Email is required</Form.HelpText>
      </Form.Group>
      <Form.Group controlId="password" className="form-group">
        <Form.ControlLabel>Password</Form.ControlLabel>
        <Form.Control name="password" type="password" autoComplete="off" />
      </Form.Group>
     
      <Form.Group>
        <ButtonToolbar className="button-toolbar">
          <Button appearance="primary">Submit</Button>
          <Button appearance="default">Cancel</Button>
        </ButtonToolbar>
      </Form.Group>
    </Form>
  </div>
);

export default FormComponent;
