import { useEffect, useState } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/whoami/", { credentials: "include" })
      .then((r) => {
        if (r.status === 200) return r.json();
        window.location.href = `/accounts/login/?next=${encodeURIComponent(window.location.pathname)}`;
        return null;
      })
      .then((data) => { if (data) setOk(true); })
      .catch(() => {
        window.location.href = `/accounts/login/?next=${encodeURIComponent(window.location.pathname)}`;
      });
  }, []);

  if (ok === null) return <div className="p-6">Carregando…</div>;
  return <>{children}</>;
}
