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

import { fetchCustomerRegistration } from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";
import { submitQuestionnaire } from "../store/reducers/Home/HomeAction";
import { API } from "../utills/services";

const { Title } = Typography;
const { Option } = Select;

const pastelColorsCustomers = [
  "#fde2e4",
  "#f9d5e5",
  "#cfe9f3",
  "#c9e4de",
  "#e2f0cb",
  "#fef9c3",
];
const pastelColorsProjects = [
  "#e2f4d3",
  "#cffafe",
  "#fef7c3",
  "#ffd8be",
  "#e0aaff",
  "#bbf7d0",
];

const Home = () => {
  const dispatch = useDispatch();

  // Local States
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [localQuestions, setLocalQuestions] = useState([]);
  const [questionnaireLoading, setQuestionnaireLoading] = useState(false);
  const [answers, setAnswers] = useState({});

  const {
    entities: customers,
    loading: customersLoading,
    error: customersError,
  } = useSelector((state) => state.customerRegistration);

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

  useEffect(() => {
    if (customersError && !customersLoading) {
      message.error(`Failed to load customers: ${customersError}`);
    }
  }, [customersError, customersLoading]);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedProject(null);
    setLocalQuestions([]);
    setAnswers({});
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setLocalQuestions([]);
    setAnswers({});

    try {
      setQuestionnaireLoading(true);
      const response = await API.get(
        `Question/GetByProjectId?id=${project.id}`
      );
      const questions = response?.data?.data?.questionDetail || [];
      setLocalQuestions(questions);
    } catch (error) {
      console.error("Error fetching project questionnaire:", error);
      message.error("Failed to load questionnaire for this project.");
    } finally {
      setQuestionnaireLoading(false);
    }
  };

  const renderAnswerField = (question, index) => {
    const tName = question?.questionType?.typeName?.toLowerCase() || "";
    const value = answers[index] || "";

    const handleAnswerChange = (value) => {
      const updatedAnswers = { ...answers, [index]: value };
      setAnswers(updatedAnswers);
    };

    switch (tName) {
      case "text":
        return (
          <Input
            placeholder="Enter text"
            value={value}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );
      case "numeric":
        return (
          <Input
            type="number"
            placeholder="Enter a number"
            value={value}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );
      case "radio":
        return (
          <Radio.Group
            value={value}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            {question.option?.map((opt, i) => (
              <Radio key={i} value={opt.optionText}>
                {opt.optionText}
              </Radio>
            ))}
          </Radio.Group>
        );
      case "checkbox":
        return (
          <Checkbox.Group
            value={Array.isArray(value) ? value : []}
            onChange={(checkedValues) => handleAnswerChange(checkedValues)}
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
            onChange={(val) => handleAnswerChange(val)}
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
            onChange={(date, dateString) => handleAnswerChange(dateString)}
          />
        );
      case "image":
        return question.imageUrl ? (
          <img
            src={question.imageUrl}
            alt="Question"
            style={{ maxWidth: "100%", marginTop: 8 }}
          />
        ) : (
          <p>No image provided.</p>
        );
      default:
        return (
          <p style={{ color: "#999" }}>No input available for this type.</p>
        );
    }
  };

  const handleSubmit = () => {
    if (!selectedProject) {
      message.error("Please select a project.");
      return;
    }

    const payload = {
      fK_CustomerProject_ID: selectedProject.id,
      answerDetailInp: localQuestions.map((q, idx) => ({
        questionText: q.questionText,
        answerText: answers[idx] || "",
        answerImageInp: q.answerImages || [],
      })),
    };

    dispatch(submitQuestionnaire(payload));
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Customer & Project Questionnaire
      </Title>

      {/* Customer Carousel */}
      <section>
        <Title level={4}>Customers</Title>
        {customersLoading ? (
          <Spin />
        ) : (
          <Carousel dots slidesToShow={4} swipeToSlide draggable>
            {customers.map((customer, index) => (
              <div key={customer.id} style={{ padding: "0 8px" }}>
                <Card
                  hoverable
                  onClick={() => handleCustomerClick(customer)}
                  style={{
                    backgroundColor:
                      pastelColorsCustomers[
                        index % pastelColorsCustomers.length
                      ],
                    textAlign: "center",
                    margin: "8px", // Increased margin for spacing
                    padding: "16px", // Adjusted padding for a larger card
                    borderRadius: "12px", // Slightly rounded corners for better visuals
                    display: "flex",
                    alignItems: "center", // Vertically center
                    justifyContent: "center", // Horizontally center
                    flexDirection: "row", // Keep logo and text side by side
                    width: "300px", // Increased card width
                    height: "120px", // Increased card height
                  }}
                >
                  {customer.imageUrl ? (
                    <img
                      src={`${BASE_DOMAIN.replace("/api", "/Images")}${
                        customer.imageUrl
                      }`}
                      alt={`${customer.customerName} Logo`}
                      style={{
                        width: "60px", // Increased logo size
                        height: "60px",
                        objectFit: "contain",
                        borderRadius: "50%",
                        marginRight: "16px", // Add more space between logo and text
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "60px", // Increased placeholder size
                        height: "60px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "16px",
                      }}
                    >
                      No Logo
                    </div>
                  )}
                  <h4 style={{ margin: 0, fontSize: "16px" }}>
                    {customer.customerName}
                  </h4>{" "}
                  {/* Increased text size */}
                </Card>
              </div>
            ))}
          </Carousel>
        )}
      </section>

      {/* Project Carousel */}
      {selectedCustomer && (
        <section style={{ marginTop: 48 }}>
          <Title level={4}>Projects for {selectedCustomer.customerName}</Title>
          <Carousel dots slidesToShow={4} swipeToSlide draggable>
            {selectedCustomer.customerProject?.map((project, index) => (
              <div key={project.id} style={{ padding: "0 8px" }}>
                <Card
                  hoverable
                  onClick={() => handleProjectClick(project)}
                  style={{
                    backgroundColor:
                      pastelColorsProjects[index % pastelColorsProjects.length],
                    textAlign: "center",
                    margin: "8px", // Increased margin for spacing
                    padding: "16px", // Adjusted padding for a larger card
                    borderRadius: "12px", // Slightly rounded corners for better visuals
                    display: "flex",
                    alignItems: "center", // Vertically center
                    justifyContent: "center", // Horizontally center
                    flexDirection: "row", // Keep logo and text side by side
                    width: "300px", // Increased card width
                    height: "120px", // Increased card height
                  }}
                >
                  {project.imageUrl ? (
                    <img
                      src={`${BASE_DOMAIN.replace("/api", "/Images")}${
                        project.imageUrl
                      }`}
                      alt={`${project.projectName} Logo`}
                      style={{
                        width: "60px", // Increased logo size
                        height: "60px",
                        objectFit: "contain",
                        borderRadius: "50%",
                        marginRight: "16px", // Add more space between logo and text
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "60px", // Increased placeholder size
                        height: "60px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "16px",
                      }}
                    >
                      No Logo
                    </div>
                  )}
                  <h4 style={{ margin: 0, fontSize: "16px" }}>
                    {project.projectName}
                  </h4>{" "}
                  {/* Increased text size */}
                </Card>
              </div>
            ))}
          </Carousel>
        </section>
      )}

      {/* Questionnaire */}
      {selectedProject && (
        <section style={{ marginTop: 48 }}>
          <Title level={4}>
            Questionnaire for {selectedProject.projectName}
          </Title>
          {questionnaireLoading ? (
            <Spin />
          ) : (
            <Form layout="vertical" onFinish={handleSubmit}>
              {localQuestions.map((question, index) => (
                <Form.Item key={index} label={question.questionText}>
                  {renderAnswerField(question, index)}
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
