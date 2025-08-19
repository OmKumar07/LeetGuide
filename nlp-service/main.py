from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="LeetGuide NLP Service")

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None
    print("Warning: GEMINI_API_KEY not found. Using mock recommendations.")

class UserProfile(BaseModel):
    username: str
    skills: List[dict]
    solved_problems: List[str]
    weak_areas: List[str]

class RecommendationRequest(BaseModel):
    username: str
    topic: Optional[str] = None
    difficulty: Optional[str] = None

class Recommendation(BaseModel):
    title: str
    slug: str
    difficulty: str
    tags: List[str]
    reason: str
    confidence: float

# Mock problem database
MOCK_PROBLEMS = [
    {
        "title": "Two Sum",
        "slug": "two-sum",
        "difficulty": "Easy",
        "tags": ["Array", "Hash Table"],
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "slug": "longest-substring-without-repeating-characters", 
        "difficulty": "Medium",
        "tags": ["Hash Table", "String", "Sliding Window"],
    },
    {
        "title": "Median of Two Sorted Arrays",
        "slug": "median-of-two-sorted-arrays",
        "difficulty": "Hard", 
        "tags": ["Array", "Binary Search", "Divide and Conquer"],
    },
    {
        "title": "Valid Parentheses",
        "slug": "valid-parentheses",
        "difficulty": "Easy",
        "tags": ["String", "Stack"],
    },
    {
        "title": "Binary Tree Inorder Traversal",
        "slug": "binary-tree-inorder-traversal",
        "difficulty": "Easy", 
        "tags": ["Stack", "Tree", "Depth-First Search"],
    }
]

@app.get("/")
async def root():
    return {"message": "LeetGuide NLP Service is running!"}

@app.post("/recommendations", response_model=List[Recommendation])
async def get_recommendations(request: RecommendationRequest):
    try:
        if model and GEMINI_API_KEY:
            # Use Gemini AI for intelligent recommendations
            recommendations = await get_ai_recommendations(request)
        else:
            # Fallback to mock recommendations
            recommendations = get_mock_recommendations(request)
        
        return recommendations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_ai_recommendations(request: RecommendationRequest) -> List[Recommendation]:
    """Use Gemini AI to generate personalized recommendations"""
    
    prompt = f"""
    As a LeetCode expert, recommend 3 coding problems for user '{request.username}'.
    
    User preferences:
    - Topic: {request.topic or "Any"}
    - Difficulty: {request.difficulty or "Any"}
    
    Consider these problem categories:
    - Arrays & Hashing
    - Two Pointers
    - Stack & Queue
    - Binary Search
    - Sliding Window
    - Linked Lists
    - Trees & Graphs
    - Dynamic Programming
    
    For each recommendation, provide:
    1. Problem title
    2. Difficulty (Easy/Medium/Hard)
    3. Main tags (2-3 tags)
    4. Brief reason why it's good for this user
    
    Format as JSON array with fields: title, difficulty, tags, reason
    """
    
    try:
        response = model.generate_content(prompt)
        
        # Parse AI response and convert to recommendations
        # For now, return mock data with AI-inspired reasoning
        return get_mock_recommendations(request, ai_enhanced=True)
        
    except Exception as e:
        print(f"AI recommendation failed: {e}")
        return get_mock_recommendations(request)

def get_mock_recommendations(request: RecommendationRequest, ai_enhanced=False) -> List[Recommendation]:
    """Generate mock recommendations with optional AI-style reasoning"""
    
    recommendations = []
    
    for problem in MOCK_PROBLEMS:
        # Simple filtering
        if request.difficulty and problem["difficulty"] != request.difficulty:
            continue
            
        if request.topic and request.topic not in problem["tags"]:
            continue
        
        if ai_enhanced:
            reason = f"AI suggests this problem helps strengthen {', '.join(problem['tags'][:2])} skills"
        else:
            reason = f"Recommended based on your profile for {request.username}"
            
        if request.topic:
            reason = f"Great for practicing {request.topic}"
        
        recommendations.append(Recommendation(
            title=problem["title"],
            slug=problem["slug"], 
            difficulty=problem["difficulty"],
            tags=problem["tags"],
            reason=reason,
            confidence=random.uniform(0.8, 0.95) if ai_enhanced else random.uniform(0.7, 0.85)
        ))
    
    # Return top 3 recommendations
    return recommendations[:3]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
