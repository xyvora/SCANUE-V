# graph.py

from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, Dict, Any, List
from agents import PFCAgents, AgentState

class CustomGraph:
    """
    Implements a graph representing PFC region interactions.
    DLPFC acts as central executive, coordinating with other regions:
    - VMPFC: Emotional assessment and risk evaluation
    - OFC: Reward processing and value-based decisions
    - ACC: Conflict monitoring and error detection
    - MPFC: Social cognition and self-referential processing
    """

    def __init__(self, topic: str) -> None:
        self.topic = topic
        self.agents = PFCAgents(topic=self.topic)
        # Initialize with typed state
        self.workflow = StateGraph(AgentState)

    def build_graph(self) -> None:
        """
        Builds a graph representing PFC information flow:
        1. DLPFC (central executive) coordinates with other regions
        2. Each region processes specialized information
        3. Information flows back to DLPFC for integration
        """
        # Add nodes for each PFC region with validation
        for role, agent_function in self.agents.agents.items():
            if role not in ["DLPFC", "VMPFC", "OFC", "ACC", "MPFC"]:
                raise ValueError(f"Invalid PFC region: {role}")
            self.workflow.add_node(role, agent_function)
        
        # Define information flow routing with enhanced validation
        def router(state: AgentState) -> str | None:
            next_agent = state["next"]
            current_role = state.get("current_role", "DLPFC")
            
            # Validate state
            if "input" not in state or "history" not in state:
                raise ValueError("Invalid state: missing required fields")
            
            # Process routing
            if next_agent == END:
                return None
            
            # DLPFC coordination logic
            if current_role == "DLPFC":
                if next_agent in ["VMPFC", "OFC", "ACC", "MPFC"]:
                    return next_agent
                return END
            else:
                # Other regions return to DLPFC for integration
                return "DLPFC"
        
        # Define valid pathways with proper typing
        dlpfc_edges: Dict[str, str] = {
            "VMPFC": "VMPFC",  # Emotional processing
            "OFC": "OFC",      # Reward evaluation
            "ACC": "ACC",      # Conflict monitoring
            "MPFC": "MPFC",    # Social cognition
            END: END
        }
        
        # Add edges with validation
        self.workflow.add_conditional_edges(
            "DLPFC",
            router,
            dlpfc_edges
        )
        
        # Other regions report back to DLPFC
        for role in ["VMPFC", "OFC", "ACC", "MPFC"]:
            self.workflow.add_conditional_edges(
                role,
                router,
                {
                    "DLPFC": "DLPFC",  # Return to central executive
                    END: END
                }
            )
        
        # DLPFC is the entry point (central executive)
        self.workflow.set_entry_point("DLPFC")
        
        # Compile with type checking
        self.graph = self.workflow.compile()

    def execute(self) -> str:
        """Execute the PFC processing workflow."""
        self.build_graph()
        
        # Initialize state
        initial_state: AgentState = {
            "input": self.topic,
            "history": [],
            "next": "DLPFC",
            "current_role": "DLPFC"
        }
        
        try:
            final_state = self.graph.invoke(initial_state)
            return self.format_output(final_state)
        except Exception as e:
            return f"Error in PFC processing: {str(e)}"

    def format_output(self, state: AgentState) -> str:
        """Format the final analysis into a structured report."""
        try:
            history = state["history"]
            report = ["\nPFC Analysis Report", "=" * 50, ""]
            
            # Group analyses by region for better organization
            analyses = {
                "DLPFC": [],  # Executive function analysis
                "VMPFC": [],  # Emotional assessment
                "OFC": [],    # Reward/value analysis
                "ACC": [],    # Conflict monitoring
                "MPFC": []    # Social cognition
            }
            
            # Organize analyses by region
            for role, analysis in history:
                analyses[role].append(analysis)
            
            # Format report with clear sections
            for role, role_analyses in analyses.items():
                if role_analyses:
                    report.append(f"\n{role} Analysis:")
                    report.append("-" * 50)
                    for analysis in role_analyses:
                        report.append(analysis)
                        report.append("-" * 25)
            
            return "\n".join(report)
        except Exception as e:
            return f"Error formatting PFC analysis: {str(e)}"
