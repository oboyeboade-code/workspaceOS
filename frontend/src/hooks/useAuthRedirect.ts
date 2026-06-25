import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
const { getMe } = api

export function useAuthRedirect() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (user.role === "employer") {
        nav("/employer");
      } else if (user.role === "employee") {
        nav("/employee");
      }
    });
  }, []);

  return { loading };
}