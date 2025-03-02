# SCANUE-V - Synthetic Cognitive Augmentation Network Using Experts

<p align="center">
  <img src="https://github.com/user-attachments/assets/a1cadb3e-f399-475a-a24e-b33f477f0615" alt="SCANUEV Logo">
</p>

## 🚀 Overview

SCANUE-V (Synthetic Cognitive Augmentation Network Using Experts) advances cognitive augmentation through a biologically inspired modular architecture. Building on the foundation of previous SCAN iterations, SCANUE-V employs a sophisticated system that integrates specialized agent models, adaptive learning, and human-in-the-loop methodologies to improve user alignment and overall cognitive augmentation capabilities.

SCANUE-V draws inspiration from the prefrontal cortex (PFC) and its subregions to simulate core cognitive processes, creating a versatile framework for next-generation cognitive augmentation solutions that can adapt to diverse user needs.

## 🧠 Biologically-Inspired Architecture

SCANUE-V simulates various subregions of the prefrontal cortex to address intricate cognitive tasks:

- **DLPFC (Dorsolateral Prefrontal Cortex)**: Executive control, working memory, and task planning
- **VMPFC (Ventromedial Prefrontal Cortex)**: Emotional regulation and risk assessment
- **OFC (Orbitofrontal Cortex)**: Reward evaluation and decision-making
- **ACC (Anterior Cingulate Cortex)**: Conflict detection and error monitoring
- **MPFC (Medial Prefrontal Cortex)**: Integration of inputs into value-based recommendations

## 🔧 Technology Stack

### Frontend
- **Next.js 15.1.7** with App Router
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Radix UI** for accessible UI components
- **Playwright** for end-to-end testing

### Backend
- **FastAPI** for high-performance API
- **Python 3.13+**
- **LangGraph** for multi-agent state management
- **LangChain** for multi-agent orchestration
- **OpenAI GPT-4o-mini** fine-tuned models (one for each PFC-inspired agent)
- **PostgreSQL** (via asyncpg) for data storage
- **JWT** for authentication
- **Valkey (Redis)** for caching

### DevOps
- **Docker & Docker Compose** for containerization
- **Traefik** for reverse proxy
- **GitHub Actions** for CI/CD
- **CLI Interface** for direct system interaction

## 🔑 Core Features

### 1. Modular Agent Architecture
SCANUE-V leverages a PFC-inspired modular architecture where specialized agents handle specific cognitive functions, providing more targeted and efficient cognitive augmentation.

### 2. Information Routing and Processing
- Command line interface for user query submission
- Task delegation and planning by the DLPFC Agent
- Specialized subtask distribution across domain-expert agents
- Parallel processing for improved performance and near real-time responses

### 3. Human-in-the-Loop (HITL) Integration
- Continuous user feedback integrated into the system's learning process
- Real-time adaptation to user preferences and requirements
- Enhanced ethical alignment and oversight
- Greater contextual understanding compared to traditional reinforcement learning

### 4. Adaptive Learning
SCANUE-V combines human-in-the-loop methodologies with specialized agent models to continuously improve performance and user alignment.

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.13+ (for local backend development)
- Just command runner (optional, but recommended)

### Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SCANUE-V.git
   cd SCANUE-V
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Update .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/docs

### Using Just Commands

[Just](https://github.com/casey/just) is a handy command runner that simplifies common development tasks. SCANUE-V provides a comprehensive set of Just commands for development workflows:

1. **Install Just** (if not already installed)
   ```bash
   # On macOS
   brew install just

   # On Windows (with Chocolatey)
   choco install just

   # On Linux
   apt-get install just
   ```

2. **View available commands**
   ```bash
   just --list
   ```

3. **Start the entire application stack** (primary method)
   ```bash
   just docker-up
   ```

4. **Start only the frontend**
   ```bash
   just frontend
   ```

5. **Start only the backend**
   ```bash
   just backend
   ```

6. **Run tests**
   ```bash
   just test
   ```

7. **Clean up containers and volumes**
   ```bash
   just clean
   ```

8. **Format and lint code**
   ```bash
   just lint
   ```

These commands simplify development by providing unified shortcuts across the entire project, regardless of whether you're working on the frontend or backend.

### Local Development

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

**Backend**:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e .
uvicorn app.main:app --reload
```

## 📚 Design-Based Research Approach

SCANUE-V's development follows a design-based research (DBR) methodology, informed by:

- IRB-compliant Cognitive Augmentation User Survey Evaluation (CAUSE)
- Technology Acceptance Model (TAM)
- Unified Theory of Acceptance and Use of Technology (UTAUT)
- Jobs-To-Be-Done (JTBD)
- System Usability Scale (SUS)
- NASA Task Load Index (NASA-TLX)

This approach ensures continuous refinement based on user feedback and evolving requirements.

## 🔮 Future Directions

### User Interfaces
Development of graphical user interfaces (GUIs) to enhance workflow visualization, improve multi-agent coordination, and broaden accessibility.

### SCANUE Alignment Technique (SCANAQ)
Integration of the SCANAQ instrument, a 36-question tool that focuses on problem-solving and psychological alignment to tailor agent behaviors to user needs.

### Advanced Neural Architectures
Exploration of novel neural architectures, such as Spiking Transformer Augmenting Cognition (STAC), and potential noninvasive brain-computer interface integrations.

### Ethical and Contextual Adaptations
Refinement of HITL methodologies to reduce bias and address ethical complexities, with applications in healthcare, education, and finance.

## 🧪 Testing

SCANUE-V employs comprehensive testing strategies to ensure reliability:

**Frontend Tests**:
```bash
cd frontend
npm test
```

**Backend Tests**:
```bash
cd backend
pytest
```

**End-to-End Testing**:
```bash
just e2e-test
```

## 🛠️ Development Tools

- **Just** - Command runner (see `justfile` for available commands)
- **Pre-commit** - Git hooks for code quality
- **ESLint & Ruff** - Code linting
- **Tailwind CSS** - Styling framework
- **CLI Testbed** - For validating core SCANUE-V functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- All contributors who have helped shape SCANUE-V
- The research communities behind prefrontal cortex studies and biologically-inspired AI
- The open-source communities behind Next.js, FastAPI, LangGraph, and all other technologies used in this project
