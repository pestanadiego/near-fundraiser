import React, { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddFundraise = ({ save, account }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [amountNeeded, setAmountNeeded] = useState("");
  const isFormFilled = () => name && image && description && amountNeeded;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (account) {
      setShow(true);
    } else {
      toast.error("You need to connect your wallet first.");
    }
  };

  return (
    <>
      <Button
        onClick={handleShow}
        variant='dark'
        style={{ display: "flex", alignItems: "baseline" }}
      >
        Add one
        <i style={{ marginLeft: "5px" }} class='bi bi-plus'></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Fundraise</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId='inputName'
              label='Fundraiser name'
              className='mb-3'
            >
              <Form.Control
                type='text'
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder='Enter name of fundraise'
              />
            </FloatingLabel>
            <FloatingLabel
              controlId='inputUrl'
              label='Image URL'
              className='mb-3'
            >
              <Form.Control
                type='text'
                placeholder='Image URL'
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId='inputDescription'
              label='Description'
              className='mb-3'
            >
              <Form.Control
                as='textarea'
                placeholder='description'
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId='inputAmountNeeded'
              label='Amount Needed'
              className='mb-3'
            >
              <Form.Control
                type='text'
                placeholder='Amount Needed'
                onChange={(e) => {
                  setAmountNeeded(e.target.value);
                }}
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
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                name,
                description,
                image,
                amountNeeded,
              });
              console.log({
                name,
                description,
                image,
                amountNeeded,
              });
              handleClose();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddFundraise.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddFundraise;
