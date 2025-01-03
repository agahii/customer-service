import React, { useEffect, useState, useRef } from "react";
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
  Radio,
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
import moment from "moment";

import { fetchCustomerRegistration } from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";
import { addQuestion, getQuestionById } from "../store/reducers/Questionnaire/QuestionnaireAction";
import { fetchQuestionTypes } from "../store/reducers/QuestionType/QuestionTypeAction";

const { Option } = Select;
const { Title } = Typography;

const Questionnaire = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // LOCAL state for newly added/edited questions
  const [questions, setQuestions] = useState([]);

  // Show/Hide Modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Editing existing question index or null if adding new
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Holds question details for modal
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    questionTypeId: "",
    questionTypeName: "",
    options: [],
    imageUrl: null,
    answer: null,
    isMandatory: false,
  });

  // Selected customer
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Redux store: customers
  const {
    entities: customers,
    loading: customersLoading,
    error: customersError,
  } = useSelector((state) => state.customerRegistration);

  // Redux store: question types
  const {
    entities: questionTypes,
    loading: questionTypesLoading,
    error: questionTypesError,
  } = useSelector((state) => state.questionType);

  // Redux store: the **fetched** questions
  const { questions: fetchedQuestions } = useSelector((state) => state.questionnaire);

  // Avoid multiple dispatch in Strict Mode
  const hasFetchedQuestionTypes = useRef(false);

  // ---------- Fetch customers on mount ----------
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

  // ---------- Fetch question types on mount ----------
  useEffect(() => {
    if (!hasFetchedQuestionTypes.current) {
      if (questionTypes.length === 0 && !questionTypesLoading) {
        dispatch(fetchQuestionTypes());
      }
      hasFetchedQuestionTypes.current = true;
    }
  }, [dispatch, questionTypes.length, questionTypesLoading]);

  // ---------- Show errors if any ----------
  useEffect(() => {
    if (customersError && !customersLoading) {
      message.error(`Failed to load customers: ${customersError}`);
    }
  }, [customersError, customersLoading]);

  useEffect(() => {
    if (questionTypesError && !questionTypesLoading) {
      message.error(`Failed to load question types: ${questionTypesError}`);
    }
  }, [questionTypesError, questionTypesLoading]);

  // ---------- SUBMIT FORM ----------
  const onFinish = async (values) => {
    const { customerProject } = values;
    if (questions.length === 0) {
      message.error("Please add at least one question before submitting.");
      return;
    }

    const finalPayload = {
      fK_CustomerProject_ID: customerProject,
      questionDetailInp: questions.map((q, idx) => ({
        questionText: q.questionText,
        fK_QuestionType_ID: q.questionTypeId,
        isMandatory: q.isMandatory || false,
        order: idx + 1,
        isActive: true,
        optionInp:
          q.options && q.options.length > 0
            ? q.options.map((opt) => ({ optionText: opt }))
            : [],
      })),
    };

    try {
      await dispatch(addQuestion(finalPayload)).unwrap();
      message.success("Questionnaire submitted successfully!");
      form.resetFields();
      setQuestions([]);
      setSelectedCustomerId(null);
    } catch (error) {
      console.error("Submission Error:", error);
      message.error(`Submission failed: ${error}`);
    }
  };

  // ---------- CUSTOMER SELECTION ----------
  const handleCustomerChange = (value) => {
    setSelectedCustomerId(value);
    form.setFieldsValue({ customerProject: undefined });
  };

  // ---------- PROJECT SELECTION -> Fetch saved questions ----------
  const handleProjectChange = (projectId) => {
    form.setFieldsValue({ customerProject: projectId });
    dispatch(getQuestionById(projectId)); // fetch from server
  };

  // ---------- Sync Redux store -> local questions ----------
  useEffect(() => {
    // If the server returned questionDetail with nested "option" objects,
    // we transform them into the shape your UI expects:
    if (fetchedQuestions && fetchedQuestions.length > 0) {
      const transformed = fetchedQuestions.map((srvQ) => ({
        // Use the same structure your UI logic uses:
        questionText: srvQ.questionText,
        questionTypeId: srvQ.fK_QuestionType_ID, 
        questionTypeName: srvQ.questionType?.typeName || "",
        isMandatory: srvQ.isMandatory || false,

        // Convert each option object to a string
        options: Array.isArray(srvQ.option)
          ? srvQ.option.map((opt) => opt.optionText)
          : [],
        
        // If you need defaultAnswer/imageUrl from the server, handle them similarly
        defaultAnswer: null,
        imageUrl: null,
      }));
      setQuestions(transformed);
    } else {
      // If no data was returned, reset the local questions
      setQuestions([]);
    }
  }, [fetchedQuestions]);

  // ---------- MODAL HANDLERS ----------
  const showModal = (question = null, index = null) => {
    if (question !== null && index !== null) {
      setEditingQuestion(index);
      setCurrentQuestion({
        questionText: question.questionText,
        questionTypeId: question.questionTypeId,
        questionTypeName: question.questionTypeName,
        options: [...(question.options || [])],
        imageUrl: question.imageUrl || null,
        answer: question.defaultAnswer || null,
        isMandatory: question.isMandatory || false,
      });
    } else {
      setEditingQuestion(null);
      setCurrentQuestion({
        questionText: "",
        questionTypeId: "",
        questionTypeName: "",
        options: [],
        imageUrl: null,
        answer: null,
        isMandatory: false,
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const {
      questionText,
      questionTypeId,
      questionTypeName,
      options,
      imageUrl,
      answer,
      isMandatory,
    } = currentQuestion;

    if (!questionText.trim()) {
      message.error("Question text is required.");
      return;
    }
    if (!questionTypeId) {
      message.error("Question Type is required.");
      return;
    }
    if (
      (questionTypeName === "checkbox" ||
        questionTypeName === "radio" ||
        questionTypeName === "dropdown") &&
      options.length < 2
    ) {
      message.error("Please provide at least two options for this answer type.");
      return;
    }

    const questionToAdd = {
      questionText,
      questionTypeId,
      questionTypeName,
      isMandatory,
      options:
        questionTypeName === "checkbox" ||
        questionTypeName === "radio" ||
        questionTypeName === "dropdown"
          ? options
          : [],
      imageUrl: questionTypeName === "image" ? imageUrl : null,
      defaultAnswer:
        questionTypeName === "datepicker" || questionTypeName === "numeric"
          ? answer
          : null,
    };

    if (editingQuestion !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion] = questionToAdd;
      setQuestions(updatedQuestions);
      message.success("Question edited successfully!");
    } else {
      setQuestions([...questions, questionToAdd]);
      message.success("Question added successfully!");
    }

    setIsModalVisible(false);
    setCurrentQuestion({
      questionText: "",
      questionTypeId: "",
      questionTypeName: "",
      options: [],
      imageUrl: null,
      answer: null,
      isMandatory: false,
    });
    setEditingQuestion(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentQuestion({
      questionText: "",
      questionTypeId: "",
      questionTypeName: "",
      options: [],
      imageUrl: null,
      answer: null,
      isMandatory: false,
    });
    setEditingQuestion(null);
  };

  // ---------- FIELD CHANGE HANDLERS ----------
  const handleCurrentQuestionChange = (field, value) => {
    if (field === "questionTypeId") {
      const matchedType = questionTypes.find((qt) => qt.id === value);
      const typeName = matchedType ? matchedType.typeName : "";

      setCurrentQuestion((prev) => ({
        ...prev,
        questionTypeId: value,
        questionTypeName: typeName,
      }));
    } else {
      setCurrentQuestion((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // ---------- OPTIONS ----------
  const addOption = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const removeOption = (index) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions.splice(index, 1);
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

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

  // ---------- RENDER ANSWER FIELD ----------
  const renderAnswerField = (question) => {
    const tName = question.questionTypeName.toLowerCase();

    switch (tName) {
      case "checkbox":
        return (
          <Checkbox.Group>
            <Space direction="vertical">
              {question.options.map((option, idx) => (
                <Checkbox key={idx} value={option}>
                  {option}
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
                <Radio key={idx} value={option}>
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );
      case "dropdown":
        return (
          <Select placeholder="Select an option" style={{ width: "100%" }}>
            {question.options.map((option, idx) => (
              <Option key={idx} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );
      case "datepicker":
        return <DatePicker style={{ width: "100%" }} />;
      case "image":
        return question.imageUrl ? (
          <img
            src={question.imageUrl}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        ) : (
          <p>No image uploaded.</p>
        );
      case "numeric":
        return <Input type="number" placeholder="Enter a number" />;
      case "text":
        return null;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Create and Answer Questionnaire
      </Title>

      {customersError && !customersLoading && (!customers || customers.length === 0) && (
        <Alert
          message="Error"
          description={`Failed to load customers: ${customersError}`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {questionTypesError && !questionTypesLoading && (!questionTypes || questionTypes.length === 0) && (
        <Alert
          message="Error"
          description={`Failed to load question types: ${questionTypesError}`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ questions: [] }}
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

        {/* Customer Project Dropdown */}
        <Form.Item
          name="customerProject"
          label="Customer Project"
          rules={[{ required: true, message: "Please select a project" }]}
        >
          <Select
            showSearch
            placeholder="Select a project"
            loading={customersLoading}
            disabled={!selectedCustomerId || customersLoading}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={
              selectedCustomerId ? "No projects found" : "Please select a customer first"
            }
            onChange={handleProjectChange} // fetch saved questions
          >
            {selectedCustomerId &&
              Array.isArray(customers) &&
              customers
                .find((customer) => customer.id === selectedCustomerId)
                ?.customerProject.map((project) => (
                  <Option key={project.id} value={project.id}>
                    {project.projectName}
                  </Option>
                ))}
          </Select>
        </Form.Item>

        {/* Add Question Button */}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => showModal()}
            block
            icon={<PlusOutlined />}
          >
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
                  title={
                    <>
                      {`Question ${index + 1}: ${question.questionText}`}
                      <br />
                      <small style={{ color: "#888" }}>
                        Type: {question.questionTypeName || "Unknown"}
                      </small>
                    </>
                  }
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

        {/* Submit and Reset */}
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
                setSelectedCustomerId(null);
              }}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Modal for Adding/Editing */}
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
          <Form.Item label="Question Text" required tooltip="This is a required field">
            <Input
              placeholder="Enter your question"
              value={currentQuestion.questionText}
              onChange={(e) => handleCurrentQuestionChange("questionText", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Question Type" required tooltip="This is a required field">
            <Select
              placeholder="Select question type"
              value={currentQuestion.questionTypeId}
              onChange={(value) => handleCurrentQuestionChange("questionTypeId", value)}
              loading={questionTypesLoading}
              notFoundContent={questionTypesLoading ? "Loading..." : "No question types found"}
            >
              {Array.isArray(questionTypes) &&
                questionTypes.map((qt) => (
                  <Option key={qt.id} value={qt.id}>
                    {qt.typeName.charAt(0).toUpperCase() + qt.typeName.slice(1)}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          {(currentQuestion.questionTypeName === "checkbox" ||
            currentQuestion.questionTypeName === "radio" ||
            currentQuestion.questionTypeName === "dropdown") && (
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
                <Button type="dashed" onClick={addOption} block icon={<PlusOutlined />}>
                  Add Option
                </Button>
              </Form.Item>
            </Form.Item>
          )}

          {currentQuestion.questionTypeName === "datepicker" && (
            <Form.Item label="Default Date (optional)">
              <DatePicker
                style={{ width: "100%" }}
                value={
                  currentQuestion.answer ? moment(currentQuestion.answer, "YYYY-MM-DD") : null
                }
                onChange={(date, dateString) =>
                  handleCurrentQuestionChange("answer", dateString)
                }
              />
            </Form.Item>
          )}

          {currentQuestion.questionTypeName === "image" && (
            <Form.Item label="Upload Image">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        imageUrl: reader.result,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {currentQuestion.imageUrl && (
                <img
                  src={currentQuestion.imageUrl}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", marginTop: 10 }}
                />
              )}
            </Form.Item>
          )}

          {currentQuestion.questionTypeName === "numeric" && (
            <Form.Item label="Numeric Answer (optional)">
              <Input
                type="number"
                placeholder="Enter a number"
                value={currentQuestion.answer || ""}
                onChange={(e) => handleCurrentQuestionChange("answer", e.target.value)}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Questionnaire;
