# tools.py

from typing import TypedDict, Dict, Any, List, Callable, Annotated
from langgraph.prebuilt import Tool, ToolExecutor
from openai_wrapper import OpenAIWrapper
from config import settings
from aisettings import AISettings

# Define more specific input schema
class ToolInput(TypedDict):
    input: str  # The topic or content to analyze
    history: List[tuple[str, str]]  # List of (role, message) tuples
    role: str  # The PFC role performing the analysis

class Tools:
    """Defines tools available to PFC agents."""
    
    def __init__(self):
        """Initialize tools with configurations."""
        self.ai_settings = AISettings()
        self.prompt_templates = self.ai_settings.get_prompt_templates()
        self.error_messages = self.ai_settings.get_error_messages()

    @staticmethod
    def complex_analyzer(tool_input: Annotated[ToolInput, "Input for complex analysis"]) -> str:
        """
        Conducts complex analyses and data-driven decision making.
        
        Args:
            tool_input: Dictionary containing input text, conversation history, and agent role
            
        Returns:
            str: Analysis report or error message
        """
        try:
            topic = tool_input['input']
            role = tool_input['role']
            history = tool_input['history']
            
            # Create context from history with proper formatting
            context_messages = []
            for prev_role, message in history:
                context_messages.append(f"{prev_role}:\n{message}\n")
            context = "\n".join(context_messages) if context_messages else ""
            
            # Get role-specific prompt template
            prompt_template = AISettings.get_prompt_templates()["analysis"]
            prompt = prompt_template.format(
                context=context,
                role=role,
                topic=topic
            )
            
            # Get model configuration for role
            model_name = getattr(settings, f"{role}_MODEL", settings.DLPFC_MODEL)
            openai_wrapper = OpenAIWrapper(model_name=model_name)
            
            # Get analysis with proper error handling
            try:
                analysis_report = openai_wrapper.create_chat_completion(
                    messages=[
                        {
                            "role": "system", 
                            "content": f"You are the {role}, focusing on specialized analysis. "
                                     f"Format your response with clear sections and bullet points."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=settings.MAX_TOKENS,
                    temperature=settings.TEMPERATURE
                )
                return f"{role} Analysis:\n{analysis_report}"
            except Exception as e:
                return AISettings.get_error_messages()["analysis_error"].format(
                    role=role,
                    error=str(e)
                )
            
        except KeyError as e:
            return f"Missing required input: {str(e)}"
        except Exception as e:
            return f"Error in tool execution: {str(e)}"

    @staticmethod
    def get_tools(role_name: str) -> List[Tool]:
        """Returns role-specific tools with proper integration."""
        base_tools = [
            Tool(
                name="complex_analyzer",
                description="Conducts comprehensive analysis based on role specialization",
                function=Tools.complex_analyzer,
                input_schema=ToolInput
            )
        ]
        
        # Add role-specific tools
        role_tools = {
            "DLPFC": [
                Tool(
                    name="integration_analyzer",
                    description="Integrates information from other PFC regions",
                    function=Tools.integration_analyzer,
                    input_schema=ToolInput
                )
            ],
            "VMPFC": [
                Tool(
                    name="emotional_analyzer",
                    description="Analyzes emotional implications",
                    function=Tools.emotional_analyzer,
                    input_schema=ToolInput
                )
            ]
            # Add other role-specific tools as needed
        }
        
        return base_tools + role_tools.get(role_name, [])
