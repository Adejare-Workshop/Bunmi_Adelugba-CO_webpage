from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import uvicorn

app = FastAPI(title="BAC Website API", description="Backend for Bunmi Adelugba & Co.")

# Configure CORS to allow your frontend to talk to the backend
origins = [
    "http://localhost:5500",  # Default Live Server port
    "http://127.0.0.1:5500",
    "https://bac-temporary-hosting.pages.dev" # Your deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the expected data structure using Pydantic for validation
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    service: str
    message: str

@app.post("/contact")
async def submit_contact_form(form_data: ContactForm):
    """
    Receives contact form data from the frontend.
    In a production environment, this would save to a database 
    (like PostgreSQL) or trigger an email via an SMTP service.
    """
    try:
        # Example processing logic
        print(f"New inquiry received from {form_data.name} ({form_data.email})")
        print(f"Service requested: {form_data.service}")
        print(f"Message: {form_data.message}")
        
        # Here is where you could easily integrate a database connector 
        # or an ML spam filter in the future.

        return {"status": "success", "message": "Inquiry received successfully."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    # Run the server on port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)