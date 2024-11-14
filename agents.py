# agents.py

from typing import TypedDict, Dict, Any, List, Callable, Union
from langgraph.prebuilt import ToolExecutor
from langgraph.graph import END, MessageGraph
from openai_wrapper import OpenAIWrapper
from config import settings
from tools import Tools, ToolInput

class AgentState(TypedDict):
    input: str
    history: List[tuple[str, str]]  # List of (role, message) tuples
    next: str

class PFCAgents:
    """
    Implements a network of PFC region agents that collaborate in cognitive processing.
    Each agent represents a distinct prefrontal cortex region with specialized functions.
    """

    def __init__(self, topic: str) -> None:
        self.topic = topic
        self.agent_models = {
            "DLPFC": settings.DLPFC_MODEL,  # Dorsolateral PFC
            "VMPFC": settings.VMPFC_MODEL,  # Ventromedial PFC
            "OFC": settings.OFC_MODEL,      # Orbitofrontal Cortex
            "ACC": settings.ACC_MODEL,      # Anterior Cingulate Cortex
            "MPFC": settings.MPFC_MODEL,    # Medial PFC
        }
        self.tools = Tools()
        self.agents: Dict[str, Callable[[AgentState], AgentState]] = {}
        self._initialize_agents()

    def _initialize_agents(self) -> None:
        """Initialize all agents with their respective functions."""
        for role in self.agent_models.keys():
            self.agents[role] = self.create_agent_function(role)

    def create_agent_function(self, role_name: str) -> Callable[[AgentState], AgentState]:
        """Creates an agent function that processes state and returns next steps."""
        config = self.create_agent(role_name)
        
        def agent_function(state: AgentState) -> AgentState:
            current_input = state["input"]
            history = state["history"]
            
            # Create context from history with proper formatting
            context_messages = []
            for role, message in history:
                context_messages.append(f"{role}:\n{message}\n")
            context = "\n".join(context_messages) if context_messages else ""
            
            # Create the messages for the LLM with enhanced context
            messages = [
                {"role": "system", "content": config["backstory"] + "\n" + config["goal"]},
                {"role": "user", "content": (
                    f"Previous Analysis:\n{context}\n\n"
                    f"Current Topic: {current_input}\n\n"
                    f"Provide your analysis as {role_name}, considering the previous analyses "
                    f"and focusing on your specific role in the decision-making process."
                )}
            ]
            
            # Get LLM response with enhanced error handling
            try:
                llm_response = config["llm"].create_chat_completion(
                    messages=messages,
                    max_tokens=settings.MAX_TOKENS,
                    temperature=settings.TEMPERATURE
                )
            except Exception as e:
                llm_response = f"Error in LLM response for {role_name}: {str(e)}"
            
            # Execute tools with proper input schema and error handling
            tool_input: ToolInput = {
                "input": llm_response,
                "history": history,
                "role": role_name
            }
            
            try:
                tool_response = config["tool_executor"].invoke(tool_input)
            except Exception as e:
                tool_response = f"Error in tool execution for {role_name}: {str(e)}"
            
            # Determine next agent based on current state
            next_agent = self.determine_next_agent(role_name)
            
            # Update state with proper typing and validation
            return {
                "input": tool_response,
                "history": history + [(role_name, tool_response)],
                "next": next_agent
            }
        
        return agent_function

    def determine_next_agent(self, current_role: str) -> str:
        """
        Determines the next agent based on PFC information processing hierarchy.
        DLPFC integrates information from other regions for final decision-making.
        """
        # DLPFC receives input from other regions for integration
        if current_role == "DLPFC":
            return "VMPFC"  # Start emotional assessment
        elif current_role in ["VMPFC", "OFC", "ACC", "MPFC"]:
            return "DLPFC"  # Return to DLPFC for integration
        return "DLPFC"  # Default to executive control

    def create_agent(self, role_name: str) -> dict:
        """Creates base agent configuration with enhanced setup."""
        model_name = self.agent_models[role_name]
        client = OpenAIWrapper(model_name=model_name)
        
        tools = self.tools.get_tools(role_name)
        tool_executor = ToolExecutor(tools)
        
        backstory = self.get_backstory(role_name)
        goal = self.get_goal(role_name)
        
        return {
            "role": role_name,
            "llm": client,
            "tools": tools,
            "tool_executor": tool_executor,
            "backstory": f"You are the {role_name}, specializing in {backstory} for the topic '{self.topic}'.",
            "goal": goal
        }

    def get_backstory(self, role_name: str) -> str:
        """Returns the neurologically-informed backstory for each PFC region."""
        backstories = {
            "DLPFC": "executive functions including working memory, planning, and cognitive control. "
                    "You integrate information to guide complex decision-making and regulate behavior.",
            
            "VMPFC": "processing emotional value and risk assessment. You evaluate the emotional "
                    "significance of choices and predict their emotional outcomes.",
            
            "OFC": "reward processing and value-based decision making. You integrate sensory and "
                    "emotional information to evaluate rewards and guide behavior optimization.",
            
            "ACC": "error detection, conflict monitoring, and emotional regulation. You identify "
                    "conflicts between competing responses and help regulate emotional reactions.",
            
            "MPFC": "self-referential thinking and social cognition. You process information about "
                    "self and others, supporting social decision-making and perspective-taking."
        }
        return backstories.get(role_name, "")

    def get_goal(self, role_name: str) -> str:
        """Returns the specialized cognitive goal for each PFC region."""
        goals = {
            "DLPFC": "Analyze the situation using executive control, maintain relevant information "
                    "in working memory, and develop strategic plans for optimal outcomes.",
            
            "VMPFC": "Evaluate the emotional implications and risks, considering how different "
                    "choices might affect emotional wellbeing and social relationships.",
            
            "OFC": "Assess the reward value of different options, integrate sensory and emotional "
                    "information, and optimize decision-making for maximum benefit.",
            
            "ACC": "Monitor for conflicts between competing options, detect potential errors, "
                    "and help regulate emotional responses to support optimal choices.",
            
            "MPFC": "Consider social and self-relevant implications, integrate personal and "
                    "social knowledge, and support perspective-taking in decision-making."
        }
        return goals.get(role_name, "")

    def communicate(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Facilitates communication between agents."""
        current_role = state["next"]
        current_input = state["input"]
        history = state["history"]

        # Get the analysis from the current agent
        analysis = self.agents[current_role]({"input": current_input, "history": history})

        # Update the state with the new analysis
        updated_state = {
            "input": analysis["input"],
            "history": analysis["history"],
            "next": analysis["next"]
        }

        return updated_state