import asyncio

from langgraph.graph import END, StateGraph
from langgraph.graph.state import CompiledStateGraph

from app.agents.agents import ACCAgent, DLPFCAgent, MPFCAgent, OFCAgent, VMPFCAgent
from app.models.agents import AgentState
from app.types import JsonDict


def create_workflow() -> CompiledStateGraph:
    """Create the workflow graph."""
    workflow = StateGraph(AgentState)

    workflow.add_node("task_delegation", process_task_delegation)
    workflow.add_node("emotional_regulation", process_emotional_regulation)
    workflow.add_node("reward_processing", process_reward_processing)
    workflow.add_node("conflict_detection", process_conflict_detection)
    workflow.add_node("value_assessment", process_value_assessment)

    def get_next_stage(state: AgentState) -> str:
        current_stage = state.stage
        if current_stage is None or current_stage == END:
            return END

        stage_map = {
            "task_delegation": "emotional_regulation",
            "emotional_regulation": "reward_processing",
            "reward_processing": "conflict_detection",
            "conflict_detection": "value_assessment",
            "value_assessment": END,
        }
        return stage_map.get(current_stage, END)

    for stage in [
        "task_delegation",
        "emotional_regulation",
        "reward_processing",
        "conflict_detection",
        "value_assessment",
    ]:
        workflow.add_conditional_edges(
            stage,
            get_next_stage,
            {
                "emotional_regulation": "emotional_regulation",
                "reward_processing": "reward_processing",
                "conflict_detection": "conflict_detection",
                "value_assessment": "value_assessment",
                END: END,
            },
        )

    workflow.set_entry_point("task_delegation")

    return workflow.compile()


async def process_task_delegation(state: AgentState) -> JsonDict:
    """Process task delegation through DLPFC agent."""
    dlpfc = DLPFCAgent()
    result = await asyncio.wait_for(dlpfc.process(state), timeout=30.0)
    return {**state.model_dump(), **result, "stage": "emotional_regulation"}


async def process_emotional_regulation(state: AgentState) -> JsonDict:
    """Process emotional regulation through VMPFC agent."""
    vmpfc = VMPFCAgent()
    result = await asyncio.wait_for(vmpfc.process(state), timeout=30.0)
    return {**state.model_dump(), **result, "stage": "reward_processing"}


async def process_reward_processing(state: AgentState) -> JsonDict:
    """Process reward processing through OFC agent."""
    ofc = OFCAgent()
    result = await asyncio.wait_for(ofc.process(state), timeout=30.0)
    return {**state.model_dump(), **result, "stage": "conflict_detection"}


async def process_conflict_detection(state: AgentState) -> JsonDict:
    """Process conflict detection through ACC agent."""
    acc = ACCAgent()
    result = await asyncio.wait_for(acc.process(state), timeout=30.0)
    return {**state.model_dump(), **result, "stage": "value_assessment"}


async def process_value_assessment(state: AgentState) -> JsonDict:
    """Process value assessment through MPFC agent."""
    mpfc = MPFCAgent()
    result = await asyncio.wait_for(mpfc.process(state), timeout=30.0)
    return {**state.model_dump(), **result, "stage": END}
