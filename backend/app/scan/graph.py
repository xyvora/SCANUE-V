from collections.abc import Hashable
from typing import cast

from langgraph.graph import END, StateGraph

from app.models.scan import AnalysisReport
from app.scan.pfc_agents import AgentState, PFCAgents


class CustomGraph:
    def __init__(self, topic: str) -> None:
        self.topic = topic
        self.agents = PFCAgents(topic=self.topic)
        self.workflow = StateGraph(AgentState)

    def build_graph(self) -> None:
        for role, agent_function in self.agents.agents.items():
            self.workflow.add_node(role, agent_function)

        def router(state: AgentState) -> str | None:
            next_agent = state["next"]
            if next_agent == END:
                return None

            if next_agent is not None:
                return next_agent
            return END

        dlpfc_edges: dict[str, str] = {
            "VMPFC": "VMPFC",
            "OFC": "OFC",
            "ACC": "ACC",
            "MPFC": "MPFC",
            END: END,
        }

        self.workflow.add_conditional_edges("DLPFC", router, cast(dict[Hashable, str], dlpfc_edges))

        for role in ("VMPFC", "OFC", "ACC", "MPFC"):
            self.workflow.add_conditional_edges(
                role,
                router,
            )

        self.workflow.set_entry_point("DLPFC")
        self.graph = self.workflow.compile()

    async def execute(self) -> AnalysisReport:
        self.build_graph()

        initial_state = AgentState(
            input=self.topic,
            history=[],
            next="DLPFC",
            current_role="DLPFC",
        )

        final_state = await self.graph.ainvoke(initial_state)
        return self.prepare_output(cast(AgentState, final_state))

    def prepare_output(self, state: AgentState) -> AnalysisReport:
        dlpfc_analysis = None
        vmpfc_analysis = None
        ofc_analysis = None
        acc_analysis = None
        mpfc_analysis = None

        for role, analysis in state["history"]:
            if role == "DLPFC":
                dlpfc_analysis = " ".join(analysis) if analysis else None
            elif role == "VMPFC":
                vmpfc_analysis = " ".join(analysis) if analysis else None
            elif role == "OFC":
                ofc_analysis = " ".join(analysis) if analysis else None
            elif role == "ACC":
                acc_analysis = " ".join(analysis) if analysis else None
            elif role == "MPFC":
                mpfc_analysis = " ".join(analysis) if analysis else None

        return AnalysisReport(
            dlpfc_analysis=dlpfc_analysis,
            vmpfc_analysis=vmpfc_analysis,
            ofc_analysis=ofc_analysis,
            acc_analysis=acc_analysis,
            mpfc_analysis=mpfc_analysis,
        )
