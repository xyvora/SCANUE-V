# main.py

from typing import Optional
from graph import CustomGraph, AgentState
from utils import setup_logging

def main(topic: Optional[str] = None) -> None:
    """Main execution with enhanced error handling and logging."""
    logger = setup_logging()
    
    try:
        # Validate input
        if topic is None:
            topic = input("Please enter the topic for analysis: ").strip()
        if not topic:
            raise ValueError("Topic cannot be empty")
            
        logger.info(f"Initializing PFC analysis for topic: {topic}")
        
        # Initialize graph with validation
        custom_graph = CustomGraph(topic=topic)
        
        # Execute analysis
        logger.info("Starting PFC region analysis")
        final_report = custom_graph.execute()
        
        # Format and display results
        print("\n" + "="*50)
        print("SCANUE-V Analysis Report")
        print("="*50 + "\n")
        print(final_report)
        print("\n" + "="*50)
        
        logger.info("Analysis completed successfully")
        
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise

if __name__ == "__main__":
    main()
