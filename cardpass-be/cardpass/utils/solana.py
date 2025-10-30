from __future__ import annotations

import base64
from typing import Tuple

import base58
from nacl.exceptions import BadSignatureError
from nacl.signing import VerifyKey


class SignatureVerificationError(ValueError):
    pass


def decode_pubkey(pubkey: str) -> bytes:
    try:
        decoded = base58.b58decode(pubkey)
    except ValueError as exc:  # pragma: no cover - base58 provides str error
        raise SignatureVerificationError("Invalid wallet public key encoding") from exc
    if len(decoded) != 32:
        raise SignatureVerificationError("Invalid wallet public key length")
    return decoded


def verify_signature(message: bytes, signature_b64: str, wallet_pubkey: str) -> None:
    try:
        signature = base64.b64decode(signature_b64)
    except Exception as exc:  # pragma: no cover - base64 handles error
        raise SignatureVerificationError("Invalid signature encoding") from exc

    verify_key = VerifyKey(decode_pubkey(wallet_pubkey))
    try:
        verify_key.verify(message, signature)
    except BadSignatureError as exc:
        raise SignatureVerificationError("Signature verification failed") from exc
