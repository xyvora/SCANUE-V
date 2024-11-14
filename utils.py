# utils.py

import logging
from typing import Optional
import sys

def setup_logging(log_level: Optional[str] = "INFO") -> logging.Logger:
    """Setup logging with enhanced configuration."""
    # Create formatter with detailed information
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Create console handler with proper error level
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(log_level)
    
    # Create file handler for persistent logging
    file_handler = logging.FileHandler('scanue_v.log')
    file_handler.setFormatter(formatter)
    file_handler.setLevel(log_level)
    
    # Setup logger with both handlers
    logger = logging.getLogger("SCAN")
    logger.setLevel(getattr(logging, log_level))
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    # Log startup information
    logger.info("SCANUE-V Logger initialized")
    logger.info(f"Log level set to: {log_level}")
    
    return logger

