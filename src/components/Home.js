import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BASE_DOMAIN } from "../utills/services";
import {
  Carousel,
  Card,
  Spin,
  message,
  Typography,
  Input,
  Radio,
  Checkbox,
  Select,
  DatePicker,
  Button,
  Form,
} from "antd";
import moment from "moment";

// We still use Redux for fetching customers
import { fetchCustomerRegistration } from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";

// But for project questions, we'll call the API directly instead of using the questionnaire slice
import { API } from "../utills/services"; // Make sure the path and name are correct

const { Title } = Typography;
const { Option } = Select;

const pastelColorsCustomers = ["#fde2e4", "#f9d5e5", "#cfe9f3", "#c9e4de", "#e2f0cb", "#fef9c3"];
const pastelColorsProjects = ["#e2f4d3", "#cffafe", "#fef7c3", "#ffd8be", "#e0aaff", "#bbf7d0"];

const Home = () => {
  const dispatch = useDispatch();

  // ----- Local states -----
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Local questionnaire data (NOT from Redux)
  const [localQuestions, setLocalQuestions] = useState([]);
  const [questionnaireLoading, setQuestionnaireLoading] = useState(false);

  // For storing user answers in Home
  const [answers, setAnswers] = useState({});

  // Redux: Customer Registration
  const {
    entities: customers,
    loading: customersLoading,
    error: customersError,
  } = useSelector((state) => state.customerRegistration);

  // ----- Fetch customers on mount -----
  useEffect(() => {
    const controller = new AbortController();
    dispatch(
      fetchCustomerRegistration({
        pagingInfo: { skip: 0, take: 100 },
        controller,
      })
    );

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  // ----- Show error if any -----
  useEffect(() => {
    if (customersError && !customersLoading) {
      message.error(`Failed to load customers: ${customersError}`);
    }
  }, [customersError, customersLoading]);

  // ----- Reset localQuestions & answers when a new project is clicked -----
  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setLocalQuestions([]);
    setAnswers({});

    // Do a local fetch from the same endpoint your getQuestionById thunk uses
    try {
      setQuestionnaireLoading(true);
      // e.g. GET /Question/GetById?id=PROJECT_ID
      const response = await API.get(`Question/GetById?id=${project.id}`);
      const questions = response?.data?.data?.questionDetail || [];
      setLocalQuestions(questions);
    } catch (error) {
      console.error("Error fetching local project questionnaire", error);
      message.error("Failed to load local questionnaire");
    } finally {
      setQuestionnaireLoading(false);
    }
  };

  // ----- Handlers -----
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedProject(null);
    setLocalQuestions([]);
    setAnswers({});
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const renderAnswerField = (question, index) => {
    const tName = question.questionType?.typeName?.toLowerCase() || "";
    const value = answers[index];

    switch (tName) {
      case "text":
        return (
          <Input
            placeholder="Enter text"
            value={value || ""}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        );
      case "numeric":
        return (
          <Input
            type="number"
            placeholder="Enter a number"
            value={value || ""}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        );
      case "radio":
        return (
          <Radio.Group
            value={value || ""}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          >
            {question.option?.map((opt, i) => (
              <Radio key={i} value={opt.optionText}>
                {opt.optionText}
              </Radio>
            ))}
          </Radio.Group>
        );
      case "checkbox":
        // value can be an array
        return (
          <Checkbox.Group
            value={Array.isArray(value) ? value : []}
            onChange={(checkedValues) => handleAnswerChange(index, checkedValues)}
          >
            {question.option?.map((opt, i) => (
              <Checkbox key={i} value={opt.optionText}>
                {opt.optionText}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "dropdown":
        return (
          <Select
            placeholder="Select an option"
            style={{ width: 200 }}
            value={value || undefined}
            onChange={(val) => handleAnswerChange(index, val)}
          >
            {question.option?.map((opt, i) => (
              <Option key={i} value={opt.optionText}>
                {opt.optionText}
              </Option>
            ))}
          </Select>
        );
      case "datepicker":
        return (
          <DatePicker
            style={{ width: 200 }}
            value={value ? moment(value) : null}
            onChange={(date, dateString) => handleAnswerChange(index, dateString)}
          />
        );
      case "image":
        if (question.imageUrl) {
          return (
            <img
              src={question.imageUrl}
              alt="Question"
              style={{ maxWidth: "100%", marginTop: 8 }}
            />
          );
        }
        return <p>No image provided.</p>;
      default:
        return <p style={{ color: "#999" }}>No specific input for this type.</p>;
    }
  };

  const handleSubmit = () => {
    console.log("Answers in Home (local):", answers);
    message.success("Questionnaire submitted!");
    // If you want to send these answers to your backend, do so here
    // e.g. API.post("/Questionnaire/submit", { projectId: selectedProject.id, answers })
  };

  // ----- Render -----
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Home (Questionnaire)
      </Typography.Title>

      {/* Customers carousel */}
      <section>
        <Typography.Title level={4}>Customers</Typography.Title>
        {customersLoading ? (
          <Spin />
        ) : customers && customers.length > 0 ? (
          <Carousel dots={false} slidesToShow={4} swipeToSlide draggable>
            {customers.map((customer, index) => {
              const tileColor = pastelColorsCustomers[index % pastelColorsCustomers.length];
              return (
                <div key={customer.id} style={{ padding: "0 8px" }}>
                 <Card
  hoverable
  onClick={() => handleCustomerClick(customer)}
  style={{
    backgroundColor: tileColor,
    textAlign: "center",
    margin: "8px",
    padding: "16px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center-align logo and text
    justifyContent: "center", // Center content vertically
    minHeight: "200px",
  }}
>
  {/* Logo */}
  {customer.imageUrl && (
    <img
      src={BASE_DOMAIN.replace("/api", "/Images") + customer.imageUrl}
      alt={`${customer.customerName} Logo`}
      style={{
        width: "100px",
        height: "100px",
        objectFit: "contain",
        marginBottom: "8px", // Add spacing between logo and name
      }}
    />
  )}

  {/* Customer Name */}
  <h4 style={{ margin: 0 }}>{customer.customerName}</h4>
</Card>

                </div>
              );
            })}
          </Carousel>
        ) : (
          <p>No customers available.</p>
        )}
      </section>

      {/* Projects carousel */}
      {selectedCustomer && (
        <section style={{ marginTop: 48 }}>
          <Typography.Title level={4}>
            Projects for {selectedCustomer.customerName}
          </Typography.Title>
          {selectedCustomer.customerProject?.length > 0 ? (
            <Carousel dots={false} slidesToShow={4} swipeToSlide draggable>
              {selectedCustomer.customerProject.map((project, index) => {
                const tileColor = pastelColorsProjects[index % pastelColorsProjects.length];
                return (
                  <div key={project.id} style={{ padding: "0 8px" }}>
                     <Card
                hoverable
                onClick={() => handleProjectClick(project)}
                style={{
                  backgroundColor: tileColor,
                  textAlign: "center",
                  margin: "8px",
                  padding: "16px",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "200px",
                }}
              >
                {/* Project Logo */}
                {project.imageUrl ? (
                  <img
                    src={`${BASE_DOMAIN.replace("/api", "/Images")}${project.imageUrl}`}
                    alt={`${project.projectName} Logo`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      marginBottom: "8px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#999",
                      fontSize: "12px",
                    }}
                  >
                    No Logo
                  </div>
                )}

                {/* Project Name */}
                <h4 style={{ margin: 0 }}>{project.projectName}</h4>
              </Card>
                  </div>
                );
              })}
            </Carousel>
          ) : (
            <p>No projects found for this customer.</p>
          )}
        </section>
      )}

      {/* Local Questionnaire */}
      {selectedProject && (
        <section style={{ marginTop: 48, maxWidth: 600 }}>
          <Typography.Title level={4}>
            Questionnaire for {selectedProject.projectName}
          </Typography.Title>
          {questionnaireLoading ? (
            <Spin />
          ) : localQuestions && localQuestions.length > 0 ? (
            <Form layout="vertical">
              {localQuestions.map((q, idx) => (
                <Form.Item key={idx} label={`Q${idx + 1}: ${q.questionText}`}>
                  {renderAnswerField(q, idx)}
                </Form.Item>
              ))}

              <Form.Item>
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <p>No questionnaire data for this project.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
