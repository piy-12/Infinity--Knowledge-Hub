import bcrypt

class Hash:
    @staticmethod
    def bcrypt(password: str) -> str:
        # Convert to bytes and truncate to 72 bytes
        password_bytes = password.encode("utf-8")[:72]
        hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        return hashed.decode("utf-8")  # store as string in DB

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        password_bytes = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(password_bytes, hashed_password.encode("utf-8"))
