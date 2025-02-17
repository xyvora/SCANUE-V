import Link from "next/link";
import { isLoggedIn } from "@/utils/auth";

async function buildButtons() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    return (
      <div>
        <li>
          <Link href="/chat" passHref>
            <button>Chat</button>
          </Link>
        </li>
        <li>
          <Link href="/account" passHref>
            <button>Profile</button>
          </Link>
        </li>
        <li>
          <form action="/api/logout" method="POST">
            <button type="submit">Log Out</button>
          </form>
        </li>
      </div>
    );
  }

  return (
    <li>
      <Link href="/login" passHref>
        <button>Log In</button>
      </Link>
    </li>
  );
}

export default async function Navbar() {
  const buttons = await buildButtons();

  return (
    <nav>
      <ul>
        { buttons }
      </ul>
    </nav>
  );
};
