import pytest

from app.models.scan import AnalysisReport
from app.scan.graph import CustomGraph
from app.scan.pfc_agents import AgentState


@pytest.mark.parametrize(
    "state, expected",
    (
        (
            AgentState(
                current_role="DLPFC",
                input="some input",
                history=[
                    ("DLPFC", "dlpfc"),
                    ("VMPFC", "vmpfc"),
                    ("OFC", "ofc"),
                    ("ACC", "acc"),
                    ("MPFC", "mpfc"),
                ],
                next="VMPFC",
            ),
            AnalysisReport(
                dlpfc_analysis="dlpfc",
                vmpfc_analysis="vmpfc",
                ofc_analysis="ofc",
                acc_analysis="acc",
                mpfc_analysis="mpfc",
            ),
        ),
        (
            AgentState(
                current_role="DLPFC",
                input="some input",
                history=[
                    ("DLPFC", "dlpfc"),
                ],
                next="VMPFC",
            ),
            AnalysisReport(
                dlpfc_analysis="dlpfc",
                vmpfc_analysis=None,
                ofc_analysis=None,
                acc_analysis=None,
                mpfc_analysis=None,
            ),
        ),
        (
            AgentState(
                current_role="DLPFC",
                input="some input",
                history=[],
                next="VMPFC",
            ),
            AnalysisReport(
                dlpfc_analysis=None,
                vmpfc_analysis=None,
                ofc_analysis=None,
                acc_analysis=None,
                mpfc_analysis=None,
            ),
        ),
    ),
)
def test_prepare_output(state, expected):
    graph = CustomGraph("some topic")

    assert graph.prepare_output(state) == expected
