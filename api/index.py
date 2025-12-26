"""
Vercel serverless function entry point for FastAPI backend
This wraps the FastAPI app using Mangum for AWS Lambda/Vercel compatibility
"""
import sys
import os

# Add backend to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

# Set environment variable to indicate we're on Vercel
os.environ["VERCEL"] = "1"

from mangum import Mangum
from main import app

# Create handler for Vercel - this is what Vercel calls
handler = Mangum(app, lifespan="off")
