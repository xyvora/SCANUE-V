from camel_converter.pydantic_base import CamelBase


class AnalysisReport(CamelBase):
    dlpfc_analysis: str | None = None
    vmpfc_analysis: str | None = None
    ofc_analysis: str | None = None
    acc_analysis: str | None = None
    mpfc_analysis: str | None = None


class Topic(CamelBase):
    topic: str
