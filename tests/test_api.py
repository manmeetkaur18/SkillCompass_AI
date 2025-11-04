import requests

# Test 1: Health check
response = requests.get("http://localhost:8000/health")
print("Health Check:", response.json())

# Test 2: Extract skills from text
test_text = "Python developer with Django, React, AWS, and Machine Learning experience"
response = requests.post(
    "http://localhost:8000/api/test-skills",
    params={"text": test_text}
)
print("\nSkills Extracted:", response.json())

# Test 3: Upload resume (uncomment and add your file path)
# with open("path/to/resume.pdf", "rb") as f:
#     response = requests.post(
#         "http://localhost:8000/api/extract-skills",
#         files={"file": f}
#     )
#     print("\nResume Analysis:", response.json())