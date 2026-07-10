import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api'
import { Loader2 } from "lucide-react"

const FullPageLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  )
}
const { getMe } = api

const RequireEmployee = ({ children }) => {
  const nav = useNavigate();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    getMe().then((user) => {
      if (!user || user.role !== "employee") {
        nav("/");
      } else {
        setAllowed(true);
      }
    });
  }, []);

  if (allowed === null) return <FullPageLoading />;

  return children;
}

export default RequireEmployee;