import React, { useState,useEffect } from "react";
import * as emailjs from "emailjs-com";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { contactConfig } from "../../content_option";

export const ContactUs = () => {
  const [formData, setFormdata] = useState({
    email: "",
    name: "",
    message: "",
    loading: false,
    show: false,
    alertmessage: "",
    variant: "",
  });

 
   useEffect(() => {
    const lastSentTime = localStorage.getItem("lastSentTime");
    if (lastSentTime) {
      const lastSentDate = new Date(parseInt(lastSentTime));
      const currentDate = new Date();

      // Check if 24 hours have passed since the last sent email
      if (currentDate - lastSentDate < 24 * 60 * 60 * 1000) {
        setFormdata({
          ...formData,
          alertmessage: "You can only send one email per day.",
          variant: "warning",
          show: true,
        });
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const lastSentTime = localStorage.getItem("lastSentTime");

    if (lastSentTime) {
      const lastSentDate = new Date(parseInt(lastSentTime));
      const currentDate = new Date();

      // Check if 24 hours have passed since the last sent email
      if (currentDate - lastSentDate < 24 * 60 * 60 * 1000) {
        setFormdata({
          ...formData,
          alertmessage: "You can only send one email per day.",
          variant: "warning",
          show: true,
        });
        return;
      }
    }

    setFormdata({ ...formData, loading: true });

    const templateParams = {
      from_name: formData.email,
      user_name: formData.sankha,
      to_name: "sankha.softech@gmail.com",
      message: formData.message,
    };

    emailjs
      .send(
        "service_v87aoh9", // Correct the service ID
        "template_bs6a30c", // Correct the template ID
        templateParams,
        "_Cf7e3-L96sK1yO_X" // Correct the user ID
      )
      .then(
        (result) => {
          console.log(result.text);
          setFormdata({
            ...formData,
            loading: false,
            alertmessage: "SUCCESS! Looking forward to reading your email.",
            variant: "success",
            show: true,
          });

          // Update last sent time in local storage
          localStorage.setItem("lastSentTime", new Date().getTime());
        },
        (error) => {
          console.log(error.text);
          setFormdata({
            ...formData,
            alertmessage: `Failed to send! ${error.text}`,
            variant: "danger",
            show: true,
          });
          document.getElementsByClassName("co_alert")[0].scrollIntoView();
        }
      );
  };

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Contact</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Contact Me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="12">
            <Alert
              show={formData.show}
              variant={formData.variant}
              className={`rounded-0 co_alert ${
                formData.show ? "d-block" : "d-none"
              }`}
              onClose={() => setFormdata({ ...formData, show: false })}
              dismissible
            >
              <p className="my-0">{formData.alertmessage}</p>
            </Alert>
          </Col>
          <Col lg="5" className="mb-5">
            <h3 className="color_sec py-4">Get in touch</h3>
            <address>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contactConfig.YOUR_EMAIL}`}>
                {contactConfig.YOUR_EMAIL}
              </a>
              <br />
            </address>
            <p>{contactConfig.description}</p>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <form onSubmit={handleSubmit} className="contact__form w-100">
              <Row>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name || ""}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <textarea
                className="form-control rounded-0"
                id="message"
                name="message"
                placeholder="Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <br />
              <Row>
                <Col lg="12" className="form-group">
                  <button className="btn ac_btn" type="submit">
                    {formData.loading ? "Sending..." : "Send"}
                  </button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
      <div className={formData.loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};
