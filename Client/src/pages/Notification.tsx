import React from "react";
import { Form, Container, Card, Button } from "react-bootstrap";

interface NotificationItem {
  label: string;
  desc: string;
  defaultChecked: boolean;
}

const Notification: React.FC = () => {
  const notifications: NotificationItem[] = [
    { label: "Likes and Comments", desc: "Joy say painful removed reached end.", defaultChecked: true },
    { label: "Reply to My comments", desc: "Ask a quick six seven offer see among.", defaultChecked: true },
    { label: "Subscriptions", desc: "Preference any astonished unreserved Mrs.", defaultChecked: true },
    { label: "Birthdays", desc: "Contented he gentleman agreeable do be.", defaultChecked: false },
    { label: "Events", desc: "Fulfilled direction use continually.", defaultChecked: true },
    { label: "Email notifications", desc: "As hastened oh produced prospect.", defaultChecked: false },
    { label: "Push notifications", desc: "Rendered six say his striking confined.", defaultChecked: true },
  ];

  return (
    <Container className="d-flex justify-content-center p-0 p-lg-2">
      <Card className=" m-auto p-2 p-lg-4">
        <h1 className="mb-3 fw-bold fs-3">Notification</h1>
        <p className="text-muted">
          Tried law yet style child. The bore of true of no be deal. Frequently
          sufficient to be unaffected. The furnished she concluded depending
          procuring concealed.
        </p>

        <Form>
          {notifications.map((item, index) => (
            <div key={index}>
              <Form.Group className="d-flex justify-content-between align-items-center py-3">
                <div>
                  <strong>{item.label}</strong>
                  <p className="text-muted mb-0">{item.desc}</p>
                </div>
                <Form.Check
                  type="switch"
                  id={`custom-switch-${index}`}
                  defaultChecked={item.defaultChecked}
                />
              </Form.Group>
              {index < notifications.length - 1 && <hr />}
            </div>
          ))}

          <Button variant="primary" className="mt-3 w-100">
            Save Changes
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Notification;