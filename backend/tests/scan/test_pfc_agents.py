from typing import cast

import pytest

from app.scan.pfc_agents import (
    PFCAgents,
    _determine_next_agent,
    _get_backstory,
    _get_goal,
    _get_prompt_templates,
)
from app.types import RoleName


def test_agents():
    pfc_agents = PFCAgents("some topic")

    assert list(pfc_agents.agents.keys()) == ["DLPFC", "VMPFC", "OFC", "ACC", "MPFC"]


def test_create_agent():
    role = "DLPFC"
    pfc_agents = PFCAgents("some topic")

    result = pfc_agents.create_agent(cast(RoleName, role))

    assert result["role"] == role
    assert (
        result["backstory"]
        == f"You are the {role}, specializing in executive functions including working memory, planning, and cognitive control. You integrate information to guide complex decision-making and regulate behavior. for the topic 'some topic'."
    )
    assert (
        result["goal"]
        == "Analyze the situation using executive control, maintain relevant information in working memory, and develop strategic plans for optimal outcomes."
    )


@pytest.mark.parametrize(
    "role, expected",
    (
        (
            "DLPFC",
            "executive functions including working memory, planning, and cognitive control. You integrate information to guide complex decision-making and regulate behavior.",
        ),
        (
            "VMPFC",
            "processing emotional value and risk assessment. You evaluate the emotional significance of choices and predict their emotional outcomes.",
        ),
        (
            "ACC",
            "error detection, conflict monitoring, and emotional regulation. You identify conflicts between competing responses and help regulate emotional reactions.",
        ),
        (
            "MPFC",
            "self-referential thinking and social cognition. You process information about self and others, supporting social decision-making and perspective-taking.",
        ),
    ),
)
def test_get_backstory(role, expected):
    assert _get_backstory(role) == expected


@pytest.mark.parametrize(
    "role, expected",
    (
        (
            "DLPFC",
            "Analyze the situation using executive control, maintain relevant information in working memory, and develop strategic plans for optimal outcomes.",
        ),
        (
            "VMPFC",
            "Evaluate the emotional implications and risks, considering how different choices might affect emotional wellbeing and social relationships.",
        ),
        (
            "OFC",
            "Assess the reward value of different options, integrate sensory and emotional information, and optimize decision-making for maximum benefit.",
        ),
        (
            "ACC",
            "Monitor for conflicts between competing options, detect potential errors, and help regulate emotional responses to support optimal choices.",
        ),
        (
            "MPFC",
            "Consider social and self-relevant implications, integrate personal and social knowledge, and support perspective-taking in decision-making.",
        ),
    ),
)
def test_get_goal(role, expected):
    assert _get_goal(role) == expected


@pytest.mark.parametrize(
    "role, expected",
    (("DLPFC", "VMPFC"), ("VMPFC", "OFC"), ("OFC", "ACC"), ("ACC", "MPFC"), ("MPFC", None)),
)
def test_determine_next_agent(role, expected):
    result = _determine_next_agent(role)

    assert result == expected


def test_get_prompt_templates():
    context = "some context"
    topic = "some topic"
    role_name = "DLPFC"
    result = _get_prompt_templates(context, topic, cast(RoleName, role_name))

    assert result == {
        "analysis": f"""
        Previous Analysis:
        {context}

        Current Topic: {topic}
        Role: {role_name}

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
        "error": "Error in {role} processing: {error}",
    }
