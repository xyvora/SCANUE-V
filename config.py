# config.py

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# OpenAI API Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY or OPENAI_API_KEY.startswith("sk-xxxxxxxxxxxxxxxxxxxxx"):
    raise ValueError(
        "Please replace the OpenAI API key in .env with your actual API key "
        "from https://platform.openai.com/api-keys"
    )

# Model Configurations for PFC Regions
DLPFC_MODEL = os.getenv("DLPFC_MODEL", "gpt-4")  # Executive functions
VMPFC_MODEL = os.getenv("VMPFC_MODEL", "gpt-4")  # Emotional processing
OFC_MODEL = os.getenv("OFC_MODEL", "gpt-4")      # Reward evaluation
ACC_MODEL = os.getenv("ACC_MODEL", "gpt-4")      # Conflict monitoring
MPFC_MODEL = os.getenv("MPFC_MODEL", "gpt-4")    # Social cognition

# Processing Parameters
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "500"))
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Optional: Model-specific temperatures for different cognitive functions
DLPFC_TEMP = float(os.getenv("DLPFC_TEMP", "0.7"))  # More focused
VMPFC_TEMP = float(os.getenv("VMPFC_TEMP", "0.8"))  # More nuanced
OFC_TEMP = float(os.getenv("OFC_TEMP", "0.7"))      # Balanced
ACC_TEMP = float(os.getenv("ACC_TEMP", "0.6"))      # More precise
MPFC_TEMP = float(os.getenv("MPFC_TEMP", "0.8"))    # More creative
