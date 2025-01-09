// src/components/Home.js

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Card,
  Spin,
  message,
  Typography,
  Divider,
  Space,
  Alert,
} from "antd";
import {
  fetchIndustries,
  fetchCustomerProjects,
  fetchQuestionnaireByProjectId,
} from "../store/reducers/Home/HomeAction";
import {
  setSelectedIndustry,
  setSelectedProject,
  clearSelections,
} from "../store/reducers/Home/HomeSlice";
import { HomeOutlined, ProjectOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Home = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  const {
    industries,
    customerProjects,
    loadingIndustries,
    loadingCustomerProjects,
    loadingQuestionnaire,
    errorIndustries,
    errorCustomerProjects,
    errorQuestionnaire,
    selectedIndustry,
    selectedProject,
    fetchedQuestionnaire,
  } = useSelector((state) => state.home);

  // Fetch industries & projects once
  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchIndustries());
      dispatch(fetchCustomerProjects());
      hasFetched.current = true;
    }
  }, [dispatch]);

  // Show any fetch errors
  useEffect(() => {
    if (errorIndustries) message.error(`Failed to load industries: ${errorIndustries}`);
    if (errorCustomerProjects) message.error(`Failed to load customer projects: ${errorCustomerProjects}`);
    if (errorQuestionnaire) message.error(`Failed to load questionnaire: ${errorQuestionnaire}`);
  }, [errorIndustries, errorCustomerProjects, errorQuestionnaire]);

  // Pastel color palette for tiles
  const tileColors = [
    "#AEDFF7", "#F7E6AE", "#AEF7A4", "#F7AEDF",
    "#A4F7F0", "#F7A4D6", "#F7A4A1", "#A1F7B5",
  ];
  const getColor = (index) => tileColors[index % tileColors.length];

  // On industry click -> set as selected, clear project
  const handleIndustryClick = (industry) => {
    dispatch(setSelectedIndustry(industry));
    dispatch(setSelectedProject(null));
  };

  // On project click -> set as selected, fetch its questionnaire, clear industry
  const handleProjectClick = (project) => {
    dispatch(setSelectedProject(project));
    dispatch(fetchQuestionnaireByProjectId(project.id));
    dispatch(setSelectedIndustry(null));
  };

  // Flatten out all projects from each customer
  const allProjects = customerProjects.flatMap((cust) => cust.projects || []);

  // Renders each question according to its type
  const renderAnswerField = (question) => {
    const tName = question.questionTypeName?.toLowerCase() || "";
    switch (tName) {
      case "checkbox":
        return (
          <Space direction="vertical">
            {question.options?.map((opt, idx) => (
              <Text key={idx}>
                <input type="checkbox" /> {opt}
              </Text>
            ))}
          </Space>
        );
      case "radio":
        return (
          <Space direction="vertical">
            {question.options?.map((opt, idx) => (
              <Text key={idx}>
                <input type="radio" name={`question_${question.id}`} /> {opt}
              </Text>
            ))}
          </Space>
        );
      case "dropdown":
        return (
          <select style={{ width: "100%" }}>
            <option value="">Select an option</option>
            {question.options?.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case "datepicker":
        return <input type="date" style={{ width: "100%" }} />;
      case "image":
        return question.imageUrl ? (
          <img src={question.imageUrl} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} />
        ) : <Text>No image uploaded.</Text>;
      case "numeric":
        return <input type="number" style={{ width: "100%" }} />;
      case "text":
        return <input type="text" style={{ width: "100%" }} />;
      default:
        return null;
    }
  };

  // Renders the questionnaire below the second slide
  const renderQuestionnaire = () => {
    if (loadingQuestionnaire) return <Spin tip="Loading questionnaire..." />;
    if (errorQuestionnaire) {
      return (
        <Alert
          message="Error"
          description={errorQuestionnaire}
          type="error"
          showIcon
        />
      );
    }
    if (!fetchedQuestionnaire?.length) {
      return <Text>No questionnaire available for this project.</Text>;
    }
    return (
      <div style={{ marginTop: 24 }}>
        <Divider orientation="left">Project Questionnaire</Divider>
        <Row gutter={[16, 16]}>
          {fetchedQuestionnaire.map((question, idx) => (
            <Card
              key={idx}
              title={`Q${idx + 1}: ${question.questionText}`}
              bordered={false}
              style={{ backgroundColor: "#f9f9f9", width: "100%" }}
            >
              {renderAnswerField(question)}
            </Card>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Home
      </Title>

      {/* 1. Industries Slide */}
      <Divider orientation="left">Industries</Divider>
      {loadingIndustries ? (
        <Spin tip="Loading industries..." />
      ) : (
        <div style={{ display: "flex", overflowX: "auto", padding: "16px 0" }}>
          {industries.map((ind, idx) => (
            <Card
              key={ind.id}
              hoverable
              onClick={() => handleIndustryClick(ind)}
              style={{
                backgroundColor: getColor(idx),
                minWidth: 200,
                marginRight: 16,
                cursor: "pointer",
                flex: "0 0 auto",
              }}
            >
              <Space direction="vertical" align="center">
                <HomeOutlined style={{ fontSize: 32, color: "#333" }} />
                <Title level={4} style={{ textAlign: "center" }}>
                  {ind.industryType}
                </Title>
              </Space>
            </Card>
          ))}
        </div>
      )}

      {/* 2. Customer Projects Slide */}
      <Divider orientation="left">Customer Projects</Divider>
      {loadingCustomerProjects ? (
        <Spin tip="Loading customer projects..." />
      ) : (
        <div style={{ display: "flex", overflowX: "auto", padding: "16px 0" }}>
          {allProjects.map((proj, idx) => (
            <Card
              key={proj.id}
              hoverable
              onClick={() => handleProjectClick(proj)}
              style={{
                backgroundColor: getColor(idx),
                minWidth: 200,
                marginRight: 16,
                cursor: "pointer",
                flex: "0 0 auto",
              }}
            >
              <Space direction="vertical" align="center">
                <ProjectOutlined style={{ fontSize: 32, color: "#333" }} />
                <Title level={4} style={{ textAlign: "center" }}>
                  {proj.projectName}
                </Title>
              </Space>
            </Card>
          ))}
        </div>
      )}

      {/* Optional: Display details of the currently selected Industry */}
      {selectedIndustry && (
        <div style={{ marginTop: 24 }}>
          <Divider orientation="left">Industry Details</Divider>
          <Card>
            <Title level={4}>{selectedIndustry.industryType}</Title>
            <Text>{selectedIndustry.description || "No description available."}</Text>
          </Card>
        </div>
      )}

      {/* Render Questionnaire for the selected Project */}
      {selectedProject && (
        <div style={{ marginTop: 24 }}>
          <Divider orientation="left">Project Questionnaire</Divider>
          {renderQuestionnaire()}
        </div>
      )}
    </div>
  );
};

export default Home;
