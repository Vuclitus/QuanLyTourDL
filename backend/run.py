import uvicorn
import os
import sys

# Add the current directory to sys.path to allow importing 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("Starting QLTourDuLich Backend on http://localhost:8001")
    print("Note: Port 8000 is reserved for PostgreSQL.")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )
