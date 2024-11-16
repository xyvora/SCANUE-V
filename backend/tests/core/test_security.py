from app.core.security import get_password_hash, verify_password


def test_verify_password_match():
    hashed_password = get_password_hash("test")
    assert verify_password("test", hashed_password) is True


def test_verify_password_no_match():
    hashed_password = get_password_hash("t")
    assert verify_password("test", hashed_password) is False
