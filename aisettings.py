from typing import TypedDict, Dict, Any, List

class AgentConfig(TypedDict):
    """Configuration for each PFC agent."""
    role: str
    model: str
    backstory: str
    goal: str
    temperature: float
    max_tokens: int

class AISettings:
    """Defines settings and configurations for the AI agents."""
    
    @staticmethod
    def get_agent_configs() -> Dict[str, AgentConfig]:
        """Returns configuration for all PFC agents."""
        return {
            "DLPFC": {
                "role": "DLPFC",
                "model": "gpt-4",
                "backstory": "executive functions like planning and decision-making",
                "goal": "Make decisions based on integrated perspectives.",
                "temperature": 0.7,
                "max_tokens": 500
            },
            "VMPFC": {
                "role": "VMPFC",
                "model": "gpt-4",
                "backstory": "assessing emotional outcomes and risks",
                "goal": "Provide emotional insights for decision-making.",
                "temperature": 0.8,
                "max_tokens": 500
            },
            "OFC": {
                "role": "OFC",
                "model": "gpt-4",
                "backstory": "balancing rewards against emotional risks",
                "goal": "Assess actions based on rewards and manage impulses.",
                "temperature": 0.7,
                "max_tokens": 500
            },
            "ACC": {
                "role": "ACC",
                "model": "gpt-4",
                "backstory": "resolving conflicts",
                "goal": "Resolve conflicts effectively.",
                "temperature": 0.7,
                "max_tokens": 500
            },
            "MPFC": {
                "role": "MPFC",
                "model": "gpt-4",
                "backstory": "understanding social dynamics and self-reflection",
                "goal": "Analyze social interactions for personal growth.",
                "temperature": 0.8,
                "max_tokens": 500
            }
        }

    @staticmethod
    def get_prompt_templates() -> Dict[str, str]:
        """Returns integrated prompt templates."""
        return {
            "analysis": """
            Previous Analysis:
            {context}
            
            Current Topic: {topic}
            Role: {role}
            
            Instructions:
            1. Review previous analyses if available
            2. Analyze from your role's perspective
            3. Consider interactions with other PFC regions
            4. Provide structured insights
            
            Format your response with clear sections and bullet points.
            """,
            
            "integration": """
            As the DLPFC, integrate the following analyses:
            {context}
            
            Focus on:
            1. Key patterns and insights
            2. Conflicts or contradictions
            3. Integrated recommendations
            4. Next steps
            """,
            
            "error": "Error in {role} processing: {error}"
        }

    @staticmethod
    def get_error_messages() -> Dict[str, str]:
        """Returns standardized error message templates."""
        return {
            "llm_error": "Error in LLM response for {role}: {error}",
            "tool_error": "Error in tool execution for {role}: {error}",
            "analysis_error": "Error in analysis: {error}"
        } 