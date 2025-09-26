from typing import Dict, Any, List
from groq import Groq

from app.config import settings


def analyze_image(image_url: str) -> Dict[str, Any]:
    """Analyze an image using vision capabilities"""
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "system",
                "content": "You are an expert in inspection methods and quality control. "
                           "Analyze the provided image description and identify any defects, anomalies, "
                           "or quality issues. Provide detailed observations and potential causes."
            },
            {
                "role": "user",
                "content": f"Analyze this inspection image and provide detailed observations: {image_url}"
            }
        ],
        max_tokens=1000
    )
    
    analysis = response.choices[0].message.content
    
    # Parse the analysis into structured data
    result = {
        "analysis": analysis,
        "detected_issues": extract_detected_issues(analysis),
    }
    
    return result


def extract_detected_issues(analysis: str) -> List[Dict[str, Any]]:
    """Extract detected issues from the analysis text"""
    # This is a simplified implementation
    # In a real application, this would use more sophisticated NLP techniques
    issues = []
    
    # Simple parsing based on common patterns in the analysis text
    lines = analysis.split('\n')
    current_issue = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if this line starts a new issue
        if line.startswith('- ') or line.startswith('* ') or any(line.lower().startswith(keyword) for keyword in ['defect:', 'issue:', 'problem:', 'anomaly:']):
            if current_issue:
                issues.append(current_issue)
            
            current_issue = {
                "description": line.lstrip('- *').strip(),
                "details": []
            }
        elif current_issue and line.startswith('  '):
            # This is a detail for the current issue
            current_issue["details"].append(line.strip())
    
    # Add the last issue if there is one
    if current_issue:
        issues.append(current_issue)
    
    return issues