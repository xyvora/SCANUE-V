// TODO: I want to remove this page and instead use a button in the navbar to do the logout, but
// a navbar hasn't been added yet so this is a temporary work around.

"use client";

import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    const logout = async () => {
      const response = await fetch("/api/logout", { method: "POST", redirect: "follow"});
      window.location.href = response.url;
    };

    logout();
  }, []);
};

export default Logout;
