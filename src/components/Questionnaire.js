// src/components/Questionnaire.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Select,
  Button,
  message,
  Space,
  Alert,
  Input,
  Checkbox,
  Radio, // Imported Radio
  DatePicker,
  Card,
  Modal,
  List,
  Typography,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { fetchCustomerRegistration } from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";
import { addQuestionnaire } from "../store/reducers/Questionnaire/QuestionnaireAction"; // Ensure correct path
import moment from "moment";

const { Option } = Select;
const { Title } = Typography;

const Questionnaire = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // State for list of questions
  const [questions, setQuestions] = useState([]);

  // State for Modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State for editing question
  const [editingQuestion, setEditingQuestion] = useState(null); // null means adding new

  // State for new/edit question fields
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    answerType: "",
    options: [],
  });

  // Access customer data and error from CustomerRegistration slice
  const {
    entities: customers,
    loading: customersLoading,
    error: customersError,
  } = useSelector((state) => state.customerRegistration);

  // Fetch customers on component mount
  useEffect(() => {
    const controller = new AbortController();
    dispatch(
      fetchCustomerRegistration({ pagingInfo: { skip: 0, take: 100 }, controller })
    );
    return () => {
      controller.abort();
    };
  }, [dispatch]);

  // Handle and display errors related to fetching customers
  useEffect(() => {
    if (customersError && !customersLoading) {
      message.error(`Failed to load customers: ${customersError}`);
    }
  }, [customersError, customersLoading]);

  // Handle form submission
  const onFinish = async (values) => {
    const { customerName, customerProject } = values;

    const payload = {
      customerId: customerName,
      projectId: customerProject,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        answerType: q.answerType,
        options:
          q.answerType === "checkbox" || q.answerType === "radio" || q.answerType === "dropdown"
            ? q.options.map((opt) => opt.optionText)
            : null,
      })),
    };

    console.log("Submitting Questionnaire with payload:", payload);

    try {
      await dispatch(addQuestionnaire(payload)).unwrap(); // Ensure addQuestionnaire handles the payload correctly
      message.success("Questionnaire submitted successfully!");
      form.resetFields();
      setQuestions([]);
    } catch (error) {
      console.error("Submission Error:", error);
      message.error(`Submission failed: ${error}`);
    }
  };

  // Handle customer selection change
  const handleCustomerChange = (value) => {
    // Reset project field whenever customer changes
    form.setFieldsValue({ customerProject: undefined });
  };

  // Open Modal to Add/Edit Question
  const showModal = (question = null, index = null) => {
    if (question !== null && index !== null) {
      // Editing existing question
      setEditingQuestion(index);
      setCurrentQuestion({
        questionText: question.questionText,
        answerType: question.answerType,
        options: question.options || [],
      });
    } else {
      // Adding new question
      setEditingQuestion(null);
      setCurrentQuestion({
        questionText: "",
        answerType: "",
        options: [],
      });
    }
    setIsModalVisible(true);
  };

  // Handle Modal OK (Add/Edit Question)
  const handleOk = () => {
    const { questionText, answerType, options } = currentQuestion;

    // Validation
    if (!questionText.trim()) {
      message.error("Question text is required.");
      return;
    }

    if (!answerType) {
      message.error("Answer type is required.");
      return;
    }

    if (
      (answerType === "checkbox" || answerType === "radio" || answerType === "dropdown") &&
      options.length < 2
    ) {
      message.error("Please provide at least two options for the selected answer type.");
      return;
    }

    // Prepare question object
    const questionToAdd = {
      questionText,
      answerType,
      options:
        answerType === "checkbox" || answerType === "radio" || answerType === "dropdown"
          ? options.map((opt) => ({ optionText: opt }))
          : [],
    };

    if (editingQuestion !== null) {
      // Edit existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion] = questionToAdd;
      setQuestions(updatedQuestions);
      message.success("Question edited successfully!");
    } else {
      // Add new question
      setQuestions([...questions, questionToAdd]);
      message.success("Question added successfully!");
    }

    // Reset modal state
    setIsModalVisible(false);
    setCurrentQuestion({
      questionText: "",
      answerType: "",
      options: [],
    });
    setEditingQuestion(null);
  };

  // Handle Modal Cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentQuestion({
      questionText: "",
      answerType: "",
      options: [],
    });
    setEditingQuestion(null);
  };

  // Handle Change in New/Edit Question Fields
  const handleCurrentQuestionChange = (field, value) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle Option Addition in New/Edit Question
  const addOption = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  // Handle Option Change in New/Edit Question
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  // Handle Option Removal in New/Edit Question
  const removeOption = (index) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions.splice(index, 1);
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  // Handle Delete Question
  const handleDeleteQuestion = (index) => {
    Modal.confirm({
      title: "Are you sure you want to delete this question?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
        message.success("Question deleted successfully!");
      },
    });
  };

  // Render answer field based on answer type
  const renderAnswerField = (question) => {
    switch (question.answerType) {
      case "checkbox":
        return (
          <Checkbox.Group>
            <Space direction="vertical">
              {question.options.map((option, idx) => (
                <Checkbox key={idx} value={option.optionText}>
                  {option.optionText}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        );
      case "radio":
        return (
          <Radio.Group>
            <Space direction="vertical">
              {question.options.map((option, idx) => (
                <Radio key={idx} value={option.optionText}>
                  {option.optionText}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );
      case "dropdown":
        return (
          <Select placeholder="Select an option" style={{ width: "100%" }}>
            {question.options.map((option, idx) => (
              <Option key={idx} value={option.optionText}>
                {option.optionText}
              </Option>
            ))}
          </Select>
        );
      case "text":
        return <Input placeholder="Enter your answer" />;
      case "date":
        return <DatePicker style={{ width: "100%" }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Create and Answer Questionnaire
      </Title>

      {/* Display error alert if there's an error fetching customers and no customers are loaded */}
      {customersError && !customersLoading && (!customers || customers.length === 0) && (
        <Alert
          message="Error"
          description={`Failed to load customers: ${customersError}`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          questions: [],
        }}
      >
        {/* Customer Name Dropdown */}
        <Form.Item
          name="customerName"
          label="Customer Name"
          rules={[{ required: true, message: "Please select a customer" }]}
        >
          <Select
            showSearch
            placeholder="Select a customer"
            loading={customersLoading}
            onChange={handleCustomerChange}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={customersLoading ? "Loading..." : "No customers found"}
          >
            {Array.isArray(customers) &&
              customers.map((customer) => (
                <Option key={customer.id} value={customer.id}>
                  {customer.customerName}
                </Option>
              ))}
          </Select>
        </Form.Item>

        {/* 
          Wrap the Project dropdown in a noStyle Form.Item with shouldUpdate 
          so it re-renders and becomes enabled as soon as Customer Name changes.
        */}
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) =>
          prevValues.customerName !== curValues.customerName || prevValues.customerProject !== curValues.customerProject
        }>
          {({ getFieldValue }) => (
            <Form.Item
              name="customerProject"
              label="Customer Project"
              rules={[{ required: true, message: "Please select a project" }]}
            >
              <Select
                showSearch
                placeholder="Select a project"
                loading={customersLoading}
                // Enable or disable based on the form value, not just on mount
                disabled={!getFieldValue("customerName")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={
                  getFieldValue("customerName")
                    ? "No projects found"
                    : "Please select a customer first"
                }
              >
                {getFieldValue("customerName") &&
                  Array.isArray(customers) &&
                  customers
                    .find((customer) => customer.id === getFieldValue("customerName"))
                    ?.customerProject.map((project) => (
                      <Option key={project.id} value={project.id}>
                        {project.projectName}
                      </Option>
                    ))}
              </Select>
            </Form.Item>
          )}
        </Form.Item>

        {/* Add Question Button */}
        <Form.Item>
          <Button type="dashed" onClick={() => showModal()} block icon={<PlusOutlined />}>
            Add Question
          </Button>
        </Form.Item>

        {/* Display List of Questions */}
        <div style={{ marginBottom: 24 }}>
          {questions.length > 0 ? (
            <List
              dataSource={questions}
              renderItem={(question, index) => (
                <Card
                  key={index}
                  style={{ marginBottom: 16 }}
                  title={`Question ${index + 1}: ${question.questionText}`}
                  extra={
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => showModal(question, index)}
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteQuestion(index)}
                      >
                        Remove
                      </Button>
                    </Space>
                  }
                >
                  {renderAnswerField(question)}
                </Card>
              )}
            />
          ) : (
            <p>No questions added yet. Click "Add Question" to start.</p>
          )}
        </div>

        {/* Submit and Reset Buttons */}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              disabled={customersLoading || questions.length === 0}
            >
              Submit Questionnaire
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setQuestions([]);
              }}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Modal for Adding/Editing New Question */}
      <Modal
        title={editingQuestion !== null ? "Edit Question" : "Add New Question"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingQuestion !== null ? "Save" : "Add"}
        cancelText="Cancel"
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item
            label="Question Text"
            required
            tooltip="This is a required field"
          >
            <Input
              placeholder="Enter your question"
              value={currentQuestion.questionText}
              onChange={(e) => handleCurrentQuestionChange("questionText", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Answer Type"
            required
            tooltip="This is a required field"
          >
            <Select
              placeholder="Select answer type"
              value={currentQuestion.answerType}
              onChange={(value) => handleCurrentQuestionChange("answerType", value)}
            >
              <Option value="checkbox">Checkbox</Option>
              <Option value="radio">Radio Button</Option>
              <Option value="dropdown">Dropdown</Option>
              <Option value="text">Text Box</Option>
              <Option value="date">Date Picker</Option>
            </Select>
          </Form.Item>

          {/* Conditionally Render Options for Checkbox, Radio, or Dropdown */}
          {(currentQuestion.answerType === "checkbox" ||
            currentQuestion.answerType === "radio" ||
            currentQuestion.answerType === "dropdown") && (
            <Form.Item label="Options" required>
              <List
                dataSource={currentQuestion.options}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <Space>
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={item}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                      {currentQuestion.options.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => removeOption(index)}
                        />
                      )}
                    </Space>
                  </List.Item>
                )}
              />
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={addOption}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Option
                </Button>
              </Form.Item>
            </Form.Item>
          )}

          {/* Conditionally Render Answer Field for Text and Date */}
          {(currentQuestion.answerType === "text" || currentQuestion.answerType === "date") && (
            <Form.Item
              label={currentQuestion.answerType === "text" ? "Answer" : "Select Date"}
              required
            >
              {currentQuestion.answerType === "text" ? (
                <Input
                  placeholder="Enter your answer"
                  value={currentQuestion.answer}
                  onChange={(e) => handleCurrentQuestionChange("answer", e.target.value)}
                />
              ) : (
                <DatePicker
                  style={{ width: "100%" }}
                  value={currentQuestion.answer ? moment(currentQuestion.answer) : null}
                  onChange={(date, dateString) => handleCurrentQuestionChange("answer", dateString)}
                />
              )}
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Questionnaire;
