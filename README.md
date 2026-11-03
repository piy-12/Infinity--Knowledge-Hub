# 🚀 Infinity Knowledge Hub

**An AI-Powered Learning and Knowledge Management Platform**

Infinity Knowledge Hub is a centralized knowledge management and learning platform designed for students, educators, and professionals. It combines AI-powered document understanding, Retrieval-Augmented Generation (RAG), and productivity tools to create an interactive learning environment.

The platform allows users to upload documents, generate AI-powered summaries, interact with their study materials through an intelligent chatbot, and access multiple tools that simplify their learning and knowledge management experience.

---

## 🌟 Key Features

### 🤖 1. AI-Powered Chatbot (RAG)

An intelligent chatbot powered by a Retrieval-Augmented Generation (RAG) architecture that allows users to interact with their uploaded documents.

* Document-based question answering.
* Context-aware responses using retrieved document chunks.
* Llama-powered Large Language Model (LLM).
* Sentence Transformer-based text embeddings.
* Semantic similarity search for relevant information retrieval.
* Multiple document chunking strategies.
* Contextual responses grounded in uploaded knowledge.

### 📄 2. AI Document Summarization

Convert lengthy documents into concise and understandable study materials.

* Upload documents and extract their content.
* Generate AI-powered document summaries.
* Simplify complex information for students.
* Create structured study material from uploaded documents.
* Reduce the time required to understand lengthy academic resources.

### 📚 3. Global Library

A centralized library where users can contribute and access shared learning resources.

* Upload and share documents.
* Access resources contributed by other users.
* Maintain a centralized repository of knowledge.
* Discover and utilize learning materials.

### 📝 4. Notes Management

A dedicated workspace for managing personal study notes.

* Create and manage notes.
* Organize learning materials.
* Maintain important information in one place.

### 🧠 5. Quiz System

An interactive quiz module designed to support active learning.

* Generate and attempt quizzes.
* Practice concepts and evaluate understanding.
* Reinforce learning through assessments.

### 📅 6. Calendar

A calendar module to help users organize their academic and professional schedules.

* Manage important events.
* Track schedules and activities.
* Organize learning tasks and deadlines.

### 🧮 7. Calculator

An integrated calculator that provides quick mathematical computations without leaving the platform.

### 📖 8. Additional Learning Utilities

Other integrated utilities designed to make the platform a comprehensive learning environment.

---

## 🏗️ RAG Architecture

The platform implements Retrieval-Augmented Generation to provide context-aware answers based on user-uploaded documents.

### Document Processing Pipeline

1. **Document Upload:** Users submit documents to the platform.
2. **Text Extraction:** Extract textual content from uploaded documents.
3. **Text Chunking:** Divide documents into smaller chunks using different chunking strategies.
4. **Embedding Generation:** Generate vector representations using Sentence Transformers.
5. **Vector Storage:** Store embeddings for efficient retrieval.
6. **Semantic Retrieval:** Retrieve relevant document chunks based on the user's query.
7. **Context Construction:** Prepare relevant retrieved information as context.
8. **LLM Generation:** Pass the retrieved context and user query to Llama.
9. **Response Generation:** Generate context-aware answers grounded in the uploaded documents.

### RAG Workflow

```text
          User Uploads Document
                   |
                   v
            Text Extraction
                   |
                   v
             Text Chunking
                   |
                   v
          Sentence Transformers
             (Embeddings)
                   |
                   v
           Vector Database
                   |
                   v
             User Query
                   |
                   v
          Semantic Retrieval
                   |
                   v
          Relevant Documents
                   |
                   v
          Context Construction
                   |
                   v
              Llama LLM
                   |
                   v
          Contextual Response
```

### Retrieval Techniques

The RAG implementation explores different approaches to improve document retrieval and response relevance.

* Semantic Search
* Vector Similarity Search
* Sentence Transformer Embeddings
* Different Text Chunking Strategies
* Context-Based Retrieval

---

## 🛠️ Technology Stack

| Category             | Technologies                         |
| -------------------- | ------------------------------------ |
| Frontend             | React.js, Vite, Tailwind CSS         |
| Backend              | Python, FastAPI                      |
| Database             | PostgreSQL                           |
| ORM                  | SQLAlchemy                           |
| Authentication       | JWT, OAuth2, bcrypt                  |
| Large Language Model | Llama                                |
| Embeddings           | Sentence Transformers                |
| AI Architecture      | Retrieval-Augmented Generation (RAG) |
| Vector Retrieval     | Semantic Search, Vector Similarity   |
| API Integration      | REST APIs                            |
| Containerization     | Docker                               |
| Version Control      | Git, GitHub                          |

---

## ⚙️ Core Functionalities

| Module                 | Description                                   |
| ---------------------- | --------------------------------------------- |
| AI Chatbot             | Document-based conversational AI using RAG    |
| Document Summarization | AI-generated summaries of uploaded documents  |
| Global Library         | Shared document repository                    |
| Notes                  | Personal note creation and management         |
| Quiz                   | Interactive learning and assessment           |
| Calendar               | Academic and professional schedule management |
| Calculator             | Integrated mathematical utility               |

---

## 🎯 Project Objectives

* Build a centralized knowledge management platform.
* Make document understanding easier through AI-powered summarization.
* Implement RAG for context-aware document question answering.
* Experiment with different chunking and retrieval strategies.
* Improve learning efficiency through integrated academic tools.
* Provide a collaborative environment for sharing knowledge and resources.

---

## 🔮 Future Enhancements

* Advanced RAG techniques such as Hybrid Search and Reranking.
* Multi-document conversational search.
* Improved retrieval through query rewriting and contextual compression.
* AI-generated quizzes based on uploaded documents.
* Personalized learning recommendations.
* Advanced document management and collaboration.

---

## 👨‍💻 Contributors

Developed as an AI-powered knowledge management and learning platform with a focus on integrating modern LLM technologies, RAG pipelines, and student productivity tools.

---

**Infinity Knowledge Hub — Learn, Organize, Explore, and Grow.** 🚀
