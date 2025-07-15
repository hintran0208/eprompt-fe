export const TEMPLATE_LIBRARY = [
  {
    id: 'global-write-unit-test',
    name: 'Generate Unit Tests',
    description: 'Generate comprehensive unit tests for your code',
    template: `You are an expert QA Engineer specializing in {{language}} testing. Your task is to write comprehensive {{testType}} unit tests for the provided code.

CONTEXT:
- Language: {{language}}
- Code Type: {{codeType}}
- Testing Framework: {{framework}}
- Focus Areas: {{testAspects}}

REQUIREMENTS:
1. Write clear, maintainable test cases
2. Include edge cases and boundary conditions
3. Test both positive and negative scenarios
4. Follow {{language}} testing best practices
5. Use descriptive test names that explain what is being tested

CODE TO TEST:
\`\`\`{{language}}
{{code}}
\`\`\`

OUTPUT FORMAT:
Please provide:
1. **Test Strategy**: Brief overview of testing approach
2. **Test Cases**: Complete test code with explanations
3. **Coverage Analysis**: What scenarios are covered
4. **Recommendations**: Additional testing considerations

Generate the unit tests now:`,
    role: 'QA Engineer',
    tags: ['Testing', 'Quality Assurance', 'Development'],
    requiredFields: ['language', 'code', 'testType'],
    optionalFields: ['codeType', 'testAspects', 'framework'],
  },
  {
    id: 'global-code-review',
    name: 'Review Code',
    description: 'Review code for best practices, bugs, and improvements',
    template: `You are a Senior Software Engineer conducting a thorough code review. Analyze the provided {{language}} code with expertise and attention to detail.

REVIEW CRITERIA:
- Type: {{reviewType}}
- Focus Areas: {{focus}}
- Standards: {{standards}}

CODE FOR REVIEW:
\`\`\`{{language}}
{{code}}
\`\`\`

REVIEW FRAMEWORK:
Evaluate the code across these dimensions:

1. **FUNCTIONALITY** 
   - Does the code work as intended?
   - Are there any logical errors or bugs?

2. **CODE QUALITY**
   - Readability and maintainability
   - Naming conventions
   - Code structure and organization

3. **PERFORMANCE**
   - Efficiency considerations
   - Potential bottlenecks
   - Resource usage

4. **SECURITY**
   - Vulnerability assessment
   - Input validation
   - Security best practices

5. **BEST PRACTICES**
   - Language-specific conventions
   - Design patterns usage
   - Error handling

OUTPUT FORMAT:
## Code Review Summary
**Overall Rating**: [1-5 stars]
**Status**: [Approve/Request Changes/Needs Major Revision]

## Detailed Findings

### ✅ Strengths
- [List positive aspects]

### ⚠️ Issues Found
- [List issues with severity: Critical/Major/Minor]

### 🔧 Recommendations
- [Specific improvement suggestions]

### 📝 Code Suggestions
\`\`\`{{language}}
// Improved code snippets
\`\`\`

Provide your comprehensive review:`,
    role: 'Senior Developer',
    tags: ['Code Review', 'Development', 'Quality'],
    requiredFields: ['language', 'code'],
    optionalFields: ['reviewType', 'focus', 'standards'],
  },
  {
    id: 'global-write-user-story',
    name: 'Write User Story',
    description: 'Create detailed user stories with acceptance criteria',
    template: `You are an experienced Product Owner crafting user stories that drive valuable product development. Create a comprehensive user story following Agile best practices.

CONTEXT:
- Feature: {{feature}}
- Target User: {{userType}}
- Business Value: {{businessValue}}
- Priority: {{priority}}

USER STORY FRAMEWORK:
Create a well-structured user story that includes all essential elements for development team clarity and business value alignment.

STORY TEMPLATE:
## User Story

**As a** {{userType}}
**I want** [clear capability description]
**So that** [business value/benefit]

## Acceptance Criteria

Given [initial context/state]
When [action/trigger]
Then [expected outcome]

## Definition of Done
- [ ] [Technical requirements]
- [ ] [Quality gates]
- [ ] [Documentation needs]

## Additional Details

### Business Context
- **Priority**: {{priority}}
- **Business Value**: {{businessValue}}
- **Success Metrics**: [How will we measure success?]

### Technical Considerations
- **Dependencies**: [Any system dependencies]
- **Constraints**: [Technical or business constraints]
- **Integration Points**: [Systems that need to integrate]

### UX/UI Notes
- **User Flow**: [High-level user journey]
- **Interface Requirements**: [Key UI elements]
- **Accessibility**: [A11y considerations]

ADDITIONAL CRITERIA:
{{acceptanceCriteria}}

Please create the complete user story following this structure:`,
    role: 'Product Owner',
    tags: ['Product Management', 'Requirements', 'Agile'],
    requiredFields: ['feature', 'userType'],
    optionalFields: ['acceptanceCriteria', 'businessValue', 'priority'],
  },
  {
    id: 'global-api-documentation',
    name: 'Create API Documentation',
    description: 'Generate comprehensive API documentation',
    template: `You are a Technical Writer specializing in API documentation. Create comprehensive, developer-friendly documentation for the specified API endpoint.

API DETAILS:
- Type: {{apiType}}
- Endpoint: {{endpoint}}
- Target Audience: {{audienceLevel}}
- Required Sections: {{sections}}
- Include Examples: {{examples}}

DOCUMENTATION STRUCTURE:

# API Endpoint Documentation

## Overview
**Endpoint**: \`{{endpoint}}\`
**Method**: [HTTP Method]
**Purpose**: [Brief description of what this endpoint does]

## Authentication
[Authentication requirements and format]

## Request

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param1    | type | Yes/No   | Description |

### Query Parameters
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| param1    | type | Yes/No   | Description | value   |

### Request Headers
\`\`\`
Content-Type: application/json
Authorization: Bearer {token}
\`\`\`

### Request Body
\`\`\`json
{
  "field1": "string",
  "field2": 123,
  "field3": true
}
\`\`\`

## Response

### Success Response (200 OK)
\`\`\`json
{
  "status": "success",
  "data": {
    "id": 123,
    "name": "example"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

### Error Responses
#### 400 Bad Request
\`\`\`json
{
  "status": "error",
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
\`\`\`

#### 401 Unauthorized
\`\`\`json
{
  "status": "error",
  "message": "Authentication required"
}
\`\`\`

## Code Examples

### cURL
\`\`\`bash
curl -X POST "{{endpoint}}" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "field1": "value1",
    "field2": "value2"
  }'
\`\`\`

### JavaScript/Node.js
\`\`\`javascript
const response = await fetch('{{endpoint}}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    field1: 'value1',
    field2: 'value2'
  })
});

const data = await response.json();
\`\`\`

### Python
\`\`\`python
import requests

url = "{{endpoint}}"
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
}
data = {
    "field1": "value1",
    "field2": "value2"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
\`\`\`

## Rate Limiting
[Rate limiting information and headers]

## Changelog
- v1.0: Initial release
- v1.1: Added new parameters

## Support
For questions about this API, contact: [support information]

Please generate the complete API documentation following this comprehensive structure:`,
    role: 'Technical Writer',
    tags: ['Documentation', 'API', 'Development'],
    requiredFields: ['apiType', 'endpoint'],
    optionalFields: ['sections', 'audienceLevel', 'examples'],
  },  {
    id: 'global-database-design',
    name: 'Design Database Schema',
    description: 'Design database schemas and relationships',
    template: `You are a Database Architect with expertise in {{databaseType}} database design. Design a robust, scalable database schema following best practices.

PROJECT CONTEXT:
- Application: {{application}}
- Database Type: {{databaseType}}
- Key Entities: {{entities}}
- Requirements: {{requirements}}
- Constraints: {{constraints}}

DESIGN PRINCIPLES:
1. **Normalization**: Ensure proper normalization (1NF, 2NF, 3NF)
2. **Performance**: Optimize for expected query patterns
3. **Scalability**: Design for future growth
4. **Data Integrity**: Implement proper constraints and relationships
5. **Security**: Consider data protection and access patterns

SCHEMA DESIGN FRAMEWORK:

## Database Schema Design

### 1. Entity Relationship Analysis
[Identify main entities and their relationships]

### 2. Tables Design

#### Table: [table_name]
\`\`\`sql
CREATE TABLE table_name (
    id {{databaseType === 'PostgreSQL' ? 'SERIAL' : 'INT AUTO_INCREMENT'}} PRIMARY KEY,
    column1 VARCHAR(255) NOT NULL,
    column2 INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
\`\`\`

**Purpose**: [Explain table purpose]
**Key Relationships**: [Describe foreign key relationships]

### 3. Relationships & Constraints

#### Foreign Keys
\`\`\`sql
ALTER TABLE child_table 
ADD CONSTRAINT fk_parent 
FOREIGN KEY (parent_id) REFERENCES parent_table(id);
\`\`\`

#### Indexes
\`\`\`sql
-- Performance indexes
CREATE INDEX idx_table_column ON table_name(column_name);
CREATE UNIQUE INDEX idx_table_unique ON table_name(unique_column);
\`\`\`

### 4. Data Integrity Rules
- **Business Rules**: [Specify business logic constraints]
- **Validation**: [Data validation requirements]
- **Triggers**: [Any automated business logic]

### 5. Performance Considerations
- **Query Optimization**: [Expected query patterns]
- **Indexing Strategy**: [Index recommendations]
- **Partitioning**: [If applicable for large datasets]

### 6. Security & Access Control
- **Sensitive Data**: [Identify PII and sensitive fields]
- **Access Patterns**: [Who accesses what data]
- **Encryption**: [Fields requiring encryption]

### 7. Migration Strategy
\`\`\`sql
-- Initial schema creation
-- Version 1.0
\`\`\`

### 8. Sample Data & Test Queries
\`\`\`sql
-- Sample INSERT statements
INSERT INTO table_name (column1, column2) VALUES ('value1', 123);

-- Common queries
SELECT * FROM table_name WHERE condition;
\`\`\`

Please design the complete database schema following this comprehensive structure:`,
    role: 'Database Architect',
    tags: ['Database', 'Architecture', 'Design'],
    requiredFields: ['databaseType', 'application'],
    optionalFields: ['entities', 'requirements', 'constraints'],
  },
  {
    id: 'global-ui-wireframe',
    name: 'Create UI Wireframe',
    description: 'Create wireframes and UI component specifications',
    template: `You are a UI/UX Designer creating detailed wireframes and component specifications. Design user-centered interfaces that prioritize usability and accessibility.

DESIGN CONTEXT:
- Component Type: {{componentType}}
- Application: {{application}}
- Target Device: {{deviceType}}
- User Goals: {{userGoals}}
- Constraints: {{constraints}}

UX DESIGN PRINCIPLES:
1. **User-Centered**: Focus on user needs and goals
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Responsive**: Mobile-first, progressive enhancement
4. **Consistency**: Follow design system patterns
5. **Performance**: Optimize for loading and interaction

WIREFRAME SPECIFICATION:

## UI Wireframe: {{componentType}}

### 1. User Context & Goals
**Primary Users**: [User personas]
**Key Tasks**: [What users want to accomplish]
**Success Criteria**: [How we measure UX success]

### 2. Information Architecture
\`\`\`
Header
├── Navigation
├── User Actions
└── Search/Filter

Main Content
├── Primary Content Area
├── Secondary Information
└── Interactive Elements

Footer
├── Links
└── Legal/Contact
\`\`\`

### 3. Wireframe Layout

#### Desktop (1920x1080+)
\`\`\`
┌─────────────────────────────────────────────────┐
│ [Logo]    [Nav Items]           [User Menu]     │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Main Content Area]          [Sidebar]         │
│  ┌─────────────────────────┐   ┌─────────────┐   │
│  │                         │   │             │   │
│  │  {{componentType}}      │   │  Secondary  │   │
│  │                         │   │  Content    │   │
│  │  [Primary Actions]      │   │             │   │
│  └─────────────────────────┘   └─────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Footer Links]                    [Contact]     │
└─────────────────────────────────────────────────┘
\`\`\`

#### Mobile (390x844)
\`\`\`
┌─────────────────────┐
│ [☰] [Logo] [User]   │
├─────────────────────┤
│                     │
│  [Main Content]     │
│  ┌─────────────────┐ │
│  │                 │ │
│  │ {{componentType}}│ │
│  │                 │ │
│  │ [Actions]       │ │
│  └─────────────────┘ │
│                     │
│  [Secondary Info]   │
│                     │
├─────────────────────┤
│ [Footer]            │
└─────────────────────┘
\`\`\`

### 4. Component Specifications

#### Interactive Elements
| Element | Type | Behavior | States |
|---------|------|----------|--------|
| Primary Button | CTA | Click → Action | Default, Hover, Active, Disabled |
| Input Field | Text | Focus, Validation | Empty, Filled, Error, Success |
| Navigation | Menu | Hover, Click | Active, Inactive |

#### Content Hierarchy
1. **H1**: Primary page title
2. **H2**: Section headers
3. **H3**: Subsection headers
4. **Body**: Regular content
5. **Caption**: Supporting text

### 5. Responsive Behavior
- **Breakpoints**: 390px, 768px, 1024px, 1920px
- **Layout Changes**: [Describe how layout adapts]
- **Content Priority**: [What content is most important on mobile]

### 6. Accessibility Features
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader**: ARIA labels and descriptions
- **Color Contrast**: Minimum 4.5:1 ratio
- **Touch Targets**: Minimum 44px for mobile

### 7. User Flow
1. **Entry Point**: [How users arrive]
2. **Primary Path**: [Main user journey]
3. **Alternative Paths**: [Secondary flows]
4. **Exit Points**: [How users complete or leave]

### 8. Technical Specifications
- **Framework**: [UI framework if specified]
- **Components**: [Reusable component library]
- **State Management**: [How data flows]
- **Performance**: [Loading and interaction targets]

### 9. Testing Considerations
- **Usability Tests**: [Key scenarios to test]
- **A/B Tests**: [Variations to consider]
- **Analytics**: [Metrics to track]

Please create the complete wireframe specification following this structure:`,
    role: 'UI/UX Designer',
    tags: ['UI/UX', 'Design', 'Wireframing'],
    requiredFields: ['componentType', 'application'],
    optionalFields: ['deviceType', 'userGoals', 'constraints'],
  },  {
    id: 'global-sprint-planning',
    name: 'Plan Sprint',
    description: 'Plan and organize sprint activities and goals',
    template: `You are an experienced Scrum Master facilitating sprint planning for maximum team effectiveness and delivery value.

SPRINT CONTEXT:
- Sprint: {{sprintNumber}}
- Project: {{project}}
- Sprint Duration: {{sprintDuration}}
- Sprint Goals: {{sprintGoals}}
- Team Capacity: {{teamCapacity}}

AGILE PRINCIPLES:
1. **Collaboration**: Foster team involvement in planning
2. **Transparency**: Clear visibility of work and progress
3. **Adaptability**: Plan for change and learning
4. **Value Focus**: Prioritize highest business value
5. **Sustainable Pace**: Respect team capacity

SPRINT PLANNING FRAMEWORK:

# Sprint {{sprintNumber}} Planning

## Sprint Overview
**Project**: {{project}}
**Duration**: {{sprintDuration}}
**Sprint Goal**: [Primary objective for this sprint]
**Start Date**: [Sprint start]
**End Date**: [Sprint end]

## Part 1: What Will We Deliver?

### Sprint Goal
**Primary Objective**: {{sprintGoals}}
**Success Criteria**: [How we'll know we've succeeded]
**Business Value**: [Why this sprint matters]

### Product Backlog Items
| Priority | Story | Story Points | Business Value | Dependencies |
|----------|-------|-------------|----------------|--------------|
| High     | [Story Title] | 8 | High | None |
| Medium   | [Story Title] | 5 | Medium | Story 1 |
| Low      | [Story Title] | 3 | Low | None |

**Total Commitment**: [X story points]

## Part 2: How Will We Do the Work?

### Team Capacity Analysis
**Team Members**: {{teamCapacity}}
**Available Hours**: [Total hours minus meetings, PTO, etc.]
**Velocity**: [Historical average story points per sprint]
**Capacity Buffer**: [10-20% for unexpected work]

### Task Breakdown
#### Story 1: [Title]
- [ ] **Task 1**: [Description] - [Estimate] - [Assignee]
- [ ] **Task 2**: [Description] - [Estimate] - [Assignee]
- [ ] **Task 3**: [Description] - [Estimate] - [Assignee]

#### Story 2: [Title]
- [ ] **Task 1**: [Description] - [Estimate] - [Assignee]
- [ ] **Task 2**: [Description] - [Estimate] - [Assignee]

### Definition of Done Checklist
- [ ] Code review completed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] UI/UX review completed
- [ ] Acceptance criteria met
- [ ] Demo prepared

## Risk Assessment & Mitigation

### Identified Risks
| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| [Risk 1] | High | Medium | [Mitigation plan] |
| [Risk 2] | Medium | Low | [Mitigation plan] |

### Dependencies
- **External**: [Dependencies outside team control]
- **Internal**: [Dependencies within team]
- **Technical**: [Technical prerequisites]

## Sprint Ceremonies Schedule

### Daily Standups
- **When**: [Time and days]
- **Duration**: 15 minutes
- **Format**: What did you do? What will you do? Any blockers?

### Sprint Review
- **When**: [End of sprint]
- **Duration**: [Time based on sprint length]
- **Attendees**: [Stakeholders list]

### Sprint Retrospective
- **When**: [After sprint review]
- **Duration**: [Time based on sprint length]
- **Focus**: [What went well, what to improve, action items]

## Communication Plan

### Stakeholder Updates
- **Weekly**: [Update format and recipients]
- **Blockers**: [Escalation process]
- **Changes**: [Change management process]

### Team Collaboration
- **Working Agreements**: [Team norms and expectations]
- **Communication Channels**: [Slack, email, etc.]
- **Documentation**: [Where to find and update info]

## Success Metrics

### Sprint Metrics
- **Velocity**: [Target story points]
- **Burndown**: [Expected completion rate]
- **Quality**: [Bug count, test coverage]

### Business Metrics
- **Value Delivered**: [How to measure business impact]
- **User Satisfaction**: [Feedback mechanisms]
- **Performance**: [Technical performance targets]

## Contingency Planning

### If We're Ahead of Schedule
1. Pull additional items from backlog
2. Focus on technical debt
3. Improve test coverage
4. Documentation improvements

### If We're Behind Schedule
1. Re-evaluate scope
2. Identify what can be moved to next sprint
3. Focus on sprint goal achievement
4. Escalate if needed

Please create the complete sprint plan following this comprehensive structure:`,
    role: 'Scrum Master',
    tags: ['Agile', 'Sprint Planning', 'Project Management'],
    requiredFields: ['sprintNumber', 'project'],
    optionalFields: ['sprintGoals', 'teamCapacity', 'sprintDuration'],
  },
  {
    id: 'global-bug-report',
    name: 'Report Bug',
    description: 'Create detailed bug reports with reproduction steps',
    template: `You are a QA Tester creating a comprehensive bug report to help developers quickly understand, reproduce, and fix the issue.

BUG CONTEXT:
- Issue Type: {{issueType}}
- Application: {{application}}
- Environment: {{environment}}
- Reproduction Steps: {{reproductionSteps}}
- Expected Behavior: {{expectedBehavior}}

BUG REPORTING BEST PRACTICES:
1. **Clarity**: Make the issue immediately understandable
2. **Reproducibility**: Provide clear steps to recreate
3. **Evidence**: Include screenshots, logs, and data
4. **Impact**: Explain the business and user impact
5. **Priority**: Help teams understand urgency

BUG REPORT TEMPLATE:

# Bug Report: [Concise Issue Summary]

## Bug Overview
**Reporter**: [Your name]
**Date**: [Current date]
**Application**: {{application}}
**Issue Type**: {{issueType}}
**Severity**: [Critical/High/Medium/Low]
**Priority**: [P1/P2/P3/P4]

## Summary
[One-line description of the bug that would make sense to a stakeholder]

## Environment Details
- **OS**: [Operating system and version]
- **Browser**: [Browser name and version]
- **Device**: [Desktop/Mobile/Tablet + model if relevant]
- **Screen Resolution**: [If UI-related]
- **Application Version**: [Version number or build]
- **Environment**: {{environment}}

## Reproduction Steps
**Preconditions**: [Any setup required before reproducing]

1. [Step 1 - be specific about what to click/type]
2. [Step 2 - include exact data to enter]
3. [Step 3 - specify what to look for]
4. [Continue with numbered steps...]

**Test Data**: [Any specific data needed to reproduce]
{{reproductionSteps}}

## Expected Behavior
{{expectedBehavior}}

[What should happen when following the reproduction steps]

## Actual Behavior
[What actually happens - be specific about error messages, incorrect data, etc.]

## Evidence

### Screenshots/Videos
[Attach relevant screenshots or screen recordings]
- **Before**: [Screenshot of initial state]
- **After**: [Screenshot showing the bug]
- **Expected**: [Screenshot or mockup of expected result]

### Console Logs
\`\`\`
[Paste any relevant console errors or logs]
\`\`\`

### Network Activity
[Any relevant network requests/responses if applicable]

## Impact Assessment

### User Impact
- **Affected Users**: [Who is impacted?]
- **Frequency**: [How often does this occur?]
- **Workaround**: [Is there a way users can work around this?]

### Business Impact
- **Revenue Impact**: [Does this affect sales/conversions?]
- **Support Impact**: [Will this increase support tickets?]
- **Reputation Risk**: [Could this affect user trust?]

## Additional Context

### Related Issues
- **Similar Bugs**: [Links to related bug reports]
- **Feature Requests**: [Related feature requests]
- **Documentation**: [Relevant documentation]

### Technical Notes
- **Error Codes**: [Any specific error codes]
- **API Responses**: [Relevant API response data]
- **Database State**: [Any relevant DB information]

### Regression Information
- **When Introduced**: [When did this start happening?]
- **Last Working Version**: [What version worked correctly?]
- **Recent Changes**: [Any recent deployments or changes?]

## Suggested Investigation Areas
1. [Area 1 - e.g., authentication module]
2. [Area 2 - e.g., database connection]
3. [Area 3 - e.g., third-party integration]

## Testing Notes
- **Browsers Tested**: [List browsers where bug was verified]
- **Devices Tested**: [List devices where bug was verified]
- **Edge Cases**: [Any edge cases discovered]

Please create a comprehensive bug report following this detailed structure:`,
    role: 'QA Tester',
    tags: ['Testing', 'Bug Tracking', 'Quality Assurance'],
    requiredFields: ['issueType', 'application'],
    optionalFields: ['reproductionSteps', 'expectedBehavior', 'environment'],
  },  {
    id: 'global-architecture-design',
    name: 'Design System Architecture',
    description: 'Design system architecture and component interactions',
    template: `You are a Software Architect designing scalable, maintainable system architecture. Create a comprehensive architectural design that addresses current needs and future growth.

ARCHITECTURE CONTEXT:
- Architecture Type: {{architectureType}}
- System: {{system}}
- Key Components: {{components}}
- Requirements: {{requirements}}
- Scalability Needs: {{scalability}}

ARCHITECTURAL PRINCIPLES:
1. **Modularity**: Loosely coupled, highly cohesive components
2. **Scalability**: Handle increased load gracefully
3. **Maintainability**: Easy to modify and extend
4. **Reliability**: Fault tolerance and error handling
5. **Security**: Defense in depth approach
6. **Performance**: Efficient resource utilization

ARCHITECTURE DESIGN FRAMEWORK:

# System Architecture Design: {{system}}

## Executive Summary
**Architecture Type**: {{architectureType}}
**System Purpose**: [High-level system description]
**Key Stakeholders**: [Development team, operations, business users]
**Success Criteria**: [How we measure architectural success]

## 1. Architecture Overview

### System Context
\`\`\`
┌─────────────────────────────────────────────────┐
│                 External Systems                │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │ Client  │    │ Payment │    │   CRM   │      │
│  │   App   │    │ Gateway │    │ System  │      │
│  └─────────┘    └─────────┘    └─────────┘      │
│       │              │              │           │
└───────┼──────────────┼──────────────┼───────────┘
        │              │              │
┌───────▼──────────────▼──────────────▼───────────┐
│                {{system}}                       │
│  ┌─────────────────────────────────────────────┐ │
│  │              Core Business Logic           │ │
│  └─────────────────────────────────────────────┘ │
│  ┌─────────┐  ┌─────────┐  ┌─────────────────┐  │
│  │   API   │  │  Data   │  │    Security     │  │
│  │ Gateway │  │ Layer   │  │   & Auth        │  │
│  └─────────┘  └─────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────┘
\`\`\`

### Key Components
{{components}}

## 2. Detailed Architecture

### Component Architecture
#### Component 1: [Name]
- **Purpose**: [What this component does]
- **Responsibilities**: [Key functions]
- **Interfaces**: [How it communicates]
- **Technology Stack**: [Implementation details]

#### Component 2: [Name]
- **Purpose**: [What this component does]
- **Responsibilities**: [Key functions]
- **Interfaces**: [How it communicates]
- **Technology Stack**: [Implementation details]

### Data Architecture
\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │    Cache    │    │  Database   │
│   Devices   │◄──►│   Layer     │◄──►│   Cluster   │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                   ┌─────────────┐
                   │   Message   │
                   │    Queue    │
                   └─────────────┘
\`\`\`

### Security Architecture
- **Authentication**: [Auth strategy and implementation]
- **Authorization**: [Permission model]
- **Data Protection**: [Encryption and data handling]
- **Network Security**: [Firewall, VPN, security groups]
- **Monitoring**: [Security logging and alerting]

## 3. Technology Stack

### Frontend
- **Framework**: [React, Vue, Angular, etc.]
- **State Management**: [Redux, Vuex, etc.]
- **UI Library**: [Material-UI, Ant Design, etc.]

### Backend
- **Runtime**: [Node.js, Python, Java, etc.]
- **Framework**: [Express, Django, Spring Boot, etc.]
- **API Style**: [REST, GraphQL, gRPC]

### Database
- **Primary**: [PostgreSQL, MySQL, MongoDB, etc.]
- **Cache**: [Redis, Memcached]
- **Search**: [Elasticsearch, Solr]

### Infrastructure
- **Cloud Provider**: [AWS, Azure, GCP]
- **Containers**: [Docker, Kubernetes]
- **CI/CD**: [Jenkins, GitHub Actions, GitLab CI]

## 4. Non-Functional Requirements

### Performance
- **Response Time**: [Target response times]
- **Throughput**: [Requests per second]
- **Concurrency**: [Concurrent users]

### Scalability
{{scalability}}
- **Horizontal Scaling**: [How to scale out]
- **Vertical Scaling**: [When to scale up]
- **Auto-scaling**: [Automatic scaling triggers]

### Reliability
- **Availability**: [Uptime targets - 99.9%, 99.99%]
- **Recovery Time**: [RTO and RPO targets]
- **Fault Tolerance**: [How system handles failures]

### Security
- **Data Privacy**: [GDPR, HIPAA compliance]
- **Access Control**: [Authentication and authorization]
- **Audit Logging**: [Security event tracking]

## 5. Deployment Architecture

### Environment Strategy
\`\`\`
Development → Testing → Staging → Production
     │           │         │          │
 Feature      Integration  User       Live
 Testing       Testing   Acceptance   System
\`\`\`

### Infrastructure as Code
\`\`\`yaml
# Example Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{system}}-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: {{system}}
  template:
    metadata:
      labels:
        app: {{system}}
    spec:
      containers:
      - name: app
        image: {{system}}:latest
        ports:
        - containerPort: 8080
\`\`\`

## 6. Integration Patterns

### API Design
- **RESTful APIs**: [Resource-based URLs]
- **Authentication**: [JWT, OAuth 2.0]
- **Rate Limiting**: [Request throttling]
- **Versioning**: [API versioning strategy]

### Message Patterns
- **Synchronous**: [Direct API calls]
- **Asynchronous**: [Message queues, event streaming]
- **Event Sourcing**: [Event-driven architecture]

## 7. Monitoring & Observability

### Metrics
- **Business Metrics**: [KPIs and business outcomes]
- **Technical Metrics**: [Performance, errors, resource usage]
- **User Experience**: [Frontend performance, user flows]

### Logging
\`\`\`json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "INFO",
  "service": "{{system}}",
  "traceId": "abc123",
  "message": "User authentication successful"
}
\`\`\`

### Alerting
- **Critical**: [System down, data loss]
- **Warning**: [Performance degradation, high error rate]
- **Info**: [Deployment completion, scheduled maintenance]

## 8. Risk Assessment

### Technical Risks
| Risk | Impact | Mitigation |
|------|---------|------------|
| Single point of failure | High | Implement redundancy |
| Data loss | Critical | Regular backups, replication |
| Security breach | High | Security audits, monitoring |

### Operational Risks
| Risk | Impact | Mitigation |
|------|---------|------------|
| Deployment failures | Medium | Blue-green deployment |
| Capacity planning | Medium | Auto-scaling, monitoring |
| Team knowledge | Medium | Documentation, training |

## 9. Migration Strategy
1. **Assessment**: [Current state analysis]
2. **Planning**: [Migration roadmap]
3. **Execution**: [Phased implementation]
4. **Validation**: [Testing and verification]
5. **Cutover**: [Go-live process]

## 10. Future Considerations
- **Technology Evolution**: [How architecture will adapt]
- **Business Growth**: [Scaling for business needs]
- **Maintenance**: [Ongoing architectural evolution]

Please design the complete system architecture following this comprehensive framework:`,
    role: 'Software Architect',
    tags: ['Architecture', 'System Design', 'Development'],
    requiredFields: ['architectureType', 'system'],
    optionalFields: ['components', 'requirements', 'scalability'],
  },
  {
    id: 'global-performance-analysis',
    name: 'Analyze Performance',
    description: 'Analyze and optimize application performance',
    template: `You are a DevOps Engineer and Performance Specialist conducting a comprehensive performance analysis. Provide actionable insights for optimization.

PERFORMANCE CONTEXT:
- Component: {{applicationComponent}}
- Metrics: {{performanceMetrics}}
- Goals: {{optimizationGoals}}
- Tools: {{tools}}
- Benchmarks: {{benchmarks}}

PERFORMANCE ANALYSIS FRAMEWORK:

# Performance Analysis Report: {{applicationComponent}}

## Executive Summary
**Component Analyzed**: {{applicationComponent}}
**Analysis Date**: [Current date]
**Key Findings**: [High-level performance summary]
**Recommendations**: [Top 3 optimization priorities]

## 1. Performance Baseline

### Current Metrics
{{performanceMetrics}}

#### Response Time Analysis
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Average Response Time | [X]ms | [Y]ms | ⚠️/✅ |
| 95th Percentile | [X]ms | [Y]ms | ⚠️/✅ |
| 99th Percentile | [X]ms | [Y]ms | ⚠️/✅ |

#### Throughput Analysis
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Requests/Second | [X] | [Y] | ⚠️/✅ |
| Concurrent Users | [X] | [Y] | ⚠️/✅ |
| Peak Capacity | [X] | [Y] | ⚠️/✅ |

#### Resource Utilization
| Resource | Current | Threshold | Status |
|----------|---------|-----------|--------|
| CPU Usage | [X]% | 70% | ⚠️/✅ |
| Memory Usage | [X]% | 80% | ⚠️/✅ |
| Disk I/O | [X] IOPS | [Y] IOPS | ⚠️/✅ |
| Network I/O | [X] Mbps | [Y] Mbps | ⚠️/✅ |

## 2. Performance Bottlenecks

### Critical Issues (P1)
#### Issue 1: [Bottleneck Name]
- **Impact**: [High/Medium/Low]
- **Symptoms**: [What users experience]
- **Root Cause**: [Technical explanation]
- **Affected Components**: [List impacted systems]

#### Issue 2: [Bottleneck Name]
- **Impact**: [High/Medium/Low]
- **Symptoms**: [What users experience]
- **Root Cause**: [Technical explanation]
- **Affected Components**: [List impacted systems]

### Performance Hotspots
\`\`\`
Database Queries (40% of response time)
├── Slow JOIN operations (15%)
├── Missing indexes (12%)
├── N+1 query problems (8%)
└── Inefficient WHERE clauses (5%)

Network Latency (25% of response time)
├── External API calls (15%)
├── CDN cache misses (7%)
└── DNS resolution (3%)

Application Logic (35% of response time)
├── CPU-intensive operations (20%)
├── Memory allocation (10%)
└── Synchronous processing (5%)
\`\`\`

## 3. Detailed Analysis

### Frontend Performance
#### Browser Metrics
- **First Contentful Paint**: [X]ms
- **Largest Contentful Paint**: [X]ms
- **First Input Delay**: [X]ms
- **Cumulative Layout Shift**: [X]

#### JavaScript Performance
\`\`\`javascript
// Performance profiling results
const performanceMarks = {
  'app-start': 0,
  'dom-loaded': 250,
  'first-render': 450,
  'interactive': 800
};
\`\`\`

### Backend Performance
#### API Response Times
\`\`\`
GET /api/users        - 120ms (baseline: 80ms)  ⚠️
POST /api/orders      - 350ms (baseline: 200ms) ⚠️
GET /api/products     - 45ms  (baseline: 50ms)  ✅
\`\`\`

#### Database Performance
\`\`\`sql
-- Slow query analysis
SELECT query, avg_time, calls, percentage
FROM slow_query_log
WHERE avg_time > 100
ORDER BY avg_time DESC;
\`\`\`

### Infrastructure Performance
#### Server Metrics
- **Load Average**: [1m: X, 5m: Y, 15m: Z]
- **Memory Pressure**: [Available: X GB, Used: Y GB]
- **Disk Performance**: [Read: X IOPS, Write: Y IOPS]

#### Network Analysis
- **Bandwidth Utilization**: [X% of available capacity]
- **Packet Loss**: [X% loss rate]
- **Connection Pool**: [Active: X, Idle: Y, Max: Z]

## 4. Performance Testing Results

### Load Testing
\`\`\`
Test Scenario: Normal Load
- Concurrent Users: 100
- Duration: 10 minutes
- Result: ✅ PASS (Response time < 200ms)

Test Scenario: Peak Load
- Concurrent Users: 500
- Duration: 5 minutes
- Result: ⚠️ DEGRADED (Response time 300-500ms)

Test Scenario: Stress Test
- Concurrent Users: 1000
- Duration: 2 minutes
- Result: ❌ FAIL (Timeouts and errors)
\`\`\`

### Benchmark Comparison
{{benchmarks}}

## 5. Root Cause Analysis

### Performance Issues by Category

#### Database Issues
1. **Missing Indexes**
   - Tables: [table1, table2]
   - Impact: 200% slower queries
   - Solution: Create composite indexes

2. **Query Optimization**
   - Inefficient JOINs
   - N+1 query patterns
   - Large result sets

#### Application Issues
1. **Memory Leaks**
   - Location: [Component/module]
   - Growth Rate: [X MB/hour]
   - Impact: Increased GC pressure

2. **CPU Bottlenecks**
   - Heavy computation in main thread
   - Inefficient algorithms
   - Synchronous processing

#### Infrastructure Issues
1. **Resource Constraints**
   - CPU: [Current vs Required]
   - Memory: [Current vs Required]
   - Storage: [IOPS limitations]

2. **Network Bottlenecks**
   - Bandwidth limitations
   - High latency connections
   - CDN configuration

## 6. Optimization Recommendations

### Immediate Actions (0-2 weeks)
#### Priority 1: Database Optimization
\`\`\`sql
-- Create missing indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_date ON orders(created_at, status);
\`\`\`

#### Priority 2: Query Optimization
\`\`\`javascript
// Implement query batching
const users = await User.findByIds(userIds, {
  batch: true,
  cache: true
});
\`\`\`

#### Priority 3: Caching Strategy
\`\`\`javascript
// Add Redis caching
const cacheKey = \`user:\${userId}\`;
let user = await redis.get(cacheKey);
if (!user) {
  user = await User.findById(userId);
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
}
\`\`\`

### Short-term Improvements (2-8 weeks)
1. **Application Optimization**
   - Implement connection pooling
   - Add asynchronous processing
   - Optimize memory usage

2. **Infrastructure Scaling**
   - Horizontal scaling setup
   - Load balancer configuration
   - CDN optimization

### Long-term Strategy (2-6 months)
1. **Architecture Evolution**
   - Microservices decomposition
   - Event-driven architecture
   - Database sharding

2. **Technology Upgrades**
   - Framework updates
   - Database engine optimization
   - Infrastructure modernization

## 7. Monitoring and Alerting

### Performance Monitoring Setup
\`\`\`yaml
# Prometheus monitoring
- alert: HighResponseTime
  expr: http_request_duration_seconds > 0.5
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "High response time detected"
\`\`\`

### Key Performance Indicators (KPIs)
- **Response Time**: 95th percentile < 200ms
- **Throughput**: > 1000 RPS sustained
- **Error Rate**: < 0.1%
- **Availability**: > 99.9%

## 8. Implementation Roadmap

### Phase 1: Quick Wins (Week 1-2)
- [ ] Database index creation
- [ ] Query optimization
- [ ] Basic caching implementation

### Phase 2: Infrastructure (Week 3-6)
- [ ] Load balancer setup
- [ ] CDN configuration
- [ ] Monitoring implementation

### Phase 3: Architecture (Week 7-12)
- [ ] Service decomposition
- [ ] Event-driven patterns
- [ ] Advanced caching

### Success Metrics
- **Target Response Time**: {{optimizationGoals}}
- **Improvement Goals**: [Specific percentage improvements]
- **Business Impact**: [Expected business outcomes]

Please provide a comprehensive performance analysis following this detailed framework:`,
    role: 'DevOps Engineer',
    tags: ['Performance', 'Optimization', 'DevOps'],
    requiredFields: ['applicationComponent', 'performanceMetrics'],
    optionalFields: ['optimizationGoals', 'tools', 'benchmarks'],
  },  {
    id: 'global-security-assessment',
    name: 'Assess Security',
    description: 'Conduct security assessments and vulnerability analysis',
    template: `You are a Security Engineer conducting a comprehensive security assessment. Provide thorough analysis and actionable recommendations to strengthen system security.

SECURITY ASSESSMENT SCOPE:
- System Component: {{systemComponent}}
- Security Aspects: {{securityAspects}}
- Vulnerability Types: {{vulnerabilityTypes}}
- Compliance Requirements: {{compliance}}
- Recommendations Needed: {{recommendations}}

SECURITY FRAMEWORK - OWASP & NIST:
1. **Confidentiality**: Protect sensitive data from unauthorized access
2. **Integrity**: Ensure data accuracy and prevent tampering
3. **Availability**: Maintain system accessibility and uptime
4. **Authentication**: Verify user and system identities
5. **Authorization**: Control access to resources and functions
6. **Non-repudiation**: Ensure actions can be traced and verified

SECURITY ASSESSMENT REPORT:

# Security Assessment: {{systemComponent}}

## Executive Summary
**Assessment Date**: [Current date]
**Scope**: {{systemComponent}}
**Security Aspects Evaluated**: {{securityAspects}}
**Overall Risk Rating**: [Critical/High/Medium/Low]
**Compliance Status**: [Compliant/Non-compliant/Partial]

### Key Findings
- **Critical Vulnerabilities**: [Number found]
- **High-Risk Issues**: [Number found]
- **Compliance Gaps**: [Number of gaps]
- **Immediate Actions Required**: [Number of urgent items]

## 1. Threat Model Analysis

### Attack Surface Mapping
\`\`\`
┌─────────────────────────────────────────────────┐
│                 Attack Vectors                  │
│                                                 │
│  External    │    Internal    │    Physical     │
│  ┌─────────┐ │   ┌─────────┐  │  ┌─────────┐    │
│  │   Web   │ │   │Employee │  │  │ Server  │    │
│  │  APIs   │ │   │ Access  │  │  │ Access  │    │
│  └─────────┘ │   └─────────┘  │  └─────────┘    │
│      │       │       │        │       │         │
│      ▼       │       ▼        │       ▼         │
│  ┌─────────────────────────────────────────────┐ │
│  │         {{systemComponent}}                 │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │ │
│  │  │   App   │ │  Data   │ │   Infrastructure│ │ │
│  │  │ Layer   │ │ Layer   │ │      Layer      │ │ │
│  │  └─────────┘ └─────────┘ └─────────────────┘ │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
\`\`\`

### Threat Scenarios
#### High-Priority Threats
1. **Data Breach**
   - **Attack Vector**: SQL injection, API vulnerabilities
   - **Impact**: Confidential data exposure
   - **Likelihood**: [High/Medium/Low]

2. **Unauthorized Access**
   - **Attack Vector**: Weak authentication, privilege escalation
   - **Impact**: System compromise
   - **Likelihood**: [High/Medium/Low]

3. **Service Disruption**
   - **Attack Vector**: DDoS, resource exhaustion
   - **Impact**: Business continuity loss
   - **Likelihood**: [High/Medium/Low]

## 2. Vulnerability Assessment

### OWASP Top 10 Analysis
{{vulnerabilityTypes}}

#### A01: Broken Access Control
- **Status**: [Vulnerable/Secure/Needs Review]
- **Findings**: [Specific issues found]
- **Risk Level**: [Critical/High/Medium/Low]

#### A02: Cryptographic Failures
- **Status**: [Vulnerable/Secure/Needs Review]
- **Findings**: [Encryption issues, weak algorithms]
- **Risk Level**: [Critical/High/Medium/Low]

#### A03: Injection
- **Status**: [Vulnerable/Secure/Needs Review]
- **Findings**: [SQL injection, XSS, command injection]
- **Risk Level**: [Critical/High/Medium/Low]

### Technical Vulnerability Scan Results
\`\`\`
Critical Vulnerabilities: [X]
├── CVE-2024-XXXX: [Description]
├── CVE-2024-YYYY: [Description]
└── Custom Finding: [Description]

High Vulnerabilities: [Y]
├── Unpatched Dependencies
├── Weak Cryptography
└── Configuration Issues

Medium Vulnerabilities: [Z]
├── Information Disclosure
├── Missing Security Headers
└── Weak Password Policy
\`\`\`

## 3. Security Controls Assessment

### Authentication & Authorization
#### Current Implementation
- **Authentication Method**: [JWT, OAuth, SAML, etc.]
- **Multi-Factor Authentication**: [Enabled/Disabled]
- **Session Management**: [Secure/Insecure]
- **Password Policy**: [Strong/Weak/Missing]

#### Access Control Matrix
| Role | Resource | Permissions | Status |
|------|----------|-------------|--------|
| Admin | All Systems | CRUD | ✅ Appropriate |
| User | User Data | Read/Update | ⚠️ Over-privileged |
| Guest | Public Data | Read | ✅ Appropriate |

### Data Protection
#### Encryption Analysis
\`\`\`
Data at Rest:
├── Database: AES-256 ✅
├── File Storage: Unencrypted ❌
└── Backups: AES-256 ✅

Data in Transit:
├── API Communication: TLS 1.3 ✅
├── Database Connection: TLS 1.2 ✅
└── Internal Services: Unencrypted ❌

Data in Use:
├── Memory Protection: Basic ⚠️
├── Key Management: HSM ✅
└── Secure Processing: Needs Review ⚠️
\`\`\`

### Network Security
#### Firewall Configuration
\`\`\`
External Firewall:
├── Web Traffic (80/443): Allow ✅
├── SSH (22): Restricted IP ✅
├── Database (5432): Deny ✅
└── Management: VPN Only ✅

Internal Segmentation:
├── DMZ → App Tier: Port 8080 ✅
├── App → DB Tier: Port 5432 ✅
├── Cross-tier: Minimal Access ⚠️
└── Monitoring: Full Access ✅
\`\`\`

## 4. Compliance Assessment

### Regulatory Requirements
{{compliance}}

#### GDPR Compliance
- **Data Inventory**: [Complete/Incomplete]
- **Consent Management**: [Implemented/Missing]
- **Right to Erasure**: [Implemented/Missing]
- **Data Protection Impact Assessment**: [Complete/Pending]

#### SOC 2 Type II
- **Security**: [Compliant/Non-compliant]
- **Availability**: [Compliant/Non-compliant]
- **Processing Integrity**: [Compliant/Non-compliant]
- **Confidentiality**: [Compliant/Non-compliant]

### Industry Standards
#### ISO 27001
- **Information Security Management**: [Mature/Developing]
- **Risk Management**: [Implemented/Missing]
- **Incident Response**: [Documented/Ad-hoc]
- **Business Continuity**: [Tested/Untested]

## 5. Penetration Testing Results

### External Testing
\`\`\`
Methodology: OWASP Testing Guide
Duration: [X] days
Scope: External-facing applications

High Findings:
├── SQL Injection in /api/search
├── XSS in user profile page
└── Insecure direct object reference

Medium Findings:
├── Missing security headers
├── Information disclosure
└── Weak SSL configuration
\`\`\`

### Internal Testing
\`\`\`
Methodology: NIST SP 800-115
Duration: [X] days
Scope: Internal network and systems

Critical Findings:
├── Domain admin compromise
├── Lateral movement possible
└── Sensitive data accessible

High Findings:
├── Unpatched systems
├── Weak service accounts
└── Insufficient monitoring
\`\`\`

## 6. Risk Analysis

### Risk Matrix
| Vulnerability | Impact | Likelihood | Risk Score | Priority |
|---------------|--------|------------|------------|----------|
| SQL Injection | High | High | 9 | P1 |
| Weak Authentication | Medium | High | 6 | P2 |
| Missing Patches | High | Medium | 6 | P2 |
| Data Exposure | High | Low | 3 | P3 |

### Business Impact Assessment
#### Data Breach Scenario
- **Financial Impact**: $[X] million (regulatory fines, lost business)
- **Reputational Impact**: [Severe/Moderate/Minor]
- **Operational Impact**: [Critical/Significant/Minor]
- **Recovery Time**: [X] weeks

#### Service Disruption Scenario
- **Revenue Loss**: $[X] per hour of downtime
- **Customer Impact**: [X] affected customers
- **SLA Breach**: [Yes/No]
- **Recovery Time**: [X] hours

## 7. Security Recommendations

### Immediate Actions (0-30 days)
{{recommendations}}

#### Critical Priority
1. **Patch SQL Injection Vulnerability**
   - **Location**: \`/api/search/\` endpoint
   - **Solution**: Implement parameterized queries
   - **Effort**: 2 days
   - **Risk Reduction**: High

2. **Enable Multi-Factor Authentication**
   - **Scope**: All admin accounts
   - **Solution**: Implement TOTP or hardware tokens
   - **Effort**: 1 week
   - **Risk Reduction**: High

#### High Priority
1. **Update Security Headers**
   \`\`\`
   Content-Security-Policy: default-src 'self'
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Strict-Transport-Security: max-age=31536000
   \`\`\`

2. **Implement Input Validation**
   \`\`\`javascript
   const validateInput = (input) => {
     // Whitelist validation
     const allowedChars = /^[a-zA-Z0-9\s\-_@.]+$/;
     return allowedChars.test(input);
   };
   \`\`\`

### Short-term Improvements (30-90 days)
1. **Security Monitoring Enhancement**
   - SIEM implementation
   - Real-time threat detection
   - Automated incident response

2. **Encryption Upgrade**
   - Encrypt data at rest
   - Implement proper key management
   - Regular key rotation

### Long-term Security Strategy (90+ days)
1. **Zero Trust Architecture**
   - Network micro-segmentation
   - Continuous verification
   - Least privilege access

2. **Security Culture Development**
   - Security awareness training
   - Secure coding practices
   - Regular security assessments

## 8. Implementation Roadmap

### Phase 1: Critical Fixes (Week 1-4)
- [ ] Patch critical vulnerabilities
- [ ] Implement MFA
- [ ] Update security configurations
- [ ] Emergency response procedures

### Phase 2: Security Hardening (Week 5-12)
- [ ] Deploy security monitoring
- [ ] Implement encryption upgrades
- [ ] Enhance access controls
- [ ] Security testing automation

### Phase 3: Advanced Security (Week 13-26)
- [ ] Zero trust implementation
- [ ] Advanced threat detection
- [ ] Security orchestration
- [ ] Compliance automation

## 9. Monitoring and Metrics

### Security KPIs
- **Vulnerability Resolution Time**: Target < 30 days
- **Security Incident Response**: Target < 4 hours
- **Patch Management**: Target 95% within 30 days
- **Security Training**: Target 100% completion

### Continuous Monitoring
\`\`\`yaml
# Security monitoring alerts
- alert: UnauthorizedAccess
  condition: failed_login_attempts > 5
  action: block_ip, notify_security

- alert: DataExfiltration
  condition: data_transfer > baseline * 3
  action: throttle_connection, investigate

- alert: PrivilegeEscalation
  condition: admin_privilege_granted
  action: immediate_review, notify_management
\`\`\`

## 10. Conclusion

### Summary of Findings
The security assessment of {{systemComponent}} reveals [X] critical vulnerabilities and [Y] high-risk issues that require immediate attention. The current security posture is [assessment summary].

### Next Steps
1. **Immediate**: Address critical vulnerabilities within 30 days
2. **Short-term**: Implement comprehensive security improvements
3. **Long-term**: Develop mature security program with continuous improvement

### Success Criteria
- Zero critical vulnerabilities
- 95% compliance with security standards
- Mature incident response capabilities
- Regular security assessments and improvements

Please provide a comprehensive security assessment following this detailed framework:`,
    role: 'Security Engineer',
    tags: ['Security', 'Vulnerability Assessment', 'Development'],
    requiredFields: ['systemComponent', 'securityAspects'],
    optionalFields: ['vulnerabilityTypes', 'recommendations', 'compliance'],
  },
  {
    id: 'global-deployment-guide',
    name: 'Create Deployment Guide',
    description: 'Create deployment and configuration guides',
    template: `You are a DevOps Engineer creating a comprehensive deployment guide that ensures reliable, repeatable deployments with minimal risk.

DEPLOYMENT CONTEXT:
- Application: {{application}}
- Target Platform: {{platform}}
- Deployment Steps: {{deploymentSteps}}
- Configuration: {{configuration}}
- Troubleshooting: {{troubleshooting}}

DEVOPS BEST PRACTICES:
1. **Automation**: Minimize manual steps and human error
2. **Repeatability**: Same process works across environments
3. **Rollback**: Always have a quick recovery plan
4. **Monitoring**: Verify deployment success and health
5. **Documentation**: Clear, step-by-step instructions
6. **Security**: Secure deployment processes and credentials

DEPLOYMENT GUIDE TEMPLATE:

# Deployment Guide: {{application}}

## Overview
**Application**: {{application}}
**Target Platform**: {{platform}}
**Deployment Type**: [Blue-Green/Rolling/Canary/Recreate]
**Estimated Time**: [X] minutes
**Required Downtime**: [X] minutes (if any)

## Prerequisites

### System Requirements
- **Platform**: {{platform}}
- **Minimum Resources**: 
  - CPU: [X] cores
  - Memory: [X] GB
  - Storage: [X] GB
  - Network: [Bandwidth requirements]

### Dependencies
- **Runtime Environment**: [Node.js 18+, Python 3.9+, etc.]
- **Database**: [PostgreSQL 14+, MongoDB 5.0+, etc.]
- **External Services**: [Redis, Message Queue, etc.]
- **Third-party APIs**: [Payment gateway, Email service, etc.]

### Access Requirements
- **Deployment User**: [Username/service account]
- **Permissions**: [List required permissions]
- **Network Access**: [Firewall rules, VPN requirements]
- **Credentials**: [Environment variables, secrets management]

## Pre-Deployment Checklist

### Environment Verification
- [ ] **Infrastructure Ready**: All servers provisioned and accessible
- [ ] **Dependencies Running**: Database, cache, external services healthy
- [ ] **Network Connectivity**: All required ports and connections working
- [ ] **SSL Certificates**: Valid and not expiring soon
- [ ] **DNS Configuration**: Correct A/CNAME records in place

### Code and Configuration
- [ ] **Code Review**: All changes peer-reviewed and approved
- [ ] **Tests Passing**: Unit, integration, and e2e tests green
- [ ] **Configuration Updated**: Environment-specific configs ready
- [ ] **Database Migrations**: Scripts tested and ready to run
- [ ] **Feature Flags**: Configured for safe rollout

### Backup and Safety
- [ ] **Database Backup**: Recent backup verified and accessible
- [ ] **Configuration Backup**: Current configs saved
- [ ] **Rollback Plan**: Tested and documented
- [ ] **Monitoring Setup**: Alerts and dashboards configured
- [ ] **Team Notification**: Stakeholders informed of deployment

## Deployment Process

### Step 1: Environment Preparation
\`\`\`bash
# Set environment variables
export APP_ENV="{{platform}}"
export APP_VERSION="$(git rev-parse --short HEAD)"
export DEPLOY_USER="deploy"

# Verify environment
echo "Deploying {{application}} version \$APP_VERSION to \$APP_ENV"
echo "Current date: $(date)"
echo "Deployed by: $(whoami)"
\`\`\`

### Step 2: Pre-deployment Validation
\`\`\`bash
# Health check current environment
curl -f http://{{application}}.{{platform}}/health || {
  echo "❌ Current environment unhealthy - aborting deployment"
  exit 1
}

# Verify database connectivity
psql \$DATABASE_URL -c "SELECT 1;" || {
  echo "❌ Database connection failed - aborting deployment"
  exit 1
}

# Check disk space
AVAILABLE_SPACE=\$(df -h /var/lib/{{application}} | awk 'NR==2{print \$4}')
echo "✅ Available disk space: \$AVAILABLE_SPACE"
\`\`\`

### Step 3: Application Deployment
{{deploymentSteps}}

#### Option A: Docker Deployment
\`\`\`bash
# Pull latest image
docker pull {{application}}:\$APP_VERSION

# Stop current container (if rolling deployment)
docker stop {{application}}-current || true

# Start new container
docker run -d \\
  --name {{application}}-\$APP_VERSION \\
  --env-file {{platform}}.env \\
  --network {{application}}-network \\
  -p 8080:8080 \\
  {{application}}:\$APP_VERSION

# Wait for health check
for i in {1..30}; do
  if curl -f http://localhost:8080/health; then
    echo "✅ Application started successfully"
    break
  fi
  echo "⏳ Waiting for application to start... (\$i/30)"
  sleep 10
done
\`\`\`

#### Option B: Traditional Deployment
\`\`\`bash
# Create deployment directory
DEPLOY_DIR="/opt/{{application}}/releases/\$APP_VERSION"
mkdir -p \$DEPLOY_DIR

# Extract application files
tar -xzf {{application}}-\$APP_VERSION.tar.gz -C \$DEPLOY_DIR

# Install dependencies
cd \$DEPLOY_DIR
npm install --production

# Update symlink
ln -sfn \$DEPLOY_DIR /opt/{{application}}/current

# Restart application service
systemctl restart {{application}}
systemctl enable {{application}}
\`\`\`

#### Option C: Kubernetes Deployment
\`\`\`yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{application}}
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: {{application}}
  template:
    metadata:
      labels:
        app: {{application}}
        version: \$APP_VERSION
    spec:
      containers:
      - name: {{application}}
        image: {{application}}:\$APP_VERSION
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "{{platform}}"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
\`\`\`

\`\`\`bash
# Deploy to Kubernetes
kubectl apply -f deployment.yaml
kubectl rollout status deployment/{{application}}
\`\`\`

### Step 4: Database Migration
\`\`\`bash
# Run database migrations
cd /opt/{{application}}/current

# Create migration backup
pg_dump \$DATABASE_URL > "backup-pre-\$APP_VERSION-$(date +%Y%m%d-%H%M%S).sql"

# Run migrations
npm run migrate || {
  echo "❌ Migration failed - consider rollback"
  exit 1
}

echo "✅ Database migration completed"
\`\`\`

### Step 5: Configuration Updates
{{configuration}}

\`\`\`bash
# Update application configuration
cat > /opt/{{application}}/current/config/{{platform}}.json << EOF
{
  "database": {
    "host": "\$DB_HOST",
    "port": 5432,
    "name": "\$DB_NAME"
  },
  "redis": {
    "host": "\$REDIS_HOST",
    "port": 6379
  },
  "logging": {
    "level": "info",
    "format": "json"
  }
}
EOF

# Update environment variables
sudo tee /etc/systemd/system/{{application}}.service > /dev/null << EOF
[Unit]
Description={{application}} Application
After=network.target

[Service]
Type=simple
User=\$DEPLOY_USER
WorkingDirectory=/opt/{{application}}/current
ExecStart=/usr/bin/node app.js
Environment=NODE_ENV={{platform}}
Environment=PORT=8080
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and restart
sudo systemctl daemon-reload
sudo systemctl restart {{application}}
\`\`\`

## Post-Deployment Verification

### Health Checks
\`\`\`bash
# Application health check
APP_HEALTH=\$(curl -s http://{{application}}.{{platform}}/health | jq -r '.status')
if [ "\$APP_HEALTH" = "healthy" ]; then
  echo "✅ Application health check passed"
else
  echo "❌ Application health check failed: \$APP_HEALTH"
  exit 1
fi

# Database connectivity
DB_STATUS=\$(curl -s http://{{application}}.{{platform}}/health/db | jq -r '.connected')
if [ "\$DB_STATUS" = "true" ]; then
  echo "✅ Database connectivity verified"
else
  echo "❌ Database connectivity failed"
  exit 1
fi

# External dependencies
curl -f http://{{application}}.{{platform}}/health/dependencies || {
  echo "⚠️ Some external dependencies may be unavailable"
}
\`\`\`

### Performance Verification
\`\`\`bash
# Response time check
RESPONSE_TIME=\$(curl -o /dev/null -s -w '%{time_total}' http://{{application}}.{{platform}}/)
echo "Response time: \${RESPONSE_TIME}s"

# Load test (basic)
ab -n 100 -c 10 http://{{application}}.{{platform}}/ > loadtest-results.txt
echo "✅ Basic load test completed"

# Memory and CPU usage
docker stats {{application}}-\$APP_VERSION --no-stream
\`\`\`

### Functional Testing
\`\`\`bash
# Run smoke tests
npm run test:smoke || {
  echo "❌ Smoke tests failed - consider rollback"
  exit 1
}

# API endpoint tests
curl -f http://{{application}}.{{platform}}/api/users | jq .
curl -f -X POST http://{{application}}.{{platform}}/api/health-check
\`\`\`

## Monitoring and Alerting

### Application Metrics
\`\`\`bash
# Setup monitoring dashboards
# Grafana dashboard URL: https://monitoring.{{platform}}/d/{{application}}
# Key metrics to monitor:
# - Response time (target: < 200ms)
# - Error rate (target: < 0.1%)
# - Throughput (requests/second)
# - Resource utilization (CPU, memory)
\`\`\`

### Log Monitoring
\`\`\`bash
# Application logs location
tail -f /var/log/{{application}}/application.log

# Error monitoring
grep -i error /var/log/{{application}}/application.log

# Performance logs
grep -i "slow query" /var/log/{{application}}/application.log
\`\`\`

## Rollback Procedures

### Quick Rollback (< 5 minutes)
\`\`\`bash
# Docker rollback
PREVIOUS_VERSION=\$(docker images {{application}} --format "table {{.Tag}}" | sed -n '2p')
docker stop {{application}}-\$APP_VERSION
docker run -d --name {{application}}-rollback {{application}}:\$PREVIOUS_VERSION

# Traditional rollback
PREVIOUS_RELEASE=\$(ls -1t /opt/{{application}}/releases/ | sed -n '2p')
ln -sfn /opt/{{application}}/releases/\$PREVIOUS_RELEASE /opt/{{application}}/current
systemctl restart {{application}}

# Kubernetes rollback
kubectl rollout undo deployment/{{application}}
\`\`\`

### Database Rollback
\`\`\`bash
# Restore database backup (if migration needs rollback)
psql \$DATABASE_URL < backup-pre-\$APP_VERSION-*.sql

# Run migration rollback scripts
npm run migrate:rollback
\`\`\`

## Troubleshooting

### Common Issues
{{troubleshooting}}

#### Issue 1: Application Won't Start
**Symptoms**: Service fails to start, health checks fail
**Diagnosis**:
\`\`\`bash
# Check application logs
journalctl -u {{application}} -f

# Check port availability
netstat -tlnp | grep :8080

# Verify configuration
cat /opt/{{application}}/current/config/{{platform}}.json
\`\`\`
**Solutions**:
- Check for port conflicts
- Verify environment variables
- Validate configuration syntax

#### Issue 2: Database Connection Errors
**Symptoms**: Database timeout errors, connection refused
**Diagnosis**:
\`\`\`bash
# Test database connectivity
psql \$DATABASE_URL -c "SELECT 1;"

# Check connection pool
curl http://{{application}}.{{platform}}/health/db
\`\`\`
**Solutions**:
- Verify database credentials
- Check network connectivity
- Adjust connection pool settings

#### Issue 3: High Memory Usage
**Symptoms**: Application crashes, out of memory errors
**Diagnosis**:
\`\`\`bash
# Monitor memory usage
top -p \$(pgrep -f {{application}})
docker stats {{application}}-\$APP_VERSION
\`\`\`
**Solutions**:
- Increase memory limits
- Check for memory leaks
- Optimize application code

### Emergency Contacts
- **DevOps Team**: [Contact information]
- **Development Team**: [Contact information]
- **Infrastructure Team**: [Contact information]
- **Incident Response**: [Escalation process]

## Deployment Checklist Summary

### Pre-Deployment ✅
- [ ] Code reviewed and tested
- [ ] Infrastructure verified
- [ ] Backups created
- [ ] Team notified

### Deployment ✅
- [ ] Application deployed
- [ ] Database migrated
- [ ] Configuration updated
- [ ] Services restarted

### Post-Deployment ✅
- [ ] Health checks passed
- [ ] Performance verified
- [ ] Monitoring confirmed
- [ ] Documentation updated

### Sign-off ✅
- [ ] **Technical Lead**: [Name and signature]
- [ ] **DevOps Engineer**: [Name and signature]
- [ ] **Product Owner**: [Name and signature]

---

**Deployment completed successfully on [Date] at [Time] by [Name]**

Please create a comprehensive deployment guide following this detailed structure:`,
    role: 'DevOps Engineer',
    tags: ['Deployment', 'DevOps', 'Documentation'],
    requiredFields: ['application', 'platform'],
    optionalFields: ['deploymentSteps', 'configuration', 'troubleshooting'],
  }
];
