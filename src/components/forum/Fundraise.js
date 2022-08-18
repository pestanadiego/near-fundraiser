import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import {
  Card,
  Button,
  Col,
  Badge,
  Modal,
  Stack,
  Form,
  FloatingLabel,
  ProgressBar,
} from "react-bootstrap";

const Fundraise = ({ fundraise, donate, upvote, account }) => {
  const {
    id,
    name,
    description,
    image,
    amountNeeded,
    donations,
    upvotes,
    owner,
  } = fundraise;
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(null);
  const [recollected, setRecollected] = useState(0);
  const [numDonations, setNumDonations] = useState(0);
  const [numUpvotes, setNumUpvotes] = useState(0);
  const [areDonations, setAreDonations] = useState(true);

  const triggerDonation = () => {
    if (account) {
      handleShow();
    } else {
      toast.error("You need to connect your wallet first.");
    }
  };

  const triggerUpvote = () => {
    if (account) {
      upvote(id, account, false);
    } else {
      toast.error("You need to connect your wallet first.");
    }
  };

  const countAndSum = () => {
    if (donations) {
      let recollectedSoFar = 0;
      for (let i = 0; i < donations.length; i++) {
        recollectedSoFar += parseInt(donations[i].amount);
      }
      setRecollected(recollectedSoFar);
      setNumDonations(donations.length);
    }
    if (upvotes) {
      setNumUpvotes(upvotes.length);
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  // Check that the amount entered is valid
  const checkAmount = () => amount && amount !== "0";

  useEffect(() => {
    // Function to count the upvotes and donations as well as the amount of NEAR donated
    countAndSum();
  }, []);

  return (
    <>
      <Col key={id}>
        <Card className='h-100'>
          <Card.Header>
            <Stack direction='horizontal' gap={2}>
              <Badge
                onClick={triggerUpvote}
                style={{ cursor: "pointer" }}
                bg='secondary'
              >
                {numUpvotes} ↑
              </Badge>
              <span className='font-monospace text-secondary ms-auto'>
                {owner}
              </span>
            </Stack>
          </Card.Header>
          <div className=' ratio ratio-4x3'>
            <img src={image} alt={name} style={{ objectFit: "cover" }} />
          </div>
          <Card.Body className='d-flex  flex-column text-center'>
            <Card.Title>{name}</Card.Title>
            <Card.Text className='flex-grow-1 '>{description}</Card.Text>
            <Card.Text className='text-secondary'>
              <ProgressBar
                variant='secondary'
                now={(recollected / amountNeeded) * 100}
              />
              <span>
                {recollected}/{amountNeeded}
              </span>
            </Card.Text>
            <Card.Text className='text-secondary'>
              <span>
                {numDonations} Donation{numDonations === 1 ? "" : "s"} so far!
              </span>
            </Card.Text>
            <Button
              variant='dark'
              onClick={triggerDonation}
              className='w-100 py-3 mb-2'
            >
              Donate NEAR
            </Button>
            <Button
              variant='outline-dark'
              onClick={triggerUpvote}
              className='w-100 py-3'
            >
              Upvote
            </Button>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <p
                onClick={() => setAreDonations(true)}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                Latest $
              </p>
              <p
                onClick={() => setAreDonations(false)}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                Latest ↑
              </p>
            </div>
            <div>
              {areDonations ? (
                <div>
                  {donations ? (
                    donations
                      .slice(0)
                      .reverse()
                      .map((donation) => (
                        <div>
                          <i className='fa fa-up' />
                          <p>
                            💰 <i>{donation.wallet}</i> donated{" "}
                            <b>{donation.amount} ⋈</b>
                          </p>
                        </div>
                      ))
                  ) : (
                    <p>No donations yet</p>
                  )}
                </div>
              ) : (
                <div>
                  {upvotes ? (
                    upvotes
                      .slice(0)
                      .reverse()
                      .map((upvote) => (
                        <div>
                          <i className='fa fa-up' />
                          <p>
                            ⬆️ <i>{upvote}</i> upvoted
                          </p>
                        </div>
                      ))
                  ) : (
                    <p>No upvotes yet</p>
                  )}
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Donate</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId='inputName'
              label='Amount'
              className='mb-3'
            >
              <Form.Control
                type='text'
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                placeholder='Insert an amount'
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant='outline-secondary' onClick={handleClose}>
            Close
          </Button>
          <Button
            variant='dark'
            disabled={!checkAmount()}
            onClick={() => {
              donate(id, account, amount);
              handleClose();
            }}
          >
            Donate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Fundraise.propTypes = {
  fundraise: PropTypes.instanceOf(Object).isRequired,
  donate: PropTypes.func.isRequired,
};

export default Fundraise;
