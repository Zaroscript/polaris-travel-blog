import { useRef, useState, FormEvent } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";

const AccountSettings: React.FC = () => {
 
  const [validatedAccountSettings, setValidatedAccountSettings] = useState<boolean>(false);
  const [validatedChangePassword, setValidatedChangePassword] = useState<boolean>(false);
  
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
  const [passwordError, setPasswordError] = useState<string>("");

  const handleAccountSettingsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation();
    }
    setValidatedAccountSettings(true);
  };

 
  const handleChangePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation();
    }
    setValidatedChangePassword(true);
  };

  const handleConfirmPasswordChange = () => {
    if (
      confirmPasswordRef.current?.value !== passwordRef.current?.value
    ) {
      setPasswordError("Passwords do not match!");
    } else {
      setPasswordError("");
    }
  };

  return (
    <>
     
      <Form noValidate validated={validatedAccountSettings} onSubmit={handleAccountSettingsSubmit} className="w-100 m-auto  p-1 p-lg-3">
        <h2 className="mb-3 fw-bold fs-3">Account Settings</h2>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima, at nobis autem Sed, impedit.</p>
        <Row className="mb-3 p-1 p-lg-3 w-100">
          <Form.Group as={Col} md="4" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control required type="text" placeholder="First Name" defaultValue="Sam" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control required type="text" placeholder="Last Name" defaultValue="Lanson" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="additionalName">
            <Form.Label>Additional Name</Form.Label>
            <Form.Control type="text" placeholder="Additional Name" />
          </Form.Group>
        </Row>
        <Row className="mb-3 p-1 p-lg-3 w-100">
          <Form.Group as={Col} md="6" controlId="username">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text>@</InputGroup.Text>
              <Form.Control type="text" placeholder="Username" required defaultValue="samlanson" />
              <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="birthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control type="date" required />
            <Form.Control.Feedback type="invalid">Please provide a valid date.</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3 p-1 p-lg-3 w-100">
          <Form.Group as={Col} md="6" controlId="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="tel" placeholder="(678) 324-1251" required />
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="sam@webestica.com" required />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3 w-100 p-1 p-lg-3">
          <Form.Label>Overview</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Description (Required)" required maxLength={300} />
          <Form.Text>Character limit: 300</Form.Text>
        </Form.Group>
        <Button type="submit">Save Changes</Button>
      </Form>

     
      <Form noValidate validated={validatedChangePassword} onSubmit={handleChangePasswordSubmit} className="w-100 m-auto  p-1 p-lg-3">
        <h2 className="mb-3 fw-bold fs-3">Change Your Password</h2>
        <p>Update your password for security reasons.</p>

        <Row className="mb-3 p-1 p-lg-3">
          <Form.Group as={Col} md="12" controlId="currentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" />
          </Form.Group>
        </Row>
        <Row className="mb-3 p-1 p-lg-3">
          <Form.Group as={Col} md="12" controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <InputGroup>
              <Form.Control type="password" ref={passwordRef} required />
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3 p-1 p-lg-3">
          <Form.Group as={Col} md="12" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" ref={confirmPasswordRef} onChange={handleConfirmPasswordChange} required />
            {passwordError && <p className="text-danger mt-2">{passwordError}</p>}
          </Form.Group>
        </Row>
        <Button type="submit">Update Password</Button>
      </Form>
    </>
  );
};

export default AccountSettings;