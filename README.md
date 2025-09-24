# Inspection Methods Engineer Assistant

A comprehensive AI-powered solution for inspection methods engineers, featuring RAG (Retrieval-Augmented Generation), intelligent agents, vision analysis capabilities, evaluations, and monitoring metrics. Now powered by **Groq** for fast, efficient AI inference.

## 🚀 Features

- **🤖 AI-Powered Analysis**: Groq-based LLM integration for fast inspection analysis
- **📚 RAG System**: Intelligent document retrieval and knowledge base
- **👁️ Vision Analysis**: Image-based inspection capabilities
- **🔧 Agent Framework**: Specialized inspection method agents
- **📊 Monitoring**: Prometheus + Grafana dashboards
- **🌐 Web Interface**: Modern Streamlit frontend
- **🐳 Docker Support**: Full containerized deployment

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- Docker & Docker Compose (optional)
- Groq API Key ([Get one here](https://console.groq.com/))

### 1) Clone & Setup Environment
```bash
git clone <repository-url>
cd inspection-methods-engineer-assistant
cp .env.example .env
```

Fill in the required keys in the `.env` file:
- **GROQ_API_KEY** (Required - replaces OpenAI)
- LANGWATCH_API_KEY (optional)
- GRAFANA_ADMIN_PASSWORD
- Other configuration as needed

### 2) Development Setup (Recommended)

#### Option A: Direct Python Setup
```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Start backend (from project root)
python run_backend.py

# In another terminal, start frontend
streamlit run streamlit_app/app.py
```

#### Option B: Docker Setup
```bash
docker compose up -d --build
```

### 3) Access the Application
- **Streamlit App**: http://localhost:8501
- **API Documentation**: http://localhost:8000/docs
- **Grafana Dashboard**: http://localhost:3000 (admin/password from .env)

## 🏗️ Architecture

### Core Components
- **Backend API**: FastAPI with Groq integration
- **Frontend**: Streamlit web application
- **Vector Database**: ChromaDB for document embeddings
- **Monitoring**: Prometheus + Grafana stack
- **MCP Server**: Model Context Protocol server

### AI Integration
- **LLM Provider**: Groq (llama3-8b-8192 model)
- **Embeddings**: ChromaDB default embeddings (text-based search)
- **Vision**: Text-based analysis (adapted for Groq's capabilities)

## 📁 Project Structure

```
inspection-methods-engineer-assistant/
├── .env.example                    # Environment variables template
├── .gitignore                     # Git ignore rules
├── docker-compose.yml             # Docker services configuration
├── README.md                      # Project documentation
├── run_backend.py                 # Backend startup script
├── backend/                       # FastAPI backend
│   ├── app/
│   │   ├── main.py               # FastAPI application entry point
│   │   ├── config.py             # Configuration management
│   │   ├── deps.py               # Dependency injection
│   │   ├── agents/               # AI agent implementations
│   │   │   ├── inspection_agent.py
│   │   │   └── tools_registry.py
│   │   ├── rag/                  # RAG system components
│   │   │   ├── ingest.py         # Document ingestion
│   │   │   ├── retriever.py      # Document retrieval
│   │   │   └── schemas.py        # Data schemas
│   │   ├── vision/               # Vision analysis
│   │   │   └── vision_analysis.py
│   │   ├── guardrails/           # Safety and validation
│   │   │   └── schemas.py
│   │   └── requirements.txt      # Python dependencies
├── streamlit_app/                # Frontend application
│   ├── app.py                    # Main Streamlit app
│   └── pages/                    # Additional pages
├── monitoring/                   # Monitoring stack
│   ├── prometheus/
│   └── grafana/
└── mcp-server/                   # Model Context Protocol server
```

## 🔧 Current Status

### ✅ Working Components
- Groq API integration (replaces OpenAI)
- Streamlit frontend application
- FastAPI backend structure
- Document ingestion and RAG system
- Vision analysis capabilities
- Monitoring setup (Prometheus/Grafana)

### 🚧 Known Issues
- Backend module import path resolution (due to special characters in directory path)
- Some Docker configurations may need updates for Groq integration

### 🎯 Next Steps
1. Resolve backend startup issues
2. Test all API endpoints
3. Integrate frontend with backend
4. Deploy monitoring dashboards
5. Add comprehensive testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the [Issues](../../issues) section
2. Review the API documentation at `/docs`
3. Check logs in the monitoring dashboard

---

**Note**: This project has been migrated from OpenAI to Groq for improved performance and cost efficiency.
│   │   ├── evals/
│   │   │   ├── ragas_eval.py
│   │   │   └── datasets/
│   │   │       └── sample_eval_set.jsonl
│   │   ├── monitoring/
│   │   │   └── metrics.py
│   │   ├── connectors/
│   │   │   ├── gmail_connector.py
│   │   │   ├── gdrive_connector.py
│   │   │   └── outlook_connector.py
│   │   └── mcp/
│   │       └── mcp_client.py
│   ├── requirements.txt
│   └── Dockerfile
├── mcp-server/
│   ├── server.py
│   ├── pyproject.toml
│   └── README.md
├── streamlit_app/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── react_client/ (optional)
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── api.ts
│       └── index.css
├── grafana/
│   ├── dashboards/
│   │   └── inspection-observability.json
│   └── provisioning/
│       ├── dashboards.yml
│       └── datasources.yml
└── prometheus/
    └── prometheus.yml
```