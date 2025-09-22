import streamlit as st
import requests
import os
import json
from PIL import Image
from io import BytesIO

# API Configuration
API_URL = os.environ.get("API_URL", "http://localhost:8000")

# Initialize session state for page navigation
if 'page' not in st.session_state:
    st.session_state.page = "Home"

# --- UI CONFIG & STYLE --- 
st.set_page_config(page_title="Inspection Engineer Assistant", layout="wide")
 
st.markdown(""" 
    <style> 
    @import url('https://fonts.cdnfonts.com/css/tw-cen-mt'); 
    * { 
        font-family: 'Tw Cen MT', sans-serif !important; 
    } 
 
    /* Sidebar arrow fix */ 
    section[data-testid="stSidebar"] [data-testid="stSidebarNav"]::before { 
        content: "▶"; 
        font-size: 1.3rem; 
        margin-right: 0.4rem; 
    } 
 
    /* Top-right logo placement */ 
    .logo-container { 
        position: fixed; 
        top: 5rem; 
        right: 12rem; 
        z-index: 9999; 
    } 
    
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1E3A8A;
    }
    .sub-header {
        font-size: 1.5rem;
        font-weight: 500;
        color: #3B82F6;
    }
    .stTextInput > div > div > input {
        font-family: 'Tw Cen MT', sans-serif !important;
    }
    .stButton > button {
        font-family: 'Tw Cen MT', sans-serif !important;
        background-color: #1E3A8A;
        color: white;
    }
    .stButton > button:hover {
        background-color: #3B82F6;
    }
    </style> 
""", unsafe_allow_html=True)
 
# Display logo (smaller, top-right) 
st.markdown( 
    """ 
    <div class="logo-container"> 
        <img src="https://github.com/valonys/DigiTwin/blob/29dd50da95bec35a5abdca4bdda1967f0e5efff6/ValonyLabs_Logo.png?raw=true" width="70"> 
    </div> 
    """, 
    unsafe_allow_html=True 
) 
 
st.title("📊 DigiTwin - Inspection Engineer")

# --- AVATARS --- 
USER_AVATAR = "https://raw.githubusercontent.com/achilela/vila_fofoka_analysis/9904d9a0d445ab0488cf7395cb863cce7621d897/USER_AVATAR.png"
BOT_AVATAR = "https://raw.githubusercontent.com/achilela/vila_fofoka_analysis/991f4c6e4e1dc7a8e24876ca5aae5228bcdb4dba/Ataliba_Avatar.jpg"

# Sidebar
with st.sidebar:
    #st.image("streamlit_app/assets/placeholder.svg", width=150)
    st.markdown("<div class='sub-header'>Navigation</div>", unsafe_allow_html=True)
    selected_page = st.radio(
        "Select a page:",
        ["Home", "Query Assistant", "Standards Search", "Vision Analysis", "Evaluation"],
        index=["Home", "Query Assistant", "Standards Search", "Vision Analysis", "Evaluation"].index(st.session_state.page)
    )
    
    # Update session state when radio button changes
    if selected_page != st.session_state.page:
        st.session_state.page = selected_page
    
    st.markdown("---")
    st.markdown("<div class='sub-header'>About</div>", unsafe_allow_html=True)
    st.markdown(
        """The Inspection Methods Engineer Assistant helps with inspection standards, 
        procedures, and analysis. It provides access to standards, catalogs, and 
        vision-based inspection capabilities."""
    )

# Home Page
if st.session_state.page == "Home":
    st.markdown("<div class='main-header'>Inspection Methods Engineer Assistant</div>", unsafe_allow_html=True)
    st.markdown("<div class='sub-header'>Your AI-powered inspection methods companion</div>", unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Features section
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("### 🔍 Query Assistant")
        st.markdown("Ask questions about inspection methods, standards, and procedures.")
        if st.button("Go to Query Assistant", key="home_query"):
            st.session_state.page = "Query Assistant"
            st.experimental_rerun()
    
    with col2:
        st.markdown("### 📚 Standards Search")
        st.markdown("Search for and explore inspection standards and catalogs.")
        if st.button("Go to Standards Search", key="home_standards"):
            st.session_state.page = "Standards Search"
            st.experimental_rerun()
    
    with col3:
        st.markdown("### 👁️ Vision Analysis")
        st.markdown("Analyze images for defects and quality issues.")
        if st.button("Go to Vision Analysis", key="home_vision"):
            st.session_state.page = "Vision Analysis"
            st.experimental_rerun()

# Query Assistant Page
elif st.session_state.page == "Query Assistant":
    st.markdown("<div class='main-header'>Query Assistant</div>", unsafe_allow_html=True)
    st.markdown("Ask questions about inspection methods, standards, and procedures.")
    
    query = st.text_area("Enter your question:", height=100)
    
    if st.button("Submit"):
        if query:
            with st.spinner("Processing your query..."):
                try:
                    # Call the API with a timeout to prevent long waiting
                    response = requests.post(
                        f"{API_URL}/query",
                        json={"query": query},
                        timeout=10  # 10 seconds timeout
                    )
                    
                    if response.status_code == 200:
                        result = response.json()
                        st.markdown("### Answer")
                        st.markdown(result["answer"])
                        
                        # Display sources if available
                        if "sources" in result and result["sources"]:
                            st.markdown("### Sources")
                            for i, source in enumerate(result["sources"]):
                                st.markdown(f"**Source {i+1}**: {source['source']}")
                                st.markdown(f"{source['content'][:200]}...")
                    else:
                        st.error(f"Error: {response.status_code} - {response.text}")
                except requests.exceptions.ConnectionError:
                    st.error("⚠️ Backend API Connection Error: The backend service is not running or not accessible. Please start the backend service with 'cd backend && python -m app.main'")
                    st.info("💡 For now, you can continue using other features that don't require the backend API.")
                except requests.exceptions.Timeout:
                    st.error("⚠️ Backend API Timeout: The request to the backend service timed out. The service might be overloaded or not responding.")
                except Exception as e:
                    st.error(f"Error: {str(e)}")
        else:
            st.warning("Please enter a question.")

# Standards Search Page
elif st.session_state.page == "Standards Search":
    st.markdown("<div class='main-header'>Standards Search</div>", unsafe_allow_html=True)
    st.markdown("Search for and explore inspection standards and catalogs.")
    
    search_type = st.radio("Search type:", ["Standards", "Catalog"])
    search_query = st.text_input("Enter search terms:")
    
    if st.button("Search"):
        if search_query:
            with st.spinner("Searching..."):
                try:
                    # Determine the endpoint based on search type
                    if search_type == "Standards":
                        endpoint = f"{API_URL}/api/standards/search"
                    else:  # Catalog
                        endpoint = f"{API_URL}/api/catalog/search"
                    
                    # Call the API with a timeout to prevent long waiting
                    response = requests.get(
                        endpoint,
                        params={"query": search_query},
                        timeout=5  # 5 seconds timeout
                    )
                    
                    if response.status_code == 200:
                        results = response.json()["results"]
                        
                        if results:
                            st.markdown(f"### Results ({len(results)})")
                            
                            for i, result in enumerate(results):
                                with st.expander(f"{i+1}. {result.get('title', result.get('name', 'Untitled'))}"): 
                                    if "description" in result:
                                        st.markdown(result["description"])
                                    
                                    # Display other details
                                    for key, value in result.items():
                                        if key not in ["title", "name", "description"]:
                                            st.markdown(f"**{key.capitalize()}**: {value}")
                        else:
                            st.info("No results found.")
                    else:
                        st.error(f"Error: {response.status_code} - {response.text}")
                except requests.exceptions.ConnectionError:
                    st.error("⚠️ Backend API Connection Error: The backend service is not running or not accessible. Please start the backend service with 'cd backend && python -m app.main'")
                    st.info("💡 For now, you can continue using other features that don't require the backend API.")
                except requests.exceptions.Timeout:
                    st.error("⚠️ Backend API Timeout: The request to the backend service timed out. The service might be overloaded or not responding.")
                except Exception as e:
                    st.error(f"Error: {str(e)}")
        else:
            st.warning("Please enter search terms.")

# Vision Analysis Page
elif st.session_state.page == "Vision Analysis":
    st.markdown("<div class='main-header'>Vision Analysis</div>", unsafe_allow_html=True)
    st.markdown("Analyze images for defects and quality issues.")
    
    uploaded_file = st.file_uploader("Upload an image for analysis", type=["jpg", "jpeg", "png"])
    image_url = st.text_input("Or enter an image URL:")
    
    if uploaded_file is not None or image_url:
        if st.button("Analyze"):
            with st.spinner("Analyzing image..."):
                try:
                    # Determine the image source
                    if uploaded_file is not None:
                        # Display the uploaded image
                        image = Image.open(uploaded_file)
                        st.image(image, caption="Uploaded Image", use_column_width=True)
                        
                        # TODO: In a real implementation, you would upload the image to a storage service
                        # and get a URL to pass to the API. For this example, we'll use a placeholder URL.
                        analysis_url = "https://example.com/uploaded_image.jpg"
                    else:
                        # Display the image from URL
                        response = requests.get(image_url)
                        image = Image.open(BytesIO(response.content))
                        st.image(image, caption="Image from URL", use_column_width=True)
                        analysis_url = image_url
                    
                    try:
                        # Call the API with a timeout to prevent long waiting
                        response = requests.post(
                            f"{API_URL}/analyze-image",
                            params={"image_url": analysis_url},
                            timeout=5  # 5 seconds timeout
                        )
                        
                        if response.status_code == 200:
                            result = response.json()
                            
                            st.markdown("### Analysis Results")
                            st.markdown(result["analysis"]["analysis"])
                            
                            if "detected_issues" in result["analysis"] and result["analysis"]["detected_issues"]:
                                st.markdown("### Detected Issues")
                                for i, issue in enumerate(result["analysis"]["detected_issues"]):
                                    st.markdown(f"**Issue {i+1}**: {issue['description']}")
                                    
                                    if "details" in issue and issue["details"]:
                                        for detail in issue["details"]:
                                            st.markdown(f"- {detail}")
                    except requests.exceptions.ConnectionError:
                        st.error("⚠️ Backend API Connection Error: The backend service is not running or not accessible. Please start the backend service with 'cd backend && python -m app.main'")
                        st.info("💡 For now, you can continue using other features that don't require the backend API.")
                    except requests.exceptions.Timeout:
                        st.error("⚠️ Backend API Timeout: The request to the backend service timed out. The service might be overloaded or not responding.")
                    except Exception as e:
                        st.error(f"Error: {str(e)}")
                    else:
                        st.error(f"Error: {response.status_code} - {response.text}")
                except Exception as e:
                    st.error(f"Error: {str(e)}")
        
# Evaluation Page
elif st.session_state.page == "Evaluation":
    st.markdown("<div class='main-header'>Evaluation</div>", unsafe_allow_html=True)
    st.markdown("Evaluate the performance of the assistant.")
    
    if st.button("Run Evaluation"):
        with st.spinner("Running evaluation..."):
            try:
                # Call the API
                response = requests.get(f"{API_URL}/evaluate")
                
                if response.status_code == 200:
                    result = response.json()
                    
                    st.markdown("### Evaluation Results")
                    
                    # Display summary metrics
                    st.markdown("#### Summary Metrics")
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.metric("Faithfulness", f"{result['faithfulness']:.2f}")
                        st.metric("Answer Relevancy", f"{result['answer_relevancy']:.2f}")
                    
                    with col2:
                        st.metric("Context Precision", f"{result['context_precision']:.2f}")
                        st.metric("Context Recall", f"{result['context_recall']:.2f}")
                    
                    # Display sample details
                    st.markdown("#### Sample Details")
                    for i, detail in enumerate(result["details"][:5]):  # Show only first 5 for brevity
                        with st.expander(f"Sample {detail['sample_id']}"): 
                            st.markdown(f"**Query**: {detail['query']}")
                            st.markdown(f"**Faithfulness**: {detail['faithfulness']:.2f}")
                            st.markdown(f"**Answer Relevancy**: {detail['answer_relevancy']:.2f}")
                            st.markdown(f"**Context Precision**: {detail['context_precision']:.2f}")
                            st.markdown(f"**Context Recall**: {detail['context_recall']:.2f}")
                else:
                    st.error(f"Error: {response.status_code} - {response.text}")
            except Exception as e:
                st.error(f"Error: {str(e)}")